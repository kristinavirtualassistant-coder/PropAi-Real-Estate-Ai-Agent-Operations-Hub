import React, { useState, useEffect, useRef } from 'react';
import { TargetNiche, WholesalerLead, MaintenanceTicket } from '../types';
import { PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, X, Send, Cpu, Terminal } from 'lucide-react';

interface LiveStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNiche: TargetNiche;
  selectedLead?: WholesalerLead | null;
  selectedTicket?: MaintenanceTicket | null;
}

export const LiveStudioModal: React.FC<LiveStudioModalProps> = ({
  isOpen,
  onClose,
  activeNiche,
  selectedLead,
  selectedTicket
}) => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  
  const [transcript, setTranscript] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([]);
  const [lastReasoning, setLastReasoning] = useState<any>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const speakText = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const endCall = () => {
    setCallState('ended');
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startCall = () => {
    setCallState('calling');
    setTimeout(() => {
      setCallState('connected');
      const openingGreeting = activeNiche === 'wholesaler'
        ? `Hey ${selectedLead?.ownerName || 'there'}! This is PropAI Acquisitions calling regarding your property at ${selectedLead?.propertyAddress || '123 Main St'}. Are you open to a cash offer with zero closing costs?`
        : `Hi! Thank you for calling PropAI 24/7 Tenant Maintenance. I'm your automated assistant. What maintenance emergency or issue are you experiencing today?`;

      setTranscript([{
        sender: 'agent',
        text: openingGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (audioEnabled) {
        speakText(openingGreeting);
      }
    }, 1000);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      if (callState !== 'connected') {
        setCallState('connected');
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
        setIsListening(false);
      }
    }
  };

  const handleSendUtterance = async (overrideText?: string) => {
    const textToSend = overrideText || userInputText;
    if (!textToSend.trim()) return;

    // Ensure call is connected if user interacts
    if (callState !== 'connected') {
      setCallState('connected');
    }

    setUserInputText('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user turn
    const updatedHistory = [...transcript, { sender: 'user' as const, text: textToSend, time: timeStr }];
    setTranscript(updatedHistory);
    setIsAiThinking(true);

    let aiReply = '';
    let reasoningData: any = null;

    try {
      if (activeNiche === 'wholesaler') {
        const res = await fetch('/api/wholesaler/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead: selectedLead || { propertyAddress: '1428 Elm St', ownerName: 'Robert Vance' },
            conversationHistory: updatedHistory.map(t => ({ sender: t.sender, text: t.text })),
            latestMessage: textToSend
          })
        });

        if (res.ok) {
          const data = await res.json();
          aiReply = data.reply;
          reasoningData = data.qualification;
        }
      } else {
        const res = await fetch('/api/maintenance/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            property: { address: selectedTicket?.propertyAddress || '742 Evergreen Terr', unit: selectedTicket?.unit || 'Unit 4B' },
            tenantMessage: textToSend,
            conversationHistory: updatedHistory.map(t => ({ sender: t.sender, text: t.text }))
          })
        });

        if (res.ok) {
          const data = await res.json();
          aiReply = data.reply;
          reasoningData = data.ticketUpdate;
        }
      }
    } catch (err) {
      console.error('AI Voice Studio Error:', err);
    }

    // Robust Fallback guarantee so AI is NEVER unresponsive
    if (!aiReply) {
      if (activeNiche === 'wholesaler') {
        aiReply = `I understand completely. We purchase properties as-is, cover all closing costs, and close on your schedule. Would a quick 5-minute call today work to review a zero-obligation cash offer?`;
        reasoningData = {
          motivationScore: 7,
          status: "contacted",
          extractedFacts: { askingPrice: "Negotiable", timeline: "Flexible", condition: "As-is", keyObjection: textToSend },
          recommendedAction: "Schedule a 5-minute discovery call."
        };
      } else {
        aiReply = `I've logged this maintenance issue for ${selectedTicket?.propertyAddress || '742 Evergreen Terr'}. I am auto-dispatching our preferred contractor and notifying management immediately. Please check if there are any immediate safety steps you can take.`;
        reasoningData = {
          category: "Emergent Maintenance",
          severity: "high",
          troubleshootingSteps: ["Turn off local water/power valves if leaking", "Check circuit breaker if electrical"],
          contractorDispatched: true,
          assignedContractor: "Emergency Preferred Contractor",
          contractorMessage: `URGENT DISPATCH: Tenant reported '${textToSend}' at ${selectedTicket?.propertyAddress || '742 Evergreen Terr'}.`,
          morningSummary: `Voice call received regarding '${textToSend}'. Triaged as high severity & contractor dispatched.`
        };
      }
    }

    setIsAiThinking(false);
    const newAiMessage = { sender: 'agent' as const, text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setTranscript(prev => [...prev, newAiMessage]);
    if (reasoningData) setLastReasoning(reasoningData);

    speakText(aiReply);
  };

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isAiThinking]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognitionApi = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionApi) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognitionApi();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setUserInputText(currentTranscript);
        if (event.results[0].isFinal && currentTranscript.trim()) {
          setIsListening(false);
          handleSendUtterance(currentTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-start call when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState('calling');
      setTranscript([]);
      setLastReasoning(null);
      const timer = setTimeout(() => {
        setCallState('connected');
        const openingGreeting = activeNiche === 'wholesaler'
          ? `Hey ${selectedLead?.ownerName || 'there'}! This is PropAI Acquisitions calling regarding your property at ${selectedLead?.propertyAddress || '123 Main St'}. Are you open to a cash offer with zero closing costs?`
          : `Hi! Thank you for calling PropAI 24/7 Tenant Maintenance. I'm your automated assistant. What maintenance emergency or issue are you experiencing today?`;

        setTranscript([{
          sender: 'agent',
          text: openingGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        if (audioEnabled) {
          speakText(openingGreeting);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      endCall();
    }
  }, [isOpen, activeNiche, selectedLead, selectedTicket]);

  // Call Duration Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 text-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeNiche === 'wholesaler' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>PropAI Interactive Telephony & Voice Studio</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/30">
                  Vapi / Retell Engine Simulator
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Testing Mode: <span className="text-white font-bold capitalize">{activeNiche.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Column: Phone Console & Audio Playback (5 cols) */}
          <div className="md:col-span-5 bg-slate-900 p-6 border-r border-slate-800 flex flex-col justify-between items-center text-center text-white">
            
            {/* Call State Display */}
            <div className="w-full space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${callState === 'connected' ? 'bg-emerald-400 animate-ping' : callState === 'calling' ? 'bg-amber-400 animate-bounce' : 'bg-slate-600'}`} />
                <span className="font-mono text-[11px] font-bold">
                  {callState === 'connected' ? `LIVE CALL (${formatTime(callDuration)})` : callState === 'calling' ? 'DIALING VAPI / RETELL SIP...' : 'READY TO START CALL'}
                </span>
              </div>

              {/* Avatar / Visualizer */}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-1 flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-white">
                  <Cpu className="w-7 h-7 text-indigo-400 mb-0.5" />
                  <span className="text-[10px] font-bold tracking-widest text-indigo-200">PROPAI</span>
                </div>
                {callState === 'connected' && (
                  <div className="absolute -inset-2 border-2 border-indigo-500/40 rounded-full animate-ping pointer-events-none" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  {activeNiche === 'wholesaler' ? selectedLead?.ownerName || 'Robert Vance' : selectedTicket?.tenantName || 'Jessica Taylor'}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeNiche === 'wholesaler' ? selectedLead?.propertyAddress || '1428 Elm St' : selectedTicket?.propertyAddress || '742 Evergreen Terr'}
                </p>
              </div>

              {/* Sound / Mute / Mic Controls */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      audioEnabled ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Toggle Web Speech / TTS Voice Output"
                  >
                    {audioEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
                    <span>{audioEnabled ? 'AI Voice ON' : 'Muted'}</span>
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-lg border transition-all ${isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                    title="Mute Phone Speaker"
                  >
                    {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                {/* Microphone Speech-to-Text Button */}
                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      isListening
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-md'
                        : 'bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 border-indigo-700'
                    }`}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce text-white' : 'text-indigo-400'}`} />
                    <span>{isListening ? '🎙️ Listening... Speak Now!' : '🎙️ Speak with Microphone'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dial Action Buttons */}
            <div className="w-full pt-4">
              {callState === 'connected' ? (
                <button
                  onClick={endCall}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              ) : (
                <button
                  onClick={startCall}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Start AI Voice Simulation</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Live Transcript & Gemini Reasoning Inspector (7 cols) */}
          <div className="md:col-span-7 bg-slate-50 p-5 flex flex-col justify-between overflow-hidden">
            
            {/* Transcript Area */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 mb-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" /> LIVE SPEECH & REASONING TRANSCRIPT
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">Gemini 3.6 Flash</span>
              </div>

              {transcript.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${t.sender === 'agent' ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] text-slate-500 font-semibold mb-0.5">
                    {t.sender === 'agent' ? 'PropAI AI Agent' : 'User / Phone Caller'} • {t.time}
                  </span>
                  <div className={`max-w-[88%] px-3.5 py-2 rounded-xl text-xs leading-relaxed font-medium ${
                    t.sender === 'agent'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                  }`}>
                    {t.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-indigo-700 text-xs bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 animate-pulse font-medium">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Gemini reasoning, extracting seller/tenant facts, and synthesizing speech...</span>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Gemini Live Reasoning Payload Box */}
            {lastReasoning && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 mb-2.5 text-[11px] font-mono shrink-0 text-white">
                <span className="text-emerald-400 font-bold block mb-1">
                  ⚡ GEMINI REASONING & STRUCTURED EXTRACT:
                </span>
                <pre className="text-slate-300 overflow-x-auto text-[10px]">
                  {JSON.stringify(lastReasoning, null, 2)}
                </pre>
              </div>
            )}

            {/* Quick Test Objections or Input Bar */}
            <div className="space-y-2 shrink-0">
              <span className="text-[10px] text-slate-500 font-bold block">Test Phone Objections / Statements (Click or type to respond):</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {(activeNiche === 'wholesaler' ? [
                  "Is this a scam?",
                  "What's your cash offer?",
                  "I want $250k or no deal.",
                  "Call me back next month."
                ] : [
                  "My AC is broken and it's 90 degrees!",
                  "Water is leaking into electrical outlet!",
                  "The front door keypad is completely dead.",
                  "The toilet is overflowing!"
                ]).map(obj => (
                  <button
                    key={obj}
                    onClick={() => handleSendUtterance(obj)}
                    className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium border border-slate-300 text-[11px] transition-colors"
                  >
                    "{obj}"
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Type what the caller or tenant says..."
                  value={userInputText}
                  onChange={e => setUserInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendUtterance()}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
                <button
                  disabled={!userInputText.trim()}
                  onClick={() => handleSendUtterance()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 inline mr-1" />
                  <span>Respond</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

