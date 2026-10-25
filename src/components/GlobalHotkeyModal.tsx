import React, { useState, useEffect } from 'react';
import { 
  Keyboard, X, Radio, Mic, Volume2, Sparkles, Check, 
  ExternalLink, Layers, Monitor, Sliders, ShieldCheck, Zap
} from 'lucide-react';
import { HotkeyTrigger, HotkeyMode } from '../hooks/useGlobalHotkey';
import { playSound } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

interface GlobalHotkeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotkey: HotkeyTrigger;
  onHotkeyChange: (key: HotkeyTrigger) => void;
  mode: HotkeyMode;
  onModeChange: (mode: HotkeyMode) => void;
  mediaSessionEnabled: boolean;
  onToggleMediaSession: (enabled: boolean) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isPipActive: boolean;
  onTogglePip: () => void;
  hotkeyFiredIndicator: string | null;
}

export const GlobalHotkeyModal: React.FC<GlobalHotkeyModalProps> = ({
  isOpen,
  onClose,
  hotkey,
  onHotkeyChange,
  mode,
  onModeChange,
  mediaSessionEnabled,
  onToggleMediaSession,
  isListening,
  onToggleListening,
  isPipActive,
  onTogglePip,
  hotkeyFiredIndicator,
}) => {
  const [testSuccess, setTestSuccess] = useState(false);

  useEffect(() => {
    if (hotkeyFiredIndicator) {
      setTestSuccess(true);
      const timer = setTimeout(() => setTestSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hotkeyFiredIndicator]);

  if (!isOpen) return null;

  const hotkeyOptions: { key: HotkeyTrigger; label: string; desc: string }[] = [
    {
      key: 'Space',
      label: 'Spacebar',
      desc: 'Standard sci-fi PTT. Active when not typing in text fields.',
    },
    {
      key: 'Ctrl+Space',
      label: 'Ctrl + Space / Cmd + Space',
      desc: 'Universal hotkey. Fires anywhere even inside input boxes.',
    },
    {
      key: 'Alt+V',
      label: 'Alt + V',
      desc: 'Dedicated Voice shortcut across the entire G-IT workstation.',
    },
    {
      key: 'Backquote',
      label: '` (Tilde / Backtick)',
      desc: 'Quake / developer console style hotkey trigger.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#05111c] border border-emerald-500/40 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-[0_0_50px_rgba(0,255,170,0.2)] space-y-5 relative overflow-hidden">
        {/* Holographic background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/25">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950 border border-emerald-400/50 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(0,255,170,0.3)]">
              <Keyboard className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Global Hotkey &amp; Background Listener
              </h2>
              <span className="text-xs font-tech text-emerald-400/80">
                ZERO-LATENCY DESKTOP VOICE TRIGGERING
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#061421] border border-emerald-500/30 text-emerald-400 hover:text-white hover:border-emerald-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Test Feedback Banner */}
        <div
          className={`p-3 rounded-xl border transition-all text-xs font-tech flex items-center justify-between ${
            testSuccess || hotkeyFiredIndicator
              ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-[0_0_20px_rgba(0,255,170,0.4)] animate-pulse'
              : 'bg-[#030914] border-emerald-500/20 text-emerald-300/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${testSuccess || isListening ? 'text-emerald-400 animate-spin' : 'text-emerald-500/50'}`} />
            <span>
              {testSuccess || hotkeyFiredIndicator
                ? `INTERCEPTED: ${hotkeyFiredIndicator || hotkey} (Microphone Activated!)`
                : `Test Mode: Press [${hotkey}] on your keyboard anytime.`}
            </span>
          </div>

          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">
            {isListening ? 'MIC ACTIVE' : 'STANDBY'}
          </span>
        </div>

        {/* 1. Hotkey Selection */}
        <div className="space-y-2">
          <label className="text-xs font-tech uppercase text-emerald-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> 1. Select Primary Hotkey Trigger:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hotkeyOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  playSound.click();
                  triggerHaptic('scanTick');
                  onHotkeyChange(opt.key);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  hotkey === opt.key
                    ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-[0_0_15px_rgba(0,255,170,0.25)]'
                    : 'bg-[#030914] border-emerald-500/20 hover:border-emerald-400/50 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">{opt.label}</span>
                  {hotkey === opt.key && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-emerald-400/70 font-sans leading-tight">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Hotkey Mode: Toggle vs Push-To-Talk */}
        <div className="space-y-2">
          <label className="text-xs font-tech uppercase text-emerald-400 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" /> 2. Voice Trigger Behavior:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-tech">
            <button
              onClick={() => {
                playSound.click();
                triggerHaptic('scanTick');
                onModeChange('toggle');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                mode === 'toggle'
                  ? 'bg-emerald-950/70 border-emerald-400 text-white font-bold shadow-[0_0_12px_rgba(0,255,170,0.25)]'
                  : 'bg-[#030914] border-emerald-500/20 text-emerald-300/70 hover:border-emerald-400/40'
              }`}
            >
              <span className="block text-white font-bold">Toggle Mode</span>
              <span className="text-[10px] text-emerald-400/70 block mt-0.5">Press to start, press again to stop</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                triggerHaptic('scanTick');
                onModeChange('push_to_talk');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                mode === 'push_to_talk'
                  ? 'bg-emerald-950/70 border-emerald-400 text-white font-bold shadow-[0_0_12px_rgba(0,255,170,0.25)]'
                  : 'bg-[#030914] border-emerald-500/20 text-emerald-300/70 hover:border-emerald-400/40'
              }`}
            >
              <span className="block text-white font-bold">Push-to-Talk (PTT)</span>
              <span className="text-[10px] text-emerald-400/70 block mt-0.5">Hold key to record, release to execute</span>
            </button>
          </div>
        </div>

        {/* 3. Background Multitasking & OS-Level Hooks */}
        <div className="space-y-2 pt-2 border-t border-emerald-500/20">
          <label className="text-xs font-tech uppercase text-emerald-400 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" /> 3. Background &amp; Other Apps Multitasking:
          </label>

          {/* OS Media Keys Hook */}
          <div className="p-3 bg-[#030a14] border border-emerald-500/25 rounded-xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold font-display text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> OS Media Keys Background Interceptor
              </span>
              <p className="text-[10px] text-emerald-300/70 font-sans">
                Uses the system MediaSession API to capture your keyboard&apos;s Play/Pause or headset button even when browsing other websites or in desktop apps.
              </p>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onToggleMediaSession(!mediaSessionEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg font-tech text-xs font-bold transition-all ${
                mediaSessionEnabled
                  ? 'bg-emerald-500/30 border border-emerald-400 text-white shadow-[0_0_10px_rgba(0,255,170,0.3)]'
                  : 'bg-[#061421] border border-emerald-500/25 text-emerald-400/60'
              }`}
            >
              {mediaSessionEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Picture-in-Picture Floating Desktop Mic */}
          <div className="p-3 bg-[#030a14] border border-emerald-500/25 rounded-xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold font-display text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> Always-on-Top Floating Desktop Mic (PiP)
              </span>
              <p className="text-[10px] text-emerald-300/70 font-sans">
                Pops out an OS-level floating window that remains pinned on top of VS Code, Terminal, and other PC windows.
              </p>
            </div>

            <button
              onClick={() => {
                playSound.jarvisActivate();
                onTogglePip();
              }}
              className={`px-3 py-1.5 rounded-lg font-tech text-xs font-bold transition-all flex items-center gap-1 ${
                isPipActive
                  ? 'bg-amber-500/30 border border-amber-400 text-white shadow-[0_0_10px_rgba(255,190,11,0.3)]'
                  : 'bg-[#061421] border border-amber-500/30 text-amber-300 hover:text-white'
              }`}
            >
              <span>{isPipActive ? 'CLOSE PIP' : 'LAUNCH PIP'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer & Dismiss */}
        <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
          <span className="text-[11px] font-tech text-emerald-400/70 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Config saved in workstation profile
          </span>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-tech text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(0,255,170,0.3)] transition-all"
          >
            Confirm &amp; Arm Hotkey
          </button>
        </div>
      </div>
    </div>
  );
};
