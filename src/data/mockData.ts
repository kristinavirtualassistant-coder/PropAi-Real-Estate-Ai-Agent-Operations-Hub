import { WholesalerLead, MaintenanceTicket, PreferredContractor, AgentConfig, CampaignStats, PropertyManagerStats, BrandConfig, NicheModule, FeatureRequestItem, NicheBuildRequestItem } from '../types';

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
    isPriorityOverride: true,
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

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  companyName: 'PropAI Operations Hub',
  tagline: 'Autonomous Real Estate & Operations Agents',
  primaryColor: 'indigo',
  logoIcon: 'bot',
  customDomain: 'ops.propai.io',
  customLogoUrl: '',
  agentPhoneName: 'PropAI AI Assistant',
  whiteLabelEnabled: true,
  watermarkText: 'Powered by PropAI Autonomous Engine',
  phoneDisplayNumber: '+1 (888) 593-PROP',
  smsSignature: 'Sent via PropAI Automated Desk'
};

export const INITIAL_NICHE_MODULES: NicheModule[] = [
  {
    id: 'property_manager',
    pageNumber: 1,
    name: 'Property Managers & Landlords',
    badge: '24/7 Tenant Maintenance',
    description: 'Autonomous voice & SMS agent handling tenant emergency intake, diagnostic troubleshooting, and auto-dispatching HVAC/Plumbing contractors.',
    iconName: 'wrench',
    colorTheme: 'emerald',
    stats: [
      { label: 'Units Managed', value: '240', detail: 'Across 18 Multifamily & Single Family Properties' },
      { label: 'Avg Triage Time', value: '1.2 min', detail: 'Instant AI Tenant Diagnostics' },
      { label: 'Saved Monthly', value: '145 hrs', detail: 'Eliminated 2:00 AM Landlord Calls' }
    ],
    sampleWorkflow: [
      { step: '01', title: 'Inbound Tenant Call / Text', desc: 'Tenant calls at 2:15 AM regarding bursting pipe or broken AC unit.' },
      { step: '02', title: 'AI Triage & Video Troubleshooting', desc: 'Agent assesses issue, checks main shut-off valve, gathers photos.' },
      { step: '03', title: 'Contractor Auto-Dispatch', desc: 'Dispatches preferred plumber automatically with emergency SLA.' }
    ],
    voiceAgentPrompt: 'You are PropAI 24/7 Tenant Maintenance Coordinator. Handle tenant emergencies, diagnose root cause, and dispatch preferred contractors.'
  },
  {
    id: 'wholesaler',
    pageNumber: 2,
    name: 'Real Estate Wholesalers & Investors',
    badge: 'Off-Market Deal Engine',
    description: 'AI Voice Cold Caller & Inbound Lead Setter that qualifies motivated distress sellers (Tax Delinquent, Probate, Pre-Foreclosure) and calculates MAO cash offers.',
    iconName: 'building',
    colorTheme: 'indigo',
    stats: [
      { label: 'Active Pipeline', value: '$112,000', detail: 'Estimated Assignment Fee Value' },
      { label: 'Response Rate', value: '24.8%', detail: 'AI Multi-Touch Voice & SMS Outreach' },
      { label: 'Under Contract', value: '6 Deals', detail: 'Average $18,500 Fee Per Closed Deal' }
    ],
    sampleWorkflow: [
      { step: '01', title: 'Cold Call & Inbound Seller Voice', desc: 'Agent contacts distress list or answers inbound direct mail calls.' },
      { step: '02', title: 'Motivated Seller Scoring', desc: 'Evaluates timeline, Asking Price, Repairs needed, and Motivation (1-10).' },
      { step: '03', title: 'Automated Offer & Contract', desc: 'Calculates 70% ARV minus repairs and emails purchase agreement.' }
    ],
    voiceAgentPrompt: 'You are PropAI Acquisitions Specialist. Talk to property owners, determine seller motivation, gather repair details, and negotiate cash offers.'
  },
  {
    id: 'real_estate_agent',
    pageNumber: 3,
    name: 'Real Estate Agents & Brokers',
    badge: 'Buyer/Seller Lead Qualification',
    description: 'Instant response AI assistant that answers Zillow/Realtor.com leads in 15 seconds, pre-qualifies mortgage readiness, and books showing tours directly on Google Calendar.',
    iconName: 'home',
    colorTheme: 'violet',
    stats: [
      { label: 'Lead Response Time', value: '14 sec', detail: 'Instant AI Voice Callback' },
      { label: 'Pre-Approved Buyers', value: '42 Leads', detail: 'Budget & Pre-Approval Letter Verified' },
      { label: 'Tours Booked', value: '28/mo', detail: 'Synced to Agent Calendar' }
    ],
    sampleWorkflow: [
      { step: '01', title: 'Inbound Web / Portal Lead', desc: 'New lead submits inquiry on $650k suburban listing.' },
      { step: '02', title: '15-Second AI Pre-Qualification', desc: 'Agent asks about pre-approval letter, timeline, and preferred neighborhoods.' },
      { step: '03', title: 'Direct Showing Calendar Booking', desc: 'Schedules private walkthrough tour and sends SMS confirmation.' }
    ],
    voiceAgentPrompt: 'You are the Senior Listing Assistant for Apex Real Estate Group. Pre-qualify home buyers and sellers, verify mortgage pre-approval, and book showing tours.'
  },
  {
    id: 'short_term_rental',
    pageNumber: 4,
    name: 'Short-Term Rental & Airbnb Hosts',
    badge: 'Guest Concierge & Cleaning Dispatch',
    description: '24/7 AI guest concierge answering Wi-Fi/lockbox questions, managing early check-ins, and auto-dispatching turnover cleaners between bookings.',
    iconName: 'key',
    colorTheme: 'cyan',
    stats: [
      { label: 'Active Listings', value: '38 Doors', detail: 'Airbnb, VRBO, & Direct Booking Engine' },
      { label: 'Guest Response Time', value: '< 30 sec', detail: 'Instant Smart Lock & Amenities Help' },
      { label: 'Cleaner Turnover SLA', value: '100%', detail: 'Automated Cleaner SMS Dispatch' }
    ],
    sampleWorkflow: [
      { step: '01', title: 'Guest Inquiry / Emergency', desc: 'Guest texts/calls at 10 PM about smart lock code or hot tub heater.' },
      { step: '02', title: 'Instant AI Concierge Answer', desc: 'Agent provides custom property guidebook answers and lockbox override codes.' },
      { step: '03', title: 'Turnover Cleaner Dispatch', desc: 'Triggers SMS alert to cleaning crew upon guest checkout verification.' }
    ],
    voiceAgentPrompt: 'You are the AI Guest Concierge for Luxury Vacation Rentals. Answer guest questions, guide check-ins, and resolve stay issues.'
  },
  {
    id: 'solar_sales',
    pageNumber: 5,
    name: 'Solar & Home Services Contractors',
    badge: 'Utility Bill Qualifier & Setter',
    description: 'Outbound setter & inbound qualifier that analyzes homeowners monthly electric bills, calculates shade/roof suitability, and books home solar consultations.',
    iconName: 'sun',
    colorTheme: 'amber',
    stats: [
      { label: 'Monthly Utility Audits', value: '180 Bills', detail: 'Uploaded & AI Parsed' },
      { label: 'Qualifying Electric Bill', value: '>$150/mo', detail: 'High ROI Target Threshold' },
      { label: 'Appointments Set', value: '52 Consults', detail: 'Door-to-Door & Web Inbound' }
    ],
    sampleWorkflow: [
      { step: '01', title: 'Utility Bill Image Upload', desc: 'Homeowner texts photo of monthly electric bill.' },
      { step: '02', title: 'Roof & Savings AI Audit', desc: 'Agent verifies roof orientation, current kWh rate, and calculates annual net savings.' },
      { step: '03', title: 'In-Home Design Consultation', desc: 'Books solar consultant site visit directly with homeowner.' }
    ],
    voiceAgentPrompt: 'You are the Energy Specialist for SunPower Solutions. Qualify homeowners based on utility bill costs, roof condition, and schedule solar consultations.'
  }
];

