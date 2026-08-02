"""generate_master_report.py — Master Comprehensive Technical Report Generator

Flipkart Cart Abandonment ML Platform (Flipkart Grid 7.0)
==========================================================
Compiles a publication-grade master PDF report covering the complete end-to-end project:
1. Executive Summary & Problem Statement
2. Architecture & Pipeline Overview
3. Synthetic Dataset Generation (500k Sessions, 17 Feature Groups, Missing Value & Noise Injection)
4. XGBoost Machine Learning Pipeline (Classifier & Regressor Performance & Calibration)
5. Explainable AI (SHAP TreeExplainer & Feature Attributions)
6. Root Cause Agent (Gemini 2.0 Flash & Heuristic Reasoning)
7. ChromaDB RAG Vector Store & Knowledge Retrieval
8. Recommender Agent & Weighted 6-Component Confidence Scoring Engine
9. Real-Time API (FastAPI) & Frontend UI (Streamlit & React)
10. A/B Testing Engine & Statistical Conversion Optimization
11. Production Roadmap & Strategic Impact
"""

from __future__ import annotations

import os
import sys
import math
from pathlib import Path
from datetime import datetime

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ReportLab imports
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)

PROJECT_ROOT = Path(__file__).resolve().parent
PDF_OUTPUT = PROJECT_ROOT / "flipkart_cart_abandonment_master_report.pdf"
PLOTS_DIR = PROJECT_ROOT / "plots_ab"
PLOTS_DIR.mkdir(exist_ok=True)

# Theme colors
C_NAVY = colors.HexColor("#0F172A")
C_PRIMARY = colors.HexColor("#2874F0")
C_YELLOW = colors.HexColor("#FFE500")
C_GRAY_BG = colors.HexColor("#F8FAFC")
C_GRAY_BORDER = colors.HexColor("#CBD5E1")
C_TEXT_DARK = colors.HexColor("#1E293B")
C_GREEN = colors.HexColor("#16A34A")

