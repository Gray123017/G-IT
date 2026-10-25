import React, { useState, useEffect } from 'react';
import { 
  Shield, Brain, Volume2, VolumeX, User, Clock, 
  Radio, Sparkles, FolderKanban, Calendar, Workflow, Flame, Activity, Zap, Globe, Keyboard 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export type AppNavTab = 'voice_core' | 'hero_ai' | 'web_internet' | 'projects' | 'daily_hub' | 'architecture' | 'mcu_legacy';

interface HudHeaderProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  highThinking: boolean;
  onToggleHighThinking: () => void;
  userName: string;
  onUserNameChange: (name: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProtocolModal: () => void;
  onLockInterface: () => void;
  telemetryOpen: boolean;
  onToggleTelemetry: () => void;
  hotkey: string;
  onOpenHotkeyModal: () => void;
  hotkeyFiredIndicator?: string | null;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  activeTab,
  onTabChange,
  highThinking,
  onToggleHighThinking,
  userName,
  onUserNameChange,
  soundEnabled,
  onToggleSound,
  onOpenProtocolModal,
  onLockInterface,
  telemetryOpen,
  onToggleTelemetry,
  hotkey,
  onOpenHotkeyModal,
  hotkeyFiredIndicator,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [utcTimeStr, setUtcTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setUtcTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const callsignOptions = ['Commander Gray', 'Gray', 'Sir', 'Tony', 'Boss', 'Captain'];

  return (
    <header className="border-b border-emerald-500/30 bg-[#040913]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Telemetry Ticker */}
      <div className="px-4 py-1.5 bg-[#02060d] border-b border-emerald-500/15 flex flex-wrap items-center justify-between text-[11px] font-tech text-emerald-400/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            G-IT NEURAL CPU // WORKSTATION MAINFRAME v5.0
          </span>
          <span className="hidden sm:inline text-emerald-500/40">•</span>
          <span className="hidden sm:inline">ALL DESKTOP SUBSYSTEMS NOMINAL</span>
        </div>

        <div className="flex items-center gap-3 text-emerald-300">
          <button
            onClick={() => {
              playSound.click();
              onOpenHotkeyModal();
            }}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all cursor-pointer ${
              hotkeyFiredIndicator
                ? 'bg-emerald-500/30 text-white border border-emerald-400 animate-pulse'
                : 'hover:bg-emerald-950/60 text-emerald-300'
            }`}
            title="Configure Global Hotkeys & Background Listener"
          >
            <Keyboard className="w-3 h-3 text-emerald-400" />
            <span>HOTKEY: [{hotkey.toUpperCase()}] • OS BG: READY</span>
          </button>
          <span className="hidden md:inline text-emerald-500/40">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" /> LOCAL: {timeStr}
          </span>
          <span className="hidden md:inline text-emerald-500/40">|</span>
          <span className="hidden md:inline text-emerald-400/70">{utcTimeStr}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-emerald-950/70 border border-emerald-400/50 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(0,255,170,0.3)]">
            <Shield className="w-6 h-6 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black shadow-[0_0_8px_#34d399]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display tracking-wider text-white">
                G-IT
              </h1>
              <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400/40 text-emerald-300 uppercase">
                AI Voice Assistant CPU
              </span>
            </div>
            <p className="text-[11px] font-tech text-emerald-400/70">
              GENERAL INTELLIGENT TELEMETRY // WORKSTATION COMPANION
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#061421] border border-emerald-500/30 p-1 rounded-xl text-xs font-tech overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              playSound.click();
              onTabChange('voice_core');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'voice_core'
                ? 'bg-emerald-500/30 border border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,170,0.3)] font-bold'
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voice Cockpit</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onTabChange('hero_ai');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hero_ai'
                ? 'bg-gradient-to-r from-red-500/25 via-purple-500/25 to-blue-500/25 border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold'
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Spider &amp; Superman AI</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onTabChange('web_internet');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'web_internet'
                ? 'bg-cyan-500/30 border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold'
                : 'text-cyan-300/70 hover:text-cyan-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Web &amp; Social</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onTabChange('projects');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-emerald-500/30 border border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,170,0.3)] font-bold'
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-teal-400" />
            <span>PC Projects</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onTabChange('daily_hub');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'daily_hub'
                ? 'bg-emerald-500/30 border border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,170,0.3)] font-bold'
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily &amp; Focus</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onTabChange('architecture');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-emerald-500/30 border border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,170,0.3)] font-bold'
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-amber-400" />
            <span>G-IT Blueprint</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onTabChange('mcu_legacy');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mcu_legacy'
                ? 'bg-cyan-500/30 border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold'
                : 'text-cyan-300/70 hover:text-cyan-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>J.A.R.V.I.S. Legacy (28)</span>
          </button>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Global Hotkey Config Trigger */}
          <button
            onClick={() => {
              playSound.click();
              onOpenHotkeyModal();
            }}
            title={`Global Hotkey: [${hotkey}] - Click to configure or launch Desktop PiP`}
            className={`px-2.5 py-1.5 border rounded-lg text-xs font-tech flex items-center gap-1.5 transition-all ${
              hotkeyFiredIndicator
                ? 'bg-emerald-500/40 border-emerald-300 text-white shadow-[0_0_15px_rgba(0,255,170,0.5)] animate-pulse'
                : 'bg-[#061421] border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">[{hotkey}]</span>
          </button>

          {/* Quick Protocols Trigger */}
          <button
            onClick={() => {
              playSound.click();
              onOpenProtocolModal();
            }}
            title="Open G-IT Protocols & Macros"
            className="px-2.5 py-1.5 bg-[#061421] border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white rounded-lg text-xs font-tech flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Protocols</span>
          </button>

          {/* Callsign Selector */}
          <div className="flex items-center gap-1.5 bg-[#061421] border border-emerald-500/30 px-2 py-1.5 rounded-lg text-xs font-tech">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={userName}
              onChange={(e) => {
                playSound.click();
                onUserNameChange(e.target.value);
              }}
              className="bg-transparent text-emerald-200 outline-none cursor-pointer"
            >
              {callsignOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#061421] text-emerald-200">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* High Thinking Protocol Toggle */}
          <button
            onClick={() => {
              playSound.quantumThinking();
              onToggleHighThinking();
            }}
            title="Toggle Gemini 4 Argon with High Thinking"
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-tech ${
              highThinking
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,190,11,0.3)]'
                : 'bg-[#061421] border-emerald-500/30 text-emerald-400 hover:border-emerald-400'
            }`}
          >
            <Brain className={`w-4 h-4 ${highThinking ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className="hidden lg:inline">ARGON THINKING</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) playSound.click();
            }}
            title={soundEnabled ? 'HUD Audio Enabled' : 'HUD Audio Muted'}
            className="p-2 bg-[#061421] border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-emerald-500/50" />}
          </button>

          {/* Live System Telemetry Toggle */}
          <button
            onClick={() => {
              playSound.click();
              onToggleTelemetry();
            }}
            title={telemetryOpen ? 'Hide Live Telemetry Window' : 'Open Live Telemetry Floating Window'}
            className={`px-2.5 py-2 rounded-lg border text-xs font-tech flex items-center gap-1.5 transition-all ${
              telemetryOpen
                ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,170,0.3)]'
                : 'bg-[#061421] border-emerald-500/30 text-emerald-400 hover:border-emerald-400 hover:text-white'
            }`}
          >
            <Activity className={`w-4 h-4 ${telemetryOpen ? 'text-emerald-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className="hidden sm:inline">TELEMETRY</span>
          </button>

          {/* Biometric Terminal Lock Button */}
          <button
            onClick={() => {
              playSound.biometricScanHum();
              onLockInterface();
            }}
            title="Lock Terminal with Biometric Security"
            className="p-2 bg-[#061421] border border-amber-500/30 hover:border-amber-400 text-amber-400 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
