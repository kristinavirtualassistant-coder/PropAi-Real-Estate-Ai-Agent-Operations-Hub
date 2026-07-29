import React from 'react';
import { TargetNiche } from '../types';
import { Bot, PhoneCall, Building2, Wrench, Sparkles, DollarSign, Settings, Upload, Activity } from 'lucide-react';

interface NavbarProps {
  activeNiche: TargetNiche;
  setActiveNiche: (niche: TargetNiche) => void;
  onOpenLiveStudio: () => void;
  onOpenGeminiIntelligence: () => void;
  onOpenConfig: () => void;
  onOpenPricing: () => void;
  onOpenImport: () => void;
  onOpenActivityLogs: () => void;
  geminiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeNiche,
  setActiveNiche,
  onOpenLiveStudio,
  onOpenGeminiIntelligence,
  onOpenConfig,
  onOpenPricing,
  onOpenImport,
  onOpenActivityLogs,
  geminiConnected
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-16 py-2 md:py-0 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  PropAI
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MICRO-SAAS ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Real Estate & Operations Agents
              </p>
            </div>
          </div>

          {/* Niche Target Switcher */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner shrink-0 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveNiche('wholesaler')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                activeNiche === 'wholesaler'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${activeNiche === 'wholesaler' ? 'text-white' : 'text-indigo-300'}`} />
              <span>Target A: Acquisitions (Wholesale)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNiche('property_manager')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                activeNiche === 'property_manager'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Wrench className={`w-3.5 h-3.5 ${activeNiche === 'property_manager' ? 'text-white' : 'text-emerald-300'}`} />
              <span>Target B: 24/7 Maintenance (PM)</span>
            </button>
          </div>

          {/* Action Tools & Status */}
          <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-1">
            
            {/* Gemini API Status Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${geminiConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="font-mono text-[11px] text-slate-300">
                {geminiConnected ? 'Gemini 3.6 Flash Active' : 'Fallback Engine'}
              </span>
            </div>

            {/* Activity Telemetry Logs Button */}
            <button
              type="button"
              onClick={onOpenActivityLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="View Raw Vapi/Retell & Gemini API Request/Response Telemetry"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Activity Logs</span>
            </button>

            {/* Gemini Intelligence Hub Button */}
            <button
              type="button"
              onClick={onOpenGeminiIntelligence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-200" />
              <span>Gemini AI Hub</span>
            </button>

            {/* Live Studio Call/SMS Simulator Button */}
            <button
              type="button"
              onClick={onOpenLiveStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-colors shadow-sm cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live AI Simulator</span>
            </button>

            {/* Import Leads / Properties */}
            <button
              type="button"
              onClick={onOpenImport}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Upload Property Leads or Door List"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import</span>
            </button>

            {/* Agent Telephony Config */}
            <button
              type="button"
              onClick={onOpenConfig}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Configure Voice & Telephony Prompts"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* ROI & SaaS Pricing Modal */}
            <button
              type="button"
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>SaaS Pricing & ROI</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
