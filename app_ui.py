"""app_ui.py — Interactive Streamlit Dashboard for Cart Abandonment recommendations

Provides a premium, real-time conversion dashboard. Behind the scenes,
it leverages the same production orchestrator pipeline (Preprocessing,
XGBClassifier, SHAP explainer, Root Cause inference, ChromaDB RAG, and Confidence score).

Run:
    streamlit run app_ui.py
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path
import pandas as pd

import streamlit as st

# Setup paths
_PROJECT_ROOT = Path(__file__).resolve().parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.append(str(_PROJECT_ROOT))

from cart_abandonment_ml.api.app import PipelineService, SessionRequest
from cart_abandonment_ml.config.config import config

# Set page layout to wide and Flipkart themed
st.set_page_config(
    page_title="Flipkart Cart Abandonment Recommendation Center",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------------------------
# Cached Model Initialization — load once, reuse across runs
# ---------------------------------------------------------------------------
@st.cache_resource
def load_pipeline() -> PipelineService:
    return PipelineService(config)

try:
    pipeline = load_pipeline()
    model_loaded = True
except Exception as exc:
    st.error(f"Failed to load prediction pipeline model files: {exc}")
    model_loaded = False


# ===========================================================================
# Streamlit UI Header
# ===========================================================================
st.markdown(
    """
    <style>
    .main-title {
        color: #047BD5; /* Flipkart Blue */
        font-size: 38px;
        font-weight: 800;
        margin-bottom: 2px;
    }
    .sub-title {
        color: #F8E831; /* Flipkart Yellow */
        background-color: #047BD5;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 16px;
        display: inline-block;
        margin-bottom: 25px;
    }
    .metric-card {
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border-left: 5px solid #047BD5;
        margin-bottom: 15px;
    }
    .metric-val {
        font-size: 28px;
        font-weight: 800;
        color: #212529;
    }
    .metric-label {
        font-size: 14px;
        font-weight: 600;
        color: #6c757d;
    }
    </style>
    """,
    unsafe_allow_html=True
)

st.markdown('<div class="main-title">Flipkart Cart Abandonment Control Panel</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Conversion Optimisation & Real-time RAG Interventions</div>', unsafe_allow_html=True)

if not model_loaded:
    st.stop()


# ===========================================================================
# Left Panel: User and Behavioral Feature Inputs
# ===========================================================================
st.sidebar.header("🛒 Session Behavioral Inputs")

# High importance inputs based on SHAP rankings
hesitation = st.sidebar.slider("Hesitation Score", 0.0, 10.0, 2.5, help="Time spent hovering or delayed clicks")
trust = st.sidebar.slider("Platform Trust Score", 0.0, 1.0, 0.75, help="User platform engagement score")
price_sensitivity = st.sidebar.slider("Price Sensitivity Score", 0.0, 5.0, 1.8)
quality_uncertainty = st.sidebar.slider("Quality Uncertainty Score", 0.0, 5.0, 0.5)
purchase_intent = st.sidebar.slider("Purchase Intent Score", 0.0, 1.0, 0.8)

st.sidebar.subheader("🚚 Shipping & Order Values")
shipping = st.sidebar.number_input("Shipping Charges (INR)", 0.0, 500.0, 40.0)
cart_value = st.sidebar.number_input("Cart Total Value (INR)", 100.0, 150000.0, 4500.0)
items_in_cart = st.sidebar.slider("Total Items in Cart", 1, 20, 3)

st.sidebar.subheader("⚡ Technical Friction & Activity")
payment_failures = st.sidebar.selectbox("Payment Failures (current session)", [0, 1, 2, 3])
checkout_restarts = st.sidebar.selectbox("Checkout Restart Count", [0, 1, 2, 3, 4])
tab_switches = st.sidebar.slider("Browser Tab Switches", 0, 50, 4)
competitor_checked = st.sidebar.selectbox("Competitor Price Checked", ["No", "Yes"])
is_premium = st.sidebar.selectbox("Is Flipkart Plus Member", ["No", "Yes"])

# Context Metadata options
st.sidebar.subheader("📦 Catalog Details")
category = st.sidebar.selectbox("Product Category", ["Electronics", "Fashion", "Home Appliances", "Beauty & Personal Care", "Books & Toys"])
brand_tier = st.sidebar.selectbox("Brand Premium Tier", ["Mass Market", "Premium", "Ultra Premium"])

st.sidebar.subheader("👤 Buyer History")
history_purchases = st.sidebar.number_input("Total Past Completed Purchases", 0, 100, 5)
history_returns = st.sidebar.slider("Past Return Rate", 0.0, 1.0, 0.05)


# ===========================================================================
# Assemble Session Dictionary for pipeline execution
# ===========================================================================
session_dict = {
    "hesitation_score": hesitation,
    "trust_score": trust,
    "price_sensitivity_score": price_sensitivity,
    "quality_uncertainty_score": quality_uncertainty,
    "purchase_intent_score": purchase_intent,
    "total_shipping_charges": shipping,
    "cart_value": cart_value,
    "total_items_in_cart": items_in_cart,
    "payment_failures": payment_failures,
    "checkout_restart_count": checkout_restarts,
    "tab_switch_count": tab_switches,
    "competitor_price_checked": 1 if competitor_checked == "Yes" else 0,
    "is_premium_member": 1 if is_premium == "Yes" else 0,
    "total_historical_purchases": history_purchases,
    "persona": "Price Sensitive Shopper" if price_sensitivity > 2.0 else "Regular Active User"
}

request_obj = SessionRequest(
    session_data=session_dict,
    product_metadata={"category": category, "brand_tier": brand_tier, "price": cart_value},
    user_metadata={"total_purchases": history_purchases, "return_rate": history_returns}
)


# ===========================================================================
# Run Prediction Pipeline
# ===========================================================================
with st.spinner("Executing Real-time Prediction & Retrieval Pipeline..."):
    res = pipeline.process_session(request_obj)


# ===========================================================================
# Layout: Middle and Right Panels
# ===========================================================================
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("📊 Conversion Risk Assessment")
    
    # Probability Gauge
    prob = res.abandonment_probability
    st.metric(
        label="Abandonment Probability Risk",
        value=f"{prob:.2%}",
        delta="HIGH RISK" if prob >= 0.75 else "MEDIUM RISK" if prob >= 0.45 else "LOW RISK",
        delta_color="inverse"
    )
    
    # Progress bar color representation
    st.progress(prob)

    # Inferred Cause card
    st.markdown(
        f"""
        <div class="metric-card">
            <div class="metric-label">INFERRED ROOT CAUSE</div>
            <div class="metric-val" style="color: #d9534f;">{res.root_cause}</div>
        </div>
        """,
        unsafe_allow_html=True
    )

    # Audited Decision Confidence Score
    conf = res.confidence
    conf_level = "HIGH" if conf >= 0.75 else "MEDIUM" if conf >= 0.45 else "LOW"
    st.markdown(
        f"""
        <div class="metric-card" style="border-left-color: #5cb85c;">
            <div class="metric-label">RECOMMENDATION CONFIDENCE SCORE</div>
            <div class="metric-val" style="color: #5cb85c;">{conf:.0%} ({conf_level})</div>
        </div>
        """,
        unsafe_allow_html=True
    )

with col2:
    st.subheader("🎯 Personalised RAG Recommendation")
    
    st.markdown(
        f"""
        <div class="metric-card" style="border-left-color: #F8E831; background-color: #fff9e6;">
            <div class="metric-label">RECOMMENDED FLIPKART INTERVENTION</div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 10px; color: #333;">
                {res.recommended_intervention}
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    # SHAP Feature attributions chart
    st.subheader("🌲 Explainable AI (Local SHAP Attribution)")
    
    feature_data = []
    for feat in res.top_features:
        feature_data.append({
            "Feature": feat.feature,
            "Impact (SHAP)": feat.importance,
            "Direction": "Increases Risk" if feat.importance > 0 else "Decreases Risk"
        })
        
    df_shap = pd.DataFrame(feature_data)
    
    # Render horizontal bar chart
    st.bar_chart(
        df_shap,
        x="Feature",
        y="Impact (SHAP)",
        color="Direction"
    )

