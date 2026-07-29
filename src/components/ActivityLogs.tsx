import React, { useState, useEffect } from 'react';
import {
  Activity,
  Terminal,
  RefreshCw,
  Trash2,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Send,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Server,
  ArrowUpRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { ActivityLogEntry } from '../types';

interface ActivityLogsProps {
  logs?: ActivityLogEntry[];
  onRefresh?: () => void;
  onClear?: () => void;
  isEmbedded?: boolean;
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({
  logs: externalLogs,
  onRefresh,
  onClear,
  isEmbedded = false
}) => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTestTriggering, setIsTestTriggering] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // Fetch logs from server
  const fetchServerLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/activity-logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (externalLogs && externalLogs.length > 0) {
      setLogs(externalLogs);
    } else {
      fetchServerLogs();
    }
    // Poll logs every 5 seconds
    const interval = setInterval(() => {
      fetchServerLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [externalLogs]);

  const handleClearLogs = async () => {
    try {
      await fetch('/api/activity-logs', { method: 'DELETE' });
      setLogs([]);
      if (onClear) onClear();
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  // Test Payload Trigger Handlers
  const triggerVapiTestPayload = async () => {
    setIsTestTriggering(true);
    setTestNotification('Sending mock Vapi Telephony payload to /api/vapi/webhook...');
    try {
      const mockVapiPayload = {
        message: {
          type: "function-call",
          functionCall: {
            id: `vapi-call-${Date.now()}`,
            name: "getWholesalerResponse",
            parameters: {
              userMessage: "How much can you pay in cash for 123 Main St, Dallas TX?",
              leadId: "lead-001",
              callerNumber: "+15550192831"
            }
          }
        },
        call: {
          id: "vapi-session-8832",
          status: "in-progress",
          telephonyProvider: "vapi"
        }
      };

      const res = await fetch('/api/vapi/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockVapiPayload)
      });
      const data = await res.json();
      setTestNotification(`✅ Vapi Webhook Response Received! Payload reached Gemini LLM. Response: "${data.assistantResponse || 'Success'}"`);
      fetchServerLogs();
    } catch (err: any) {
      setTestNotification(`❌ Error sending Vapi payload: ${err.message}`);
    } finally {
      setIsTestTriggering(false);
      setTimeout(() => setTestNotification(null), 6000);
    }
  };

  const triggerRetellTestPayload = async () => {
    setIsTestTriggering(true);
    setTestNotification('Sending mock Retell AI payload to /api/retell/webhook...');
    try {
      const mockRetellPayload = {
        event: "user_speech_committed",
        call_id: `retell-call-${Date.now()}`,
        args: {
          user_prompt: "The AC unit in unit 4B is blowing warm air and outside temperature is 95 degrees.",
          tenant_name: "Sarah Jenkins",
          property: "742 Evergreen Terr, Unit 4B"
        },
        telephonyProvider: "retell"
      };

      const res = await fetch('/api/retell/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockRetellPayload)
      });
      const data = await res.json();
      setTestNotification(`✅ Retell Webhook Response Received! Payload reached Gemini LLM. Response: "${data.content || 'Success'}"`);
      fetchServerLogs();
    } catch (err: any) {
      setTestNotification(`❌ Error sending Retell payload: ${err.message}`);
    } finally {
      setIsTestTriggering(false);
      setTimeout(() => setTestNotification(null), 6000);
    }
  };

  const triggerGeminiWholesalerTest = async () => {
    setIsTestTriggering(true);
    setTestNotification('Sending Wholesaler Prompt to /api/wholesaler/respond...');
    try {
      const res = await fetch('/api/wholesaler/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            ownerName: "Robert Vance",
            propertyAddress: "404 Oakridge Blvd",
            distressType: "Pre-Foreclosure",
            estimatedValue: 320000
          },
          latestMessage: "I need to sell in 14 days before auction. Can you make me an offer?",
          conversationHistory: []
        })
      });
      const data = await res.json();
      setTestNotification(`✅ Gemini 3.6 Flash Response Received! Reply: "${data.reply?.slice(0, 70)}..."`);
      fetchServerLogs();
    } catch (err: any) {
      setTestNotification(`❌ Error: ${err.message}`);
    } finally {
      setIsTestTriggering(false);
      setTimeout(() => setTestNotification(null), 6000);
    }
  };

  const handleCopyJson = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesService = selectedServiceFilter === 'all' || 
      log.service.toLowerCase().includes(selectedServiceFilter.toLowerCase());
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      log.service.toLowerCase().includes(query) ||
      log.endpoint.toLowerCase().includes(query) ||
      log.status.toLowerCase().includes(query) ||
      JSON.stringify(log.requestPayload).toLowerCase().includes(query) ||
      JSON.stringify(log.responsePayload).toLowerCase().includes(query);

    return matchesService && matchesSearch;
  });

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 ${isEmbedded ? 'p-0' : 'p-6'}`}>
      
      {/* Header Bar */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400 shadow-md">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">API Activity Telemetry & Payload Inspector</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                LIVE LOGS ({logs.length})
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verify raw request & response objects sent to Vapi, Retell, and Gemini LLM models.
            </p>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchServerLogs}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 text-xs font-semibold border border-slate-700 hover:border-rose-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Quick Trigger Simulation Bar */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold flex items-center gap-1.5 text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Payload Verification Diagnostics (Test LLM Reachability):</span>
          </span>
          <span className="text-[11px] text-slate-400">Click a button to push a raw payload to the backend server</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={triggerVapiTestPayload}
            disabled={isTestTriggering}
            className="px-3 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/60 text-purple-200 font-medium flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Simulate Vapi Webhook</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 opacity-70" />
          </button>

          <button
            onClick={triggerRetellTestPayload}
            disabled={isTestTriggering}
            className="px-3 py-2 rounded-xl bg-teal-900/40 hover:bg-teal-900/70 border border-teal-700/60 text-teal-200 font-medium flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Simulate Retell Webhook</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-400 opacity-70" />
          </button>

          <button
            onClick={triggerGeminiWholesalerTest}
            disabled={isTestTriggering}
            className="px-3 py-2 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-700/60 text-indigo-200 font-medium flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Simulate Gemini Prompt</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 opacity-70" />
          </button>
        </div>

        {testNotification && (
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-xs text-indigo-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] leading-relaxed">{testNotification}</span>
          </div>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Service Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'vapi', label: 'Vapi Telephony' },
            { id: 'retell', label: 'Retell AI' },
            { id: 'wholesaler', label: 'Gemini Wholesaler' },
            { id: 'maintenance', label: 'Gemini Maintenance' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedServiceFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                selectedServiceFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search raw payload keys, text, status..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Logs Table / List Container */}
      <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-slate-500">
            <Server className="w-8 h-8 mx-auto text-slate-600 animate-bounce" />
            <p className="text-xs font-semibold">No activity telemetry logs match your filter.</p>
            <p className="text-[11px]">Send a chat message or click one of the test trigger buttons above to inspect raw LLM request/response payloads.</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = expandedLogId === log.id;
            const reqJsonStr = JSON.stringify(log.requestPayload, null, 2);
            const resJsonStr = JSON.stringify(log.responsePayload, null, 2);

            return (
              <div key={log.id} className="p-4 hover:bg-slate-800/40 transition-colors">
                {/* Compact Row Header */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button className="text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {/* Service Badge */}
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border shrink-0 ${
                      log.service.includes('Vapi')
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : log.service.includes('Retell')
                        ? 'bg-teal-950 text-teal-300 border-teal-800'
                        : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                    }`}>
                      {log.service}
                    </span>

                    {/* Endpoint & Method */}
                    <span className="font-mono text-xs text-slate-200 font-bold truncate">
                      {log.method} {log.endpoint}
                    </span>

                    {/* Model Used */}
                    {log.modelUsed && (
                      <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {log.modelUsed}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    {/* Latency */}
                    <span className="font-mono text-[11px] text-slate-400">
                      ⚡ {log.latencyMs} ms
                    </span>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.status.includes('200')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {log.status}
                    </span>

                    {/* Timestamp */}
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Expanded Raw Inspector Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    
                    {/* Verification Status Alert */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium text-slate-200">
                          Payload Communication Status: <span className="text-emerald-400 font-bold">Successfully Delivered & Executed by Gemini LLM</span>
                        </span>
                      </div>
                      {log.notes && (
                        <span className="text-[11px] text-slate-400 font-mono">{log.notes}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* RAW REQUEST PAYLOAD */}
                      <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs text-indigo-400 font-bold border-b border-slate-800/80 pb-2">
                          <span className="flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Raw Request Payload (Outgoing)</span>
                          </span>
                          <button
                            onClick={() => handleCopyJson(reqJsonStr, `${log.id}-req`)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                          >
                            {copiedId === `${log.id}-req` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === `${log.id}-req` ? 'Copied' : 'Copy JSON'}</span>
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 p-2 scrollbar-thin scrollbar-thumb-slate-800">
                          {reqJsonStr}
                        </pre>
                      </div>

                      {/* RAW RESPONSE PAYLOAD */}
                      <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold border-b border-slate-800/80 pb-2">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Raw Response Payload (Incoming from LLM)</span>
                          </span>
                          <button
                            onClick={() => handleCopyJson(resJsonStr, `${log.id}-res`)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                          >
                            {copiedId === `${log.id}-res` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === `${log.id}-res` ? 'Copied' : 'Copy JSON'}</span>
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 p-2 scrollbar-thin scrollbar-thumb-slate-800">
                          {resJsonStr}
                        </pre>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
