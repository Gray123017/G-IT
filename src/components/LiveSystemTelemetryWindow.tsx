import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Terminal, Cpu, Zap, Radio, X, 
  Minus, Maximize2, Minimize2, Trash2, Copy, Check, 
  RotateCw, Shield, Brain, Sparkles, Filter 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export interface TelemetryLogItem {
  id: string;
  type: 'BACKEND_API' | 'THOUGHT_PROCESS' | 'HERO_SUBSYSTEM' | 'VOICE_BUS' | 'SECURITY';
  title: string;
  detail: string;
  latencyMs?: number;
  statusCode?: number;
  modelUsed?: string;
  timestamp: string;
}

interface TelemetryWindowProps {
  logs: TelemetryLogItem[];
  onClearLogs: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const LiveSystemTelemetryWindow: React.FC<TelemetryWindowProps> = ({
  logs,
  onClearLogs,
  isOpen,
  onToggleOpen,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'THOUGHTS' | 'API' | 'HERO'>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [serverMemoryMb, setServerMemoryMb] = useState(38);
  const [serverUptime, setServerUptime] = useState(120);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Periodic heartbeat poll to server /api/telemetry
  useEffect(() => {
    const fetchServerTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (data.memoryUsageMb) setServerMemoryMb(data.memoryUsageMb);
          if (data.serverUptimeSec) setServerUptime(Math.round(data.serverUptimeSec));
        }
      } catch {}
    };

    fetchServerTelemetry();
    const interval = setInterval(fetchServerTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'THOUGHTS') return log.type === 'THOUGHT_PROCESS';
    if (activeFilter === 'API') return log.type === 'BACKEND_API';
    if (activeFilter === 'HERO') return log.type === 'HERO_SUBSYSTEM';
    return true;
  });

  const handleCopyLogs = () => {
    const formatted = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.type}] [${l.statusCode || 'N/A'}] ${l.title} - ${l.detail} (${
            l.latencyMs ? l.latencyMs + 'ms' : ''
          })`
      )
      .join('\n');
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestLog = logs[logs.length - 1];

  if (!isOpen) return null;

  // Minimized compact pill dock view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-2">
        <div
          onClick={() => {
            playSound.click();
            setIsMinimized(false);
          }}
          className="px-3.5 py-2 bg-[#05111c]/95 border border-emerald-400/80 hover:border-emerald-300 rounded-full shadow-[0_0_20px_rgba(0,255,170,0.3)] flex items-center gap-2.5 cursor-pointer backdrop-blur-md transition-all text-xs font-tech text-emerald-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider">LIVE TELEMETRY</span>
          <span className="text-emerald-400/60 font-mono">|</span>
          <span className="text-[11px] text-emerald-200">
            {latestLog ? `${latestLog.statusCode || 200} OK (${latestLog.latencyMs || 24}ms)` : 'IDLE'}
          </span>
          <Maximize2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        </div>
      </div>
    );
  }

  // Expanded Floating Diagnostic Window
  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-lg sm:max-w-xl h-[420px] bg-[#040e1b]/95 border border-emerald-500/40 rounded-xl shadow-[0_0_40px_rgba(0,255,170,0.2)] flex flex-col overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
      {/* Window Header */}
      <div className="p-3 bg-[#061625] border-b border-emerald-500/25 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div>
            <h4 className="text-xs font-display font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
              <span>LIVE SYSTEM TELEMETRY</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-tech">
                BACKEND &amp; THOUGHT STREAM
              </span>
            </h4>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1 text-emerald-400">
          <button
            onClick={() => {
              playSound.click();
              setIsMinimized(true);
            }}
            title="Minimize to Pill"
            className="p-1 hover:text-white hover:bg-emerald-950/60 rounded transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              playSound.click();
              onToggleOpen();
            }}
            title="Close Telemetry"
            className="p-1 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subsystem Metrics Bar */}
      <div className="px-3 py-1.5 bg-[#030913] border-b border-emerald-500/15 flex items-center justify-between text-[10px] font-tech text-emerald-400/80">
        <div className="flex items-center gap-3">
          <span>HEAP: <strong className="text-white">{serverMemoryMb} MB</strong></span>
          <span>•</span>
          <span>UPTIME: <strong className="text-white">{serverUptime}s</strong></span>
          <span>•</span>
          <span>LOGS: <strong className="text-emerald-300">{logs.length}</strong></span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
              autoScroll ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'text-emerald-400/50'
            }`}
          >
            {autoScroll ? 'AUTO-SCROLL ON' : 'PAUSED'}
          </button>
          <button
            onClick={handleCopyLogs}
            title="Copy all telemetry logs"
            className="p-1 text-emerald-400 hover:text-white"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            onClick={onClearLogs}
            title="Clear logs"
            className="p-1 text-emerald-400 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-1 bg-[#05111c] border-b border-emerald-500/15 flex items-center gap-1.5 text-[11px] font-tech overflow-x-auto scrollbar-none">
        <span className="text-emerald-400/60 uppercase text-[10px] pr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> View:
        </span>
        {(['ALL', 'THOUGHTS', 'API', 'HERO'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              playSound.click();
              setActiveFilter(filter);
            }}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap text-[10px] ${
              activeFilter === filter
                ? 'bg-emerald-500/30 border border-emerald-400 text-white font-bold'
                : 'text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            {filter === 'ALL'
              ? 'ALL STREAM'
              : filter === 'THOUGHTS'
              ? 'INTERNAL THOUGHTS'
              : filter === 'API'
              ? 'API NETWORK'
              : 'HERO MODELS'}
          </button>
        ))}
      </div>

      {/* Real-Time Log Output Terminal */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-3 overflow-y-auto space-y-2 font-tech text-xs bg-[#020710]/95 font-mono"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-emerald-500/40 text-xs">
            Awaiting backend actions or operator query...
          </div>
        ) : (
          filteredLogs.map((item) => {
            const isThought = item.type === 'THOUGHT_PROCESS';
            const isApi = item.type === 'BACKEND_API';
            const isHero = item.type === 'HERO_SUBSYSTEM';

            return (
              <div
                key={item.id}
                className={`p-2 rounded border transition-colors ${
                  isThought
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : isApi
                    ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
                    : isHero
                    ? 'bg-purple-950/20 border-purple-500/30 text-purple-200'
                    : 'bg-[#061522] border-emerald-500/20 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5">
                  <span className="flex items-center gap-1.5">
                    {isThought ? (
                      <Brain className="w-3 h-3 text-amber-400" />
                    ) : isApi ? (
                      <Terminal className="w-3 h-3 text-cyan-400" />
                    ) : isHero ? (
                      <Sparkles className="w-3 h-3 text-purple-400" />
                    ) : (
                      <Zap className="w-3 h-3 text-emerald-400" />
                    )}
                    <span className="font-bold uppercase tracking-wider">{item.type}</span>
                    {item.statusCode && (
                      <span
                        className={`px-1 rounded text-[9px] font-bold ${
                          item.statusCode === 200
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-red-950 text-red-300'
                        }`}
                      >
                        HTTP {item.statusCode}
                      </span>
                    )}
                  </span>

                  <span className="flex items-center gap-2">
                    {item.latencyMs !== undefined && (
                      <span className="text-emerald-300 font-bold">{item.latencyMs}ms</span>
                    )}
                    <span>{item.timestamp}</span>
                  </span>
                </div>

                <div className="font-bold text-[11px] text-white tracking-wide">
                  {item.title}
                </div>
                <div className="text-[10px] opacity-85 leading-relaxed mt-0.5 whitespace-pre-wrap">
                  {item.detail}
                </div>

                {item.modelUsed && (
                  <div className="mt-1 pt-1 border-t border-white/10 text-[9px] text-emerald-400/80">
                    Engine: <span className="text-white font-bold">{item.modelUsed}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer Ticker */}
      <div className="px-3 py-1.5 bg-[#040e1b] border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-tech text-emerald-400/70">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          G-IT LIVE BUS STREAMING NOMINAL
        </span>
        <button
          onClick={() => {
            playSound.click();
            // Trigger quick test ping
            fetch('/api/telemetry');
          }}
          className="text-emerald-300 hover:text-white flex items-center gap-1"
        >
          <RotateCw className="w-3 h-3" /> Ping Server
        </button>
      </div>
    </div>
  );
};
