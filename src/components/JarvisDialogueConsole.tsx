import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, Sparkles, 
  Brain, RotateCcw, Copy, Check, Terminal, Cpu 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export interface ChatMessage {
  id: string;
  role: 'user' | 'jarvis';
  content: string;
  modelUsed?: string;
  highThinking?: boolean;
  sources?: { title: string; url: string }[];
  timestamp: string;
}

interface DialogueConsoleProps {
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  speechSupported: boolean;
  highThinking: boolean;
  onToggleHighThinking: () => void;
  onToggleListening: () => void;
  onSendMessage: (text: string) => void;
  onReplaySpeech: (text: string) => void;
  onStopSpeaking: () => void;
  userName: string;
}

export const JarvisDialogueConsole: React.FC<DialogueConsoleProps> = ({
  messages,
  isListening,
  isSpeaking,
  transcript,
  speechSupported,
  highThinking,
  onToggleHighThinking,
  onToggleListening,
  onSendMessage,
  onReplaySpeech,
  onStopSpeaking,
  userName,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Did you calculate for the icing problem at 85,000 feet?',
    'Run blood toxicity diagnostics on the palladium arc core.',
    'Deconstruct Howard Stark\'s 1974 Expo model to synthesize a new element.',
    'Initiate House Party Protocol. Authorize the Iron Legion.',
    'Calculate the trajectory to steer the nuclear missile into the wormhole.',
    'Explain your evolution from Stark mainframe AI into The Vision.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSpeaking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playSound.click();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#050d18]/95 border border-cyan-500/30 rounded-xl shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col h-[580px] sm:h-[640px] overflow-hidden">
      {/* Console Header */}
      <div className="p-3.5 sm:p-4 border-b border-cyan-500/25 bg-[#081525] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-950/70 border border-cyan-400/40 rounded-lg text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-white tracking-wider uppercase flex items-center gap-2">
              J.A.R.V.I.S. VOICE &amp; LOGIC MATRIX
            </h3>
            <span className="text-[10px] font-tech text-cyan-400/70 block">
              CALLSIGN: {userName.toUpperCase()} // MAINFRAME REASONING READY
            </span>
          </div>
        </div>

        {/* High Thinking Protocol Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound.quantumThinking();
              onToggleHighThinking();
            }}
            title="Toggle Gemini 4 Argon with High Thinking"
            className={`px-3 py-1.5 rounded-lg border text-xs font-tech transition-all flex items-center gap-1.5 ${
              highThinking
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,190,11,0.3)]'
                : 'bg-[#091729] border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:text-cyan-200'
            }`}
          >
            <Brain className={`w-3.5 h-3.5 ${highThinking ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} />
            <span>ARGON HIGH THINKING</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                highThinking ? 'bg-amber-400 text-black' : 'bg-cyan-900 text-cyan-300'
              }`}
            >
              {highThinking ? 'ON' : 'AUTO'}
            </span>
          </button>

          {isSpeaking && (
            <button
              onClick={() => {
                playSound.click();
                onStopSpeaking();
              }}
              title="Mute JARVIS Speech"
              className="p-1.5 bg-red-950/60 border border-red-500/40 text-red-300 rounded-lg hover:bg-red-900 transition-colors"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1 text-[10px] font-tech uppercase text-cyan-400/70">
              <span>{msg.role === 'user' ? userName : 'J.A.R.V.I.S.'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.modelUsed && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono">
                  {msg.modelUsed}
                </span>
              )}
            </div>

            <div
              className={`max-w-[88%] sm:max-w-[82%] rounded-xl p-3.5 sm:p-4 border ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/80 border-cyan-500/40 text-cyan-100 rounded-tr-none'
                  : 'bg-[#081525]/90 border-cyan-500/30 text-cyan-50 rounded-tl-none shadow-[0_0_20px_rgba(0,240,255,0.06)]'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Grounded Web Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-cyan-500/20 space-y-1">
                  <span className="text-[10px] font-tech text-cyan-400 uppercase tracking-wider block">
                    Grounded Web Sources:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-400/30 hover:border-cyan-400 text-cyan-300 rounded text-[10px] font-mono transition-colors truncate max-w-[200px]"
                      >
                        {src.title || src.url} &rarr;
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Footer with Play and Copy */}
              {msg.role === 'jarvis' && (
                <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-cyan-500/15 text-[11px] font-tech text-cyan-400/80">
                  <button
                    onClick={() => onReplaySpeech(msg.content)}
                    className="hover:text-cyan-200 transition-colors flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Vocalize
                  </button>

                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-cyan-200 transition-colors flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Log
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Mic Listening Preview */}
        {isListening && (
          <div className="p-3 bg-cyan-950/60 border border-cyan-400 rounded-lg flex items-center gap-3 animate-pulse">
            <Mic className="w-4 h-4 text-cyan-300 animate-bounce" />
            <div className="text-xs font-tech text-cyan-200">
              <span className="font-bold text-cyan-400">ACOUSTIC SENSORS ACTIVE: </span>
              {transcript || 'Listening for commands, sir...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-[#061120] border-t border-cyan-500/20 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[10px] font-tech uppercase text-cyan-400/60 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              playSound.click();
              onSendMessage(prompt);
            }}
            className="px-2.5 py-1 bg-[#091829] hover:bg-cyan-950/80 border border-cyan-500/25 hover:border-cyan-400 text-[11px] font-sans text-cyan-200 rounded whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-[#081525] border-t border-cyan-500/30 flex items-center gap-2 sm:gap-3"
      >
        {/* Voice Input Button */}
        {speechSupported ? (
          <button
            type="button"
            onClick={() => {
              playSound.jarvisActivate();
              onToggleListening();
            }}
            className={`p-2.5 sm:p-3 rounded-lg border transition-all flex items-center justify-center flex-shrink-0 ${
              isListening
                ? 'bg-red-600/90 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                : 'bg-cyan-950/70 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:bg-cyan-900/60'
            }`}
            title={isListening ? 'Click to stop listening' : 'Speak to J.A.R.V.I.S.'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        ) : (
          <div title="Web Speech API not supported in this browser" className="text-cyan-500/50 p-2">
            <MicOff className="w-4 h-4" />
          </div>
        )}

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Give an order, ask about Mark series armor, or simulate a scenario, ${userName}...`}
          className="flex-1 bg-[#06101c] border border-cyan-500/30 focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-cyan-100 placeholder:text-cyan-500/50 outline-none transition-colors"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 sm:p-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-40 disabled:pointer-events-none text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-4 h-4 fill-black" />
        </button>
      </form>
    </div>
  );
};
