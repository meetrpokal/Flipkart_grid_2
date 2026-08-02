import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, AreaChart, Area, CartesianGrid } from 'recharts';
import { Sparkles, Clock, User, HelpCircle, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';
import { Card, Badge, Loader } from '../components/DesignSystem';

const Dashboard: React.FC = () => {
  const { cart, events, prediction, setPrediction } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // 1. Probability Trend (Calculates dynamic risk path as events occurred)
  const trendData = useMemo(() => {
    let currentProb = 0.35;
    const points = events.map((evt, idx) => {
      if (evt.eventType === 'TAB_SWITCH') currentProb = Math.min(0.98, currentProb + 0.12);
      else if (evt.eventType === 'IDLE') currentProb = Math.min(0.98, currentProb + 0.08);
      else if (evt.eventType === 'MOUSE_LEAVE') currentProb = Math.min(0.98, currentProb + 0.15);
      else if (evt.eventType === 'VIEW_SPECIFICATIONS' || evt.eventType === 'VIEW_REVIEWS') currentProb = Math.max(0.05, currentProb - 0.05);
      else if (evt.eventType === 'APPLY_COUPON') currentProb = Math.max(0.05, currentProb - 0.20);
      else if (evt.eventType === 'ADD_TO_CART') currentProb = Math.max(0.05, currentProb - 0.10);
      
      return {
        name: `#${idx + 1}`,
        "Risk %": Math.round(currentProb * 100)
      };
    });
    return points.length > 0 ? points : [{ name: "Start", "Risk %": 35 }];
  }, [events]);

  // 2. Journey Activity Velocity (Cumulative events counts)
  const journeyData = useMemo(() => {
    let total = 0;
    const points = events.map((_, idx) => {
      total += 1;
      return {
        step: `#${idx + 1}`,
        "Activity": total
      };
    });
    return points.length > 0 ? points : [{ step: "Start", "Activity": 0 }];
  }, [events]);

  // 3. Session Statistics by Event Class
  const statData = useMemo(() => {
    const friction = events.filter(e => ['TAB_SWITCH', 'IDLE', 'MOUSE_LEAVE', 'FAILED_COUPON'].includes(e.eventType)).length;
    const catalog = events.filter(e => ['VIEW_PRODUCT', 'VIEW_SPECIFICATIONS', 'VIEW_REVIEWS', 'ZOOM_IMAGE', 'COMPARE_PRODUCT', 'CHECK_DELIVERY', 'SEARCH', 'FILTER', 'SORT'].includes(e.eventType)).length;
    const cartOps = events.filter(e => ['ADD_TO_CART', 'REMOVE_FROM_CART', 'CHANGE_QUANTITY', 'APPLY_COUPON', 'OPEN_CART', 'CHECKOUT', 'BUY_NOW', 'WISHLIST'].includes(e.eventType)).length;

    return [
      { name: 'Friction', count: friction },
      { name: 'Catalog', count: catalog },
      { name: 'Cart Ops', count: cartOps }
    ];
  }, [events]);

  // ---------------------------------------------------------------------------
  // Real-time API Inference logic
  // ---------------------------------------------------------------------------
  const runPredictionPipeline = async () => {
    if (cart.length === 0) {
      setPrediction(null);
      return;
    }
    
    setIsLoading(true);
    setErrorStatus(null);

    // 1. Calculate features from Zustand state
    const hesitationScore = events.filter(e => e.eventType === 'IDLE').length * 2.5 + 
                           events.filter(e => e.eventType === 'ZOOM_IMAGE').length * 1.5;
    const tabSwitchCount = events.filter(e => e.eventType === 'TAB_SWITCH').length;
    const checkoutRestartCount = events.filter(e => e.eventType === 'CHECKOUT').length > 1 ? 1 : 0;
    const paymentFailures = events.filter(e => e.eventType === 'FAILED_COUPON').length;
    
    const competitorPriceChecked = events.some(e => e.eventType === 'COMPARE_PRODUCT') ? 1 : 0;
    const isPremiumMember = 0; // Default

    const cartValue = cart.reduce((acc, item) => acc + (item.product.price * (1 - item.product.discount) * item.quantity), 0);
    const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

    const priceSensitivity = events.filter(e => e.eventType === 'APPLY_COUPON' || e.eventType === 'FAILED_COUPON').length * 1.2 +
                             competitorPriceChecked * 1.5;
    const qualityUncertainty = events.filter(e => e.eventType === 'VIEW_REVIEWS' || e.eventType === 'VIEW_SPECIFICATIONS').length * 0.8;
    const trustScore = 0.85 - (paymentFailures * 0.2);

    const session_data = {
      hesitation_score: Math.min(10.0, hesitationScore + 1.2),
      trust_score: Math.max(0.1, trustScore),
      price_sensitivity_score: Math.min(5.0, priceSensitivity),
      quality_uncertainty_score: Math.min(5.0, qualityUncertainty),
      purchase_intent_score: Math.max(0.05, 1.0 - (tabSwitchCount * 0.1) - (hesitationScore * 0.05)),
      total_shipping_charges: cartValue >= 500 ? 0.0 : 40.0,
      cart_value: cartValue,
      total_items_in_cart: totalItemsInCart,
      payment_failures: paymentFailures,
      checkout_restart_count: checkoutRestartCount,
      tab_switch_count: tabSwitchCount,
      competitor_price_checked: competitorPriceChecked,
      is_premium_member: isPremiumMember,
      total_historical_purchases: 6,
      persona: priceSensitivity > 2.0 ? "Price Sensitive Shopper" : "Regular Active User"
    };

    const firstProduct = cart[0]?.product;
    const product_metadata = firstProduct ? {
      category: firstProduct.category,
      brand_tier: firstProduct.price > 5000 ? "Premium" : "Mass Market",
      price: firstProduct.price
    } : null;

    const user_metadata = {
      total_purchases: 6,
      return_rate: 0.05
    };

    try {
      const result = await apiService.predictAbandonment({
        session_data,
        product_metadata,
        user_metadata
      });

      setPrediction({
        abandonmentProbability: result.abandonment_probability,
        prediction: result.prediction,
        rootCause: result.root_cause,
        recommendedIntervention: result.recommended_intervention,
        confidence: result.confidence,
        topFeatures: result.top_features.map((f: any) => ({
          feature: f.feature,
          importance: f.importance,
          direction: f.direction
        }))
      });
    } catch (err) {
      console.warn("Failed to fetch live API prediction, executing mathematical fallback...");
      
      // Fallback calculator to ensure UI is robust and always functional
      const mockProb = Math.min(0.98, Math.max(0.05, 0.35 + (tabSwitchCount * 0.12) + (hesitationScore * 0.08) - (trustScore * 0.2)));
      const mockCause = mockProb >= 0.70 ? "Price Sensitive" : mockProb >= 0.45 ? "Hesitation / Doubt" : "None";
      const mockIntervention = mockProb >= 0.70
        ? "Offer standard FLIPKART50 checkout coupon to lower cart total friction."
        : mockProb >= 0.45
        ? "Display customer review overlays detailing seller credibility and shipping assurance."
        : "No intervention needed. Regular conversion flow.";

      setPrediction({
        abandonmentProbability: mockProb,
        prediction: mockProb >= 0.50,
        rootCause: mockCause,
        recommendedIntervention: mockIntervention,
        confidence: 0.85 - (mockProb * 0.2),
        topFeatures: [
          { feature: "hesitation_score", importance: hesitationScore * 0.5, direction: "increases_abandonment" },
          { feature: "tab_switch_count", importance: tabSwitchCount * 0.4, direction: "increases_abandonment" },
          { feature: "trust_score", importance: -trustScore * 0.3, direction: "decreases_abandonment" }
        ]
      });
      setErrorStatus("Using simulator mode (API server offline)");
    } finally {
      setIsLoading(false);
    }
  };

  // Run pipeline whenever cart changes or active pages trigger events
  useEffect(() => {
    runPredictionPipeline();
  }, [cart.length, events.length]);

  // Chronological summary calculations
  const summaryMetrics = useMemo(() => {
    const totalTabSwitches = events.filter(e => e.eventType === 'TAB_SWITCH').length;
    const totalIdleToggles = events.filter(e => e.eventType === 'IDLE').length;
    const totalSpecViews = events.filter(e => e.eventType === 'VIEW_SPECIFICATIONS').length;
    const totalReviewViews = events.filter(e => e.eventType === 'VIEW_REVIEWS').length;

    return {
      tabSwitches: totalTabSwitches,
      idleTriggers: totalIdleToggles,
      specLookups: totalSpecViews,
      reviewLookups: totalReviewViews
    };
  }, [events]);

  // Color mappings
  const getRiskColor = (prob: number) => {
    if (prob >= 0.70) return '#ef4444'; // Red
    if (prob >= 0.40) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  const getRiskText = (prob: number) => {
    if (prob >= 0.70) return 'HIGH RISK';
    if (prob >= 0.40) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto flex flex-col gap-8 text-left">
      {/* Header and status alerts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="text-ai-blue" />
            <span>AI Session Control Center</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Real-time XGBoost classification & ChromaDB RAG recommendation pipeline</p>
        </div>
        
        {/* Simulator / API Online Alert */}
        {errorStatus ? (
          <Badge variant="warning">{errorStatus}</Badge>
        ) : cart.length > 0 ? (
          <Badge variant="success">API Backend Connected</Badge>
        ) : null}
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-xl border border-slate-800 flex flex-col items-center gap-4 max-w-lg mx-auto">
          <HelpCircle size={40} className="text-slate-500" />
          <h4 className="text-base font-bold text-white">No active shopping session found</h4>
          <p className="text-xs text-slate-400">Please go back to the store, add some items to your shopping cart, and navigate back to view predictions.</p>
        </div>
      ) : isLoading && !prediction ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: Risk Gauges and Core KPI Predictions */}
          <div className="flex flex-col gap-6">
            <Card variant="glow" className="flex flex-col items-center text-center gap-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest self-start">Abandonment Probability</h3>
              
              {/* Circular SVG Gauge */}
              {prediction && (
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={getRiskColor(prediction.abandonmentProbability)}
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - prediction.abandonmentProbability)}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-white">
                      {Math.round(prediction.abandonmentProbability * 100)}%
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider mt-0.5" style={{ color: getRiskColor(prediction.abandonmentProbability) }}>
                      {getRiskText(prediction.abandonmentProbability)}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              {prediction && (
                <div className={`w-full py-2.5 rounded-lg font-bold text-sm border ${
                  prediction.prediction
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {prediction.prediction ? '⚠️ PREDICTED: LIKELY TO ABANDON' : '✅ PREDICTED: LIKELY TO PURCHASE'}
                </div>
              )}
            </Card>

            {/* Root Cause Details */}
            {prediction && (
              <Card className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inferred Root Cause</span>
                <div className="text-lg font-extrabold text-white">{prediction.rootCause}</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Obstacle classification deduced from browser active timers, hesitation counts, and product coupon interaction history.
                </p>
              </Card>
            )}

            {/* Confidence Gauge */}
            {prediction && (
              <Card className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Decision Confidence</span>
                  <span className="text-xs font-bold text-white">{Math.round(prediction.confidence * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-ai-blue transition-all duration-500"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">Based on SHAP density maps, model classification variance, and database similarities.</p>
              </Card>
            )}
          </div>

          {/* COLUMN 2: Interventions and SHAP Bar Charts */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            
            {/* Recommended Action Card */}
            {prediction && (
              <Card className="border-l-4 border-l-purple-500 bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-400" />
                  <span>Personalised RAG Intervention</span>
                </span>
                <div className="text-base font-extrabold text-white mt-3 leading-relaxed">
                  {prediction.recommendedIntervention}
                </div>
              </Card>
            )}

            {/* SHAP Chart using Recharts */}
            {prediction && (
              <Card className="flex flex-col gap-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Explainable AI: Local SHAP Attributions</span>
                
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prediction.topFeatures}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                      <XAxis type="number" stroke="#64748b" />
                      <YAxis dataKey="feature" type="category" stroke="#64748b" width={110} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      />
                      <Bar dataKey="importance" fill="#047BD5">
                        {prediction.topFeatures.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={entry.importance > 0 ? '#ef4444' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 px-2">
                  <span>← Decreases Abandonment Risk (Green)</span>
                  <span>Increases Abandonment Risk (Red) →</span>
                </div>
              </Card>
            )}
          </div>

          {/* COLUMN 3: Session Logs, Journey Maps, & Activity Summary (Full width below) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Session Statistics Summary */}
            <Card className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} />
                <span>Behavior Summary</span>
              </span>
              <div className="flex flex-col gap-2 mt-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Browser Tab Switches:</span>
                  <span className="font-bold">{summaryMetrics.tabSwitches}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Idle / Hesitation Triggers:</span>
                  <span className="font-bold">{summaryMetrics.idleTriggers}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Product Specs Viewed:</span>
                  <span className="font-bold">{summaryMetrics.specLookups}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Customer Reviews Checked:</span>
                  <span className="font-bold">{summaryMetrics.reviewLookups}</span>
                </div>
              </div>
            </Card>

            {/* Visual User Journey timeline */}
            <Card className="md:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} />
                <span>Chronological User Journey Timeline</span>
              </span>
              
              <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                {events.length > 0 ? (
                  events.map((evt, idx) => (
                    <div key={idx} className="flex gap-3 text-xs border-l border-slate-800 pl-4 relative">
                      {/* Circle marker */}
                      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-ai-blue" />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white uppercase text-[10px] tracking-wider">{evt.eventType}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Page: {evt.page}</div>
                        {Object.keys(evt.metadata).length > 0 && (
                          <div className="text-[9px] text-slate-500 bg-slate-950/40 p-1.5 rounded mt-1">
                            {JSON.stringify(evt.metadata)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 py-6 text-center">No user activities logged in this session yet.</span>
                )}
              </div>
            </Card>
          </div>

          {/* COLUMN 4: Recharts Analytics Graphs Grid (Trend, Velocity, Distribution) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            
            {/* Probability Trend */}
            <Card className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Abandonment Probability Risk Trend</span>
              <div className="h-48 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                    <Line type="monotone" dataKey="Risk %" stroke="#047BD5" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Journey Engagement Velocity */}
            <Card className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Journey Engagement Velocity</span>
              <div className="h-48 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={journeyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="step" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="Activity" stroke="#8A2BE2" fill="rgba(138, 43, 226, 0.15)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Event Category distribution */}
            <Card className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Behavior Event Distribution</span>
              <div className="h-48 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                    <Bar dataKey="count" fill="#10b981">
                      {statData.map((_, idx) => {
                        const colors = ['#ef4444', '#3b82f6', '#10b981'];
                        return <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
