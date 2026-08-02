import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BarChart2, ShieldAlert, Cpu, Database, Award, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from '../components/DesignSystem';

const Landing: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  const steps = [
    { icon: <Cpu className="text-blue-400" size={20} />, title: "ML Classifier", label: "Predict Risk" },
    { icon: <BarChart2 className="text-purple-400" size={20} />, title: "SHAP Explainability", label: "Isolate Friction" },
    { icon: <Sparkles className="text-pink-400" size={20} />, title: "Reasoning Agent", label: "Infer Cause" },
    { icon: <Database className="text-emerald-400" size={20} />, title: "ChromaDB RAG", label: "Retrieve Interventions" },
    { icon: <Award className="text-amber-400" size={20} />, title: "Recommender", label: "Optimise Nudge" }
  ];

  return (
    <motion.div
      className="min-h-screen py-16 px-6 max-w-7xl mx-auto flex flex-col gap-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 1. HERO SECTION */}
      <motion.section className="text-center flex flex-col items-center gap-6" variants={itemVariants}>
        <Badge variant="primary" className="px-3.5 py-1 text-sm tracking-wider uppercase bg-ai-blue/10 border-ai-blue/30 text-ai-blue">
          Flipkart AI Recommendation Platform
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl">
          Predict & Prevent Cart Abandonment using <span className="bg-gradient-to-r from-ai-blue via-blue-400 to-ai-purple bg-clip-text text-transparent">Explainable RAG</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-400 max-w-2xl">
           Flipkart's conversion optimization engine. Analyzes real-time shopping behavior, explains conversion obstacles via SHAP, and retrieves high-efficiency checkout nudges.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link to="/store">
            <Button variant="primary" className="px-8 py-3.5 text-base active:scale-95 group">
              <span>Start Shopping Demo</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="glass" className="px-8 py-3.5 text-base active:scale-95">
              <span>Open AI Dashboard</span>
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* 2. PROJECT OVERVIEW */}
      <motion.section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center" variants={itemVariants}>
        <div className="text-left flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Protecting Merchant Margins while Maximising Conversions</h2>
          <p className="text-slate-400 leading-relaxed">
            Standard e-commerce setups offer coupons to every customer who abandons their cart, eroding product margins and reinforcing bad waiting behaviors. 
          </p>
          <p className="text-slate-400 leading-relaxed">
            Our system solves this. Using an XGBoost classification pipeline, it triggers SHAP attributions to find the root cause of friction. 
            RAG then searches a structured database to match the user with the most cost-efficient conversion strategy.
          </p>
        </div>
        <Card variant="glow" className="flex flex-col gap-6 text-left">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-ai-blue" />
            <span>Real-time Risk Metrics</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inference Speed</span>
              <div className="text-lg font-extrabold text-white mt-1">~1.2 ms</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SHAP Resolution</span>
              <div className="text-lg font-extrabold text-white mt-1">100% Native</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">RAG Retrieval</span>
              <div className="text-lg font-extrabold text-white mt-1">&lt; 180 ms</div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* 3. AI WORKFLOW DIAGRAM */}
      <motion.section className="flex flex-col gap-8 text-center" variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">The AI Inference Pipeline</h2>
          <p className="text-sm text-slate-500">Every behavioral signal is processed sequentially to formulate compliant recommendations</p>
        </div>

        {/* Workflow steps diagram */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 overflow-x-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2.5 p-4 bg-slate-900/40 rounded-lg border border-slate-800/50 min-w-[150px] flex-1">
                <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-white">{step.title}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{step.label}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center text-slate-700 animate-pulse">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.section>

      {/* 4. FEATURES GRID */}
      <motion.section className="flex flex-col gap-8 text-left" variants={itemVariants}>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center">Engine Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <h4 className="font-bold text-base text-white">Dual XGBoost Core</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual-model backend utilizing high-capacity XGBClassifier for probability estimation and XGBRegressor for baseline comparison.
            </p>
          </Card>
          <Card className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <h4 className="font-bold text-base text-white">Tree-Attribution SHAP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides mathematical guarantees on local feature explanations to pinpoint conversion obstacles per user session.
            </p>
          </Card>
          <Card className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database size={18} />
            </div>
            <h4 className="font-bold text-base text-white">ChromaDB Retrieval</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Searches a 200-document knowledge base with metadata filters to find matched interventions.
            </p>
          </Card>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Landing;
