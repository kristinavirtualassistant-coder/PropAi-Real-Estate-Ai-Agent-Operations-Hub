import React, { useState, useEffect } from 'react';
import { TargetNiche, WholesalerLead, MaintenanceTicket, PreferredContractor, AgentConfig, CampaignStats, PropertyManagerStats } from './types';
import {
  INITIAL_WHOLESALER_LEADS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_CONTRACTORS,
  DEFAULT_WHOLESALER_CONFIG,
  DEFAULT_MAINTENANCE_CONFIG,
  INITIAL_WHOLESALER_STATS,
  INITIAL_PM_STATS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { WholesalerDashboard } from './components/WholesalerDashboard';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';
import { LiveStudioModal } from './components/LiveStudioModal';
import { ConfigModal } from './components/ConfigModal';
import { PricingModal } from './components/PricingModal';
import { ImportLeadsModal } from './components/ImportLeadsModal';
import { GeminiIntelligenceModal } from './components/GeminiIntelligenceModal';
import { ActivityLogs } from './components/ActivityLogs';
import { X } from 'lucide-react';

export default function App() {
  const [activeNiche, setActiveNiche] = useState<TargetNiche>('wholesaler');
  
  // Data States
  const [leads, setLeads] = useState<WholesalerLead[]>(INITIAL_WHOLESALER_LEADS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [contractors] = useState<PreferredContractor[]>(INITIAL_CONTRACTORS);
  
  // Config States
  const [wholesalerConfig, setWholesalerConfig] = useState<AgentConfig>(DEFAULT_WHOLESALER_CONFIG);
  const [maintenanceConfig, setMaintenanceConfig] = useState<AgentConfig>(DEFAULT_MAINTENANCE_CONFIG);
  
  // Stats
  const [wholesalerStats, setWholesalerStats] = useState<CampaignStats>(INITIAL_WHOLESALER_STATS);
  const [pmStats, setPmStats] = useState<PropertyManagerStats>(INITIAL_PM_STATS);

  // Modals & Flags
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState<boolean>(false);
  const [isGeminiIntelligenceOpen, setIsGeminiIntelligenceOpen] = useState<boolean>(false);
  const [isActivityLogsOpen, setIsActivityLogsOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [geminiConnected, setGeminiConnected] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Selected items for Studio
  const [selectedLeadForSim, setSelectedLeadForSim] = useState<WholesalerLead | null>(leads[0] || null);
  const [selectedTicketForSim, setSelectedTicketForSim] = useState<MaintenanceTicket | null>(tickets[0] || null);

  // Check Gemini Health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setGeminiConnected(!!data.geminiAvailable);
      })
      .catch(err => {
        console.error('Health check failed:', err);
      });
  }, []);

  // 1. Wholesaler Message Sender (Target A)
  const handleSendMessageToLead = async (leadId: string, text: string) => {
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append seller message
    const updatedUserConv = [
      ...targetLead.conversation,
      { id: `m-${Date.now()}`, sender: 'seller' as const, text, timestamp: timestampStr }
    ];

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, conversation: updatedUserConv } : l));
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/wholesaler/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: targetLead,
          conversationHistory: updatedUserConv.map(c => ({ sender: c.sender, text: c.text })),
          latestMessage: text,
          systemPrompt: wholesalerConfig.systemPrompt
        })
      });

      const data = await res.json();
      setIsAiThinking(false);

      if (data.reply) {
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const finalConv = [
          ...updatedUserConv,
          { id: `ai-${Date.now()}`, sender: 'ai' as const, text: data.reply, timestamp: aiTimeStr }
        ];

        const motivationScore = data.qualification?.motivationScore || targetLead.motivationScore;
        const newStatus = data.qualification?.status || targetLead.status;

        setLeads(prev => prev.map(l => l.id === leadId ? {
          ...l,
          conversation: finalConv,
          motivationScore: motivationScore,
          status: newStatus as any,
          lastContactDate: 'Just now'
        } : l));

        // Update stats
        if (motivationScore >= 7) {
          setWholesalerStats(prev => ({
            ...prev,
            qualifiedCount: prev.qualifiedCount + 1,
            estimatedPipelineValue: prev.estimatedPipelineValue + 15000
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setIsAiThinking(false);
    }
  };

  // 2. Maintenance Message Sender (Target B)
  const handleSendMessageToTenant = async (ticketId: string, text: string) => {
    const targetTicket = tickets.find(t => t.id === ticketId);
    if (!targetTicket) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTenantConv = [
      ...targetTicket.conversation,
      { id: `t-${Date.now()}`, sender: 'tenant' as const, text, timestamp: timestampStr }
    ];

    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, conversation: updatedTenantConv } : t));
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/maintenance/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: { address: targetTicket.propertyAddress, unit: targetTicket.unit },
          tenantMessage: text,
          conversationHistory: updatedTenantConv.map(c => ({ sender: c.sender, text: c.text })),
          preferredContractors: contractors.reduce((acc, c) => ({ ...acc, [c.trade]: `${c.company} (${c.name})` }), {})
        })
      });

      const data = await res.json();
      setIsAiThinking(false);

      if (data.reply) {
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const finalConv = [
          ...updatedTenantConv,
          { id: `ai-${Date.now()}`, sender: 'ai' as const, text: data.reply, timestamp: aiTimeStr }
        ];

        const ticketUpdate = data.ticketUpdate || {};

        setTickets(prev => prev.map(t => t.id === ticketId ? {
          ...t,
          conversation: finalConv,
          severity: ticketUpdate.severity || t.severity,
          status: ticketUpdate.contractorDispatched ? 'contractor_dispatched' : 'triaged',
          contractorAssigned: ticketUpdate.assignedContractor || t.contractorAssigned,
          contractorMessage: ticketUpdate.contractorMessage || t.contractorMessage,
          troubleshootingSteps: ticketUpdate.troubleshootingSteps || t.troubleshootingSteps,
          morningSummary: ticketUpdate.morningSummary || t.morningSummary
        } : t));

        if (ticketUpdate.severity === 'emergency') {
          setPmStats(prev => ({
            ...prev,
            emergencyResolved24h: prev.emergencyResolved24h + 1
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setIsAiThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeNiche={activeNiche}
        setActiveNiche={setActiveNiche}
        onOpenLiveStudio={() => setIsLiveStudioOpen(true)}
        onOpenGeminiIntelligence={() => setIsGeminiIntelligenceOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenActivityLogs={() => setIsActivityLogsOpen(true)}
        geminiConnected={geminiConnected}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {activeNiche === 'wholesaler' ? (
          <WholesalerDashboard
            leads={leads}
            stats={wholesalerStats}
            onSelectLeadForSim={(lead) => {
              setSelectedLeadForSim(lead);
              setIsLiveStudioOpen(true);
            }}
            onAddNewLead={(newLead) => {
              const fullLead: WholesalerLead = {
                id: `lead-${Date.now()}`,
                propertyAddress: newLead.propertyAddress || '123 Main St',
                cityStateZip: newLead.cityStateZip || 'Dallas, TX',
                ownerName: newLead.ownerName || 'Property Owner',
                phone: newLead.phone || '(555) 019-2831',
                distressType: newLead.distressType || 'Tax Delinquent',
                estimatedValue: newLead.estimatedValue || 250000,
                motivationScore: 5,
                status: 'new',
                conversation: []
              };
              setLeads(prev => [fullLead, ...prev]);
              setSelectedLeadForSim(fullLead);
            }}
            onUpdateLeadStatus={(leadId, status) => {
              setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
            }}
            onSendMessageToLead={handleSendMessageToLead}
            isAiThinking={isAiThinking}
          />
        ) : (
          <MaintenanceDashboard
            tickets={tickets}
            stats={pmStats}
            contractors={contractors}
            onSelectTicketForSim={(ticket) => {
              setSelectedTicketForSim(ticket);
              setIsLiveStudioOpen(true);
            }}
            onSendMessageToTenant={handleSendMessageToTenant}
            onAddNewTicket={(newTicket) => {
              const fullTicket: MaintenanceTicket = {
                id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
                propertyAddress: newTicket.propertyAddress || '742 Evergreen Terr',
                unit: newTicket.unit || 'Unit 1A',
                tenantName: newTicket.tenantName || 'Tenant',
                tenantPhone: newTicket.tenantPhone || '(555) 019-2831',
                issueDescription: newTicket.issueDescription || 'Maintenance request',
                category: newTicket.category || 'General',
                severity: newTicket.severity || 'medium',
                status: 'submitted',
                createdAt: 'Just now',
                conversation: [],
                troubleshootingSteps: []
              };
              setTickets(prev => [fullTicket, ...prev]);
              setSelectedTicketForSim(fullTicket);
            }}
            isAiThinking={isAiThinking}
          />
        )}

        {/* Dedicated Activity Telemetry Logs Dashboard Section */}
        <section id="activity-logs-section" className="pt-4 border-t border-slate-300/60 dark:border-slate-800">
          <ActivityLogs />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-3.5 text-center text-xs text-slate-400 font-medium">
        PropAI Operations Hub • Real Estate Wholesaler Acquisitions & 24/7 Tenant Maintenance Engine • Powered by Gemini 3.6 Flash
      </footer>

      {/* Modals */}
      {isActivityLogsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-5xl my-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsActivityLogsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <ActivityLogs isEmbedded={true} />
          </div>
        </div>
      )}

      <GeminiIntelligenceModal
        isOpen={isGeminiIntelligenceOpen}
        onClose={() => setIsGeminiIntelligenceOpen(false)}
      />

      <LiveStudioModal
        isOpen={isLiveStudioOpen}
        onClose={() => setIsLiveStudioOpen(false)}
        activeNiche={activeNiche}
        selectedLead={selectedLeadForSim}
        selectedTicket={selectedTicketForSim}
      />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        activeNiche={activeNiche}
        config={activeNiche === 'wholesaler' ? wholesalerConfig : maintenanceConfig}
        onSaveConfig={(newConfig) => {
          if (activeNiche === 'wholesaler') {
            setWholesalerConfig(newConfig);
          } else {
            setMaintenanceConfig(newConfig);
          }
        }}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <ImportLeadsModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        activeNiche={activeNiche}
        onImportBulkLeads={(newLeads) => {
          setLeads(prev => [...newLeads, ...prev]);
        }}
        onImportBulkTickets={(newTickets) => {
          setTickets(prev => [...newTickets, ...prev]);
        }}
      />

    </div>
  );
}
