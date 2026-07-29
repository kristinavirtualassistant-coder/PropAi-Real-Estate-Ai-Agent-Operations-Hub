import React, { useState, useEffect } from 'react';
import { TargetNiche, WholesalerLead, MaintenanceTicket, PreferredContractor, AgentConfig, CampaignStats, PropertyManagerStats, BrandConfig, NicheModule, FeatureRequestItem, NicheBuildRequestItem } from './types';
import {
  INITIAL_WHOLESALER_LEADS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_CONTRACTORS,
  DEFAULT_WHOLESALER_CONFIG,
  DEFAULT_MAINTENANCE_CONFIG,
  INITIAL_WHOLESALER_STATS,
  INITIAL_PM_STATS,
  DEFAULT_BRAND_CONFIG,
  INITIAL_NICHE_MODULES,
  INITIAL_FEATURE_REQUESTS,
  INITIAL_NICHE_BUILD_REQUESTS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { WholesalerDashboard } from './components/WholesalerDashboard';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';
import { NicheCatalogDashboard } from './components/NicheCatalogDashboard';
import { LiveStudioModal } from './components/LiveStudioModal';
import { ConfigModal } from './components/ConfigModal';
import { PricingModal } from './components/PricingModal';
import { ImportLeadsModal } from './components/ImportLeadsModal';
import { BrandModal } from './components/BrandModal';
import { AddNicheModal } from './components/AddNicheModal';
import { FeatureRequestModal } from './components/FeatureRequestModal';
import { GeminiIntelligenceDrawer } from './components/GeminiIntelligenceDrawer';
import { auth, onAuthStateChanged, User } from './lib/firebase';

export default function App() {
  // Firebase User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Page 1: Property Managers, Page 2: Wholesalers, etc.
  const [activeNiche, setActiveNiche] = useState<TargetNiche>('property_manager');
  const [nicheModules, setNicheModules] = useState<NicheModule[]>(INITIAL_NICHE_MODULES);
  
  // Data States
  const [leads, setLeads] = useState<WholesalerLead[]>(INITIAL_WHOLESALER_LEADS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [contractors] = useState<PreferredContractor[]>(INITIAL_CONTRACTORS);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequestItem[]>(INITIAL_FEATURE_REQUESTS);
  const [nicheBuildRequests, setNicheBuildRequests] = useState<NicheBuildRequestItem[]>(INITIAL_NICHE_BUILD_REQUESTS);
  
  // Brand & Config States
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(DEFAULT_BRAND_CONFIG);
  const [wholesalerConfig, setWholesalerConfig] = useState<AgentConfig>(DEFAULT_WHOLESALER_CONFIG);
  const [maintenanceConfig, setMaintenanceConfig] = useState<AgentConfig>(DEFAULT_MAINTENANCE_CONFIG);
  
  // Stats
  const [wholesalerStats, setWholesalerStats] = useState<CampaignStats>(INITIAL_WHOLESALER_STATS);
  const [pmStats, setPmStats] = useState<PropertyManagerStats>(INITIAL_PM_STATS);

  // Modals & Flags
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isBrandOpen, setIsBrandOpen] = useState<boolean>(false);
  const [isAddNicheOpen, setIsAddNicheOpen] = useState<boolean>(false);
  const [isFeatureRequestOpen, setIsFeatureRequestOpen] = useState<boolean>(false);
  const [isGeminiDrawerOpen, setIsGeminiDrawerOpen] = useState<boolean>(false);
  const [geminiConnected, setGeminiConnected] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

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

  const handleTogglePriorityOverride = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, isPriorityOverride: !l.isPriorityOverride } : l));
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

  const activeNicheModule = nicheModules.find(m => m.id === activeNiche) || nicheModules[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeNiche={activeNiche}
        setActiveNiche={setActiveNiche}
        nicheModules={nicheModules}
        onOpenLiveStudio={() => setIsLiveStudioOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenBrand={() => setIsBrandOpen(true)}
        onOpenAddNicheModal={() => setIsAddNicheOpen(true)}
        onOpenFeatureRequestModal={() => setIsFeatureRequestOpen(true)}
        onOpenGeminiDrawer={() => setIsGeminiDrawerOpen(true)}
        brandConfig={brandConfig}
        geminiConnected={geminiConnected}
        currentUser={currentUser}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page 1: Property Managers */}
        {activeNiche === 'property_manager' ? (
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
        ) : activeNiche === 'wholesaler' ? (
          /* Page 2: Wholesalers */
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
            onTogglePriorityOverride={handleTogglePriorityOverride}
            isAiThinking={isAiThinking}
          />
        ) : (
          /* Page 3+: Extensible Niche Modules */
          <NicheCatalogDashboard
            nicheModule={activeNicheModule}
            brandConfig={brandConfig}
            onOpenLiveStudio={() => setIsLiveStudioOpen(true)}
            onOpenAddNicheModal={() => setIsAddNicheOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 gap-2">
        <div>
          <span className="font-bold text-slate-800">{brandConfig.companyName}</span> • {brandConfig.tagline}
        </div>
        <div className="text-[11px] font-mono text-indigo-600 font-semibold">
          {brandConfig.watermarkText} ({brandConfig.customDomain})
        </div>
      </footer>

      {/* Modals */}
      <LiveStudioModal
        isOpen={isLiveStudioOpen}
        onClose={() => setIsLiveStudioOpen(false)}
        activeNiche={activeNiche}
        selectedLead={selectedLeadForSim}
        selectedTicket={selectedTicketForSim}
        brandConfig={brandConfig}
      />

      <BrandModal
        isOpen={isBrandOpen}
        onClose={() => setIsBrandOpen(false)}
        brandConfig={brandConfig}
        onSaveBrand={(newBrand) => setBrandConfig(newBrand)}
      />

      <AddNicheModal
        isOpen={isAddNicheOpen}
        onClose={() => setIsAddNicheOpen(false)}
        existingCount={nicheModules.length}
        onAddNiche={(newMod) => {
          setNicheModules(prev => [...prev, newMod]);
          setActiveNiche(newMod.id);
        }}
        onSubmitNicheBuildRequest={(newBuildReq) => {
          const item: NicheBuildRequestItem = {
            ...newBuildReq,
            id: `nbr-${Date.now()}`,
            status: 'Received',
            submittedAt: 'Just now'
          };
          setNicheBuildRequests(prev => [item, ...prev]);
        }}
        onOpenFeatureRequestModal={() => {
          setIsAddNicheOpen(false);
          setIsFeatureRequestOpen(true);
        }}
      />

      <FeatureRequestModal
        isOpen={isFeatureRequestOpen}
        onClose={() => setIsFeatureRequestOpen(false)}
        featureRequests={featureRequests}
        onSubmitRequest={(req) => {
          const newItem: FeatureRequestItem = {
            ...req,
            id: `fr-${Date.now()}`,
            votes: 1,
            userVoted: true,
            status: 'Under Review',
            createdAt: 'Just now'
          };
          setFeatureRequests(prev => [newItem, ...prev]);
        }}
        onVoteRequest={(id) => {
          setFeatureRequests(prev => prev.map(item => {
            if (item.id === id) {
              const userVoted = !item.userVoted;
              return {
                ...item,
                userVoted,
                votes: userVoted ? item.votes + 1 : item.votes - 1
              };
            }
            return item;
          }));
        }}
        onOpenAddNicheModal={() => {
          setIsFeatureRequestOpen(false);
          setIsAddNicheOpen(true);
        }}
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

      <GeminiIntelligenceDrawer
        isOpen={isGeminiDrawerOpen}
        onClose={() => setIsGeminiDrawerOpen(false)}
      />

    </div>
  );
}
