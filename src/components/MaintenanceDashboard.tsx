import React, { useState } from 'react';
import { MaintenanceTicket, PropertyManagerStats, PreferredContractor, TicketSeverity, TicketStatus } from '../types';
import { Wrench, AlertCircle, PhoneCall, CheckCircle2, ShieldAlert, Sparkles, Send, UserCheck, Plus, Clock, Building, HardHat, FileText, Check, ChevronRight } from 'lucide-react';

interface MaintenanceDashboardProps {
  tickets: MaintenanceTicket[];
  stats: PropertyManagerStats;
  contractors: PreferredContractor[];
  onSelectTicketForSim: (ticket: MaintenanceTicket) => void;
  onSendMessageToTenant: (ticketId: string, text: string) => Promise<void>;
  onAddNewTicket: (ticket: Partial<MaintenanceTicket>) => void;
  isAiThinking: boolean;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({
  tickets,
  stats,
  contractors,
  onSelectTicketForSim,
  onSendMessageToTenant,
  onAddNewTicket,
  isAiThinking
}) => {
  const [activeTicket, setActiveTicket] = useState<MaintenanceTicket | null>(tickets[0] || null);
  const [tenantMsgInput, setTenantMsgInput] = useState<string>('');
  const [showAddTicketModal, setShowAddTicketModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'kanban' | 'contractors'>('kanban');

  const handleSendTenantMessage = async () => {
    if (!activeTicket || !tenantMsgInput.trim()) return;
    const text = tenantMsgInput;
    setTenantMsgInput('');
    await onSendMessageToTenant(activeTicket.id, text);
  };

  const getSeverityBadge = (sev: TicketSeverity) => {
    switch (sev) {
      case 'emergency':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 animate-pulse"><ShieldAlert className="w-3 h-3 text-rose-600" /> 2:00 AM EMERGENCY</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Standard</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (st: TicketStatus) => {
    switch (st) {
      case 'contractor_dispatched':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><HardHat className="w-3 h-3 text-emerald-700" /> Contractor Dispatched</span>;
      case 'triaged':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Triaged</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Completed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Submitted</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Target Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs border border-emerald-200 font-bold">
                24/7 PROPERTY OPERATIONS
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Prevents Hiring 3 Extra Human Coordinators
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              24/7 Autonomous Maintenance & Tenant Coordinator
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Handles middle-of-the-night tenant emergency calls, diagnoses issue severity with Gemini AI, guides tenant through troubleshooting, and auto-dispatches preferred local contractors.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddTicketModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Tenant Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>Doors Managed</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalUnitsManaged}</div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">Across 18 Properties</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>24/7 Avg Triage Speed</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-700">{stats.avgTriageTimeMinutes} mins</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Instant Voice/SMS Triage</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>24h Emergencies Resolved</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{stats.emergencyResolved24h}</div>
          <p className="text-[11px] text-rose-700 font-semibold mt-1">Auto-Dispatched HVAC/Plumbing</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span>Tenant Satisfaction</span>
            <UserCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{stats.tenantSatisfactionScore} / 5.0</div>
          <p className="text-[11px] text-slate-500 mt-1">From 140+ tenant ratings</p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-teal-900 font-bold mb-1">
            <span>Hours Saved Monthly</span>
            <Wrench className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">145 Hours</div>
          <p className="text-[11px] text-slate-600 mt-1 font-medium">Replaces night shift VA team</p>
        </div>

      </div>

      {/* Morning Briefing Banner */}
      <div className="bg-white border border-teal-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800 border border-teal-200 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 tracking-wider">
              AUTOMATED MORNING MANAGER BRIEFING (GENERATED 6:00 AM)
            </span>
            <span className="text-[10px] text-slate-500 font-medium">24/7 AI System Log</span>
          </div>
          <p className="text-xs text-slate-700 mt-1 font-mono leading-relaxed font-medium">
            {"Overnight summary: 2:14 AM - Complete AC Failure reported by Jessica Taylor (742 Evergreen Terr, Unit 4B). AI auto-triaged as Emergency (outside temp > 92°F). AirPro Emergency HVAC dispatched via SMS. Tenant guided through circuit breaker safety check. ETA for repair: 7:45 AM today."}
          </p>
        </div>
      </div>

      {/* View Switcher: Work Orders vs Preferred Contractors */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'kanban'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Work Orders & 24/7 Triage
        </button>

        <button
          onClick={() => setActiveTab('contractors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'contractors'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Preferred Contractor Auto-Dispatch ({contractors.length})
        </button>
      </div>

      {/* Tab 1: Work Orders Workspace */}
      {activeTab === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Tickets List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col h-[640px]">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Active Maintenance Work Orders ({tickets.length})
            </h3>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {tickets.map(ticket => {
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-teal-800">{ticket.id}</span>
                          <span className="text-xs text-slate-900 font-bold">• {ticket.unit}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 font-medium line-clamp-1">
                          {ticket.issueDescription}
                        </p>
                      </div>
                      <div className="shrink-0">{getSeverityBadge(ticket.severity)}</div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200">
                      <div className="text-slate-500 font-medium">{ticket.tenantName} ({ticket.propertyAddress})</div>
                      <div>{getStatusBadge(ticket.status)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Ticket Detail & Live Chat Simulator (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-[640px]">
            {activeTicket ? (
              <>
                {/* Header */}
                <div className="pb-3 border-b border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-teal-800">{activeTicket.id}</span>
                      <h2 className="text-sm font-bold text-slate-900">{activeTicket.propertyAddress}, {activeTicket.unit}</h2>
                      {getSeverityBadge(activeTicket.severity)}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tenant: <span className="text-slate-800 font-bold">{activeTicket.tenantName}</span> ({activeTicket.tenantPhone})
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTicketForSim(activeTicket)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Simulate 2:00 AM Tenant Call</span>
                  </button>
                </div>

                {/* Auto-Dispatch & Troubleshooting Card */}
                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold flex items-center gap-1">
                      <HardHat className="w-3.5 h-3.5 text-teal-600" /> DISPATCHED CONTRACTOR:
                    </span>
                    <span className="text-teal-800 font-extrabold">{activeTicket.contractorAssigned || 'None'}</span>
                  </div>

                  {activeTicket.contractorMessage && (
                    <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700 font-mono font-medium">
                      <span className="text-emerald-700 font-bold">AUTOMATED SMS SENT TO CONTRACTOR:</span> "{activeTicket.contractorMessage}"
                    </div>
                  )}

                  {activeTicket.troubleshootingSteps.length > 0 && (
                    <div>
                      <span className="text-slate-600 text-[11px] font-bold block mb-1">AI TROUBLESHOOTING GIVEN TO TENANT:</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 font-medium">
                        {activeTicket.troubleshootingSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto space-y-3 my-1 pr-1 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  {activeTicket.conversation.length > 0 ? (
                    activeTicket.conversation.map(msg => {
                      const isAi = msg.sender === 'ai';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5 px-1 font-medium">
                            <span>{isAi ? 'PropAI Maintenance Assistant' : activeTicket.tenantName}</span>
                            <span>• {msg.timestamp}</span>
                          </div>
                          <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${
                            isAi
                              ? 'bg-teal-600 text-white rounded-tl-xs shadow-sm'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tr-xs shadow-sm'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs font-medium">
                      No call transcript logged yet. Type a tenant emergency message below to test triage!
                    </div>
                  )}

                  {isAiThinking && (
                    <div className="flex items-center gap-2 text-teal-800 text-xs bg-teal-50 p-2.5 rounded-xl border border-teal-200 animate-pulse font-bold">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>PropAI Maintenance Engine is diagnosing issue severity & drafting response...</span>
                    </div>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="pt-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Simulate Late-Night Tenant Emergency:</span>
                  <div className="flex flex-wrap gap-1.5 text-[11px] mb-2">
                    {[
                      "My toilet is overflowing and won't stop running!",
                      "The heater is blowing freezing cold air and it's 20° outside.",
                      "There's a pipe leaking water right onto my electrical breaker box!",
                      "My key snapped inside the front door deadbolt."
                    ].map(emText => (
                      <button
                        key={emText}
                        onClick={async () => {
                          setTenantMsgInput(emText);
                          await onSendMessageToTenant(activeTicket.id, emText);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium transition-colors"
                      >
                        "{emText}"
                      </button>
                    ))}
                  </div>

                  {/* Input Field */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type tenant emergency message..."
                      value={tenantMsgInput}
                      onChange={e => setTenantMsgInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendTenantMessage()}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium"
                    />
                    <button
                      onClick={handleSendTenantMessage}
                      disabled={isAiThinking || !tenantMsgInput.trim()}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs font-medium">
                Select a ticket on the left to view triage details and test AI response.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Tab 2: Preferred Contractor Directory */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Preferred Local Contractor Auto-Dispatch Directory</h3>
            <p className="text-xs text-slate-600 mt-1">
              When PropAI diagnoses an Emergency or High Severity issue (e.g. AC failure in heatwave, burst pipe), it automatically dispatches the primary contractor via SMS with address and job details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractors.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-xs font-bold border border-teal-200">
                      {c.trade}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{c.company}</h4>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">Contact: {c.name}</p>
                  <p className="text-xs text-slate-400">Phone: {c.phone} | Email: {c.email}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-amber-600 font-bold block">★ {c.rating} / 5.0</span>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-[10px] font-bold ${
                    c.autoDispatchUrgent ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {c.autoDispatchUrgent ? 'Auto-Dispatch ON' : 'Manual Approval'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddTicketModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-600" /> Log New Tenant Maintenance Ticket
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddNewTicket({
                  propertyAddress: formData.get('address') as string,
                  unit: formData.get('unit') as string,
                  tenantName: formData.get('tenant') as string,
                  tenantPhone: formData.get('phone') as string,
                  issueDescription: formData.get('issue') as string,
                  category: formData.get('category') as any,
                  severity: formData.get('severity') as any,
                  status: 'submitted',
                  createdAt: 'Just now',
                  conversation: [],
                  troubleshootingSteps: []
                });
                setShowAddTicketModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Property Address</label>
                <input required name="address" defaultValue="742 Evergreen Terrace" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit #</label>
                  <input required name="unit" defaultValue="Unit 2A" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select name="category" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium">
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Locksmith">Locksmith</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tenant Name</label>
                  <input required name="tenant" defaultValue="Alex Miller" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tenant Phone</label>
                  <input required name="phone" defaultValue="(214) 555-0922" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Description</label>
                <textarea required name="issue" rows={2} defaultValue="AC unit in master bedroom is blowing warm air." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Severity</label>
                <select name="severity" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium">
                  <option value="emergency">Emergency (24/7 Auto-Dispatch)</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowAddTicketModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold">
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
