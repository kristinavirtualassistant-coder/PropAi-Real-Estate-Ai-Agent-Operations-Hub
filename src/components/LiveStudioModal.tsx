import React, { useState, useEffect } from 'react';
import { TargetNiche, WholesalerLead, MaintenanceTicket, BrandConfig } from '../types';
import { PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, X, Play, RefreshCw, Send, ShieldAlert, Flame, Cpu, Terminal } from 'lucide-react';

interface LiveStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNiche: TargetNiche;
  selectedLead?: WholesalerLead | null;
  selectedTicket?: MaintenanceTicket | null;
  brandConfig?: BrandConfig;
}

export const LiveStudioModal: React.FC<LiveStudioModalProps> = ({
  isOpen,
  onClose,
  activeNiche,
  selectedLead,
  selectedTicket,
  brandConfig
}) => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const companyName = brandConfig?.companyName || 'PropAI';
  const agentPhoneName = brandConfig?.agentPhoneName || `${companyName} AI Assistant`;
  const phoneDisplayNumber = brandConfig?.phoneDisplayNumber || '+1 (888) 593-PROP';
  
  const [transcript, setTranscript] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([]);
  const [lastReasoning, setLastReasoning] = useState<any>(null);

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

  if (!isOpen) return null;

  const startCall = () => {
    setCallState('calling');
    setTimeout(() => {
      setCallState('connected');
      // Opening AI greeting
      const openingGreeting = activeNiche === 'wholesaler'
        ? `Hey ${selectedLead?.ownerName || 'there'}! This is ${agentPhoneName} calling on behalf of ${companyName} regarding your property at ${selectedLead?.propertyAddress || '123 Main St'}. Are you open to a cash offer with zero closing costs?`
        : `Hi! Thank you for calling ${companyName} 24/7 Tenant Maintenance Line (${phoneDisplayNumber}). I'm your automated assistant. What maintenance issue are you experiencing today?`;

      setTranscript([{
        sender: 'agent',
        text: openingGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (audioEnabled && 'speechSynthesis' in window) {
        speakText(openingGreeting);
      }
    }, 1500);
  };

  const endCall = () => {
    setCallState('ended');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendUtterance = async (overrideText?: string) => {
    const textToSend = overrideText || userInputText;
    if (!textToSend.trim()) return;

    setUserInputText('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user turn
    const updatedHistory = [...transcript, { sender: 'user' as const, text: textToSend, time: timeStr }];
    setTranscript(updatedHistory);
    setIsAiThinking(true);

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
        const data = await res.json();
        setIsAiThinking(false);

        const aiReply = data.reply || "I completely understand. We buy as-is, close quickly, and cover all fees. Does a 10-minute call today work to go over details?";
        setTranscript(prev => [...prev, { sender: 'agent', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setLastReasoning(data.qualification);

        speakText(aiReply);
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
        const data = await res.json();
        setIsAiThinking(false);

        const aiReply = data.reply || "Thank you. I have logged this ticket and auto-dispatched our emergency contractor.";
        setTranscript(prev => [...prev, { sender: 'agent', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setLastReasoning(data.ticketUpdate);

        speakText(aiReply);
      }
    } catch (err) {
      setIsAiThinking(false);
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${activeNiche === 'wholesaler' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>PropAI Interactive Telephony & Voice Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200">
                  Vapi / Retell Engine Simulator
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Testing Mode: <span className="text-slate-900 font-bold capitalize">{activeNiche.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Column: Phone Console & Audio Playback (5 cols) */}
          <div className="md:col-span-5 bg-slate-50 p-6 border-r border-slate-200 flex flex-col justify-between items-center text-center">
            
            {/* Call State Display */}
            <div className="w-full space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${callState === 'connected' ? 'bg-emerald-500 animate-ping' : callState === 'calling' ? 'bg-amber-500 animate-bounce' : 'bg-slate-400'}`} />
                <span className="font-mono text-[11px] font-bold">
                  {callState === 'connected' ? `LIVE CALL (${formatTime(callDuration)})` : callState === 'calling' ? 'DIALING VAPI / RETELL SIP...' : 'READY TO START CALL'}
                </span>
              </div>

              {/* Avatar / Visualizer */}
              <div className="relative mx-auto w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-1 flex items-center justify-center shadow-md">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-slate-900">
                  <Cpu className="w-8 h-8 text-indigo-600 mb-1" />
                  <span className="text-[10px] font-extrabold tracking-widest text-indigo-900">PROPAI</span>
                </div>
                {callState === 'connected' && (
                  <div className="absolute -inset-2 border-2 border-indigo-400/60 rounded-full animate-ping pointer-events-none" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {activeNiche === 'wholesaler' ? selectedLead?.ownerName || 'Robert Vance' : selectedTicket?.tenantName || 'Jessica Taylor'}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {activeNiche === 'wholesaler' ? selectedLead?.propertyAddress || '1428 Elm St' : selectedTicket?.propertyAddress || '742 Evergreen Terr'}
                </p>
              </div>

              {/* Sound / Mute Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    audioEnabled ? 'bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                  title="Toggle Web Speech / TTS Voice Output"
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4" />}
                  <span>{audioEnabled ? 'Voice Output ON' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl border transition-all ${isMuted ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-white text-slate-700 border-slate-200'}`}
                >
                  {isMuted ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Dial Action Buttons */}
            <div className="w-full pt-6">
              {callState === 'connected' ? (
                <button
                  onClick={endCall}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              ) : (
                <button
                  onClick={startCall}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Start AI Voice Simulation</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Live Transcript & Gemini Reasoning Inspector (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Transcript Area */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 mb-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" /> LIVE SPEECH & REASONING TRANSCRIPT
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Gemini 3.6 Flash</span>
              </div>

              {transcript.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${t.sender === 'agent' ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] text-slate-500 mb-0.5 font-medium">
                    {t.sender === 'agent' ? 'PropAI AI Agent' : 'User / Phone Caller'} • {t.time}
                  </span>
                  <div className={`max-w-[88%] px-3.5 py-2 rounded-xl text-xs leading-relaxed font-medium ${
                    t.sender === 'agent'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {t.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-indigo-900 text-xs bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 animate-pulse font-bold">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Gemini reasoning, extracting seller/tenant facts, and synthesizing speech...</span>
                </div>
              )}
            </div>

            {/* Gemini Live Reasoning Payload Box */}
            {lastReasoning && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 text-[11px] font-mono shrink-0">
                <span className="text-emerald-700 font-bold block mb-1">
                  ⚡ GEMINI REASONING & STRUCTURED EXTRACT:
                </span>
                <pre className="text-slate-800 overflow-x-auto text-[10px] font-medium">
                  {JSON.stringify(lastReasoning, null, 2)}
                </pre>
              </div>
            )}

            {/* Quick Test Objections or Input Bar */}
            <div className="space-y-2 shrink-0">
              <span className="text-[10px] text-slate-500 font-bold block">Test Phone Objections (Click to speak as caller):</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {(activeNiche === 'wholesaler' ? [
                  "Is this a scam?",
                  "What's your cash offer?",
                  "I want $250k or no deal.",
                  "Call me back next month."
                ] : [
                  "My AC is broken and it's 90 degrees!",
                  "Water is leaking into electrical outlet!",
                  "The front door keypad is completely dead."
                ]).map(obj => (
                  <button
                    key={obj}
                    disabled={callState !== 'connected'}
                    onClick={() => handleSendUtterance(obj)}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 border border-slate-200 text-[11px] font-medium"
                  >
                    "{obj}"
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  disabled={callState !== 'connected'}
                  placeholder={callState === 'connected' ? "Speak into phone line..." : "Start call first to speak..."}
                  value={userInputText}
                  onChange={e => setUserInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendUtterance()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 disabled:opacity-50 font-medium"
                />
                <button
                  disabled={callState !== 'connected' || !userInputText.trim()}
                  onClick={() => handleSendUtterance()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
                >
                  Speak
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
