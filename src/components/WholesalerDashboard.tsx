import React, { useState } from 'react';
import { WholesalerLead, CampaignStats, LeadStatus } from '../types';
import { Building2, PhoneCall, Calendar, DollarSign, Flame, MessageSquare, AlertTriangle, CheckCircle2, Search, Filter, Plus, UserCheck, ArrowUpRight, TrendingUp, Sparkles, Send, RefreshCw, Layers } from 'lucide-react';

interface WholesalerDashboardProps {
  leads: WholesalerLead[];
  stats: CampaignStats;
  onSelectLeadForSim: (lead: WholesalerLead) => void;
  onAddNewLead: (lead: Partial<WholesalerLead>) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onSendMessageToLead: (leadId: string, text: string) => Promise<void>;
  onTogglePriorityOverride?: (leadId: string) => void;
  isAiThinking: boolean;
}

export const WholesalerDashboard: React.FC<WholesalerDashboardProps> = ({
  leads,
  stats,
  onSelectLeadForSim,
  onAddNewLead,
  onUpdateLeadStatus,
  onSendMessageToLead,
  onTogglePriorityOverride,
  isAiThinking
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLead, setActiveLead] = useState<WholesalerLead | null>(leads[0] || null);
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = selectedStatus === 'all'
      ? true
      : selectedStatus === 'hot_override'
      ? !!lead.isPriorityOverride
      : lead.status === selectedStatus;
    const matchesSearch = lead.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.distressType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendMessage = async () => {
    if (!activeLead || !newMessageText.trim()) return;
    const text = newMessageText;
    setNewMessageText('');
    await onSendMessageToLead(activeLead.id, text);
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'qualified':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><Flame className="w-3 h-3 text-emerald-600" /> Motivated Lead</span>;
      case 'under_contract':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-600" /> Under Contract</span>;
      case 'offer_made':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Offer Made</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Contacted</span>;
      case 'unmotivated':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Unmotivated</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">New Lead</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Target Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl p-6 border border-indigo-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-mono text-xs border border-indigo-200 font-bold">
                ACQUISITIONS ENGINE
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Replaces $2,000/mo Human Cold Caller
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Wholesale Acquisitions & Off-Market Cold Outreach
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Autonomous text/voice agent initiates personalized outreach to property owners, handles objections, gauges seller motivation, and books qualified deals onto your calendar.
            </p>
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property Lead</span>
          </button>
        </div>
      </div>

      {/* Campaign KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>Total Leads Contacted</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.contactedCount}</div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 2,500/mo automated texts
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>Response Rate</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{stats.responseRate}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Industry avg is 8-12%</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>Motivated Leads</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{stats.qualifiedCount}</div>
          <p className="text-[11px] text-amber-700 mt-1 font-semibold">Motivation score ≥ 7</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">${stats.estimatedPipelineValue.toLocaleString()}</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">6 Active Assignments</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-indigo-800 font-bold mb-1">
            <span>Monthly VA Savings</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">$1,701 / mo</div>
          <p className="text-[11px] text-slate-600 mt-1 font-medium">$299 AI vs $2,000 Remote VA</p>
        </div>

      </div>

      {/* Main Workspace: Lead List + Conversational AI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lead List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col h-[680px]">
          
          {/* Filters & Search */}
          <div className="space-y-3 mb-4 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search address, owner, distress..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'hot_override', 'qualified', 'offer_made', 'under_contract', 'contacted', 'unmotivated'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap text-xs transition-colors flex items-center gap-1 ${
                    selectedStatus === st
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-semibold'
                  }`}
                >
                  {st === 'hot_override' ? (
                    <><Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> Hot Override</>
                  ) : (
                    st.replace('_', ' ')
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Lead List Cards */}
          <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
            {filteredLeads.map(lead => {
              const isSelected = activeLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setActiveLead(lead)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        <span>{lead.propertyAddress}</span>
                        {lead.isPriorityOverride && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-md border border-rose-200 flex items-center gap-1 font-extrabold shadow-2xs">
                            <Flame className="w-2.5 h-2.5 text-rose-600 fill-rose-500" /> HOT OVERRIDE
                          </span>
                        )}
                        {lead.scheduledCallDate && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-1 font-bold">
                            <Calendar className="w-2.5 h-2.5" /> Booked
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">{lead.ownerName} • {lead.cityStateZip}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTogglePriorityOverride) onTogglePriorityOverride(lead.id);
                        }}
                        className={`p-1 rounded-md border text-[10px] font-bold transition-all ${
                          lead.isPriorityOverride
                            ? 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500'
                        }`}
                        title={lead.isPriorityOverride ? 'Remove Hot Override' : 'Flag as Hot Override'}
                      >
                        <Flame className={`w-3.5 h-3.5 ${lead.isPriorityOverride ? 'text-rose-600 fill-rose-500' : 'text-slate-400'}`} />
                      </button>
                      <div>{getStatusBadge(lead.status)}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                        {lead.distressType}
                      </span>
                      <span className="font-medium">Val: ${lead.estimatedValue.toLocaleString()}</span>
                    </div>

                    {/* Motivation Meter */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 font-medium">Motivation:</span>
                      <span className={`font-mono font-bold ${
                        lead.isPriorityOverride
                          ? 'text-rose-600 font-extrabold'
                          : lead.motivationScore >= 8 ? 'text-emerald-600' :
                          lead.motivationScore >= 5 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {lead.isPriorityOverride ? '10/10 (Override)' : `${lead.motivationScore}/10`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs font-medium">
                No property leads found for this filter.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Lead Conversational Detail Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-[680px]">
          
          {activeLead ? (
            <>
              {/* Lead Top Header */}
              <div className="pb-4 border-b border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">{activeLead.propertyAddress}</h2>
                    {activeLead.isPriorityOverride && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-600 fill-rose-500" /> HOT OVERRIDE
                      </span>
                    )}
                    {getStatusBadge(activeLead.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Owner: <span className="text-slate-800 font-bold">{activeLead.ownerName}</span> ({activeLead.phone}) • <span className="text-indigo-600 font-bold">{activeLead.distressType}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTogglePriorityOverride && onTogglePriorityOverride(activeLead.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      activeLead.isPriorityOverride
                        ? 'bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-800 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    }`}
                    title="Manually force lead priority to Hot regardless of AI assessment score"
                  >
                    <Flame className={`w-3.5 h-3.5 ${activeLead.isPriorityOverride ? 'text-rose-600 fill-rose-500 animate-pulse' : 'text-slate-400'}`} />
                    <span>{activeLead.isPriorityOverride ? 'Priority: HOT (Override Active)' : 'Override Priority: Mark Hot'}</span>
                  </button>

                  <button
                    onClick={() => onSelectLeadForSim(activeLead)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Launch Voice Call Sim</span>
                  </button>
                </div>
              </div>

              {/* Qualification Analysis Bar */}
              <div className="grid grid-cols-4 gap-2 my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs shrink-0">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">ESTIMATED VALUE</span>
                  <span className="font-extrabold text-slate-900">${activeLead.estimatedValue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">ASKING PRICE</span>
                  <span className="font-extrabold text-emerald-600">
                    {activeLead.askingPrice ? `$${activeLead.askingPrice.toLocaleString()}` : 'Negotiating'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">SCHEDULED CALL</span>
                  <span className="font-extrabold text-amber-600">
                    {activeLead.scheduledCallDate || 'Pending Booking'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">PRIORITY STATUS</span>
                  {activeLead.isPriorityOverride ? (
                    <span className="font-extrabold text-rose-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-rose-500" /> Manual HOT Override
                    </span>
                  ) : (
                    <span className="font-bold text-slate-700">
                      AI Score: {activeLead.motivationScore}/10
                    </span>
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 bg-slate-50 rounded-xl p-3 border border-slate-200">
                {activeLead.isPriorityOverride && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-600 fill-rose-500 shrink-0" />
                      <span><strong>Manual Priority Override Active:</strong> Lead is flagged as <strong>HOT</strong> regardless of AI motivation score.</span>
                    </div>
                    <button
                      onClick={() => onTogglePriorityOverride && onTogglePriorityOverride(activeLead.id)}
                      className="text-[11px] font-bold text-rose-700 hover:underline shrink-0 ml-2"
                    >
                      Clear Override
                    </button>
                  </div>
                )}
                {activeLead.conversation.length > 0 ? (
                  activeLead.conversation.map(msg => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5 px-1 font-medium">
                          <span>{isAi ? 'PropAI Acquisitions Agent' : activeLead.ownerName}</span>
                          <span>• {msg.timestamp}</span>
                        </div>
                        <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${
                          isAi
                            ? 'bg-indigo-600 text-white rounded-tl-xs shadow-sm'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tr-xs shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs font-medium">
                    No initial conversation history. Type a message below to trigger Gemini AI outreach!
                  </div>
                )}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-indigo-700 text-xs bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 animate-pulse font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Acquisitions Agent is reasoning and drafting response...</span>
                  </div>
                )}
              </div>

              {/* Quick Objection Presets */}
              <div className="pt-2 shrink-0">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Simulate Seller Objections (Click to Send):</span>
                <div className="flex flex-wrap gap-1.5 text-[11px] mb-2">
                  {[
                    "How much cash will you pay me?",
                    "Is this a scam? I get 20 texts a day.",
                    "I want $250k net or no deal.",
                    "Call me back in 3 months."
                  ].map(objText => (
                    <button
                      key={objText}
                      onClick={async () => {
                        setNewMessageText(objText);
                        await onSendMessageToLead(activeLead.id, objText);
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium transition-colors"
                    >
                      "{objText}"
                    </button>
                  ))}
                </div>

                {/* Input Field */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type seller response or objection..."
                    value={newMessageText}
                    onChange={e => setNewMessageText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isAiThinking || !newMessageText.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-medium">
              Select a lead on the left to inspect conversation and test AI response.
            </div>
          )}

        </div>

      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" /> Add Property Off-Market Lead
            </h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddNewLead({
                  propertyAddress: formData.get('address') as string,
                  cityStateZip: formData.get('cityState') as string,
                  ownerName: formData.get('ownerName') as string,
                  phone: formData.get('phone') as string,
                  distressType: formData.get('distress') as any,
                  estimatedValue: Number(formData.get('estimatedValue')) || 250000,
                  motivationScore: 5,
                  status: 'new',
                  conversation: []
                });
                setShowAddLeadModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 font-bold mb-1">Property Street Address</label>
                <input required name="address" placeholder="e.g. 502 Main St" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">City, State Zip</label>
                <input required name="cityState" placeholder="e.g. Dallas, TX 75201" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Owner Name</label>
                  <input required name="ownerName" placeholder="e.g. John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Owner Phone</label>
                  <input required name="phone" placeholder="(555) 019-2831" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Distress Type</label>
                  <select name="distress" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium">
                    <option value="Tax Delinquent">Tax Delinquent</option>
                    <option value="Vacant Property">Vacant Property</option>
                    <option value="Pre-Foreclosure">Pre-Foreclosure</option>
                    <option value="Absentee Owner">Absentee Owner</option>
                    <option value="Code Violation">Code Violation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Est. Value ($)</label>
                  <input type="number" name="estimatedValue" defaultValue={280000} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm">
                  Add Lead & Launch Outreach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
