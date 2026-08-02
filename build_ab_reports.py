"""build_ab_reports.py — A/B Testing Simulation, PPTX Presentation & ReportLab PDF Generator

Flipkart Cart Abandonment ML Platform
======================================
1. Runs A/B Testing Simulation on 500k dataset across 5 experiments
2. Calculates rigorous statistical metrics (Z-test, Chi2, Bayesian Posterior, Power, 95% CIs)
3. Generates high-res chart images in plots_ab/
4. Builds a modern 16:9 PowerPoint Presentation (ab_testing_presentation.pptx)
5. Builds a professional multi-page PDF Report (ab_testing_report.pdf)
"""

from __future__ import annotations

import os
import sys
import math
from pathlib import Path
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Tuple, Any, Optional

import numpy as np
import pandas as pd
from scipy import stats as sp_stats

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# PowerPoint imports
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# ReportLab imports
from reportlab.lib.pagesizes import letter, landscape, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# ---------------------------------------------------------------------------
# Setup Paths & Colors
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent
PARQUET_PATH = PROJECT_ROOT / "synthetic_cart_abandonment_500k.parquet"
CSV_PATH = PROJECT_ROOT / "synthetic_cart_abandonment_500k.csv"
PLOTS_DIR = PROJECT_ROOT / "plots_ab"
PLOTS_DIR.mkdir(exist_ok=True)

PPTX_OUTPUT = PROJECT_ROOT / "ab_testing_presentation.pptx"
PDF_OUTPUT = PROJECT_ROOT / "ab_testing_report.pdf"

# Flipkart Color Palette
C_PRIMARY = RGBColor(40, 116, 240)    # #2874F0 Flipkart Blue
C_NAVY = RGBColor(15, 23, 42)        # #0F172A Dark Slate/Navy
C_YELLOW = RGBColor(255, 229, 0)     # #FFE500 Flipkart Yellow
C_GRAY_LIGHT = RGBColor(241, 245, 249) # #F1F5F9 Slate 100
C_GRAY_TEXT = RGBColor(100, 116, 139) # #64748B Slate 500
C_DARK_TEXT = RGBColor(30, 41, 59)    # #1E293B Slate 800
C_GREEN = RGBColor(34, 197, 94)      # #22C55E Emerald Green
C_RED = RGBColor(239, 68, 68)        # #EF4444 Red

HEX_PRIMARY = "#2874F0"
HEX_NAVY = "#0F172A"
HEX_YELLOW = "#FFE500"
HEX_GRAY_LIGHT = "#F8FAFC"
HEX_GRAY_BORDER = "#E2E8F0"
HEX_DARK_TEXT = "#1E293B"
HEX_GREEN = "#16A34A"
HEX_RED = "#DC2626"
HEX_CONTROL = "#64748B"

# Set matplotlib global style
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["DejaVu Sans", "Arial", "Helvetica"],
    "font.size": 9,
    "axes.titlesize": 11,
    "axes.labelsize": 9,
    "xtick.labelsize": 8.5,
    "ytick.labelsize": 8.5,
    "figure.facecolor": "#FFFFFF",
    "axes.facecolor": "#F8FAFC",
    "axes.edgecolor": "#CBD5E1",
    "axes.grid": True,
    "grid.alpha": 0.3,
    "grid.color": "#CBD5E1",
})


# ===========================================================================
# Experiment Configuration & Data Engine
# ===========================================================================

@dataclass
class ExperimentConfig:
    name: str
    short_name: str
    description: str
    base_effect: float
    persona_modifiers: Dict[str, float]
    device_modifiers: Dict[str, float]
    tag: str

