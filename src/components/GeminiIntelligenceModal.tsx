import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  Brain,
  Zap,
  Mic,
  Search,
  MapPin,
  X,
  Send,
  Radio,
  ExternalLink,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface GeminiIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiIntelligenceModal: React.FC<GeminiIntelligenceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'thinking' | 'fast' | 'transcribe' | 'grounding' | 'live'>('chat');

  // --- 1. CHATBOT STATE ---
  const [chatModel, setChatModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string; time: string }>>([
    {
      role: 'model',
      text: 'Hello! I am your PropAI Deal & Property Assistant. I maintain full multi-turn context. Ask me to underwrite a deal, handle seller objections, or draft contractor dispatch SOPs.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatSystemPrompt, setChatSystemPrompt] = useState('You are PropAI Chatbot, an expert advisor for real estate wholesalers and property managers.');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userText = chatInput;
    setChatInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: userText, time: timeStr }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
          model: chatModel,
          systemInstruction: chatSystemPrompt
        })
      });
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: data.reply || 'No response returned.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- 2. HIGH THINKING STATE ---
  const [thinkingPrompt, setThinkingPrompt] = useState('Underwrite a creative seller financing deal: Purchase Price $350k, $50k down, 4% interest-only for 5 years with balloon. ARV is $480k, rehab $40k.');
  const [thinkingResult, setThinkingResult] = useState<string | null>(null);
  const [isThinkingLoading, setIsThinkingLoading] = useState(false);

  const handleRunDeepAnalysis = async () => {
    setIsThinkingLoading(true);
    setThinkingResult(null);
    try {
      const res = await fetch('/api/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: thinkingPrompt, context: { mode: 'high_thinking' } })
      });
      const data = await res.json();
      setThinkingResult(data.analysis || 'Analysis complete.');
    } catch (err) {
      console.error(err);
      setThinkingResult('Error performing high thinking analysis.');
    } finally {
      setIsThinkingLoading(false);
    }
  };

  // --- 3. FAST RESPONSE STATE ---
  const [fastInput, setFastInput] = useState('Seller says: "I already have cash offers higher than yours!"');
  const [fastReply, setFastReply] = useState<string | null>(null);
  const [fastLatency, setFastLatency] = useState<number | null>(null);
  const [isFastLoading, setIsFastLoading] = useState(false);

  const handleRunFastResponse = async () => {
    setIsFastLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/fast-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fastInput })
      });
      const data = await res.json();
      setFastReply(data.reply);
      setFastLatency(Math.round(performance.now() - start));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFastLoading(false);
    }
  };

  // --- 4. AUDIO TRANSCRIBE STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTranscribing(true);
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/wav' })
            });
            const data = await res.json();
            setTranscriptionResult(data.text || 'Transcription complete.');
          } catch (err) {
            console.error(err);
            setTranscriptionResult('Failed to transcribe audio.');
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- 5. GROUNDING (SEARCH & MAPS) ---
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps'>('search');
  const [groundingQuery, setGroundingQuery] = useState('Dallas TX off-market house prices 2026 trends');
  const [groundingText, setGroundingText] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  const handleRunGrounding = async () => {
    setIsGroundingLoading(true);
    setGroundingText(null);
    setGroundingSources([]);
    try {
      const endpoint = groundingMode === 'search' ? '/api/search-grounding' : '/api/maps-grounding';
      const body = groundingMode === 'search' ? { query: groundingQuery } : { locationQuery: groundingQuery };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setGroundingText(data.text);
      setGroundingSources(data.groundingSources || data.mapsSources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // --- 6. LIVE API AUDIO SESSION ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const toggleLiveSession = () => {
    if (isLiveActive) {
      if (wsRef.current) wsRef.current.close();
      setIsLiveActive(false);
      setLiveLog(prev => [...prev, 'Live session disconnected.']);
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsLiveActive(true);
        setLiveLog(prev => [...prev, '⚡ Connected to Gemini Live API (gemini-3.1-flash-live-preview). Start speaking...']);
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.audio) {
          setLiveLog(prev => [...prev, '🔊 [AI Voice Audio Chunk Received]']);
        }
        if (msg.interrupted) {
          setLiveLog(prev => [...prev, '⚠️ [Voice Interrupted]']);
        }
      };

      ws.onerror = (err) => {
        console.error('WS error:', err);
        setLiveLog(prev => [...prev, '❌ Live WebSocket Connection Error.']);
      };

      ws.onclose = () => {
        setIsLiveActive(false);
        setLiveLog(prev => [...prev, 'Disconnected from Live session.']);
      };

      wsRef.current = ws;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gemini Intelligence Hub
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  @google/genai 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Multi-turn Chat • High Thinking Mode • Live API • Grounding • Audio Transcribe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tab Selector Bar */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto shrink-0 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Multi-turn Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('thinking')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'thinking' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-300" />
            <span>High Thinking Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('fast')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'fast' ? 'bg-amber-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Low-Latency Lite</span>
          </button>

          <button
            onClick={() => setActiveTab('transcribe')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'transcribe' ? 'bg-teal-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-4 h-4 text-teal-300" />
            <span>Audio Transcribe</span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'grounding' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-blue-300" />
            <span>Google Search & Maps</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'live' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-300" />
            <span>Live Voice API</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">

          {/* TAB 1: MULTI-TURN CHATBOT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full space-y-4">
              {/* Controls Header */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Select Model:</span>
                  <select
                    value={chatModel}
                    onChange={(e: any) => setChatModel(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (General Purpose)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Tasks)</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={chatSystemPrompt}
                    onChange={(e) => setChatSystemPrompt(e.target.value)}
                    placeholder="System instruction..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Chat History Thread */}
              <div className="flex-1 overflow-y-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400 opacity-80">
                        <span className="font-bold uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'PropAI Agent'}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-3 text-xs text-indigo-400">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <span>PropAI is thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Ask anything about underwriting, contracts, seller objections..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HIGH THINKING MODE */}
          {activeTab === 'thinking' && (
            <div className="space-y-6">
              <div className="bg-purple-950/40 border border-purple-800/50 p-4 rounded-2xl flex items-start gap-3">
                <Brain className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-200">
                  <h3 className="font-bold text-white text-sm mb-1">Deep Reasoning with gemini-3.1-pro-preview</h3>
                  <p>
                    Configured with <code className="bg-purple-900/60 px-1.5 py-0.5 rounded font-mono text-purple-300">thinkingLevel: ThinkingLevel.HIGH</code> without setting maxOutputTokens. Ideal for complex financial underwriting, creative seller finance structures, and multi-clause contract risk analysis.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Enter Complex Deal or Risk Underwriting Query:</label>
                <textarea
                  rows={4}
                  value={thinkingPrompt}
                  onChange={(e) => setThinkingPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleRunDeepAnalysis}
                disabled={isThinkingLoading || !thinkingPrompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                {isThinkingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                <span>{isThinkingLoading ? 'Executing High Thinking Mode...' : 'Run Deep Reasoning Analysis'}</span>
              </button>

              {thinkingResult && (
                <div className="bg-slate-950 border border-purple-900/60 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-400 border-b border-slate-800 pb-2 font-bold">
                    <span>High Thinking Reasoning Output</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">ThinkingLevel.HIGH</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{thinkingResult}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOW LATENCY LITE */}
          {activeTab === 'fast' && (
            <div className="space-y-6">
              <div className="bg-amber-950/40 border border-amber-800/50 p-4 rounded-2xl flex items-start gap-3">
                <Zap className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <h3 className="font-bold text-white text-sm mb-1">Ultra Fast Responses with gemini-3.1-flash-lite</h3>
                  <p>
                    Engineered for sub-second, ultra-low-latency real estate objections and instant lead response automations.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Seller/Tenant Objection Statement:</label>
                <input
                  type="text"
                  value={fastInput}
                  onChange={(e) => setFastInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleRunFastResponse}
                disabled={isFastLoading || !fastInput.trim()}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                {isFastLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isFastLoading ? 'Generating Fast Response...' : 'Get Instant Low-Latency Response'}</span>
              </button>

              {fastReply && (
                <div className="bg-slate-950 border border-amber-800/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2 font-bold text-amber-400">
                    <span>Fast Response Output</span>
                    {fastLatency !== null && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                        Latency: {fastLatency} ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-100 font-medium">{fastReply}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIO TRANSCRIBE */}
          {activeTab === 'transcribe' && (
            <div className="space-y-6">
              <div className="bg-teal-950/40 border border-teal-800/50 p-4 rounded-2xl flex items-start gap-3">
                <Mic className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-200">
                  <h3 className="font-bold text-white text-sm mb-1">Microphone Audio Transcription with gemini-3.5-flash</h3>
                  <p>
                    Record spoken voice notes or tenant maintenance calls directly via your browser microphone. Gemini transcribes audio into crisp, accurate text.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/50 ring-4 ring-rose-500/30'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {isRecording ? '🎙️ Recording Voice... Click to Stop' : 'Click Mic to Start Voice Recording'}
                </span>
              </div>

              {isTranscribing && (
                <div className="flex items-center justify-center gap-2 text-xs text-teal-400 font-bold p-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transcribing audio with gemini-3.5-flash...</span>
                </div>
              )}

              {transcriptionResult && (
                <div className="bg-slate-950 border border-teal-800/60 rounded-xl p-5 space-y-2">
                  <div className="text-xs text-teal-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>Transcription Output</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <p className="text-xs text-slate-100 font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">{transcriptionResult}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GROUNDING */}
          {activeTab === 'grounding' && (
            <div className="space-y-6">
              <div className="bg-blue-950/40 border border-blue-800/50 p-4 rounded-2xl flex items-start gap-3">
                <Search className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200">
                  <h3 className="font-bold text-white text-sm mb-1">Google Search & Maps Grounding with gemini-3.5-flash</h3>
                  <p>
                    Retrieve real-time web news, tax record updates, market comps with <code className="bg-blue-900/60 px-1 py-0.5 rounded">googleSearch</code> or location analytics with <code className="bg-blue-900/60 px-1 py-0.5 rounded">googleMaps</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGroundingMode('search')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    groundingMode === 'search' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Google Search Grounding</span>
                </button>

                <button
                  onClick={() => setGroundingMode('maps')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    groundingMode === 'maps' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Google Maps Grounding</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  {groundingMode === 'search' ? 'Enter Market Search Query:' : 'Enter Property Address or City Query:'}
                </label>
                <input
                  type="text"
                  value={groundingQuery}
                  onChange={(e) => setGroundingQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleRunGrounding}
                disabled={isGroundingLoading || !groundingQuery.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                {isGroundingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isGroundingLoading ? 'Fetching Grounded Data...' : 'Run Grounded Intelligence Search'}</span>
              </button>

              {groundingText && (
                <div className="bg-slate-950 border border-blue-800/60 rounded-xl p-5 space-y-4">
                  <div className="text-xs text-blue-400 font-bold border-b border-slate-800 pb-2">
                    Grounded Result ({groundingMode === 'search' ? 'Google Search' : 'Google Maps'})
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{groundingText}</p>

                  {groundingSources.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 block">Extracted Grounding Citations:</span>
                      <div className="flex flex-wrap gap-2">
                        {groundingSources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800/60 text-[11px] hover:bg-blue-900 transition-colors"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: LIVE VOICE API */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <div className="bg-rose-950/40 border border-rose-800/50 p-4 rounded-2xl flex items-start gap-3">
                <Radio className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-200">
                  <h3 className="font-bold text-white text-sm mb-1">Live Voice API with gemini-3.1-flash-live-preview</h3>
                  <p>
                    Low-latency, real-time voice conversations powered by Gemini Live API streaming via WebSocket (<code className="font-mono bg-rose-900/60 px-1 py-0.5 rounded">/live</code>).
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <button
                  onClick={toggleLiveSession}
                  className={`px-8 py-4 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-xl transition-all ${
                    isLiveActive
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <Radio className={`w-5 h-5 ${isLiveActive ? 'animate-bounce' : ''}`} />
                  <span>{isLiveActive ? 'Disconnect Live Voice API Session' : 'Connect to Gemini Live API Session'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 h-48 overflow-y-auto font-mono text-[11px]">
                <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 text-xs">Live API Stream Log</div>
                {liveLog.length === 0 && (
                  <span className="text-slate-600">Click connect to initialize WebSocket audio stream...</span>
                )}
                {liveLog.map((log, i) => (
                  <div key={i} className="text-rose-300">{log}</div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
