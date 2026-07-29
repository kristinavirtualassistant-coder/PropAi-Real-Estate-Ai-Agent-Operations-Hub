import React, { useState } from 'react';
import { NicheModule, BrandConfig } from '../types';
import { Home, Key, Sun, Sparkles, Briefcase, PhoneCall, Bot, Play, ArrowRight, ShieldCheck, CheckCircle2, Plus, Zap, Settings2 } from 'lucide-react';

interface NicheCatalogDashboardProps {
  nicheModule: NicheModule;
  brandConfig: BrandConfig;
  onOpenLiveStudio: () => void;
  onOpenAddNicheModal: () => void;
}

export const NicheCatalogDashboard: React.FC<NicheCatalogDashboardProps> = ({
  nicheModule,
  brandConfig,
  onOpenLiveStudio,
  onOpenAddNicheModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'prompt'>('overview');
  const [testQuery, setTestQuery] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const getIcon = () => {
    switch (nicheModule.iconName) {
      case 'home': return <Home className="w-6 h-6 text-violet-400" />;
      case 'key': return <Key className="w-6 h-6 text-cyan-400" />;
      case 'sun': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'briefcase': return <Briefcase className="w-6 h-6 text-rose-400" />;
      default: return <Sparkles className="w-6 h-6 text-indigo-400" />;
    }
  };

  const handleRunSimulation = () => {
    if (!testQuery.trim()) return;
    setIsSimulating(true);
    setTestResponse(null);

    setTimeout(() => {
      setIsSimulating(false);
      setTestResponse(
        `[${brandConfig.companyName} AI Agent]: Hello! Thank you for reaching out regarding ${nicheModule.name}. In response to "${testQuery}", I have automatically logged your request, verified qualification criteria, and scheduled the next action step in our CRM.`
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner for Niche */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden text-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white border border-indigo-200 shadow-sm">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {nicheModule.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200">
                  Active Niche Module
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {nicheModule.name}
              </h1>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                {nicheModule.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLiveStudio}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4 text-indigo-100" />
              <span>Simulate Voice Call</span>
            </button>

            <button
              onClick={onOpenAddNicheModal}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add New Niche</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nicheModule.stats.map((st, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 shadow-sm transition-all">
            <span className="text-xs font-semibold text-slate-500 block">{st.label}</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{st.value}</div>
            <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-600" />
              {st.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'overview', label: 'Interactive AI Sandbox' },
          { id: 'workflow', label: '3-Step Execution Workflow' },
          { id: 'prompt', label: 'System Voice Prompt' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Interactive AI Sandbox */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                Live Agent Response Sandbox
              </h3>
              <p className="text-xs text-slate-500">Test how the AI Agent for <span className="text-slate-800 font-semibold">{nicheModule.name}</span> responds to customer inputs</p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              PROMPT READY
            </span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Test Customer / Lead Input</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={e => setTestQuery(e.target.value)}
                placeholder="e.g. 'I want to schedule a showing for tomorrow at 2 PM' or 'My electric bill is $220/mo'"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating || !testQuery.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap shadow-md"
              >
                {isSimulating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Test Response</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {testResponse && (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs space-y-2 animate-fadeIn">
              <span className="text-[10px] font-mono font-bold text-indigo-700 block">AI AGENT OUTPUT</span>
              <p className="text-slate-800 leading-relaxed font-sans">{testResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Workflow */}
      {activeTab === 'workflow' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nicheModule.sampleWorkflow.map((wf, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-600/30 font-mono">{wf.step}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{wf.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{wf.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: System Voice Prompt */}
      {activeTab === 'prompt' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-600" />
              Engine System Directive Prompt
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Retell / Vapi / Gemini Compatible</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
            {nicheModule.voiceAgentPrompt}
          </pre>
        </div>
      )}

    </div>
  );
};
