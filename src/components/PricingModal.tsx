import React, { useState } from 'react';
import { DollarSign, Check, Zap, Sparkles, X, ShieldCheck, CreditCard, Users, TrendingUp, Building2, Wrench } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [vaCount, setVaCount] = useState<number>(2);
  const [selectedTier, setSelectedTier] = useState<string>('pro');
  const [checkoutStep, setCheckoutStep] = useState<'tiers' | 'stripe' | 'success'>('tiers');

  if (!isOpen) return null;

  const humanCostMonthly = vaCount * 2000;
  const propAiCostMonthly = selectedTier === 'starter' ? 299 : selectedTier === 'pro' ? 599 : 999;
  const monthlySavings = humanCostMonthly - propAiCostMonthly;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-5 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Micro-SaaS ROI Calculator & Pricing</h2>
              <p className="text-xs text-slate-500 font-medium">Replace $2,000/mo remote human VAs with 24/7 autonomous AI agents</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkoutStep === 'tiers' && (
          <>
            {/* Interactive ROI Calculator Slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" /> Human VA vs AI Cost Comparison Calculator
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-300">
                  Save ${annualSavings.toLocaleString()} / year
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-center">
                <div>
                  <label className="text-xs text-slate-700 font-bold block mb-1">
                    Number of Remote VAs Replaced: <span className="text-indigo-700 font-extrabold text-sm">{vaCount} VAs</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={vaCount}
                    onChange={e => setVaCount(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Average offshore VA cost: $2,000/month</p>
                </div>

                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-center">
                  <span className="text-[10px] text-rose-800 font-bold block">HUMAN VA TEAM COST</span>
                  <span className="text-xl font-bold text-rose-700">${humanCostMonthly.toLocaleString()} / mo</span>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Late calls missed, high turn-over</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-800 font-bold block">PROPAI MICRO-SAAS COST</span>
                  <span className="text-xl font-bold text-emerald-700">${propAiCostMonthly} / mo</span>
                  <p className="text-[10px] text-emerald-800 font-bold mt-0.5">NET SAVINGS: ${monthlySavings.toLocaleString()} / mo</p>
                </div>
              </div>
            </div>

            {/* Pricing Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Starter */}
              <div
                onClick={() => setSelectedTier('starter')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTier === 'starter' ? 'bg-indigo-50/70 border-indigo-400 shadow-sm' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Starter Agent</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">For individual wholesalers or small property managers</p>
                  <div className="my-3">
                    <span className="text-2xl font-black text-slate-900">$299</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 1 AI Agent Engine (Target A or B)</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Up to 2,500 SMS / Voice Calls/mo</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Gemini 3.6 Flash Objection Handling</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> CRM Webhook Sync</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCheckoutStep('stripe')}
                  className="w-full mt-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Select Starter Plan
                </button>
              </div>

              {/* Pro (Popular) */}
              <div
                onClick={() => setSelectedTier('pro')}
                className={`p-4 rounded-xl border relative transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTier === 'pro' ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-500/30' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px] shadow-xs">
                  MOST POPULAR
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Pro Real Estate Hub</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Both Acquisitions + 24/7 Maintenance Suite</p>
                  <div className="my-3">
                    <span className="text-2xl font-black text-slate-900">$599</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> BOTH Target A & Target B Agents</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 10,000 SMS / Voice Calls/mo</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Automated Contractor SMS Dispatch</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Vapi & Retell AI Voice Studio</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Automated Morning Briefings</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCheckoutStep('stripe')}
                  className="w-full mt-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Start Pro Trial ($599/mo)
                </button>
              </div>

              {/* Enterprise */}
              <div
                onClick={() => setSelectedTier('enterprise')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTier === 'enterprise' ? 'bg-indigo-50/70 border-indigo-400 shadow-sm' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agency / Enterprise</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">White-label platform for large portfolios & funds</p>
                  <div className="my-3">
                    <span className="text-2xl font-black text-slate-900">$999</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Unlimited Voice Calls & Texts</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Custom Dedicated Vapi Phone Lines</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> White-Label Client Portal</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 24/7 Dedicated Account SLA</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCheckoutStep('stripe')}
                  className="w-full mt-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Select Enterprise
                </button>
              </div>

            </div>
          </>
        )}

        {/* Stripe Checkout Simulation Modal */}
        {checkoutStep === 'stripe' && (
          <div className="max-w-md mx-auto bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Stripe Secure Checkout
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">${propAiCostMonthly}/mo</span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Subscribe to <strong className="text-slate-900 capitalize">{selectedTier} Plan</strong> with 14-day risk-free trial.
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input defaultValue="investor@realestatehub.com" className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Card Number</label>
                <input defaultValue="4242 •••• •••• 4242" className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MM/YY</label>
                  <input defaultValue="12/28" className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CVC</label>
                  <input defaultValue="888" className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('success')}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all"
            >
              Confirm Subscription (${propAiCostMonthly}/mo)
            </button>
          </div>
        )}

        {/* Success Confirmation */}
        {checkoutStep === 'success' && (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Subscription Active!</h3>
            <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
              Your PropAI Real Estate Agents are live and ready to handle 24/7 cold outreach & maintenance triage.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Return to Operations Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