export const INITIAL_FEATURE_REQUESTS: FeatureRequestItem[] = [
  {
    id: 'fr-1',
    title: 'Bi-directional Zapier & Make.com Webhook Sync',
    category: 'Integration',
    description: 'Trigger immediate webhook payloads when leads reach "Qualified" or "Under Contract" status to sync automatically with Podio, HubSpot, or HighLevel.',
    votes: 42,
    userVoted: false,
    status: 'In Development',
    createdAt: '3 days ago'
  },
  {
    id: 'fr-2',
    title: 'Custom SMS Auto-Responder Sequences',
    category: 'Automation',
    description: 'Allow multi-day automated follow-up SMS drips if an unmotivated seller or tenant does not reply within 48 hours.',
    votes: 29,
    userVoted: true,
    status: 'Planned',
    createdAt: '1 week ago'
  },
  {
    id: 'fr-3',
    title: 'Native Mobile App Push Notifications',
    category: 'Mobile App',
    description: 'Receive immediate push alerts on iOS/Android when a high-severity 2:00 AM emergency maintenance ticket is logged.',
    votes: 18,
    userVoted: false,
    status: 'Under Review',
    createdAt: '2 weeks ago'
  },
  {
    id: 'fr-[#4]',
    title: 'White-Label Agency Client Portal Permissions',
    category: 'UI / Workflow',
    description: 'Multi-tenant role permissions allowing sub-account agency clients to log in and only view their own specific property leads or tickets.',
    votes: 35,
    userVoted: false,
    status: 'In Development',
    createdAt: '5 days ago'
  }
];

export const INITIAL_NICHE_BUILD_REQUESTS: NicheBuildRequestItem[] = [
  {
    id: 'nbr-1',
    industryName: 'Roofing & Storm Damage Restoration',
    targetAudience: 'Homeowners with recent hail/wind storm damage',
    keyWorkflows: 'Outbound voice outreach after severe weather events, photo damage evaluation, insurance claim guidance',
    specialRequirements: 'Integration with AccuLynx and Hover 3D models',
    contactEmail: 'sales@roofpros.com',
    status: 'Scoped',
    submittedAt: 'Yesterday'
  }
];

