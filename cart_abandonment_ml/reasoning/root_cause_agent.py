"""root_cause_agent.py — Root Cause Reasoning Agent (Gemini API)

Purpose
-------
Given a shopping session's predicted abandonment probability and SHAP-derived
feature evidence, determine the MOST LIKELY root cause of cart abandonment
using structured reasoning via the Gemini API.

Design principles
-----------------
* **No interventions** — the agent ONLY infers root cause, never recommends actions.
* **No RAG** — all context is injected into the prompt directly from the session data.
* **Structured output** — Gemini is instructed to return a strict JSON schema that is
  validated and parsed into a typed ``RootCauseResult`` dataclass before returning.
* **Deterministic** — low temperature (0.2) ensures consistent, reproducible reasoning.
* **Graceful degradation** — if the Gemini call fails (quota, network, invalid key),
  a fallback heuristic root cause is returned instead of raising.

Allowed Root Causes (10)
------------------------
    Price Sensitive         | Trust Issues          | Low Purchase Intent
    Delivery Concern        | Payment Friction      | Product Availability
    Quality Uncertainty     | Window Shopping       | Technical Problem
    Gift Purchase           |

Output Schema
-------------
{
    "root_cause":  "Price Sensitive",
    "confidence":  0.87,
    "evidence": [
        "competitor_difference SHAP = +0.214 (strong positive)",
        "price_sensitivity_score SHAP = +0.179"
    ],
    "reasoning": "The customer is exhibiting classic price-sensitive behaviour.
                  The two strongest SHAP drivers both relate to price comparison..."
}

Integration point for LLM pipeline
-----------------------------------
This module is the FIRST component of the LLM reasoning layer.
Later modules (intervention engine, notification generator, etc.) will consume
``RootCauseResult`` objects produced here.

Usage
-----
    from cart_abandonment_ml.reasoning.root_cause_agent import RootCauseAgent

    agent = RootCauseAgent()
    result = agent.analyse(
        session=session_dict,
        abandonment_probability=0.87,
        top_shap_features=shap_features,
        product_info=product_dict,       # optional
        user_history=history_dict,       # optional
    )
    print(result.root_cause)     # "Price Sensitive"
    print(result.confidence)     # 0.87
    print(result.reasoning)      # Full paragraph explanation
"""

from __future__ import annotations

import json
import logging
import os
import textwrap
import time
from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional

from cart_abandonment_ml.config.config import Config, config as default_config

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Optional Gemini import — graceful degradation if not installed
# ---------------------------------------------------------------------------
try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False
    logger.warning("google-generativeai not installed. Run: pip install google-generativeai")


# ===========================================================================
# Root cause taxonomy — the closed set of allowed answers
# ===========================================================================

ROOT_CAUSES = [
    "Price Sensitive",
    "Delivery Concern",
    "Quality Uncertainty",
    "Trust Issues",
    "Payment Friction",
    "Window Shopping",
    "Gift Purchase",
    "Technical Problem",
    "Low Purchase Intent",
    "Product Availability",
]

ROOT_CAUSE_DESCRIPTIONS = {
    "Price Sensitive":       "Customer is deterred by price, comparing competitors, or seeking discounts.",
    "Delivery Concern":      "Customer is dissatisfied with delivery time, cost, or availability.",
    "Quality Uncertainty":   "Customer doubts product quality, reviews, or authenticity.",
    "Trust Issues":          "Customer does not trust the seller, platform, or product listings.",
    "Payment Friction":      "Customer encountered issues with payment methods, OTP, or checkout errors.",
    "Window Shopping":       "Customer is browsing without immediate purchase intent.",
    "Gift Purchase":         "Customer is evaluating a product as a potential gift, not an immediate need.",
    "Technical Problem":     "Customer experienced technical issues (app crash, slow network, etc.).",
    "Low Purchase Intent":   "Customer added to cart impulsively or is early in the decision cycle.",
    "Product Availability":  "Customer found the product out of stock or unavailable for their location.",
}


# ===========================================================================
# Output schema
# ===========================================================================

