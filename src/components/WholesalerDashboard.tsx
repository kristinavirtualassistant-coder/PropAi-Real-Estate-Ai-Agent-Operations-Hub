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
  isAiThinking: boolean;
}

export const WholesalerDashboard: React.FC<WholesalerDashboardProps> = ({
  leads,
  stats,
  onSelectLeadForSim,
  onAddNewLead,
  onUpdateLeadStatus,
  onSendMessageToLead,
  isAiThinking
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLead, setActiveLead] = useState<WholesalerLead | null>(leads[0] || null);
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
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
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><Flame className="w-3 h-3 text-emerald-600" /> Motivated Lead</span>;
      case 'under_contract':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-600" /> Under Contract</span>;
      case 'offer_made':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">Offer Made</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">Contacted</span>;
      case 'unmotivated':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Unmotivated</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">New Lead</span>;
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Target Banner */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-500/30">
                TARGET A: ACQUISITIONS ENGINE
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Replaces $2,000/mo Remote Cold Caller
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              AI Wholesale Acquisitions & Off-Market Outreach
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Autonomous text/voice agent initiates personalized outreach to property owners, handles objections, gauges seller motivation, and books qualified deals onto your calendar.
            </p>
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property Lead</span>
          </button>
        </div>
      </div>

      {/* Campaign KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Leads Contacted</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.contactedCount}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 2,500/mo automated texts
          </p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Response Rate</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.responseRate}%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Industry avg is 8-12%</p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Motivated Leads</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.qualifiedCount}</div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Motivation score ≥ 7</p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">${stats.estimatedPipelineValue.toLocaleString()}</div>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">6 Active Assignments</p>
        </div>

        <div className="bg-indigo-900 text-white rounded-xl p-3.5 border border-indigo-800 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold mb-1">
            <span>Monthly VA Savings</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">$1,701 / mo</div>
          <p className="text-[11px] text-indigo-200 mt-0.5">$299 AI vs $2,000 Remote VA</p>
        </div>

      </div>

      {/* Main Workspace: Lead List + Conversational AI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Lead List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 flex flex-col h-[680px]">
          
          {/* Filters & Search */}
          <div className="space-y-2.5 mb-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search address, owner, distress..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {['all', 'qualified', 'offer_made', 'under_contract', 'contacted', 'unmotivated'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-md capitalize whitespace-nowrap text-xs font-semibold transition-colors ${
                    selectedStatus === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Lead List Cards */}
          <div className="overflow-y-auto space-y-2 pr-1 flex-1">
            {filteredLeads.map(lead => {
              const isSelected = activeLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setActiveLead(lead)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400/80 shadow-sm'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{lead.propertyAddress}</span>
                        {lead.scheduledCallDate && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded border border-amber-300 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> Booked
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">{lead.ownerName} • {lead.cityStateZip}</p>
                    </div>
                    <div>{getStatusBadge(lead.status)}</div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px] font-semibold">
                        {lead.distressType}
                      </span>
                      <span className="font-medium">Val: ${lead.estimatedValue.toLocaleString()}</span>
                    </div>

                    {/* Motivation Meter */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 font-medium">Motivation:</span>
                      <span className={`font-mono font-bold ${
                        lead.motivationScore >= 8 ? 'text-emerald-700' :
                        lead.motivationScore >= 5 ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        {lead.motivationScore}/10
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-medium">
                No property leads found for this filter.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Lead Conversational Detail Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[680px]">
          
          {activeLead ? (
            <>
              {/* Lead Top Header */}
              <div className="pb-3 border-b border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{activeLead.propertyAddress}</h2>
                    {getStatusBadge(activeLead.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Owner: <span className="text-slate-800 font-bold">{activeLead.ownerName}</span> ({activeLead.phone}) • <span className="text-indigo-700 font-bold">{activeLead.distressType}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectLeadForSim(activeLead)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Launch Voice Call Sim</span>
                  </button>
                </div>
              </div>

              {/* Qualification Analysis Bar */}
              <div className="grid grid-cols-3 gap-3 my-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs shrink-0">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">ESTIMATED VALUE</span>
                  <span className="font-bold text-slate-800">${activeLead.estimatedValue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">ASKING PRICE</span>
                  <span className="font-bold text-emerald-700">
                    {activeLead.askingPrice ? `$${activeLead.askingPrice.toLocaleString()}` : 'Negotiating'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">SCHEDULED CALL</span>
                  <span className="font-bold text-amber-700">
                    {activeLead.scheduledCallDate || 'Pending Booking'}
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 bg-slate-50 rounded-xl p-3 border border-slate-200">
                {activeLead.conversation.length > 0 ? (
                  activeLead.conversation.map(msg => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mb-0.5 px-1">
                          <span>{isAi ? 'PropAI Acquisitions Agent' : activeLead.ownerName}</span>
                          <span>• {msg.timestamp}</span>
                        </div>
                        <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isAi
                            ? 'bg-indigo-600 text-white shadow-sm rounded-tl-xs font-medium'
                            : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tr-xs font-medium'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    No initial conversation history. Type a message below to trigger Gemini AI outreach!
                  </div>
                )}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-indigo-700 text-xs bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 animate-pulse font-medium">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
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
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-300 transition-colors"
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
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isAiThinking || !newMessageText.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Select a lead on the left to inspect conversation and test AI response.
            </div>
          )}

        </div>

      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" /> Add Property Off-Market Lead
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
                <label className="block text-slate-400 mb-1">Property Street Address</label>
                <input required name="address" placeholder="e.g. 502 Main St" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">City, State Zip</label>
                <input required name="cityState" placeholder="e.g. Dallas, TX 75201" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Owner Name</label>
                  <input required name="ownerName" placeholder="e.g. John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Owner Phone</label>
                  <input required name="phone" placeholder="(555) 019-2831" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Distress Type</label>
                  <select name="distress" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white">
                    <option value="Tax Delinquent">Tax Delinquent</option>
                    <option value="Vacant Property">Vacant Property</option>
                    <option value="Pre-Foreclosure">Pre-Foreclosure</option>
                    <option value="Absentee Owner">Absentee Owner</option>
                    <option value="Code Violation">Code Violation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Est. Value ($)</label>
                  <input type="number" name="estimatedValue" defaultValue={280000} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
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
