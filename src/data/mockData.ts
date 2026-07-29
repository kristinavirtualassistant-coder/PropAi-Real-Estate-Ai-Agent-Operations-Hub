import { WholesalerLead, MaintenanceTicket, PreferredContractor, AgentConfig, CampaignStats, PropertyManagerStats } from '../types';

export const INITIAL_WHOLESALER_LEADS: WholesalerLead[] = [
  {
    id: 'lead-1',
    propertyAddress: '1428 Elm Street',
    cityStateZip: 'Dallas, TX 75201',
    ownerName: 'Robert Vance',
    phone: '(214) 555-0182',
    email: 'robert.vance@example.com',
    distressType: 'Tax Delinquent',
    estimatedValue: 310000,
    askingPrice: 210000,
    motivationScore: 9,
    status: 'qualified',
    lastContactDate: '10 mins ago',
    notes: 'Out-of-state landlord behind on property taxes ($8.4k). Wants quick cash sale without repairs.',
    scheduledCallDate: 'Today at 4:30 PM',
    conversation: [
      { id: 'm1', sender: 'ai', text: "Hey Robert! I noticed your property at 1428 Elm St in Dallas. Are you open to a cash offer with zero closing costs?", timestamp: '10:14 AM' },
      { id: 'm2', sender: 'seller', text: "Who is this? How much are you offering? It needs work.", timestamp: '10:16 AM' },
      { id: 'm3', sender: 'ai', text: "We buy completely as-is with cash! We can cover closing costs and close in 10 days. Around what ballpark price were you hoping to walk away with?", timestamp: '10:17 AM' },
      { id: 'm4', sender: 'seller', text: "If I can get $210k net and not fix anything, I'll sign today. Tax bill is due next week.", timestamp: '10:19 AM' },
      { id: 'm5', sender: 'ai', text: "That sounds very reasonable. Let's schedule a 5-minute call today with our acquisitions manager to finalize details. How does 4:30 PM work for you?", timestamp: '10:20 AM' }
    ]
  },
  {
    id: 'lead-2',
    propertyAddress: '804 Willow Lane',
    cityStateZip: 'Fort Worth, TX 76102',
    ownerName: 'Sarah Jenkins',
    phone: '(817) 555-0391',
    distressType: 'Pre-Foreclosure',
    estimatedValue: 420000,
    askingPrice: 315000,
    motivationScore: 8,
    status: 'offer_made',
    lastContactDate: '1 hour ago',
    notes: 'Inherited home with reverse mortgage issue. Highly motivated.',
    conversation: [
      { id: 'm1', sender: 'ai', text: "Hi Sarah, I saw 804 Willow Lane and wanted to see if you'd be interested in a direct cash offer?", timestamp: '09:00 AM' },
      { id: 'm2', sender: 'seller', text: "Yes actually, I inherited it and need to settle the mortgage by end of month.", timestamp: '09:05 AM' }
    ]
  },
  {
    id: 'lead-3',
    propertyAddress: '2215 Oakridge Dr',
    cityStateZip: 'Arlington, TX 76010',
    ownerName: 'Marcus Miller',
    phone: '(817) 555-0922',
    distressType: 'Vacant Property',
    estimatedValue: 275000,
    motivationScore: 5,
    status: 'contacted',
    lastContactDate: 'Yesterday',
    notes: 'Vacant for 6 months. Considering listing with Realtor but worried about repairs.',
    conversation: [
      { id: 'm1', sender: 'ai', text: "Hey Marcus, checking in regarding 2215 Oakridge Dr. Are you still thinking of selling?", timestamp: 'Yesterday' },
      { id: 'm2', sender: 'seller', text: "Maybe, what's your offer?", timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'lead-4',
    propertyAddress: '512 Pinecrest Blvd',
    cityStateZip: 'Plano, TX 75024',
    ownerName: 'Elena Rostova',
    phone: '(972) 555-0412',
    distressType: 'Absentee Owner',
    estimatedValue: 550000,
    motivationScore: 2,
    status: 'unmotivated',
    lastContactDate: '3 days ago',
    notes: 'Not interested in selling below full retail value.',
    conversation: []
  },
  {
    id: 'lead-5',
    propertyAddress: '3901 Cedar Crest Rd',
    cityStateZip: 'Garland, TX 75040',
    ownerName: 'David Chen',
    phone: '(214) 555-0771',
    distressType: 'Code Violation',
    estimatedValue: 195000,
    askingPrice: 130000,
    motivationScore: 9,
    status: 'under_contract',
    lastContactDate: '2 days ago',
    notes: 'Contract signed! Assignment fee expected: $18,500. Closing Aug 12.',
    conversation: []
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TK-9102',
    propertyAddress: '742 Evergreen Terrace',
    unit: 'Unit 4B',
    tenantName: 'Jessica Taylor',
    tenantPhone: '(214) 555-0991',
    issueDescription: 'Air conditioner stopped cooling completely. Inside temperature is 88°F and rising.',
    category: 'HVAC',
    severity: 'emergency',
    status: 'contractor_dispatched',
    createdAt: '2:14 AM Today',
    troubleshootingSteps: [
      'Checked thermostat mode (verified set to COOL at 68°F)',
      'Verified circuit breaker is ON',
      'Recommended keeping blinds closed to slow heat buildup'
    ],
    contractorAssigned: 'AirPro Emergency HVAC Services',
    contractorPhone: '(214) 555-HVAC',
    contractorMessage: 'EMERGENCY DISPATCH: AC failure reported at 742 Evergreen Terr, Unit 4B. Outside temp >92°F expected. ETA 7:45 AM.',
    morningSummary: '2:14 AM - Complete AC failure in unit 4B. Triaged as Emergency due to high indoor heat. AirPro HVAC dispatched automatically.',
    conversation: [
      { id: 't1', sender: 'tenant', text: "HELP! My AC just shut off and it's almost 90 degrees inside my apartment!", timestamp: '2:14 AM' },
      { id: 't2', sender: 'ai', text: "Hi Jessica, PropAI Maintenance here. I understand this is urgent! Is the thermostat screen powered on, and have you checked if the outdoor fan is spinning?", timestamp: '2:15 AM' },
      { id: 't3', sender: 'tenant', text: "Screen is on set to 68, but the outdoor box is totally quiet and blowing warm air.", timestamp: '2:16 AM' },
      { id: 't4', sender: 'ai', text: "Thank you. Because temperatures are dangerously high, I have flagged this as an Emergency Work Order (#TK-9102) and dispatched AirPro Emergency HVAC. Their technician will arrive by 7:45 AM.", timestamp: '2:17 AM' }
    ]
  },
  {
    id: 'TK-9088',
    propertyAddress: '1022 Westview Apartments',
    unit: 'Apt 12',
    tenantName: 'Brandon Vance',
    tenantPhone: '(817) 555-0812',
    issueDescription: 'Sink pipe leaking under bathroom vanity into bucket.',
    category: 'Plumbing',
    severity: 'medium',
    status: 'triaged',
    createdAt: 'Yesterday at 9:30 PM',
    troubleshootingSteps: [
      'Shut off local shutoff valve beneath sink',
      'Placed secondary bucket under P-trap'
    ],
    contractorAssigned: 'FastFlow Plumbing',
    morningSummary: 'Bathroom vanity sink leak. Valve turned off by tenant, non-flooding. FastFlow scheduled for 10:00 AM.',
    conversation: []
  },
  {
    id: 'TK-9071',
    propertyAddress: '310 Highpoint Towers',
    unit: 'Suite 802',
    tenantName: 'Amanda Lopez',
    tenantPhone: '(972) 555-0331',
    issueDescription: 'Keyless electronic front door lock battery warning low.',
    category: 'Locksmith',
    severity: 'low',
    status: 'completed',
    createdAt: '2 days ago',
    troubleshootingSteps: ['Replaced 4x AA batteries in keypad lock'],
    morningSummary: 'Lock battery replaced by site staff.',
    conversation: []
  }
];

export const INITIAL_CONTRACTORS: PreferredContractor[] = [
  {
    id: 'c1',
    trade: 'HVAC',
    name: 'Dave Henderson',
    company: 'AirPro Emergency HVAC Services',
    phone: '(214) 555-4822',
    email: 'dispatch@airprohvac.com',
    autoDispatchUrgent: true,
    rating: 4.9
  },
  {
    id: 'c2',
    trade: 'Plumbing',
    name: 'Carlos Mendez',
    company: 'FastFlow Plumbing Co.',
    phone: '(817) 555-3911',
    email: 'carlos@fastflowplumbing.com',
    autoDispatchUrgent: true,
    rating: 4.8
  },
  {
    id: 'c3',
    trade: 'Electrical',
    name: 'Sam Brooks',
    company: 'Amped Electric & Power',
    phone: '(972) 555-8120',
    email: 'service@ampedelectric.com',
    autoDispatchUrgent: true,
    rating: 5.0
  },
  {
    id: 'c4',
    trade: 'Locksmith',
    name: 'Mike Kowalski',
    company: 'Metro Lock & Key',
    phone: '(214) 555-9002',
    email: 'mike@metrolock.com',
    autoDispatchUrgent: false,
    rating: 4.7
  }
];

export const DEFAULT_WHOLESALER_CONFIG: AgentConfig = {
  telephonyProvider: 'vapi',
  apiKey: 'vapi_live_sim_8941029381',
  voiceName: 'Puck',
  voiceStyle: 'Casual & Friendly',
  speakingRate: 1.0,
  systemPrompt: `You are an expert Real Estate Acquisitions AI Agent working for a top real estate wholesaler.
Reach out to off-market property owners, handle objections gracefully, uncover motivation, establish condition/asking price, and book a discovery call.`,
  autoBookingLink: 'https://calendly.com/acquisitions-team/15min',
  webhookUrl: 'https://api.propaihub.com/webhooks/vapi-acquisitions',
  autoSmsEnabled: true,
  emergencyThreshold: 'high_and_above'
};

export const DEFAULT_MAINTENANCE_CONFIG: AgentConfig = {
  telephonyProvider: 'retell',
  apiKey: 'retell_live_sim_7481920391',
  voiceName: 'Zephyr',
  voiceStyle: 'Empathetic & Helpful',
  speakingRate: 0.95,
  systemPrompt: `You are PropAI 24/7 Autonomous Maintenance Coordinator.
Receive tenant emergency calls or texts, diagnose issue, provide immediate troubleshooting, and dispatch preferred contractors automatically for high/emergency issues.`,
  autoBookingLink: '',
  webhookUrl: 'https://api.propaihub.com/webhooks/retell-maintenance',
  autoSmsEnabled: true,
  emergencyThreshold: 'high_and_above'
};

export const INITIAL_WHOLESALER_STATS: CampaignStats = {
  totalLeads: 1250,
  contactedCount: 842,
  qualifiedCount: 68,
  offersMadeCount: 24,
  underContractCount: 6,
  responseRate: 24.8,
  avgCostPerLead: 1.45,
  estimatedPipelineValue: 112000
};

export const INITIAL_PM_STATS: PropertyManagerStats = {
  totalUnitsManaged: 240,
  activeTicketsCount: 3,
  emergencyResolved24h: 4,
  avgTriageTimeMinutes: 1.2,
  tenantSatisfactionScore: 4.9,
  estimatedHoursSavedMonthly: 145
};
