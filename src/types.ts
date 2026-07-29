export type TargetNiche = 'property_manager' | 'wholesaler' | 'real_estate_agent' | 'short_term_rental' | 'solar_sales' | string;

export interface NicheModule {
  id: string;
  pageNumber: number;
  name: string;
  badge: string;
  description: string;
  iconName: 'wrench' | 'building' | 'home' | 'key' | 'sun' | 'sparkles' | 'briefcase';
  colorTheme: 'emerald' | 'indigo' | 'violet' | 'amber' | 'cyan' | 'rose';
  stats: { label: string; value: string; detail: string }[];
  sampleWorkflow: { step: string; title: string; desc: string }[];
  voiceAgentPrompt: string;
  isCustom?: boolean;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'offer_made' | 'under_contract' | 'nurture' | 'unmotivated';

export type TicketSeverity = 'low' | 'medium' | 'high' | 'emergency';

export type TicketStatus = 'submitted' | 'triaged' | 'contractor_dispatched' | 'work_in_progress' | 'completed' | 'tenant_confirmed';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'seller' | 'tenant' | 'system' | 'contractor';
  text: string;
  timestamp: string;
  audioUrl?: string;
  isAudioPlaying?: boolean;
}

export interface WholesalerLead {
  id: string;
  propertyAddress: string;
  cityStateZip: string;
  ownerName: string;
  phone: string;
  email?: string;
  distressType: 'Tax Delinquent' | 'Vacant Property' | 'Pre-Foreclosure' | 'Absentee Owner' | 'Code Violation' | 'High Equity';
  estimatedValue: number;
  askingPrice?: number;
  motivationScore: number; // 1 to 10
  status: LeadStatus;
  lastContactDate?: string;
  notes?: string;
  conversation: ChatMessage[];
  scheduledCallDate?: string;
  isPriorityOverride?: boolean;
}

export interface MaintenanceTicket {
  id: string;
  propertyAddress: string;
  unit: string;
  tenantName: string;
  tenantPhone: string;
  issueDescription: string;
  category: 'HVAC' | 'Plumbing' | 'Electrical' | 'Appliance' | 'Structural' | 'Locksmith' | 'General';
  severity: TicketSeverity;
  status: TicketStatus;
  createdAt: string;
  conversation: ChatMessage[];
  troubleshootingSteps: string[];
  contractorAssigned?: string;
  contractorPhone?: string;
  contractorMessage?: string;
  morningSummary?: string;
  photoUrl?: string;
}

export interface PreferredContractor {
  id: string;
  trade: 'HVAC' | 'Plumbing' | 'Electrical' | 'Locksmith' | 'Roofing' | 'General';
  name: string;
  company: string;
  phone: string;
  email: string;
  autoDispatchUrgent: boolean;
  rating: number;
}

export interface AgentConfig {
  telephonyProvider: 'vapi' | 'retell' | 'twilio_sim';
  apiKey: string;
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  voiceStyle: 'Casual & Friendly' | 'Professional & Authoritative' | 'Empathetic & Helpful';
  speakingRate: number; // 0.8 to 1.2
  systemPrompt: string;
  autoBookingLink: string;
  webhookUrl: string;
  autoSmsEnabled: boolean;
  emergencyThreshold: 'high_and_above' | 'emergency_only';
}

export interface CampaignStats {
  totalLeads: number;
  contactedCount: number;
  qualifiedCount: number;
  offersMadeCount: number;
  underContractCount: number;
  responseRate: number; // percentage
  avgCostPerLead: number;
  estimatedPipelineValue: number;
}

export interface BrandConfig {
  companyName: string;
  tagline: string;
  primaryColor: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
  logoIcon: 'bot' | 'building' | 'home' | 'sparkles' | 'shield' | 'zap';
  customDomain: string;
  customLogoUrl?: string;
  agentPhoneName: string;
  whiteLabelEnabled: boolean;
  watermarkText: string;
  phoneDisplayNumber: string;
  smsSignature: string;
}

export interface PropertyManagerStats {
  totalUnitsManaged: number;
  activeTicketsCount: number;
  emergencyResolved24h: number;
  avgTriageTimeMinutes: number;
  tenantSatisfactionScore: number; // e.g. 4.9/5
  estimatedHoursSavedMonthly: number;
}

export interface FeatureRequestItem {
  id: string;
  title: string;
  category: 'Integration' | 'UI / Workflow' | 'Reporting' | 'Automation' | 'Mobile App' | 'Telephony';
  description: string;
  votes: number;
  userVoted?: boolean;
  status: 'Under Review' | 'Planned' | 'In Development' | 'Completed';
  createdAt: string;
  authorEmail?: string;
}

export interface NicheBuildRequestItem {
  id: string;
  industryName: string;
  targetAudience: string;
  keyWorkflows: string;
  specialRequirements: string;
  contactEmail: string;
  status: 'Received' | 'Scoped' | 'In Build' | 'Ready for Preview';
  submittedAt: string;
}