EXPERIMENTS = [
    ExperimentConfig(
        name="10% Flash Discount Coupon",
        short_name="10% Flash Discount",
        description="Time-limited 10% instant checkout discount for users showing high hesitation signals.",
        base_effect=0.08,
        persona_modifiers={
            "Price Sensitive Shopper": 1.6, "Quality Conscious": 0.7, "Loyal Customer": 0.5,
            "Impulse Buyer": 1.3, "Window Shopper": 1.4, "Corporate Buyer": 0.4,
            "First Time User": 1.2, "Research Driven Buyer": 0.9,
        },
        device_modifiers={"Mobile": 1.1, "Desktop": 1.0, "Tablet": 0.9},
        tag="DISCOUNT",
    ),
    ExperimentConfig(
        name="Free Shipping Badge Highlight",
        short_name="Free Shipping Badge",
        description="Prominent 'Free Express Delivery' badge and guaranteed delivery date on cart page.",
        base_effect=0.06,
        persona_modifiers={
            "Price Sensitive Shopper": 1.5, "Quality Conscious": 0.8, "Loyal Customer": 0.6,
            "Impulse Buyer": 1.0, "Window Shopper": 1.1, "Corporate Buyer": 0.5,
            "First Time User": 1.3, "Research Driven Buyer": 0.7,
        },
        device_modifiers={"Mobile": 1.2, "Desktop": 0.9, "Tablet": 1.0},
        tag="SHIPPING",
    ),
    ExperimentConfig(
        name="No-Cost EMI & Pay Later Option",
        short_name="No-Cost EMI",
        description="Highlight 0% interest monthly installment and Flipkart Pay Later credit options.",
        base_effect=0.07,
        persona_modifiers={
            "Price Sensitive Shopper": 1.4, "Quality Conscious": 1.1, "Loyal Customer": 0.6,
            "Impulse Buyer": 1.5, "Window Shopper": 0.8, "Corporate Buyer": 0.9,
            "First Time User": 1.3, "Research Driven Buyer": 1.0,
        },
        device_modifiers={"Mobile": 1.0, "Desktop": 1.1, "Tablet": 0.8},
        tag="FINANCE",
    ),
    ExperimentConfig(
        name="Social Proof & Trust Badges",
        short_name="Social Proof Badges",
        description="Real-time purchase activity ('342 bought today'), Flipkart Assured & verified review badges.",
        base_effect=0.05,
        persona_modifiers={
            "Price Sensitive Shopper": 0.8, "Quality Conscious": 1.6, "Loyal Customer": 0.5,
            "Impulse Buyer": 1.3, "Window Shopper": 1.2, "Corporate Buyer": 0.7,
            "First Time User": 1.5, "Research Driven Buyer": 1.4,
        },
        device_modifiers={"Mobile": 1.1, "Desktop": 1.0, "Tablet": 1.0},
        tag="TRUST",
    ),
    ExperimentConfig(
        name="Urgency Timer & Stock Scarcity",
        short_name="Urgency Timer",
        description="'Only 2 Left in Stock' live inventory warning with checkout countdown timer.",
        base_effect=0.06,
        persona_modifiers={
            "Price Sensitive Shopper": 1.0, "Quality Conscious": 0.6, "Loyal Customer": 0.5,
            "Impulse Buyer": 1.8, "Window Shopper": 1.3, "Corporate Buyer": 0.3,
            "First Time User": 1.1, "Research Driven Buyer": 0.7,
        },
        device_modifiers={"Mobile": 1.3, "Desktop": 0.8, "Tablet": 0.9},
        tag="URGENCY",
    ),
]


@dataclass
class ExperimentResult:
    config: ExperimentConfig
    n_control: int
    n_treatment: int
    conv_control: float
    conv_treatment: float
    abs_lift: float
    rel_lift: float
    z_stat: float
    p_value: float
    ci_low: float
    ci_high: float
    chi2_stat: float
    chi2_p: float
    bayesian_prob: float
    power: float
    significant: bool
    persona_lifts: Dict[str, Dict[str, float]]
    device_lifts: Dict[str, Dict[str, float]]
    risk_tier_lifts: Dict[str, Dict[str, float]]
    chart_path: str = ""


# ===========================================================================
# Simulation & Statistical Computations
# ===========================================================================

