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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Micro-SaaS ROI Calculator & Pricing</h2>
              <p className="text-xs text-slate-500 font-medium">Replace $2,000/mo remote human VAs with 24/7 autonomous AI agents</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkoutStep === 'tiers' && (
          <>
            {/* Interactive ROI Calculator Slider */}
            <div className="bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 p-5 rounded-2xl border border-indigo-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" /> Human VA vs AI Cost Comparison Calculator
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-extrabold border border-emerald-200">
                  Save ${annualSavings.toLocaleString()} / year
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-xs text-slate-700 font-bold block mb-1">
                    Number of Remote VAs Replaced: <span className="text-indigo-600 font-extrabold text-sm">{vaCount} VAs</span>
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

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                  <span className="text-[10px] text-rose-800 font-bold block">HUMAN VA TEAM COST</span>
                  <span className="text-xl font-black text-rose-600">${humanCostMonthly.toLocaleString()} / mo</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Late calls missed, high turn-over</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-800 font-bold block">PROPAI MICRO-SAAS COST</span>
                  <span className="text-xl font-black text-emerald-600">${propAiCostMonthly} / mo</span>
                  <p className="text-[10px] text-emerald-800 font-extrabold mt-0.5">NET SAVINGS: ${monthlySavings.toLocaleString()} / mo</p>
                </div>
              </div>
            </div>

            {/* Pricing Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Starter */}
              <div
                onClick={() => setSelectedTier('starter')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTier === 'starter' ? 'bg-indigo-50/60 border-indigo-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Starter Agent</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">For individual wholesalers or small property managers</p>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">$299</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 1 AI Agent Engine</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Up to 2,500 SMS / Voice Calls/mo</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Gemini 3.6 Flash Objection Handling</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> CRM Webhook Sync</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCheckoutStep('stripe')}
                  className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
                >
                  Select Starter Plan
                </button>
              </div>

              {/* Pro (Popular) */}
              <div
                onClick={() => setSelectedTier('pro')}
                className={`p-5 rounded-2xl border relative transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTier === 'pro' ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-500 shadow-xl ring-2 ring-indigo-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-[10px] shadow-sm">
                  MOST POPULAR
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Pro Real Estate Hub</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">Both Acquisitions + 24/7 Maintenance Suite</p>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">$599</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-800 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Acquisitions & Maintenance Agents</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 10,000 SMS / Voice Calls/mo</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Automated Contractor SMS Dispatch</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Vapi & Retell AI Voice Studio</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Automated Morning Briefings</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCheckoutStep('stripe')}
                  className="w-full mt-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Start Pro Trial ($599/mo)
                </button>
              </div>

              {/* Enterprise */}
              <div
                onClick={() => setSelectedTier('enterprise')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTier === 'enterprise' ? 'bg-indigo-50/60 border-indigo-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Agency / Enterprise</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">White-label platform for large portfolios & funds</p>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">$999</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Unlimited Voice Calls & Texts</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Custom Dedicated Vapi Phone Lines</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> White-Label Client Portal</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 24/7 Dedicated Account SLA</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCheckoutStep('stripe')}
                  className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
                >
                  Select Enterprise
                </button>
              </div>

            </div>
          </>
        )}

        {/* Stripe Checkout Simulation Modal */}
        {checkoutStep === 'stripe' && (
          <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Stripe Secure Checkout
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">${propAiCostMonthly}/mo</span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Subscribe to <strong className="text-slate-900 capitalize">{selectedTier} Plan</strong> with 14-day risk-free trial.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input defaultValue="investor@realestatehub.com" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Card Number</label>
                <input defaultValue="4242 •••• •••• 4242" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MM/YY</label>
                  <input defaultValue="12/28" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-medium" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CVC</label>
                  <input defaultValue="888" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-medium" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('success')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Confirm Subscription (${propAiCostMonthly}/mo)
            </button>
          </div>
        )}

        {/* Success Confirmation */}
        {checkoutStep === 'success' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Subscription Active!</h3>
            <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
              Your PropAI Real Estate Agents are live and ready to handle 24/7 cold outreach & maintenance triage.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              Return to Operations Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
