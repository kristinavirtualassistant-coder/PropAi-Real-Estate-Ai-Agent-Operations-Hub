import React, { useState } from 'react';
import { TargetNiche, AgentConfig } from '../types';
import { Settings, Sparkles, X, Save, RefreshCw, Volume2, Cpu, Link, ShieldCheck, Play } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNiche: TargetNiche;
  config: AgentConfig;
  onSaveConfig: (newConfig: AgentConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  activeNiche,
  config,
  onSaveConfig
}) => {
  const [formData, setFormData] = useState<AgentConfig>(config);
  const [marketInput, setMarketInput] = useState<string>('Dallas Tax Delinquents');
  const [toneInput, setToneInput] = useState<string>('Casual & Friendly');
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerateScriptWithGemini = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/agent/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: activeNiche === 'wholesaler' ? 'Wholesale Acquisitions Agent' : 'Maintenance & Tenant Coordinator',
          targetMarket: marketInput,
          tone: toneInput
        })
      });
      const data = await res.json();
      if (data.systemPrompt) {
        setFormData(prev => ({ ...prev, systemPrompt: data.systemPrompt }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Agent Voice & Telephony Settings</h2>
              <p className="text-xs text-slate-500 font-medium">Configure Vapi / Retell voice persona, AI prompts, and webhooks</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs">
          
          {/* Provider Selection */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'vapi', title: 'Vapi AI Telephony', desc: 'Real-time conversational voice' },
              { id: 'retell', title: 'Retell AI Engine', desc: 'Ultra-low latency phone AI' },
              { id: 'twilio_sim', title: 'Twilio SMS & Voice', desc: 'Standard SMS outreach' }
            ].map(prov => (
              <div
                key={prov.id}
                onClick={() => setFormData(prev => ({ ...prev, telephonyProvider: prov.id as any }))}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.telephonyProvider === prov.id
                    ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-extrabold text-slate-900 block">{prov.title}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">{prov.desc}</span>
              </div>
            ))}
          </div>

          {/* Voice Persona & Speed */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Prebuilt Voice Persona</label>
              <select
                value={formData.voiceName}
                onChange={e => setFormData(prev => ({ ...prev, voiceName: e.target.value as any }))}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
              >
                <option value="Puck">Puck (Warm & Friendly Male)</option>
                <option value="Zephyr">Zephyr (Empathetic & Calming)</option>
                <option value="Kore">Kore (Clear & Direct Female)</option>
                <option value="Fenrir">Fenrir (Authoritative Executive)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Speaking Rate ({formData.speakingRate}x)</label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={formData.speakingRate}
                onChange={e => setFormData(prev => ({ ...prev, speakingRate: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>
          </div>

          {/* Gemini AI Script Generator Tool */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Auto-Generate High-Converting Prompt
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Powered by Gemini 3.6 Flash</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Target Niche/Market (e.g. Pre-foreclosures)"
                value={marketInput}
                onChange={e => setMarketInput(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
              />
              <select
                value={toneInput}
                onChange={e => setToneInput(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
              >
                <option value="Casual & Friendly">Casual & Friendly</option>
                <option value="Professional & Direct">Professional & Direct</option>
                <option value="High Empathy">High Empathy (Tenant Triage)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateScriptWithGemini}
              disabled={isGeneratingScript}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {isGeneratingScript ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-indigo-200" />
              )}
              <span>{isGeneratingScript ? 'Generating Custom Script...' : 'Generate AI Script with Gemini'}</span>
            </button>
          </div>

          {/* Custom System Prompt Textarea */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">System Instructions & Behavior Rules</label>
            <textarea
              rows={5}
              value={formData.systemPrompt}
              onChange={e => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Webhook & Booking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">CRM Webhook URL (Podio/GoHighLevel)</label>
              <input
                type="text"
                value={formData.webhookUrl}
                onChange={e => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Auto-Calendar Booking Link</label>
              <input
                type="text"
                value={formData.autoBookingLink}
                onChange={e => setFormData(prev => ({ ...prev, autoBookingLink: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-medium"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveConfig(formData);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
};
