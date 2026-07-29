export type TargetNiche = 'wholesaler' | 'property_manager';

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

export interface PropertyManagerStats {
  totalUnitsManaged: number;
  activeTicketsCount: number;
  emergencyResolved24h: number;
  avgTriageTimeMinutes: number;
  tenantSatisfactionScore: number; // e.g. 4.9/5
  estimatedHoursSavedMonthly: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  service: 'Vapi Telephony' | 'Retell AI' | 'Gemini 3.6 Flash' | 'Gemini 3.5 Flash' | 'Gemini 3.1 Pro' | 'Gemini Live API' | 'Gemini TTS';
  endpoint: string;
  method: string;
  status: '200 OK' | '201 Created' | '400 Bad Request' | '500 Server Error' | 'Pending';
  latencyMs: number;
  requestPayload: any;
  responsePayload: any;
  headers?: Record<string, string>;
  modelUsed?: string;
  notes?: string;
}