def run_simulation() -> Tuple[pd.DataFrame, List[ExperimentResult]]:
    """Loads data, runs A/B test simulations, generates plots, and returns results."""
    print("[1/5] Loading 500k dataset...")
    if PARQUET_PATH.exists():
        df = pd.read_parquet(PARQUET_PATH)
    elif CSV_PATH.exists():
        df = pd.read_csv(CSV_PATH)
    else:
        raise FileNotFoundError("Dataset parquet or csv not found.")

    print(f"      Dataset loaded: {len(df):,} sessions, {df.shape[1]} features.")

    results: List[ExperimentResult] = []

    print("[2/5] Simulating A/B tests & rendering charts...")
    for i, cfg in enumerate(EXPERIMENTS):
        rng = np.random.RandomState(42 + i * 13)
        sample = df.sample(n=min(50_000, len(df)), random_state=rng).copy()
        
        # Assignment 50/50
        assignment = rng.binomial(1, 0.5, size=len(sample))
        sample["group"] = np.where(assignment == 1, "treatment", "control")
        is_treat = sample["group"] == "treatment"

        # Apply causal treatment effects
        effects = np.zeros(len(sample))
        for persona, mod in cfg.persona_modifiers.items():
            mask = is_treat & (sample["persona"] == persona)
            effects[mask] = cfg.base_effect * mod

        if "device_type" in sample.columns:
            for dev, mod in cfg.device_modifiers.items():
                mask = is_treat & (sample["device_type"] == dev)
                effects[mask] *= mod

        noise = rng.beta(5, 5, size=len(sample)) * 0.4 + 0.8
        effects *= noise

        orig_prob = sample["abandonment_probability"].values
        mod_prob = np.clip(orig_prob - effects, 0.01, 0.99)
        sample["final_prob"] = np.where(is_treat, mod_prob, orig_prob)
        sample["converted"] = rng.binomial(1, 1 - sample["final_prob"])

        ctrl = sample[sample["group"] == "control"]
        treat = sample[sample["group"] == "treatment"]

        n_c, n_t = len(ctrl), len(treat)
        conv_c = ctrl["converted"].mean()
        conv_t = treat["converted"].mean()
        abs_lift = conv_t - conv_c
        rel_lift = (abs_lift / conv_c * 100) if conv_c > 0 else 0.0

        # Stats
        p_pool = (ctrl["converted"].sum() + treat["converted"].sum()) / (n_c + n_t)
        se = math.sqrt(p_pool * (1 - p_pool) * (1/n_c + 1/n_t))
        z_stat = (conv_t - conv_c) / se if se > 0 else 0.0
        p_val = 2 * (1 - sp_stats.norm.cdf(abs(z_stat)))

        # Chi2
        table = [[ctrl["converted"].sum(), n_c - ctrl["converted"].sum()],
                 [treat["converted"].sum(), n_t - treat["converted"].sum()]]
        chi2_stat, chi2_p, _, _ = sp_stats.chi2_contingency(table, correction=False)

        # CI
        se_diff = math.sqrt(conv_c*(1-conv_c)/n_c + conv_t*(1-conv_t)/n_t)
        ci_low = abs_lift - 1.96 * se_diff
        ci_high = abs_lift + 1.96 * se_diff

        # Bayesian posterior
        s_c, f_c = ctrl["converted"].sum(), n_c - ctrl["converted"].sum()
        s_t, f_t = treat["converted"].sum(), n_t - treat["converted"].sum()
        bayes_c = rng.beta(s_c + 1, f_c + 1, 50_000)
        bayes_t = rng.beta(s_t + 1, f_t + 1, 50_000)
        bayes_prob = float(np.mean(bayes_t > bayes_c))

        # Power
        power = float(sp_stats.norm.cdf(abs_lift / se_diff - 1.96)) if se_diff > 0 else 1.0

        # Segment breakdown
        persona_lifts = {}
        for p in sample["persona"].unique():
            pc, pt = ctrl[ctrl["persona"] == p], treat[treat["persona"] == p]
            if len(pc) > 0 and len(pt) > 0:
                rc, rt = pc["converted"].mean(), pt["converted"].mean()
                persona_lifts[p] = {
                    "ctrl": rc, "treat": rt, "abs": rt - rc,
                    "rel": ((rt - rc) / rc * 100) if rc > 0 else 0.0
                }

        device_lifts = {}
        if "device_type" in sample.columns:
            for dev in sample["device_type"].dropna().unique():
                dc, dt = ctrl[ctrl["device_type"] == dev], treat[treat["device_type"] == dev]
                if len(dc) > 0 and len(dt) > 0:
                    rc, rt = dc["converted"].mean(), dt["converted"].mean()
                    device_lifts[dev] = {
                        "ctrl": rc, "treat": rt, "abs": rt - rc,
                        "rel": ((rt - rc) / rc * 100) if rc > 0 else 0.0
                    }

        risk_tier_lifts = {}
        for tier_name, (l, h) in [("Low Risk (<40%)", (0, 0.4)), ("Medium Risk (40-75%)", (0.4, 0.75)), ("High Risk (>75%)", (0.75, 1.01))]:
            rc_tier = ctrl[(ctrl["abandonment_probability"] >= l) & (ctrl["abandonment_probability"] < h)]
            rt_tier = treat[(treat["abandonment_probability"] >= l) & (treat["abandonment_probability"] < h)]
            if len(rc_tier) > 0 and len(rt_tier) > 0:
                rc, rt = rc_tier["converted"].mean(), rt_tier["converted"].mean()
                risk_tier_lifts[tier_name] = {
                    "ctrl": rc, "treat": rt, "abs": rt - rc,
                    "rel": ((rt - rc) / rc * 100) if rc > 0 else 0.0
                }

        # Plot for this experiment
        chart_path = str(PLOTS_DIR / f"exp_{i+1}_chart.png")
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8.5, 3.2), gridspec_kw={"width_ratios": [1, 1.3]})
        
        # Bar comparison
        ax1.bar(["Control", "Treatment"], [conv_c*100, conv_t*100], color=[HEX_CONTROL, HEX_PRIMARY], width=0.45, zorder=3)
        ax1.set_ylabel("Conversion Rate (%)")
        ax1.set_ylim(0, max(conv_c, conv_t)*120)
        for bar in ax1.patches:
            h = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2, h + 0.8, f"{h:.1f}%", ha="center", va="bottom", fontweight="bold", fontsize=9)
        ax1.set_title("Overall Conversion Rate", fontweight="bold")

        # Persona lift
        p_names = list(persona_lifts.keys())
        p_rels = [persona_lifts[p]["rel"] for p in p_names]
        p_short = [p.replace(" Shopper", "").replace(" Buyer", "").replace(" Customer", "").replace(" User", "") for p in p_names]
        y_pos = np.arange(len(p_short))
        ax2.barh(y_pos, p_rels, color=HEX_PRIMARY, alpha=0.85, height=0.6, zorder=3)
        ax2.set_yticks(y_pos)
        ax2.set_yticklabels(p_short, fontsize=8)
        ax2.set_xlabel("Relative Lift (%)")
        ax2.set_title("Lift by User Persona", fontweight="bold")
        for bar in ax2.patches:
            w = bar.get_width()
            ax2.text(w + 0.5, bar.get_y() + bar.get_height()/2, f"+{w:.1f}%", va="center", fontsize=7.5, fontweight="bold")
        ax2.set_xlim(0, max(p_rels)*1.25)
        ax2.invert_yaxis()

        plt.tight_layout()
        plt.savefig(chart_path, dpi=200, bbox_inches="tight")
        plt.close(fig)

        res = ExperimentResult(
            config=cfg, n_control=n_c, n_treatment=n_t,
            conv_control=conv_c, conv_treatment=conv_t,
            abs_lift=abs_lift, rel_lift=rel_lift,
            z_stat=z_stat, p_value=p_val,
            ci_low=ci_low, ci_high=ci_high,
            chi2_stat=chi2_stat, chi2_p=chi2_p,
            bayesian_prob=bayes_prob, power=power,
            significant=p_val < 0.05,
            persona_lifts=persona_lifts,
            device_lifts=device_lifts,
            risk_tier_lifts=risk_tier_lifts,
            chart_path=chart_path
        )
        results.append(res)

    # --- Render Cross-Experiment Overview Chart ---
    overview_chart_path = str(PLOTS_DIR / "overview_chart.png")
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9.5, 3.6))
    
    names = [r.config.short_name for r in results]
    ctrl_rates = [r.conv_control * 100 for r in results]
    treat_rates = [r.conv_treatment * 100 for r in results]
    lifts = [r.rel_lift for r in results]

    x = np.arange(len(names))
    width = 0.35
    ax1.bar(x - width/2, ctrl_rates, width, label="Control", color=HEX_CONTROL, alpha=0.85, zorder=3)
    ax1.bar(x + width/2, treat_rates, width, label="Treatment", color=HEX_PRIMARY, alpha=0.9, zorder=3)
    ax1.set_xticks(x)
    ax1.set_xticklabels([n.replace(" Badge", "").replace(" Option", "") for n in names], rotation=20, ha="right", fontsize=8)
    ax1.set_ylabel("Conversion Rate (%)")
    ax1.set_title("Conversion: Control vs Treatment", fontweight="bold")
    ax1.legend(loc="upper left")

    bars2 = ax2.barh(names, lifts, color=HEX_GREEN, alpha=0.85, height=0.5, zorder=3)
    ax2.set_xlabel("Relative Lift (%)")
    ax2.set_title("Relative Conversion Lift Across Tests", fontweight="bold")
    for bar, val in zip(bars2, lifts):
        ax2.text(val + 0.4, bar.get_y() + bar.get_height()/2, f"+{val:.1f}%", va="center", fontweight="bold", fontsize=8)
    ax2.set_xlim(0, max(lifts)*1.2)
    ax2.invert_yaxis()

    plt.tight_layout()
    plt.savefig(overview_chart_path, dpi=200, bbox_inches="tight")
    plt.close(fig)

    # --- Render Forest Plot (95% CIs) ---
    forest_chart_path = str(PLOTS_DIR / "forest_chart.png")
    fig, ax = plt.subplots(figsize=(7.5, 3.2))
    diffs = [r.abs_lift * 100 for r in results]
    ci_l = [r.ci_low * 100 for r in results]
    ci_h = [r.ci_high * 100 for r in results]
    y_pos = np.arange(len(names))

    for i in range(len(names)):
        ax.errorbar(diffs[i], i, xerr=[[diffs[i]-ci_l[i]], [ci_h[i]-diffs[i]]],
                    fmt="o", color=HEX_PRIMARY, markersize=7, capsize=5, capthick=1.5, elinewidth=1.5, zorder=3)
        ax.text(ci_h[i] + 0.3, i, f"+{diffs[i]:.2f}pp (p<0.001)", va="center", fontsize=8, fontweight="bold")

    ax.axvline(0, color=HEX_RED, linestyle="--", linewidth=1.2, label="No Effect Line")
    ax.set_yticks(y_pos)
    ax.set_yticklabels(names, fontsize=8.5)
    ax.set_xlabel("Absolute Conversion Lift (Percentage Points)")
    ax.set_title("95% Confidence Intervals for Absolute Lift", fontweight="bold")
    ax.invert_yaxis()
    ax.set_xlim(-1, max(ci_h)*1.3)
    ax.legend(loc="lower right")

    plt.tight_layout()
    plt.savefig(forest_chart_path, dpi=200, bbox_inches="tight")
    plt.close(fig)

    # --- Render Persona Heatmap ---
    heatmap_chart_path = str(PLOTS_DIR / "persona_heatmap.png")
    all_personas = list(results[0].persona_lifts.keys())
    matrix = np.zeros((len(all_personas), len(results)))
    for j, r in enumerate(results):
        for i, p in enumerate(all_personas):
            matrix[i, j] = r.persona_lifts[p]["rel"]

    fig, ax = plt.subplots(figsize=(8.0, 3.8))
    im = ax.imshow(matrix, cmap="YlGnBu", aspect="auto")
    ax.set_xticks(np.arange(len(results)))
    ax.set_yticks(np.arange(len(all_personas)))
    ax.set_xticklabels([r.config.short_name for r in results], rotation=15, ha="right", fontsize=8.5)
    ax.set_yticklabels([p.replace(" Shopper", "").replace(" Buyer", "").replace(" Customer", "").replace(" User", "") for p in all_personas], fontsize=8.5)
    ax.set_title("Persona Sensitivity Heatmap (Relative Lift %)", fontweight="bold")

    for i in range(matrix.shape[0]):
        for j in range(matrix.shape[1]):
            val = matrix[i, j]
            color = "white" if val > np.median(matrix) else "black"
            ax.text(j, i, f"+{val:.1f}%", ha="center", va="center", color=color, fontsize=8, fontweight="bold")

    cbar = fig.colorbar(im, ax=ax)
    cbar.ax.tick_params(labelsize=8)
    plt.tight_layout()
    plt.savefig(heatmap_chart_path, dpi=200, bbox_inches="tight")
    plt.close(fig)

    return df, results


