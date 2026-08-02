import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BarChart2, ShieldAlert, Cpu, Database, Award, ArrowRight } from 'lucide-react';
import { Button, Card } from '../components/DesignSystem';

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
    { icon: <Cpu className="text-[#60a5fa]" size={20} />, title: "ML Classifier", label: "Predict Risk" },
    { icon: <BarChart2 className="text-[#a78bfa]" size={20} />, title: "SHAP Engine", label: "Isolate Friction" },
    { icon: <Sparkles className="text-[#F8CB2E]" size={20} />, title: "Reasoning Agent", label: "Infer Cause" },
    { icon: <Database className="text-[#34d399]" size={20} />, title: "ChromaDB RAG", label: "Retrieve Interventions" },
    { icon: <Award className="text-amber-400" size={20} />, title: "Recommender", label: "Optimise Nudge" }
  ];

  return (
    <motion.div
      className="min-h-screen py-16 px-4 sm:px-6 max-w-[1400px] mx-auto flex flex-col gap-20 relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 1. HERO SECTION */}
      <motion.section className="text-center flex flex-col items-center gap-6" variants={itemVariants}>
        <div className="flex items-center gap-2 bg-[#F8CB2E]/10 border border-[#F8CB2E]/30 px-3 py-1 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#F8CB2E] animate-pulse" />
          <span className="text-[#F8CB2E] font-bold">FLIPKART GRiD 8.0</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Intelligent Cart Abandonment Intervention</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl font-ui">
          Predict & Prevent Cart Abandonment with <span className="text-[#F8CB2E]">Agentic AI Intelligence</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-mono leading-relaxed">
          Flipkart's real-time cart abandonment control center. Monitors live shopping behavior, isolates hesitation friction via local SHAP attributions, and deploys targeted RAG interventions.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link to="/store">
            <Button variant="primary" className="px-8 py-3.5 text-sm font-mono font-extrabold uppercase tracking-wider group shadow-lg shadow-[#F8CB2E]/20">
              <span>Launch Store Demo</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" className="px-8 py-3.5 text-sm font-mono font-bold uppercase tracking-wider">
              <span>Open Mission Control</span>
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* 2. PROJECT OVERVIEW */}
      <motion.section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center" variants={itemVariants}>
        <div className="text-left flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-ui">Protecting Merchant Margins while Maximising Conversions</h2>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            Generic e-commerce platforms push heavy discount coupons to every abandoning user, eroding merchant margins and training shoppers to wait for price drops. 
          </p>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            Our system solves this. An XGBoost Classifier estimates abandonment probability in real time, TreeSHAP maps local attributions to isolate exact friction causes, and a ChromaDB RAG Engine retrieves cost-efficient targeted interventions.
          </p>
        </div>
        
        <Card variant="glow" className="flex flex-col gap-6 text-left">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-ui">
            <ShieldAlert className="text-[#F8CB2E]" />
            <span>Real-time Risk Performance</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 font-mono">
            <div className="p-3 bg-[#0d1220] rounded-lg border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inference Speed</span>
              <div className="text-lg font-black text-white mt-1">~1.2 ms</div>
            </div>
            <div className="p-3 bg-[#0d1220] rounded-lg border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SHAP Resolution</span>
              <div className="text-lg font-black text-white mt-1">100% Native</div>
            </div>
            <div className="p-3 bg-[#0d1220] rounded-lg border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RAG Retrieval</span>
              <div className="text-lg font-black text-[#F8CB2E] mt-1">&lt; 180 ms</div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* 3. AI WORKFLOW DIAGRAM */}
      <motion.section className="flex flex-col gap-8 text-center" variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-ui">The Multi-Agent Inference Pipeline</h2>
          <p className="text-xs font-mono text-slate-400">Sequential execution from telemetry signal capture to personalized intervention deployment</p>
        </div>

        {/* Workflow steps diagram */}
        <div className="glass p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto font-mono">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2.5 p-4 bg-[#0d1220] rounded-lg border border-white/10 min-w-[150px] flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#080c14] flex items-center justify-center border border-white/10 shadow-inner">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-white">{step.title}</div>
                <div className="text-[10px] text-[#F8CB2E] uppercase tracking-widest font-bold">{step.label}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center text-slate-600 animate-pulse">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.section>

      {/* 4. FEATURES GRID */}
      <motion.section className="flex flex-col gap-8 text-left" variants={itemVariants}>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center font-ui">System Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded bg-[#60a5fa]/10 text-[#60a5fa] border border-[#60a5fa]/30 flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <h4 className="font-bold text-base text-white font-ui">Dual XGBoost Core</h4>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Dual-model backend utilizing high-capacity XGBClassifier for probability estimation and XGBRegressor for baseline comparison.
            </p>
          </Card>
          <Card className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/30 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <h4 className="font-bold text-base text-white font-ui">Tree-Attribution SHAP</h4>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Provides mathematical guarantees on local feature explanations to pinpoint conversion obstacles per user session.
            </p>
          </Card>
          <Card className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30 flex items-center justify-center">
              <Database size={18} />
            </div>
            <h4 className="font-bold text-base text-white font-ui">ChromaDB RAG Engine</h4>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Queries a 200-document vector knowledge base with metadata filters to match optimal intervention strategies.
            </p>
          </Card>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Landing;