st.divider()

# Expanded details tab for auditing details
tab1, tab2 = st.tabs(["📋 System Metadata", "🔬 Mathematical Auditor"])

with tab1:
    st.json({
        "input_session_vector": session_dict,
        "classification_output": "Abandoned" if res.prediction else "Retained",
        "retrieved_cause": res.root_cause,
        "intervention": res.recommended_intervention
    })

with tab2:
    st.markdown("### Confidence Scoring Auditor Breakdown")
    st.markdown(
        "The system evaluates confidence metrics across model certainty, SHAP feature density, "
        "root cause probabilities, and semantic RAG matching indices using the following weighted linear formula:"
    )
    st.code(
        "C_final = (0.20 * C_prob + 0.15 * C_shap + 0.20 * C_cause + 0.15 * C_sim + 0.15 * C_hist + 0.15 * C_rules) * 100"
    )
    st.markdown(
        "* **Model Certainty Margin ($C_{\text{prob}}$)**: Normalized distance from decision boundary.\n"
        "* **SHAP Attributions ($C_{\text{shap}}$)**: Sum of absolute values of top features.\n"
        "* **Root Cause Integrity ($C_{\text{cause}}$)**: Gemini / heuristic agent confidence.\n"
        "* **Semantic Cosine Match ($C_{\text{sim}}$)**: Cosine vector proximity score from ChromaDB.\n"
        "* **Historical Conversion ($C_{\text{hist}}$)**: Catalog success rate associated with intervention.\n"
        "* **Business Constraints ($C_{\text{rules}}$)**: Margin protection and segment discount compliance."
    )
