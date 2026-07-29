import React, { useState } from 'react';
import { FeatureRequestItem } from '../types';
import { Lightbulb, X, ThumbsUp, Plus, CheckCircle2, MessageSquare, Filter, Layers, ArrowRight, Sparkles } from 'lucide-react';

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureRequests: FeatureRequestItem[];
  onSubmitRequest: (req: Omit<FeatureRequestItem, 'id' | 'votes' | 'status' | 'createdAt'>) => void;
  onVoteRequest: (id: string) => void;
  onOpenAddNicheModal: () => void;
}

export const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({
  isOpen,
  onClose,
  featureRequests,
  onSubmitRequest,
  onVoteRequest,
  onOpenAddNicheModal
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'submit'>('browse');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FeatureRequestItem['category']>('Integration');
  const [description, setDescription] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmitRequest({
      title: title.trim(),
      category,
      description: description.trim(),
      authorEmail: authorEmail.trim() || undefined
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setTitle('');
      setDescription('');
      setAuthorEmail('');
      setActiveTab('browse');
    }, 1500);
  };

  const categories = ['All', 'Integration', 'UI / Workflow', 'Reporting', 'Automation', 'Mobile App', 'Telephony'];

  const filteredRequests = filterCategory === 'All'
    ? featureRequests
    : featureRequests.filter(r => r.category === filterCategory);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">Feature Requests & Platform Roadmap</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  COMMUNITY VOTING
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Suggest new capabilities, tools, or integrations for the core software platform
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Explaining Difference between Feature vs Niche Request */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Looking for a custom Industry Niche instead?</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              <strong className="text-slate-800">Feature Requests</strong> add platform capabilities (e.g. Zapier, Export PDF). <br className="hidden sm:inline"/>
              <strong className="text-slate-800">Niche Requests</strong> build a bespoke AI Agent tailored specifically to your industry vertical.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenAddNicheModal();
            }}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] whitespace-nowrap flex items-center gap-1 shadow-sm transition-all shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Request Niche Build</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Browse & Vote ({featureRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Request</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'browse' ? (
            <div className="space-y-4">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Request Items List */}
              <div className="space-y-3">
                {filteredRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-start gap-4 shadow-sm"
                  >
                    {/* Vote Button */}
                    <button
                      onClick={() => onVoteRequest(req.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all min-w-[54px] ${
                        req.userVoted
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-600'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${req.userVoted ? 'fill-white' : ''}`} />
                      <span className="text-xs font-extrabold font-mono mt-1">{req.votes}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                            {req.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'In Development' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                            req.status === 'Planned' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Submitted on {req.createdAt}
                      </span>
                    </div>

                  </div>
                ))}

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2">
                    <p className="text-xs font-semibold">No feature requests found in this category.</p>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="text-xs text-amber-600 font-bold hover:underline"
                    >
                      Be the first to submit one!
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Submit Request Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {submittedSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold">Feature Request Submitted!</h3>
                  <p className="text-xs text-emerald-700">
                    Thank you! Your feature request has been submitted and added to the community voting roadmap.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Feature Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Direct Zapier Webhook Trigger for Closed Deals"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="Integration">Integration (CRM, Zapier, Webhooks)</option>
                      <option value="UI / Workflow">UI / Workflow (Dashboards, Dark Mode, Filters)</option>
                      <option value="Reporting">Reporting & Analytics (CSV Export, ROI Charts)</option>
                      <option value="Automation">Automation (Auto-Followups, Email Triggers)</option>
                      <option value="Mobile App">Mobile App & Push Notifications</option>
                      <option value="Telephony">Telephony & Voice (Twilio, Retell, Call Recording)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Detailed Description</label>
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Explain how this feature would work and why it would benefit your business workflow..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Your Email (Optional, for progress updates)</label>
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={e => setAuthorEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('browse')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post Feature Request</span>
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