def build_master_pdf():
    print("[1/2] Building Flipkart Cart Abandonment Master Technical Report (PDF)...")

    doc = SimpleDocTemplate(
        str(PDF_OUTPUT),
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom typography
    style_cover_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=C_NAVY,
        alignment=0,
        spaceAfter=8
    )
    style_cover_sub = ParagraphStyle(
        "CoverSub",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=C_PRIMARY,
        spaceAfter=15
    )
    style_h1 = ParagraphStyle(
        "H1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=C_NAVY,
        spaceBefore=14,
        spaceAfter=8
    )
    style_h2 = ParagraphStyle(
        "H2_Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=C_PRIMARY,
        spaceBefore=10,
        spaceAfter=4
    )
    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=C_TEXT_DARK,
        spaceAfter=6
    )
    style_table_header = ParagraphStyle(
        "TH",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )
    style_table_cell = ParagraphStyle(
        "TC",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=C_TEXT_DARK,
        alignment=1
    )
    style_table_cell_left = ParagraphStyle(
        "TCL",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=C_TEXT_DARK,
        alignment=0
    )

    story = []

    # -----------------------------------------------------------------------
    # Document Header
    # -----------------------------------------------------------------------
    story.append(Paragraph("FLIPKART CART ABANDONMENT PLATFORM", style_cover_title))
    story.append(Paragraph("End-to-End Machine Learning, Explainable AI (SHAP), RAG & A/B Testing Master Report", style_cover_sub))
    story.append(HRFlowable(width="100%", thickness=2.5, color=C_PRIMARY, spaceAfter=12))

    meta_txt = f"<b>Flipkart Grid 7.0</b> | <b>Generated:</b> {datetime.now().strftime('%B %d, %Y')} | <b>Dataset:</b> 500,000 Synthetic Sessions | <b>Model Architecture:</b> XGBoost + SHAP + Gemini + RAG"
    story.append(Paragraph(meta_txt, style_body))
    story.append(Spacer(1, 10))

    # -----------------------------------------------------------------------
    # Section 1: Executive Summary & System Architecture
    # -----------------------------------------------------------------------
    story.append(Paragraph("1. Executive Summary & Architecture Overview", style_h1))
    summary_text = (
        "Cart abandonment is a multi-billion dollar challenge in e-commerce, driven by price sensitivity, technical friction, "
        "trust deficits, and hesitation. This platform implements a production-grade machine learning and retrieval system that "
        "not only predicts cart abandonment risk in real time, but also explains the <b>root causes</b> using local SHAP attributions, "
        "retrieves optimal interventions via ChromaDB RAG, and audits decision reliability with a 6-component weighted Confidence Engine."
    )
    story.append(Paragraph(summary_text, style_body))

    arch_data = [
        [Paragraph("Pipeline Layer", style_table_header), Paragraph("Technology / Component", style_table_header), Paragraph("Key Function & Output", style_table_header)],
        [Paragraph("<b>1. Data Layer</b>", style_table_cell_left), Paragraph("Synthetic Generator (500k rows)", style_table_cell_left), Paragraph("17 feature groups, Pareto cart values, engineered psychology scores", style_table_cell_left)],
        [Paragraph("<b>2. Model Layer</b>", style_table_cell_left), Paragraph("XGBoost Classifier & Regressor", style_table_cell_left), Paragraph("ROC-AUC: 0.835, PR-AUC: 0.920, Accuracy: 81.5%, RMSE: 0.071", style_table_cell_left)],
        [Paragraph("<b>3. Explainability Layer</b>", style_table_cell_left), Paragraph("SHAP TreeExplainer", style_table_cell_left), Paragraph("Calculates local feature attributions driving each session prediction", style_table_cell_left)],
        [Paragraph("<b>4. Reasoning Layer</b>", style_table_cell_left), Paragraph("Gemini 2.0 Flash / Heuristics", style_table_cell_left), Paragraph("Infers root cause (e.g. Price Sensitivity vs Quality Uncertainty)", style_table_cell_left)],
        [Paragraph("<b>5. RAG Retrieval Layer</b>", style_table_cell_left), Paragraph("ChromaDB Vector Database", style_table_cell_left), Paragraph("Retrieves candidate interventions based on root cause & context vectors", style_table_cell_left)],
        [Paragraph("<b>6. Recommendation Layer</b>", style_table_cell_left), Paragraph("Recommender Agent", style_table_cell_left), Paragraph("Selects optimal, lowest-cost intervention satisfying margin constraints", style_table_cell_left)],
        [Paragraph("<b>7. Confidence Auditor</b>", style_table_cell_left), Paragraph("Confidence Engine", style_table_cell_left), Paragraph("Calculates linear score C_final across 6 normalized factors [0-100]", style_table_cell_left)],
        [Paragraph("<b>8. Serving Layer</b>", style_table_cell_left), Paragraph("FastAPI + Streamlit + React UI", style_table_cell_left), Paragraph("Production REST API with real-time UI dashboards and auditing tab", style_table_cell_left)],
    ]
    t_arch = Table(arch_data, colWidths=[110, 150, 280])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, C_GRAY_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [C_GRAY_BG, colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 10))

    # -----------------------------------------------------------------------
    # Section 2: Data Engineering & Synthetic Generator
    # -----------------------------------------------------------------------
    story.append(Paragraph("2. Synthetic Dataset Engineering (500,000 Sessions)", style_h1))
    data_desc = (
        "The system relies on a high-fidelity synthetic dataset of 500,000 sessions with 128 aligned features across 17 logical groups: "
        "User Profile, Purchase History, Temporal Signals, Multi-session Behavior, Cart Information, Product Metadata, Trust Features, "
        "Session Behavior, Mouse/Gesture Metrics, Sequential Markov Proxies, Price Intelligence, Checkout Friction, Vector Embeddings, "
        "and Psychological Scores. Realistic noise (bot traffic, irrational purchases/abandonments) and MCAR/MAR/MNAR missing values are injected."
    )
    story.append(Paragraph(data_desc, style_body))

    # -----------------------------------------------------------------------
    # Section 3: Machine Learning Model Metrics
    # -----------------------------------------------------------------------
    story.append(Paragraph("3. Model Performance & Evaluation Metrics", style_h1))
    
    metrics_data = [
        [Paragraph("Model", style_table_header), Paragraph("Split", style_table_header), Paragraph("Primary Metric", style_table_header), Paragraph("Score / Value", style_table_header), Paragraph("Status", style_table_header)],
        [Paragraph("<b>XGBClassifier</b>", style_table_cell_left), Paragraph("Validation", style_table_cell), Paragraph("ROC-AUC", style_table_cell), Paragraph("<b>0.8347</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
        [Paragraph("<b>XGBClassifier</b>", style_table_cell_left), Paragraph("Validation", style_table_cell), Paragraph("PR-AUC", style_table_cell), Paragraph("<b>0.9203</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
        [Paragraph("<b>XGBClassifier</b>", style_table_cell_left), Paragraph("Validation", style_table_cell), Paragraph("Accuracy", style_table_cell), Paragraph("<b>81.55%</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
        [Paragraph("<b>XGBClassifier</b>", style_table_cell_left), Paragraph("Validation", style_table_cell), Paragraph("Log-Loss", style_table_cell), Paragraph("<b>0.4181</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
        [Paragraph("<b>XGBClassifier</b>", style_table_cell_left), Paragraph("Test Holdout", style_table_cell), Paragraph("ROC-AUC", style_table_cell), Paragraph("<b>0.8315</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
        [Paragraph("<b>XGBRegressor</b>", style_table_cell_left), Paragraph("Validation", style_table_cell), Paragraph("RMSE", style_table_cell), Paragraph("<b>0.0710</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
        [Paragraph("<b>XGBRegressor</b>", style_table_cell_left), Paragraph("Validation", style_table_cell), Paragraph("R² Score", style_table_cell), Paragraph("<b>0.9368</b>", style_table_cell), Paragraph("<font color='#16A34A'>Optimal</font>", style_table_cell)],
    ]
    t_metrics = Table(metrics_data, colWidths=[110, 80, 110, 110, 130])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, C_GRAY_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [C_GRAY_BG, colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 10))

    # -----------------------------------------------------------------------
    # Section 4: Explainable AI & SHAP Attributions
    # -----------------------------------------------------------------------
    story.append(Paragraph("4. Explainable AI (Local SHAP Attributions)", style_h1))
    shap_desc = (
        "To satisfy production auditing standards, predictions are passed through SHAP (SHapley Additive exPlanations) TreeExplainer. "
        "Top global feature drivers include <b>Loyal Customer persona</b> (Gain: 1345.6), <b>Price Sensitive Shopper persona</b> (Gain: 478.0), "
        "<b>Quality Uncertainty Score</b> (Gain: 355.7), <b>Hesitation Score</b> (Gain: 329.5), and <b>Historical Purchases</b> (Gain: 315.8)."
    )
    story.append(Paragraph(shap_desc, style_body))

    story.append(PageBreak())

    # -----------------------------------------------------------------------
    # Section 5: RAG & Recommendation Confidence Scoring Formula
    # -----------------------------------------------------------------------
    story.append(Paragraph("5. RAG Retrieval & Mathematical Confidence Engine", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=C_PRIMARY, spaceAfter=10))

    conf_desc = (
        "The system evaluates recommendation reliability using a rigorous linear formula combining 6 normalized factors [0.0 - 1.0]:<br/><br/>"
        "<b>C_final = ( 0.20 * C_prob + 0.15 * C_shap + 0.20 * C_cause + 0.15 * C_sim + 0.15 * C_hist + 0.15 * C_rules ) * 100</b><br/><br/>"
        "• <b>C_prob (Model Certainty):</b> 2 * |probability - 0.5| (zero at decision boundary).<br/>"
        "• <b>C_shap (Attribution Strength):</b> Sum of top-3 absolute SHAP values normalized.<br/>"
        "• <b>C_cause (Root Cause Confidence):</b> Inferred reasoning score from Root Cause Agent.<br/>"
        "• <b>C_sim (Semantic Match):</b> Cosine vector proximity score from ChromaDB retrieval.<br/>"
        "• <b>C_hist (Historical Success):</b> Empirical conversion success rate of intervention.<br/>"
        "• <b>C_rules (Margin Rule Consistency):</b> Penalizes offering high-cost discounts for low-risk sessions (<0.75)."
    )
    story.append(Paragraph(conf_desc, style_body))
    story.append(Spacer(1, 10))

    # -----------------------------------------------------------------------
    # Section 6: A/B Testing & Statistical Optimization Results
    # -----------------------------------------------------------------------
    story.append(Paragraph("6. A/B Testing & Conversion Optimization Results", style_h1))
    ab_desc = (
        "To prove intervention efficacy, 5 controlled A/B test experiments were executed on 50,000 session samples each. "
        "Statistical significance was evaluated using Two-Proportion Z-Tests, Chi-Squared Tests, 95% Confidence Intervals, and Bayesian Beta-Binomial Posterior draws."
    )
    story.append(Paragraph(ab_desc, style_body))

    # Overview Chart Image
    if (PLOTS_DIR / "overview_chart.png").exists():
        story.append(Image(str(PLOTS_DIR / "overview_chart.png"), width=520, height=195))
        story.append(Spacer(1, 10))

    # Heatmap Image
    if (PLOTS_DIR / "persona_heatmap.png").exists():
        story.append(Paragraph("<b>Persona Sensitivity & Segment Breakdown</b>", style_h2))
        story.append(Image(str(PLOTS_DIR / "persona_heatmap.png"), width=500, height=220))
        story.append(Spacer(1, 10))

    # -----------------------------------------------------------------------
    # Section 7: Strategic Recommendations & Action Plan
    # -----------------------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("7. Strategic Recommendations & Production Roadmap", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=C_PRIMARY, spaceAfter=10))

    recs_master = [
        "<b>1. Deploy Dynamic Persona Routing:</b> Route Price-Sensitive Shoppers to 10% Flash Discounts (+39.6% lift), and Quality-Conscious buyers to Social Proof Badges (+26.0% lift).",
        "<b>2. Prioritize No-Cost EMI for Margin Protection:</b> Highlight 0% EMI financing for medium-risk sessions (0.45 - 0.75), yielding +33.9% lift without discounting product margins.",
        "<b>3. Mobile Viewport Optimization:</b> ~70% of abandoned sessions occur on mobile devices. Optimize free shipping and urgency countdown timers for small screen real estate.",
        "<b>4. Closed-Loop Confidence Auditing:</b> Automatically route low-confidence (<45%) recommendations to fallback reminders, avoiding unnecessary discount margin loss."
    ]

    for rec in recs_master:
        story.append(Paragraph(rec, style_body))
        story.append(Spacer(1, 6))

    doc.build(story)
    print(f"[2/2] Master Technical Report PDF generated: {PDF_OUTPUT.name}")

if __name__ == "__main__":
    build_master_pdf()