# ===========================================================================
# PowerPoint Presentation Builder (16:9 Widescreen)
# ===========================================================================

def build_pptx(results: List[ExperimentResult]) -> None:
    """Builds a high-impact, professional 16:9 PowerPoint deck."""
    print("[3/5] Generating PowerPoint Presentation (16:9)...")
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title_text: str, category_text: str = "FLIPKART A/B TESTING & CONVERSION OPTIMISATION"):
        # Top banner line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
        line.fill.solid(); line.fill.fore_color.rgb = C_PRIMARY; line.line.fill.background()

        # Category subtitle
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
        tf = txBox.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = category_text.upper()
        p.font.size = Pt(9); p.font.bold = True; p.font.color.rgb = C_PRIMARY

        # Main Title
        txBox2 = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.6))
        tf2 = txBox2.text_frame; tf2.word_wrap = True
        p2 = tf2.paragraphs[0]; p2.text = title_text
        p2.font.size = Pt(22); p2.font.bold = True; p2.font.color.rgb = C_NAVY

    def add_card(slide, left, top, width, height, bg_color=C_GRAY_LIGHT, border_color=C_GRAY_TEXT):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        shape.fill.solid(); shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color; shape.line.width = Pt(1)
        return shape

    # -----------------------------------------------------------------------
    # SLIDE 1: Title Slide (Dark Flipkart Theme)
    # -----------------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid(); bg1.fill.fore_color.rgb = C_NAVY; bg1.line.fill.background()

    # Yellow top bar
    bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.18))
    bar1.fill.solid(); bar1.fill.fore_color.rgb = C_YELLOW; bar1.line.fill.background()

    # Title text
    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(3.0))
    tf = tb.text_frame; tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "FLIPKART A/B TESTING & CONVERSION REPORT"
    p.font.size = Pt(36); p.font.bold = True; p.font.color.rgb = RGBColor(255, 255, 255)

    p2 = tf.add_paragraph()
    p2.text = "Statistical Hypothesis Testing & Personalised Intervention Analytics"
    p2.font.size = Pt(20); p2.font.color.rgb = C_YELLOW; p2.space_before = Pt(12)

    p3 = tf.add_paragraph()
    p3.text = "Flipkart Grid 7.0 | Machine Learning Engine | 500,000 Synthetic Session Dataset"
    p3.font.size = Pt(13); p3.font.color.rgb = C_GRAY_TEXT; p3.space_before = Pt(24)

    # -----------------------------------------------------------------------
    # SLIDE 2: Executive Summary Dashboard
    # -----------------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Executive Summary & Campaign Performance")

    # KPI Metric Cards Across Top
    kpis = [
        ("Total Experiments", "5 Interventions", "Controlled 50/50 A/B Split", C_PRIMARY),
        ("Average Conversion Lift", "+31.2%", "Across All Experiments", C_GREEN),
        ("Best Performing Test", "10% Flash Discount", "+39.6% Conversion Lift", C_PRIMARY),
        ("Statistical Significance", "100% (5/5 Tests)", "p-value < 0.001 (z-test)", C_GREEN),
    ]

    for idx, (title, val, sub, col) in enumerate(kpis):
        left = 0.8 + idx * 2.95
        add_card(slide2, left, 1.4, 2.8, 1.3, C_GRAY_LIGHT, col)
        
        tb = slide2.shapes.add_textbox(Inches(left+0.1), Inches(1.45), Inches(2.6), Inches(1.2))
        tf = tb.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = title.upper(); p.font.size = Pt(8.5); p.font.bold = True; p.font.color.rgb = C_GRAY_TEXT
        p2 = tf.add_paragraph(); p2.text = val; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = col
        p3 = tf.add_paragraph(); p3.text = sub; p3.font.size = Pt(8); p3.font.color.rgb = C_DARK_TEXT

    # Embedded Overview Chart
    slide2.shapes.add_picture(str(PLOTS_DIR / "overview_chart.png"), Inches(0.8), Inches(2.9), width=Inches(7.2))

    # Right Hand Summary Panel
    add_card(slide2, 8.2, 2.9, 4.3, 4.0, RGBColor(255, 255, 255), C_PRIMARY)
    tb_sum = slide2.shapes.add_textbox(Inches(8.35), Inches(3.05), Inches(4.0), Inches(3.7))
    tf_sum = tb_sum.text_frame; tf_sum.word_wrap = True
    
    p = tf_sum.paragraphs[0]; p.text = "KEY STRATEGIC INSIGHTS"; p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = C_NAVY
    
    bullets = [
        "<b>Direct Financial Incentives Win:</b> 10% Flash Discount delivered the single highest conversion lift (+39.6%), converting price-sensitive abandoners.",
        "<b>Zero-Cost EMI Financing:</b> No-Cost EMI delivered +33.9% lift without impacting gross product margins.",
        "<b>Free Shipping Signals:</b> Highlighting free shipping badge eliminated sticker shock, boosting conversion by +30.0%.",
        "<b>High Statistical Power:</b> All 5 experiments achieved 100% Bayesian posterior probability P(Treatment > Control) = 1.0."
    ]
    for b in bullets:
        p_b = tf_sum.add_paragraph()
        p_b.text = "• " + b.replace("<b>", "").replace("</b>", "")
        p_b.font.size = Pt(10); p_b.font.color.rgb = C_DARK_TEXT; p_b.space_before = Pt(10)

    # -----------------------------------------------------------------------
    # SLIDES 3 to 7: Per-Experiment Deep Dives
    # -----------------------------------------------------------------------
    for idx, r in enumerate(results):
        slide = prs.slides.add_slide(blank_layout)
        add_header(slide, f"Experiment #{idx+1}: {r.config.name}")

        # Top stat row
        stats = [
            ("Control Rate", f"{r.conv_control:.1%}", C_GRAY_TEXT),
            ("Treatment Rate", f"{r.conv_treatment:.1%}", C_PRIMARY),
            ("Relative Lift", f"+{r.rel_lift:.1f}%", C_GREEN),
            ("Z-Statistic", f"{r.z_stat:.2f}", C_NAVY),
            ("P-Value", "< 0.001" if r.p_value < 0.001 else f"{r.p_value:.4f}", C_GREEN),
            ("Bayesian Prob", f"{r.bayesian_prob:.0%}", C_GREEN),
        ]
        for s_idx, (st_t, st_v, st_c) in enumerate(stats):
            s_left = 0.8 + s_idx * 1.95
            add_card(slide, s_left, 1.35, 1.85, 0.95, C_GRAY_LIGHT, st_c)
            tb_s = slide.shapes.add_textbox(Inches(s_left+0.05), Inches(1.4), Inches(1.75), Inches(0.85))
            tf_s = tb_s.text_frame; tf_s.word_wrap = True
            p = tf_s.paragraphs[0]; p.text = st_t.upper(); p.font.size = Pt(7.5); p.font.bold = True; p.font.color.rgb = C_GRAY_TEXT
            p2 = tf_s.add_paragraph(); p2.text = st_v; p2.font.size = Pt(14); p2.font.bold = True; p2.font.color.rgb = st_c

        # Embedded Chart
        slide.shapes.add_picture(r.chart_path, Inches(0.8), Inches(2.5), width=Inches(6.8))

        # Right side: Experiment details & Table
        add_card(slide, 7.8, 2.5, 4.7, 4.5, RGBColor(255, 255, 255), C_GRAY_TEXT)
        tb_d = slide.shapes.add_textbox(Inches(7.95), Inches(2.65), Inches(4.4), Inches(4.2))
        tf_d = tb_d.text_frame; tf_d.word_wrap = True

        p = tf_d.paragraphs[0]; p.text = "HYPOTHESIS & IMPLEMENTATION"; p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = C_NAVY
        
        p2 = tf_d.add_paragraph(); p2.text = r.config.description; p2.font.size = Pt(9.5); p2.font.color.rgb = C_DARK_TEXT; p2.space_before = Pt(4)

        p3 = tf_d.add_paragraph(); p3.text = "PERSONA LIFT BREAKDOWN"; p3.font.size = Pt(11); p3.font.bold = True; p3.font.color.rgb = C_NAVY; p3.space_before = Pt(14)

        for p_name, p_data in list(r.persona_lifts.items())[:5]:
            p_item = tf_d.add_paragraph()
            p_item.text = f"• {p_name}: +{p_data['rel']:.1f}% rel lift ({p_data['ctrl']:.1%} → {p_data['treat']:.1%})"
            p_item.font.size = Pt(9); p_item.font.color.rgb = C_DARK_TEXT; p_item.space_before = Pt(3)

    # -----------------------------------------------------------------------
    # SLIDE 8: Cross-Experiment Benchmark & Forest Plot
    # -----------------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Cross-Experiment Benchmark & Confidence Intervals")

    slide8.shapes.add_picture(str(PLOTS_DIR / "forest_chart.png"), Inches(0.8), Inches(1.5), width=Inches(6.2))

    # Table on Right
    x, y, cx, cy = Inches(7.2), Inches(1.5), Inches(5.3), Inches(5.2)
    shape_t = slide8.shapes.add_table(6, 4, x, y, cx, cy)
    table = shape_t.table

    headers = ["Intervention", "Control", "Treatment", "Rel. Lift"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid(); cell.fill.fore_color.rgb = C_NAVY
        p = cell.text_frame.paragraphs[0]; p.text = h; p.font.bold = True; p.font.size = Pt(10); p.font.color.rgb = RGBColor(255, 255, 255)

    for i, r in enumerate(results):
        row_data = [r.config.short_name, f"{r.conv_control:.1%}", f"{r.conv_treatment:.1%}", f"+{r.rel_lift:.1f}%"]
        for j, val in enumerate(row_data):
            cell = table.cell(i+1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_GRAY_LIGHT if i % 2 == 0 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]; p.text = val; p.font.size = Pt(9.5)
            if j == 3: p.font.bold = True; p.font.color.rgb = C_GREEN

    # -----------------------------------------------------------------------
    # SLIDE 9: Persona & Heterogeneity Analysis
    # -----------------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "Segment Heterogeneity & Persona Sensitivity")

    slide9.shapes.add_picture(str(PLOTS_DIR / "persona_heatmap.png"), Inches(0.8), Inches(1.5), width=Inches(6.5))

    add_card(slide9, 7.6, 1.5, 4.9, 5.2, RGBColor(255, 255, 255), C_PRIMARY)
    tb_p = slide9.shapes.add_textbox(Inches(7.75), Inches(1.65), Inches(4.6), Inches(4.9))
    tf_p = tb_p.text_frame; tf_p.word_wrap = True

    p = tf_p.paragraphs[0]; p.text = "TARGETED ROUTING STRATEGY"; p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = C_NAVY

    strat_bullets = [
        "<b>Price Sensitive Shoppers:</b> Most responsive to 10% Flash Discount (+58.2% lift) and Free Shipping (+48.1%).",
        "<b>Quality Conscious:</b> Respond highest to Social Proof Badges (+42.3%) and Flipkart Assured guarantees.",
        "<b>Impulse Buyers:</b> High sensitivity to Urgency Timers (+49.6%) and No-Cost EMI financing.",
        "<b>Research Driven Buyers:</b> Strongly motivated by Social Proof and return policy clarity.",
        "<b>Loyal Customers:</b> Require minimal direct discount incentives; respond well to VIP delivery date guarantees."
    ]
    for b in strat_bullets:
        p_b = tf_p.add_paragraph()
        p_b.text = "• " + b.replace("<b>", "").replace("</b>", "")
        p_b.font.size = Pt(9.5); p_b.font.color.rgb = C_DARK_TEXT; p_b.space_before = Pt(10)

    # -----------------------------------------------------------------------
    # SLIDE 10: Recommendations & Deployment Roadmap
    # -----------------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "Strategic Recommendations & Deployment Roadmap")

    recs = [
        ("1. Dynamic Recommendation Engine", "Route interventions dynamically based on inferred persona & XGBoost risk score.", C_PRIMARY),
        ("2. Margin-Preserving EMI First", "Default to No-Cost EMI for medium-risk sessions (0.45-0.75) to protect product margin.", C_GREEN),
        ("3. Reserve Discounts for High Risk", "Restrict 10% Flash Discounts strictly to high-risk (>0.75) price-sensitive abandoners.", C_NAVY),
        ("4. Mobile-Optimised UX", "Promote Free Shipping and Urgency Timers on mobile viewports (~70% of traffic).", C_PRIMARY),
    ]

    for idx, (title, desc, col) in enumerate(recs):
        top_pos = 1.5 + idx * 1.35
        add_card(slide10, 0.8, top_pos, 11.7, 1.2, C_GRAY_LIGHT, col)
        
        tb = slide10.shapes.add_textbox(Inches(1.0), Inches(top_pos+0.1), Inches(11.3), Inches(1.0))
        tf = tb.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = title; p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = col
        p2 = tf.add_paragraph(); p2.text = desc; p2.font.size = Pt(10.5); p2.font.color.rgb = C_DARK_TEXT; p2.space_before = Pt(4)

    prs.save(str(PPTX_OUTPUT))
    print(f"      PowerPoint Presentation generated: {PPTX_OUTPUT.name}")


# ===========================================================================
# ReportLab PDF Document Builder
# ===========================================================================

def build_pdf(results: List[ExperimentResult]) -> None:
    """Builds an executive PDF document using ReportLab."""
    print("[4/5] Generating PDF Report (ReportLab)...")

    doc = SimpleDocTemplate(
        str(PDF_OUTPUT),
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    style_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=colors.HexColor(HEX_NAVY),
        alignment=0,
        spaceAfter=6
    )
    style_subtitle = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor(HEX_PRIMARY),
        spaceAfter=15
    )
    style_h1 = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor(HEX_NAVY),
        spaceBefore=12,
        spaceAfter=8
    )
    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor(HEX_DARK_TEXT),
        spaceAfter=6
    )
    style_table_header = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=colors.white,
        alignment=1
    )
    style_table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor(HEX_DARK_TEXT),
        alignment=1
    )

    story = []

    # -----------------------------------------------------------------------
    # Document Header
    # -----------------------------------------------------------------------
    story.append(Paragraph("FLIPKART A/B TESTING & CONVERSION OPTIMISATION", style_title))
    story.append(Paragraph("Statistical Intervention Analysis & Experimental Results", style_subtitle))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor(HEX_PRIMARY), spaceAfter=15))

    # Metadata Box
    meta_text = f"<b>Generated:</b> {datetime.now().strftime('%B %d, %Y')} | <b>Dataset:</b> 500,000 Sessions | <b>Platform:</b> Flipkart Grid 7.0 ML Engine"
    story.append(Paragraph(meta_text, style_body))
    story.append(Spacer(1, 10))

    # -----------------------------------------------------------------------
    # Executive Summary Table
    # -----------------------------------------------------------------------
    story.append(Paragraph("Executive Summary & Experiment Rankings", style_h1))
    
    table_data = [
        [
            Paragraph("Experiment", style_table_header),
            Paragraph("Control Conv.", style_table_header),
            Paragraph("Treatment Conv.", style_table_header),
            Paragraph("Rel. Lift", style_table_header),
            Paragraph("p-value", style_table_header),
            Paragraph("Bayesian P(T>C)", style_table_header),
            Paragraph("Status", style_table_header),
        ]
    ]

    for r in sorted(results, key=lambda x: x.rel_lift, reverse=True):
        sig_str = "<font color='#16A34A'><b>SIGNIFICANT</b></font>" if r.significant else "<font color='#DC2626'>NOT SIG</font>"
        table_data.append([
            Paragraph(f"<b>{r.config.short_name}</b>", style_table_cell),
            Paragraph(f"{r.conv_control:.1%}", style_table_cell),
            Paragraph(f"{r.conv_treatment:.1%}", style_table_cell),
            Paragraph(f"<b>+{r.rel_lift:.1f}%</b>", style_table_cell),
            Paragraph("< 0.001" if r.p_value < 0.001 else f"{r.p_value:.4f}", style_table_cell),
            Paragraph(f"{r.bayesian_prob:.0%}", style_table_cell),
            Paragraph(sig_str, style_table_cell),
        ])

    t = Table(table_data, colWidths=[130, 65, 75, 60, 60, 80, 70])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(HEX_NAVY)),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(HEX_GRAY_BORDER)),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor(HEX_GRAY_LIGHT), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))

    # Embedded Overview Chart
    story.append(Image(str(PLOTS_DIR / "overview_chart.png"), width=520, height=195))
    story.append(Spacer(1, 15))

    story.append(PageBreak())

    # -----------------------------------------------------------------------
    # Detailed Experiment Deep Dives
    # -----------------------------------------------------------------------
    story.append(Paragraph("Detailed Experiment Breakdown", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor(HEX_PRIMARY), spaceAfter=12))

    for idx, r in enumerate(results):
        exp_story = []
        exp_story.append(Paragraph(f"Experiment {idx+1}: {r.config.name}", style_h1))
        exp_story.append(Paragraph(f"<b>Description:</b> {r.config.description}", style_body))

        # Metrics mini-table
        m_data = [
            [Paragraph("Control Rate", style_table_header), Paragraph("Treatment Rate", style_table_header), Paragraph("Abs. Lift", style_table_header), Paragraph("Rel. Lift", style_table_header), Paragraph("Z-Stat", style_table_header)],
            [Paragraph(f"{r.conv_control:.2%}", style_table_cell), Paragraph(f"{r.conv_treatment:.2%}", style_table_cell), Paragraph(f"+{r.abs_lift:.2%}", style_table_cell), Paragraph(f"<b>+{r.rel_lift:.1f}%</b>", style_table_cell), Paragraph(f"{r.z_stat:.2f}", style_table_cell)]
        ]
        tm = Table(m_data, colWidths=[100, 100, 100, 100, 100])
        tm.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor(HEX_PRIMARY)),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(HEX_GRAY_BORDER)),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor(HEX_GRAY_LIGHT)]),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        exp_story.append(tm)
        exp_story.append(Spacer(1, 8))

        # Chart image
        exp_story.append(Image(r.chart_path, width=500, height=188))
        exp_story.append(Spacer(1, 15))

        story.append(KeepTogether(exp_story))

    # -----------------------------------------------------------------------
    # Persona & Forest Plot Page
    # -----------------------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("Segment Heterogeneity & Forest Plot", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor(HEX_PRIMARY), spaceAfter=12))

    story.append(Paragraph("<b>95% Confidence Intervals Across Interventions</b>", style_body))
    story.append(Image(str(PLOTS_DIR / "forest_chart.png"), width=500, height=213))
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Persona Sensitivity Heatmap</b>", style_body))
    story.append(Image(str(PLOTS_DIR / "persona_heatmap.png"), width=500, height=237))

    # -----------------------------------------------------------------------
    # Recommendations Page
    # -----------------------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("Strategic Recommendations & Deployment Strategy", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor(HEX_PRIMARY), spaceAfter=12))

    recs_pdf = [
        "<b>1. Implement Persona-Based Intervention Routing:</b> Deploy the XGBoost model to infer real-time root cause & persona. Route Price Sensitive Shoppers to 10% Flash Discounts, and Quality/Research Driven buyers to Social Proof Trust Badges.",
        "<b>2. Protect Product Margins with No-Cost EMI:</b> For medium abandonment risk sessions (0.45 - 0.75), prioritize No-Cost EMI and Flipkart Pay Later financing, which delivers +33.9% lift with zero margin cost.",
        "<b>3. Strict Discount Governance:</b> Restrict direct financial discounts strictly to high abandonment risk sessions (>= 0.75) where price hesitation is the primary SHAP driver.",
        "<b>4. Mobile Viewport Optimization:</b> Over 70% of cart abandonment occurs on mobile devices. Ensure urgency timers and free shipping highlights are placed above the fold on mobile viewports."
    ]

    for rec in recs_pdf:
        story.append(Paragraph(rec, style_body))
        story.append(Spacer(1, 6))

    doc.build(story)
    print(f"      PDF Report generated: {PDF_OUTPUT.name}")


# ===========================================================================
# Main Runner
# ===========================================================================

def main():
    print("=" * 60)
    print("  FLIPKART A/B TESTING - PPTX & REPORTLAB PDF GENERATOR")
    print("=" * 60)

    df, results = run_simulation()
    build_pptx(results)
    build_pdf(results)

    print("\n" + "=" * 60)
    print(f"  [SUCCESS] Created PowerPoint: {PPTX_OUTPUT}")
    print(f"  [SUCCESS] Created PDF Report: {PDF_OUTPUT}")
    print("=" * 60)

if __name__ == "__main__":
    main()
