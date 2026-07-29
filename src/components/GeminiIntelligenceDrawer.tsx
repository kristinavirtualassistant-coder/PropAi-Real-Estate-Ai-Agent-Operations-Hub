import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, Send, Bot, User as UserIcon, Mic, MicOff, Search, MapPin, Sparkles, Zap, Layers, RefreshCw, Calculator, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';

interface GeminiIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: { title: string; url: string }[];
  timestamp: string;
}

export const GeminiIntelligenceDrawer: React.FC<GeminiIntelligenceDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'think' | 'search' | 'maps' | 'transcribe'>('chat');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      text: "Hello! I am your PropAI Gemini Intelligence Engine. You can ask me to draft acquisitions SMS scripts, triage tenant emergency complaints, or evaluate deal comps.",
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<'acquisitions' | 'maintenance' | 'underwriter'>('acquisitions');
  const [useFastLite, setUseFastLite] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Deep Underwriting (Thinking Mode) state
  const [propertyAddress, setPropertyAddress] = useState('742 Evergreen Terr, Springfield');
  const [arvInput, setArvInput] = useState('280000');
  const [rehabInput, setRehabInput] = useState('35000');
  const [askingPriceInput, setAskingPriceInput] = useState('160000');
  const [thinkingOutput, setThinkingOutput] = useState('');
  const [isThinkingLoading, setIsThinkingLoading] = useState(false);

  // Search Grounding state
  const [searchQuery, setSearchQuery] = useState('Current 30-year mortgage rates and average rent prices in Texas 2026');
  const [searchResult, setSearchResult] = useState<{ reply: string; sources: { title: string; url: string }[] } | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Maps Grounding state
  const [locationInput, setLocationInput] = useState('123 Main St, Austin, TX');
  const [mapsResult, setMapsResult] = useState('');
  const [isMapsLoading, setIsMapsLoading] = useState(false);

  // Audio Microphone Transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) return null;

  // Handle Chat Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const systemInstructions = {
        acquisitions: "You are a top Real Estate Acquisitions Wholesaler AI. Help negotiate cash offers, draft SMS scripts, and handle seller objections concisely.",
        maintenance: "You are an automated 24/7 Property Management Maintenance Triage Agent. Evaluate repair urgency, troubleshoot tenant leaks/HVAC, and draft contractor briefs.",
        underwriter: "You are a expert Real Estate Underwriter. Calculate Cap Rates, Net Operating Income, Maximum Allowable Offers (MAO), and Cash-on-Cash Return."
      };

      const endpoint = useFastLite ? "/api/gemini/fast-response" : "/api/gemini/chat";
      const payload = useFastLite
        ? { prompt: userText }
        : {
            messages: [...chatMessages, newUserMsg].map(m => ({ role: m.role, text: m.text })),
            systemInstruction: systemInstructions[selectedRole],
            modelOverride: "gemini-3.5-flash"
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || "Thinking complete.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botReply]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: "Apologies, I encountered an error connecting to Gemini. Please try again.",
        timestamp: 'Just now'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Thinking Underwrite
  const handleRunThinking = async () => {
    setIsThinkingLoading(true);
    setThinkingOutput('');

    try {
      const res = await fetch('/api/gemini/think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealDetails: {
            property: propertyAddress,
            arv: Number(arvInput) || 280000,
            rehabEst: Number(rehabInput) || 35000,
            askingPrice: Number(askingPriceInput) || 160000
          }
        })
      });

      const data = await res.json();
      setThinkingOutput(data.reply || 'Analysis complete.');
    } catch (err) {
      console.error('Thinking error:', err);
      setThinkingOutput('Failed to run deep thinking underwriting.');
    } finally {
      setIsThinkingLoading(false);
    }
  };

  // Handle Search Grounding
  const handleRunSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchLoading(true);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() })
      });

      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error('Search grounding error:', err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Handle Maps Grounding
  const handleRunMaps = async () => {
    if (!locationInput.trim()) return;
    setIsMapsLoading(true);

    try {
      const res = await fetch('/api/gemini/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: locationInput.trim(), query: "Find nearby contractors, schools, and transportation hubs." })
      });

      const data = await res.json();
      setMapsResult(data.reply || 'No location details returned.');
    } catch (err) {
      console.error('Maps grounding error:', err);
    } finally {
      setIsMapsLoading(false);
    }
  };

  // Handle Audio Microphone Recording & Transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTranscribing(true);

          try {
            const res = await fetch('/api/gemini/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' })
            });
            const data = await res.json();
            setTranscriptionResult(data.transcript || 'No transcript generated.');
          } catch (err) {
            console.error('Transcription error:', err);
            setTranscriptionResult('Failed to transcribe audio.');
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access is required to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full shadow-2xl flex flex-col text-slate-900 animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Gemini AI Intelligence Hub</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold">
                  MULTI-MODEL
                </span>
              </div>
              <p className="text-xs text-slate-500">Live API, Deep Thinking, Search & Maps Grounding</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tabs Bar */}
        <div className="flex items-center border-b border-slate-200 bg-white px-4 overflow-x-auto gap-2 scrollbar-none shrink-0 py-2">
          {[
            { id: 'chat', label: 'Multi-turn Chat', icon: Bot },
            { id: 'think', label: 'Deep Underwriter', icon: Calculator },
            { id: 'search', label: 'Google Search', icon: Search },
            { id: 'maps', label: 'Maps Grounding', icon: MapPin },
            { id: 'transcribe', label: 'Audio Transcribe', icon: Mic }
          ].map(t => {
            const IconComp = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* TAB 1: Multi-Turn Chatbot */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full justify-between space-y-4">
              
              {/* Controls */}
              <div className="flex items-center justify-between gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Role:</span>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="acquisitions">Wholesaler Acquisitions</option>
                    <option value="maintenance">Property Manager Triage</option>
                    <option value="underwriter">Deal Underwriter</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={useFastLite}
                    onChange={e => setUseFastLite(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Fast Lite Mode</span>
                  <Zap className="w-3 h-3 text-amber-500" />
                </label>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 min-h-[300px] max-h-[450px]">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                      msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                    }`}>
                      {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs space-y-1 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <span className={`text-[10px] block text-right font-mono ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini is generating response...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200 shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask Gemini anything about real estate or property management..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: Deep Underwriting (High Thinking Mode) */}
          {activeTab === 'think' && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Gemini 3.1 Pro Thinking Mode (High Level)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Executes deep multi-step mathematical calculations for MAO, rehab contingency buffers, cap rates, and deal negotiation leverage.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Property Location</label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={e => setPropertyAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Est. ARV ($)</label>
                    <input
                      type="number"
                      value={arvInput}
                      onChange={e => setArvInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Rehab ($)</label>
                    <input
                      type="number"
                      value={rehabInput}
                      onChange={e => setRehabInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Asking ($)</label>
                    <input
                      type="number"
                      value={askingPriceInput}
                      onChange={e => setAskingPriceInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunThinking}
                  disabled={isThinkingLoading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  {isThinkingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deep Thinking Analysis in Progress...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      <span>Run Deep Mathematical Underwrite</span>
                    </>
                  )}
                </button>
              </div>

              {thinkingOutput && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 animate-fadeIn">
                  <span className="text-[10px] font-mono font-bold text-purple-800 block uppercase">THINKING OUTPUT ANALYSIS</span>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
                    {thinkingOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Google Search Grounding */}
          {activeTab === 'search' && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Search className="w-4 h-4 text-amber-600" />
                  <span>Google Search Grounding (gemini-3.5-flash)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Fetches live real estate market news, mortgage rate changes, and local housing trends with web citations.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. Current average rent prices for 3-bedroom in Austin TX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleRunSearch}
                  disabled={isSearchLoading}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shrink-0 flex items-center gap-1 shadow-md"
                >
                  {isSearchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>

              {searchResult && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-slate-800 leading-relaxed font-sans">{searchResult.reply}</p>
                  
                  {searchResult.sources && searchResult.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">CITED SOURCES:</span>
                      {searchResult.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{s.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Maps Grounding */}
          {activeTab === 'maps' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Google Maps Grounding (gemini-3.5-flash)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Queries neighborhood amenities, nearby school ratings, and contractor distances for any property address.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                  placeholder="Enter property address..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
                <button
                  onClick={handleRunMaps}
                  disabled={isMapsLoading}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0 flex items-center gap-1 shadow-md"
                >
                  {isMapsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                </button>
              </div>

              {mapsResult && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">MAPS LOCATION BRIEF</span>
                  <p className="text-slate-800 leading-relaxed font-sans">{mapsResult}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Microphone Speech Audio Transcription */}
          {activeTab === 'transcribe' && (
            <div className="space-y-4 text-xs">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span>Live Audio Speech Transcription (gemini-3.5-flash)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Speak directly into your microphone to record audio messages or tenant voicemail notes for instant Gemini transcription.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-red-500/30'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <div className="text-center">
                  <span className="font-bold text-slate-800 text-sm block">
                    {isRecording ? 'Recording Audio... (Click to stop)' : 'Click Microphone to Start Recording'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isRecording ? 'Speak your message clearly' : 'Supports voice notes & spoken lead notes'}
                  </span>
                </div>
              </div>

              {isTranscribing && (
                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center gap-2 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Transcribing Audio with Gemini 3.5 Flash...</span>
                </div>
              )}

              {transcriptionResult && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase block">TRANSCRIPT RESULT</span>
                  <p className="text-slate-800 leading-relaxed font-sans">{transcriptionResult}</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
