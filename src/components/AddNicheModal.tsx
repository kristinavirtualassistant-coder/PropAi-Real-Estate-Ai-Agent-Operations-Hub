import React, { useState } from 'react';
import { NicheModule, NicheBuildRequestItem } from '../types';
import { Plus, X, Sparkles, FolderPlus, CheckCircle2, Bot, Building2, Home, Key, Sun, Briefcase, Layers, Send, Lightbulb, HelpCircle } from 'lucide-react';

interface AddNicheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNiche: (newModule: NicheModule) => void;
  onSubmitNicheBuildRequest: (req: Omit<NicheBuildRequestItem, 'id' | 'status' | 'submittedAt'>) => void;
  onOpenFeatureRequestModal: () => void;
  existingCount: number;
}

export const AddNicheModal: React.FC<AddNicheModalProps> = ({
  isOpen,
  onClose,
  onAddNiche,
  onSubmitNicheBuildRequest,
  onOpenFeatureRequestModal,
  existingCount
}) => {
  const [mode, setMode] = useState<'instant' | 'custom_request'>('instant');
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Instant Page State
  const [name, setName] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState<'wrench' | 'building' | 'home' | 'key' | 'sun' | 'sparkles' | 'briefcase'>('briefcase');
  const [voiceAgentPrompt, setVoiceAgentPrompt] = useState('');

  // Custom Build Request State
  const [industryName, setIndustryName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyWorkflows, setKeyWorkflows] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  if (!isOpen) return null;

  const handleInstantSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pageNum = existingCount + 1;
    const newModule: NicheModule = {
      id: `custom_niche_${Date.now()}`,
      pageNumber: pageNum,
      name: name.trim(),
      badge: badgeText.trim() || name.trim(),
      description: description.trim() || 'Custom industry AI voice and messaging automation module.',
      iconName: iconName,
      colorTheme: 'indigo',
      isCustom: true,
      stats: [
        { label: 'Qualified Leads', value: '34', detail: 'Inbound & Outbound AI Triage' },
        { label: 'Avg Voice Response', value: '18 sec', detail: 'Instant Autonomous Callback' },
        { label: 'Hours Saved', value: '95 hrs/mo', detail: 'Automated Operations Pipeline' }
      ],
      sampleWorkflow: [
        { step: '01', title: 'Customer Lead Inquiry', desc: 'Customer submits inquiry via web, phone call, or SMS.' },
        { step: '02', title: 'AI Prequalification & Audit', desc: 'Agent evaluates customer needs and verifies budget/timeline.' },
        { step: '03', title: 'Direct Booking & Dispatch', desc: 'Schedules consultation or dispatches field representative.' }
      ],
      voiceAgentPrompt: voiceAgentPrompt.trim() || `You are the AI Assistant for ${name.trim()}. Help callers, qualify inquiries, and book appointments.`
    };

    onAddNiche(newModule);
    onClose();
  };

  const handleBuildRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industryName.trim() || !contactEmail.trim()) return;

    onSubmitNicheBuildRequest({
      industryName: industryName.trim(),
      targetAudience: targetAudience.trim() || 'General Business Clients',
      keyWorkflows: keyWorkflows.trim() || 'Inbound voice triage & lead qualification',
      specialRequirements: specialRequirements.trim() || 'Standard telephony & CRM sync',
      contactEmail: contactEmail.trim()
    });

    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setIndustryName('');
      setTargetAudience('');
      setKeyWorkflows('');
      setSpecialRequirements('');
      setContactEmail('');
      onClose();
    }, 1800);
  };

  const iconsList = [
    { id: 'briefcase', label: 'Commercial & Sales', icon: Briefcase },
    { id: 'home', label: 'Residential Real Estate', icon: Home },
    { id: 'building', label: 'Wholesale & Investment', icon: Building2 },
    { id: 'sun', label: 'Solar & Energy', icon: Sun },
    { id: 'key', label: 'Hospitality & STR', icon: Key },
    { id: 'sparkles', label: 'Custom Agency', icon: Sparkles }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Add Industry Niche</h2>
              <p className="text-xs text-slate-500">Expand your AI platform to support new industries and verticals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Callout: Distinction between Feature Request vs Niche Build */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>How Niche Requests Work</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenFeatureRequestModal();
              }}
              className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Need a general feature instead?</span>
            </button>
          </div>
          <p className="text-slate-700 text-[11px] leading-relaxed">
            • <strong className="text-slate-900">Niche Request:</strong> We build a custom AI voice engine, bespoke data models, and specific CRM workflows tailored to your unique industry vertical.<br />
            • <strong className="text-slate-900">Feature Request:</strong> Adds a new software capability or tool to existing pages across all niches.
          </p>
        </div>

        {/* Selector Tabs */}
        <div className="flex border-b border-slate-200 gap-4 shrink-0">
          <button
            onClick={() => setMode('instant')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'instant'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Instant Sandbox Page (Demo)
          </button>
          <button
            onClick={() => setMode('custom_request')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              mode === 'custom_request'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Request Custom Niche Build</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">BESPOKE</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {mode === 'instant' ? (
            /* Mode A: Instant Sandbox Creation */
            <form onSubmit={handleInstantSave} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-800 font-bold mb-1">Niche / Industry Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Commercial Roofing, Legal Intake, Medical Spa Setter..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Badge Tag / Subtitle</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={e => setBadgeText(e.target.value)}
                  placeholder={`e.g. Page ${existingCount + 1} • Inbound Lead Qualifier`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what this AI Agent accomplishes for clients in this industry..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Select Module Icon</label>
                <div className="grid grid-cols-3 gap-2">
                  {iconsList.map(ico => {
                    const IconComp = ico.icon;
                    const isSelected = iconName === ico.id;
                    return (
                      <button
                        key={ico.id}
                        type="button"
                        onClick={() => setIconName(ico.id as any)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-emerald-600" />
                        <span className="truncate">{ico.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Voice Agent System Directive Prompt</label>
                <textarea
                  rows={3}
                  value={voiceAgentPrompt}
                  onChange={e => setVoiceAgentPrompt(e.target.value)}
                  placeholder="e.g. You are the AI Receptionist for Commercial Roofing Pros. Receive incoming calls, answer estimate questions, and schedule roof inspections."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-emerald-300 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Niche Page {existingCount + 1}</span>
                </button>
              </div>

            </form>
          ) : (
            /* Mode B: Request Custom Bespoke Niche Engine Build */
            <form onSubmit={handleBuildRequestSubmit} className="space-y-4 text-xs">
              
              {requestSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold">Niche Build Request Received!</h3>
                  <p className="text-xs text-emerald-800">
                    Our engineering team will design and deploy a custom AI agent tailored for <strong>{industryName}</strong>. You will receive a preview link at <strong>{contactEmail}</strong>.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Industry Vertical / Niche Name *</label>
                    <input
                      type="text"
                      required
                      value={industryName}
                      onChange={e => setIndustryName(e.target.value)}
                      placeholder="e.g. Dental Practice Appointment Setter, Auto Insurance Claims Triage, Yacht Brokerage Leads..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Target End-Users / Customer Base</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      placeholder="e.g. High net worth boat owners, Emergency dental patients, Insured drivers..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Key Workflows & AI Tasks Needed</label>
                    <textarea
                      rows={3}
                      value={keyWorkflows}
                      onChange={e => setKeyWorkflows(e.target.value)}
                      placeholder="Describe what the AI agent must do (e.g. Answer after-hours emergency calls, qualify patient insurance coverage, book Google Calendar appointments)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Special CRM, Telephony, or Data Integrations</label>
                    <input
                      type="text"
                      value={specialRequirements}
                      onChange={e => setSpecialRequirements(e.target.value)}
                      placeholder="e.g. Dentrix CRM, ServiceTitan, Twilio SIP Trunk, GoHighLevel..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Your Email Address (For Delivery & Preview Link) *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="founder@youragency.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMode('instant')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Custom Niche Build Request</span>
                    </button>
                  </div>
                </>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