@dataclass
class RootCauseResult:
    """Structured output from the Root Cause Reasoning Agent.

    Attributes
    ----------
    root_cause : str
        One of the 10 allowed root causes.
    confidence : float
        Agent's self-reported confidence in [0.0, 1.0].
    evidence : list[str]
        Bullet-point evidence items cited from SHAP features and session data.
    reasoning : str
        Full natural-language reasoning paragraph from Gemini.
    source : str
        "gemini" if the LLM responded, "heuristic" if the fallback was used.
    latency_ms : float
        Gemini API round-trip latency in milliseconds.
    """
    root_cause: str
    confidence: float
    evidence: List[str]
    reasoning: str
    source: str = "gemini"
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def to_llm_summary(self) -> str:
        """Compact text summary — useful as context for downstream LLM agents."""
        lines = [
            f"Root Cause   : {self.root_cause}",
            f"Confidence   : {self.confidence:.0%}",
            f"Source       : {self.source}",
            "",
            "Evidence:",
        ] + [f"  • {e}" for e in self.evidence] + ["", f"Reasoning: {self.reasoning}"]
        return "\n".join(lines)


# ===========================================================================
# Prompt builder
# ===========================================================================

class PromptBuilder:
    """Constructs Gemini prompts from structured session data.

    Keeping prompt construction separate from API calls makes it easy to
    unit-test prompts without a live Gemini connection.
    """

    SYSTEM_PROMPT = textwrap.dedent("""\
        You are an expert behavioural analyst at Flipkart's Machine Learning team.
        Your sole task is to determine the most likely root cause of cart abandonment
        for a specific shopping session.

        You will be given:
        - The model's predicted abandonment probability (XGBoost classifier output)
        - The top SHAP features that drove the prediction (ranked by |SHAP value|)
        - Session behavioural signals
        - Optional product and user history context

        Your output MUST be a single valid JSON object matching this exact schema:
        {
          "root_cause": "<one of the 10 allowed values>",
          "confidence": <float between 0.0 and 1.0>,
          "evidence": ["<specific evidence item>", "<specific evidence item>", ...],
          "reasoning": "<one detailed paragraph explaining your inference>"
        }

        Allowed root_cause values (choose EXACTLY one):
        - Price Sensitive
        - Delivery Concern
        - Quality Uncertainty
        - Trust Issues
        - Payment Friction
        - Window Shopping
        - Gift Purchase
        - Technical Problem
        - Low Purchase Intent
        - Product Availability

        Rules:
        1. Output ONLY the JSON object. No markdown, no preamble, no explanation outside the JSON.
        2. Do NOT recommend interventions or actions.
        3. Evidence items must cite specific feature names and SHAP values where available.
        4. Confidence must reflect genuine uncertainty — avoid always returning 0.9+.
        5. If signals are ambiguous or contradictory, lower confidence accordingly.
    """)

    @staticmethod
    def build_user_prompt(
        abandonment_probability: float,
        top_shap_features: List[Dict[str, Any]],
        session: Optional[Dict[str, Any]] = None,
        product_info: Optional[Dict[str, Any]] = None,
        user_history: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Assemble the user-turn prompt with all available context."""
        lines = [
            "=== ABANDONMENT PREDICTION ===",
            f"Predicted Abandonment Probability : {abandonment_probability:.1%}",
            f"Risk Level                        : {'HIGH' if abandonment_probability >= 0.7 else 'MEDIUM' if abandonment_probability >= 0.4 else 'LOW'}",
            "",
            "=== TOP SHAP FEATURES (ranked by |SHAP|) ===",
        ]

        for i, feat in enumerate(top_shap_features[:15], start=1):
            direction = feat.get("direction", "")
            shap_val  = feat.get("importance", feat.get("shap_value", 0.0))
            arrow = "▲ increases abandonment" if shap_val > 0 else "▼ decreases abandonment"
            lines.append(
                f"  {i:>2}. {feat['feature']:<45} SHAP={shap_val:+.4f}  [{arrow}]"
            )

        # Key behavioural signals from the session
        if session:
            lines += ["", "=== SESSION SIGNALS ==="]
            signal_keys = [
                "hesitation_score", "trust_score", "price_sensitivity_score",
                "quality_uncertainty_score", "purchase_intent_score",
                "checkout_restart_count", "payment_failures", "otp_timeout",
                "total_shipping_charges", "delivery_unavailable_items",
                "competitor_price_checked", "tab_switch_count",
                "session_duration_seconds", "page_views", "cart_value",
                "total_items_in_cart", "is_premium_member", "device_type",
                "network_type", "persona",
            ]
            for key in signal_keys:
                if key in session:
                    lines.append(f"  {key:<40} : {session[key]}")

        # Product info
        if product_info:
            lines += ["", "=== PRODUCT INFORMATION ==="]
            for k, v in product_info.items():
                lines.append(f"  {k:<40} : {v}")

        # User history
        if user_history:
            lines += ["", "=== USER HISTORY ==="]
            for k, v in user_history.items():
                lines.append(f"  {k:<40} : {v}")

        lines += [
            "",
            "=== TASK ===",
            "Based on ALL evidence above, identify the single most likely root cause",
            "of this customer's cart abandonment. Return ONLY the JSON object.",
        ]
        return "\n".join(lines)


# ===========================================================================
# Heuristic fallback — used when Gemini is unavailable
# ===========================================================================

def _heuristic_root_cause(
    abandonment_probability: float,
    top_shap_features: List[Dict[str, Any]],
    session: Optional[Dict[str, Any]],
) -> RootCauseResult:
    """Rule-based fallback that maps SHAP feature names to root causes.

    This is intentionally simple — it exists only to keep the pipeline running
    when Gemini is unavailable (no API key, quota exceeded, network failure).
    """
    session = session or {}
    # Map feature name keywords → root cause
    keyword_map = [
        (["price_sensitivity", "competitor", "coupon", "discount"],  "Price Sensitive"),
        (["shipping", "delivery", "estimated_delivery"],              "Delivery Concern"),
        (["quality_uncertainty", "negative_reviews", "zoomed"],       "Quality Uncertainty"),
        (["trust_score", "seller_trust", "fake_review"],              "Trust Issues"),
        (["payment_failure", "otp_timeout", "checkout_restart"],      "Payment Friction"),
        (["tab_switch", "window_shopper", "Window Shopper"],          "Window Shopping"),
        (["hesitation_score", "idle_time", "low_intent"],             "Low Purchase Intent"),
        (["delivery_unavailable", "out_of_stock"],                    "Product Availability"),
    ]

    top_features_str = " ".join(
        f['feature'] for f in top_shap_features[:10] if f.get("importance", 0) > 0
    )

    for keywords, cause in keyword_map:
        if any(kw.lower() in top_features_str.lower() for kw in keywords):
            return RootCauseResult(
                root_cause=cause,
                confidence=0.55,
                evidence=[
                    f"Heuristic match on feature: {f['feature']} (SHAP={f.get('importance', 0):+.4f})"
                    for f in top_shap_features[:3] if f.get("importance", 0) > 0
                ],
                reasoning=(
                    f"Heuristic fallback: Gemini API unavailable. "
                    f"Top SHAP features suggest '{cause}' based on keyword matching."
                ),
                source="heuristic",
                latency_ms=0.0,
            )

    return RootCauseResult(
        root_cause="Low Purchase Intent",
        confidence=0.40,
        evidence=["No dominant SHAP signal matched a specific root cause."],
        reasoning="Heuristic fallback: no clear keyword match. Defaulting to Low Purchase Intent.",
        source="heuristic",
        latency_ms=0.0,
    )


# ===========================================================================
# Main agent class
# ===========================================================================

class RootCauseAgent:
    """Root Cause Reasoning Agent using Gemini API.

    Determines the single most likely reason a customer may abandon their cart
    based on XGBoost model outputs and SHAP feature evidence.

    Parameters
    ----------
    cfg : Config, optional
        Configuration object. Uses module-level singleton if not provided.
    """

    def __init__(self, cfg: Optional[Config] = None) -> None:
        self._cfg = cfg or default_config
        self._model: Optional[Any] = None
        self._prompt_builder = PromptBuilder()
        self._init_gemini()

    def _init_gemini(self) -> None:
        """Initialise the Gemini client. Safe to call even if key is missing."""
        if not _GENAI_AVAILABLE:
            logger.warning("google-generativeai not installed — agent will use heuristic fallback.")
            return

        api_key = self._cfg.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            logger.warning(
                "GEMINI_API_KEY not set. Set it in config.py or as an environment variable. "
                "Agent will use heuristic fallback."
            )
            return

        try:
            genai.configure(api_key=api_key)
            self._model = genai.GenerativeModel(
                model_name=self._cfg.GEMINI_MODEL_NAME,
                generation_config=genai.types.GenerationConfig(
                    temperature=self._cfg.GEMINI_TEMPERATURE,
                    max_output_tokens=self._cfg.GEMINI_MAX_OUTPUT_TOKENS,
                    response_mime_type="application/json",  # enforce JSON output
                ),
                system_instruction=PromptBuilder.SYSTEM_PROMPT,
            )
            logger.info("Gemini client initialised — model: %s", self._cfg.GEMINI_MODEL_NAME)
        except Exception as exc:
            logger.warning("Gemini initialisation failed: %s — using heuristic fallback.", exc)
            self._model = None

    def _call_gemini(self, prompt: str) -> str:
        """Send the prompt to Gemini and return the raw response text."""
        response = self._model.generate_content(prompt)
        return response.text.strip()

    def _parse_response(self, raw: str) -> Dict[str, Any]:
        """Parse and validate the Gemini JSON response."""
        # Strip markdown code fences if Gemini adds them despite instructions
        if raw.startswith("```"):
            raw = "\n".join(raw.split("\n")[1:])
        if raw.endswith("```"):
            raw = "\n".join(raw.split("\n")[:-1])

        parsed = json.loads(raw)

        # Validate root cause is in the allowed set
        if parsed.get("root_cause") not in ROOT_CAUSES:
            logger.warning(
                "Gemini returned an unexpected root_cause: %r — clamping to 'Low Purchase Intent'",
                parsed.get("root_cause"),
            )
            parsed["root_cause"] = "Low Purchase Intent"

        # Clamp confidence to [0, 1]
        parsed["confidence"] = max(0.0, min(1.0, float(parsed.get("confidence", 0.5))))

        # Ensure evidence is a list of strings
        if not isinstance(parsed.get("evidence"), list):
            parsed["evidence"] = [str(parsed.get("evidence", ""))]

        return parsed

    def analyse(
        self,
        session: Optional[Dict[str, Any]] = None,
        abandonment_probability: float = 0.5,
        top_shap_features: Optional[List[Dict[str, Any]]] = None,
        product_info: Optional[Dict[str, Any]] = None,
        user_history: Optional[Dict[str, Any]] = None,
    ) -> RootCauseResult:
        """Determine the root cause of cart abandonment for a session.

        Parameters
        ----------
        session : dict, optional
            Raw session feature values.
        abandonment_probability : float
            XGBoost classifier's predicted probability (0–1).
        top_shap_features : list[dict]
            SHAP features from ``ShapEngine.get_top_features()``.
            Each dict: {"feature": str, "importance": float, "direction": str}.
        product_info : dict, optional
            Product metadata (category, price, rating, etc.).
        user_history : dict, optional
            Historical user behaviour (past purchases, return rate, etc.).

        Returns
        -------
        RootCauseResult
            Structured root cause with evidence, reasoning, and confidence.
        """
        top_shap_features = top_shap_features or []
        session = session or {}

        # --- Heuristic path ---
        if self._model is None:
            logger.info("Gemini unavailable — using heuristic root cause inference.")
            return _heuristic_root_cause(abandonment_probability, top_shap_features, session)

        # --- Gemini path ---
        user_prompt = self._prompt_builder.build_user_prompt(
            abandonment_probability=abandonment_probability,
            top_shap_features=top_shap_features,
            session=session,
            product_info=product_info,
            user_history=user_history,
        )

        logger.debug("Sending prompt to Gemini (%d chars)...", len(user_prompt))
        t0 = time.perf_counter()

        try:
            raw_response = self._call_gemini(user_prompt)
            latency_ms = (time.perf_counter() - t0) * 1000
            logger.info("Gemini responded in %.0fms", latency_ms)

            parsed = self._parse_response(raw_response)
            return RootCauseResult(
                root_cause=parsed["root_cause"],
                confidence=parsed["confidence"],
                evidence=parsed["evidence"],
                reasoning=parsed.get("reasoning", ""),
                source="gemini",
                latency_ms=round(latency_ms, 1),
            )

        except json.JSONDecodeError as exc:
            logger.warning("Gemini returned invalid JSON (%s). Falling back to heuristic.", exc)
            return _heuristic_root_cause(abandonment_probability, top_shap_features, session)
        except Exception as exc:
            logger.warning("Gemini call failed (%s). Falling back to heuristic.", exc)
            return _heuristic_root_cause(abandonment_probability, top_shap_features, session)

    def analyse_batch(
        self,
        sessions: List[Dict[str, Any]],
        abandonment_probabilities: List[float],
        top_shap_features_list: List[List[Dict[str, Any]]],
        product_infos: Optional[List[Optional[Dict[str, Any]]]] = None,
        user_histories: Optional[List[Optional[Dict[str, Any]]]] = None,
    ) -> List[RootCauseResult]:
        """Analyse root cause for a batch of sessions.

        Processes sessions sequentially to respect Gemini rate limits.
        """
        results = []
        n = len(sessions)
        for i, (sess, prob, feats) in enumerate(
            zip(sessions, abandonment_probabilities, top_shap_features_list)
        ):
            logger.info("Analysing session %d/%d (prob=%.2f)", i + 1, n, prob)
            result = self.analyse(
                session=sess,
                abandonment_probability=prob,
                top_shap_features=feats,
                product_info=(product_infos[i] if product_infos else None),
                user_history=(user_histories[i] if user_histories else None),
            )
            results.append(result)
        return results


# ===========================================================================
# CLI demo
# ===========================================================================

if __name__ == "__main__":
    import pprint
    logging.basicConfig(
        level=logging.INFO,
        format=default_config.LOG_FORMAT,
    )

    # -----------------------------------------------------------------------
    # Example: high-risk session with strong price sensitivity signals
    # -----------------------------------------------------------------------
    demo_session = {
        "persona":                    "Price Sensitive Shopper",
        "hesitation_score":           2.8,
        "trust_score":                0.65,
        "price_sensitivity_score":    1.9,
        "quality_uncertainty_score":  0.4,
        "purchase_intent_score":      0.3,
        "checkout_restart_count":     0,
        "payment_failures":           0,
        "otp_timeout":                0,
        "total_shipping_charges":     50.0,
        "delivery_unavailable_items": 0,
        "competitor_price_checked":   1,
        "tab_switch_count":           6,
        "session_duration_seconds":   340,
        "page_views":                 18,
        "cart_value":                 8500.0,
        "total_items_in_cart":        2,
        "is_premium_member":          0,
        "device_type":                "Mobile",
        "network_type":               "4G",
    }

    demo_shap_features = [
        {"feature": "competitor_difference",       "importance":  0.214, "direction": "increases_abandonment"},
        {"feature": "price_sensitivity_score",     "importance":  0.179, "direction": "increases_abandonment"},
        {"feature": "hesitation_score",            "importance":  0.156, "direction": "increases_abandonment"},
        {"feature": "tab_switch_count",            "importance":  0.098, "direction": "increases_abandonment"},
        {"feature": "trust_score",                 "importance": -0.089, "direction": "decreases_abandonment"},
        {"feature": "total_shipping_charges",      "importance":  0.071, "direction": "increases_abandonment"},
        {"feature": "purchase_intent_score",       "importance": -0.054, "direction": "decreases_abandonment"},
        {"feature": "checkout_restart_count",      "importance":  0.021, "direction": "increases_abandonment"},
        {"feature": "is_premium_member",           "importance": -0.018, "direction": "decreases_abandonment"},
        {"feature": "quality_uncertainty_score",   "importance":  0.012, "direction": "increases_abandonment"},
    ]

    demo_product = {
        "category":       "Electronics",
        "brand":          "Samsung",
        "price":          8500.0,
        "rating":         4.1,
        "rating_count":   1243,
        "discount":       "15%",
        "in_stock":       True,
    }

    demo_history = {
        "total_purchases":       3,
        "days_since_last_buy":   45,
        "previous_abandoned":    2,
        "abandonment_rate":      0.40,
        "preferred_category":    "Electronics",
    }

    agent = RootCauseAgent()
    result = agent.analyse(
        session=demo_session,
        abandonment_probability=0.874,
        top_shap_features=demo_shap_features,
        product_info=demo_product,
        user_history=demo_history,
    )

    print("\n" + "=" * 60)
    print("ROOT CAUSE ANALYSIS RESULT")
    print("=" * 60)
    print(json.dumps(result.to_dict(), indent=2))
    print("=" * 60)
    print("\nLLM SUMMARY:\n")
    print(result.to_llm_summary())
