import React, { useState, useEffect, useCallback } from 'react';
import { HudHeader, AppNavTab } from './components/HudHeader';
import { GitQuantumCoreCanvas } from './components/GitQuantumCoreCanvas';
import { ArcReactorCanvas } from './components/ArcReactorCanvas';
import { JarvisDialogueConsole, ChatMessage } from './components/JarvisDialogueConsole';
import { ProjectCommandCenter } from './components/ProjectCommandCenter';
import { DailyActivityHub } from './components/DailyActivityHub';
import { GitArchitectureBlueprint } from './components/GitArchitectureBlueprint';
import { GitProtocolRunnerModal } from './components/GitProtocolRunnerModal';
import { CapabilityMatrixList } from './components/CapabilityMatrixList';
import { SuitDiagnosticsPanel } from './components/SuitDiagnosticsPanel';
import { ElementSynthesizerLab } from './components/ElementSynthesizerLab';
import { CapabilitySimulationModal } from './components/CapabilitySimulationModal';
import { BiometricFaceScanAuth } from './components/BiometricFaceScanAuth';
import { LiveSystemTelemetryWindow, TelemetryLogItem } from './components/LiveSystemTelemetryWindow';
import { HeroAiIntegratorTab } from './components/HeroAiIntegratorTab';
import { WebInternetOmniboxTab } from './components/WebInternetOmniboxTab';
import { JARVIS_CAPABILITIES, JarvisCapability } from './data/jarvisCapabilities';
import { INITIAL_PROJECTS, INITIAL_SCHEDULE, PcProject, DailyActivity } from './data/gitProjects';
import { useJarvisVoice } from './hooks/useJarvisVoice';
import { useGlobalHotkey } from './hooks/useGlobalHotkey';
import { GlobalHotkeyModal } from './components/GlobalHotkeyModal';
import { playSound } from './utils/soundEffects';
import { Shield, Radio, Activity, Cpu, Sparkles, FolderKanban, Calendar, Workflow, Flame, Zap, Keyboard } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppNavTab>('voice_core');
  const [highThinking, setHighThinking] = useState(false);
  const [userName, setUserName] = useState('Commander Gray');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Telemetry Floating Window State
  const [telemetryOpen, setTelemetryOpen] = useState(true);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLogItem[]>([
    {
      id: 'log-boot-1',
      type: 'SECURITY',
      title: 'Biometric Face-Scan Gatekeeper Armed',
      detail: 'Facial contour mesh verified. Operator: Commander Gray.',
      statusCode: 200,
      timestamp: '00:00:01',
    },
    {
      id: 'log-boot-2',
      type: 'HERO_SUBSYSTEM',
      title: 'Integrated Spider-Man Models (K.A.R.E.N. & E.D.I.T.H.)',
      detail: '576 Web combos, acoustic recon & orbital satellite drone mesh active.',
      statusCode: 200,
      timestamp: '00:00:02',
    },
    {
      id: 'log-boot-3',
      type: 'HERO_SUBSYSTEM',
      title: 'Integrated Superman Models (JOR-EL & KELEX)',
      detail: 'Genesis Codex archive, solar radiation bio-capacitors & cosmic translation bus online.',
      statusCode: 200,
      timestamp: '00:00:03',
    },
    {
      id: 'log-boot-4',
      type: 'THOUGHT_PROCESS',
      title: 'G-IT Deliberative Reasoning Engine Calibrated',
      detail: 'Gemini 4 Argon with ThinkingLevel.HIGH ready for multi-step STEM & code architecture.',
      modelUsed: 'gemini-4-argon',
      timestamp: '00:00:04',
    },
  ]);

  // G-IT Projects & Schedule data state
  const [projects, setProjects] = useState<PcProject[]>(INITIAL_PROJECTS);
  const [schedule, setSchedule] = useState<DailyActivity[]>(INITIAL_SCHEDULE);

  // Modals
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [selectedMcuSimulation, setSelectedMcuSimulation] = useState<JarvisCapability | null>(null);

  // Initial G-IT Welcome Message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'git-welcome-1',
      role: 'jarvis',
      content:
        'Greetings, Commander Gray. G-IT (General Intelligent Telemetry) sovereign CPU is online and calibrated for your workstation. All local PC project pipelines, daily focus agendas, and Gemini 4 Argon high-thinking subroutines are fully synchronized. Which project or task shall we command today?',
      modelUsed: 'gemini-3.8-flash',
      timestamp: 'ONLINE',
    },
  ]);

  // Voice recognition transcription handler
  const handleTranscriptFinal = useCallback((finalText: string) => {
    if (!finalText.trim()) return;
    sendMessage(finalText.trim());
  }, []);

  const {
    isListening,
    isSpeaking,
    transcript,
    audioFrequency,
    speechSupported,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
  } = useJarvisVoice({
    voiceName: 'Fenrir',
    onTranscriptFinal: handleTranscriptFinal,
  });

  // Global Hotkey & Desktop Multitasking Hook
  const [showHotkeyModal, setShowHotkeyModal] = useState(false);
  const {
    hotkey,
    setHotkey,
    mode: hotkeyMode,
    setMode: setHotkeyMode,
    mediaSessionEnabled,
    setMediaSessionEnabled,
    hotkeyFiredIndicator,
    isPipActive,
    toggleDocumentPip,
  } = useGlobalHotkey({
    isListening,
    onToggleListening: toggleListening,
    onStartListening: startListening,
    onStopListening: stopListening,
    enabled: isAuthenticated,
  });

  // Play initial startup chime
  useEffect(() => {
    playSound.jarvisActivate();
  }, []);

  // Send query to full-stack Gemini server
  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check if query is complex STEM/engineering or highThinking
    const isComplex =
      highThinking ||
      /calculate|simulate|physics|lattice|quantum|trajectory|element|algorithm|vector|reactor|fusion|equation|architect|refactor|benchmark/i.test(
        prompt
      );

    if (isComplex && soundEnabled) {
      playSound.quantumThinking();
    }

    const reqTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Log initial deliberation thought process
    setTelemetryLogs((prev) => [
      ...prev,
      {
        id: `thought-${Date.now()}`,
        type: 'THOUGHT_PROCESS',
        title: isComplex ? 'Deep Deliberation Engaged (Gemini 4 Argon)' : 'Neural Intent Categorization',
        detail: `Deconstructing query: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}" for ${userName}. ThinkingLevel: ${isComplex ? 'HIGH' : 'STANDARD'}.`,
        modelUsed: isComplex ? 'gemini-4-argon' : 'gemini-3.8-flash',
        timestamp: reqTimestamp,
      },
    ]);

    const reqStartTime = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: messages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          highThinking: isComplex,
          userName,
        }),
      });

      const latency = Date.now() - reqStartTime;

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `git-${Date.now()}`,
        role: 'jarvis',
        content: data.text || 'Command executed, Commander.',
        modelUsed: data.modelUsed,
        highThinking: data.highThinking,
        sources: data.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Log successful backend API status
      setTelemetryLogs((prev) => [
        ...prev,
        {
          id: `api-${Date.now()}`,
          type: 'BACKEND_API',
          title: `POST /api/chat - HTTP 200 OK (${latency}ms)`,
          detail: `Model: ${data.modelUsed}. Payload: ${prompt.length} in / ${data.text?.length || 0} out chars.`,
          latencyMs: latency,
          statusCode: 200,
          modelUsed: data.modelUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);

      // If backend returned explicit thinking steps, log them
      if (data.telemetry?.thinkingSteps) {
        data.telemetry.thinkingSteps.forEach((step: string, i: number) => {
          setTelemetryLogs((prev) => [
            ...prev,
            {
              id: `step-${Date.now()}-${i}`,
              type: 'THOUGHT_PROCESS',
              title: `Reasoning Step ${i + 1}/${data.telemetry.thinkingSteps.length}`,
              detail: step,
              modelUsed: data.modelUsed,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            },
          ]);
        });
      }

      // Vocalize response
      if (data.text) {
        speak(data.text);
      }
    } catch (err: any) {
      const latency = Date.now() - reqStartTime;
      console.error('Chat error:', err);

      setTelemetryLogs((prev) => [
        ...prev,
        {
          id: `api-err-${Date.now()}`,
          type: 'BACKEND_API',
          title: 'POST /api/chat - HTTP 500 Network Anomaly',
          detail: `Error: ${err.message}. Engaging local workstation fallback subroutines.`,
          latencyMs: latency,
          statusCode: 500,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);

      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'jarvis',
        content: `I apologize, ${userName}. A transient network anomaly occurred in our telemetry stream. Local workstation backup subroutines are standing by. How shall we proceed?`,
        modelUsed: 'G-IT Local Mainframe',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speak(fallbackMsg.content);
    }
  };

  const handleReplaySpeech = (text: string) => {
    playSound.click();
    speak(text);
  };

  const handleConsultFromOtherTab = (prompt: string) => {
    setActiveTab('voice_core');
    sendMessage(prompt);
  };

  const handleSimulateHeroAction = (title: string, details: string) => {
    setTelemetryLogs((prev) => [
      ...prev,
      {
        id: `hero-${Date.now()}`,
        type: 'HERO_SUBSYSTEM',
        title,
        detail: details,
        statusCode: 200,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#030813] text-emerald-100 flex flex-col font-sans hud-grid relative selection:bg-emerald-500/30 selection:text-white">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines z-10 opacity-50" />

      {/* Biometric Face-Scan Auth Gatekeeper (Locked at app startup) */}
      {!isAuthenticated && (
        <BiometricFaceScanAuth
          userName={userName}
          onAuthenticated={() => {
            setIsAuthenticated(true);
          }}
          onSpeakGreeting={(text) => speak(text)}
        />
      )}

      {/* Main HUD Header */}
      <HudHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        highThinking={highThinking}
        onToggleHighThinking={() => setHighThinking(!highThinking)}
        userName={userName}
        onUserNameChange={setUserName}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenProtocolModal={() => setShowProtocolModal(true)}
        onLockInterface={() => {
          setIsAuthenticated(false);
          playSound.biometricScanHum();
        }}
        telemetryOpen={telemetryOpen}
        onToggleTelemetry={() => setTelemetryOpen(!telemetryOpen)}
        hotkey={hotkey}
        onOpenHotkeyModal={() => setShowHotkeyModal(true)}
        hotkeyFiredIndicator={hotkeyFiredIndicator}
      />

      {/* Global Hotkey Visual Notification Toast */}
      {hotkeyFiredIndicator && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-950/95 border border-emerald-400 rounded-xl shadow-[0_0_30px_rgba(0,255,170,0.5)] flex items-center gap-2.5 text-xs font-tech text-white animate-bounce">
          <Keyboard className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>GLOBAL HOTKEY TRIGGERED: {hotkeyFiredIndicator}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 z-20">
        {/* TAB 1: G-IT Voice Cockpit & Neural Core */}
        {activeTab === 'voice_core' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: G-IT Quantum Nexus Core */}
            <div className="lg:col-span-5 space-y-5 flex flex-col items-center">
              <div className="w-full bg-[#05111c]/95 border border-emerald-500/35 rounded-xl p-5 shadow-[0_0_40px_rgba(0,255,170,0.12)] flex flex-col items-center relative overflow-hidden">
                {/* Tech corner markings */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

                <div className="flex items-center justify-between w-full pb-2 border-b border-emerald-500/20 text-xs font-tech text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> G-IT QUANTUM NEXUS
                  </span>
                  <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    {isSpeaking
                      ? 'VOCALIZING'
                      : isListening
                      ? 'ACOUSTIC SENSING'
                      : highThinking
                      ? 'ARGON HIGH THINKING'
                      : 'STANDBY READY'}
                  </span>
                </div>

                {/* G-IT Quantum Core Canvas */}
                <GitQuantumCoreCanvas
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  thinkingMode={highThinking}
                  audioFrequency={audioFrequency}
                  colorScheme={highThinking ? 'amber' : 'emerald'}
                  onClick={() => {
                    playSound.quantumThinking();
                    sendMessage(`G-IT, run a full workstation telemetry and project readiness diagnostic for ${userName}.`);
                  }}
                />

                {/* Telemetry stats */}
                <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-emerald-500/20 text-center font-tech">
                  <div className="p-2 bg-[#061824] rounded border border-emerald-500/15">
                    <span className="text-[10px] text-emerald-400/70 block uppercase">Active Projects</span>
                    <span className="text-sm font-bold text-white">{projects.length} Online</span>
                  </div>
                  <div className="p-2 bg-[#061824] rounded border border-emerald-500/15">
                    <span className="text-[10px] text-emerald-400/70 block uppercase">Acoustic Freq</span>
                    <span className="text-sm font-bold text-emerald-300">
                      {(audioFrequency * 100 + 432).toFixed(0)} Hz
                    </span>
                  </div>
                  <div className="p-2 bg-[#061824] rounded border border-emerald-500/15">
                    <span className="text-[10px] text-emerald-400/70 block uppercase">Cognitive Engine</span>
                    <span className={`text-sm font-bold ${highThinking ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {highThinking ? 'ARGON HIGH' : 'FLASH'}
                    </span>
                  </div>
                </div>

                {/* Voice button trigger */}
                <div className="w-full mt-4 flex items-center justify-center">
                  <button
                    onClick={() => {
                      playSound.jarvisActivate();
                      toggleListening();
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-tech text-xs tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-[0_0_25px_rgba(0,255,170,0.35)]'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>
                      {isListening
                        ? 'Acoustic Sensors Active — Click to Stop'
                        : `Initiate Voice Command [${hotkey.toUpperCase()}]`}
                    </span>
                  </button>
                </div>

                {/* Hotkey & Background OS Info Tag */}
                <div className="w-full mt-2 flex items-center justify-between text-[10px] font-tech text-emerald-400/80 px-1">
                  <span className="flex items-center gap-1">
                    <Keyboard className="w-3 h-3 text-emerald-400" />
                    <span>Hotkey: <strong className="text-white">{hotkey}</strong> ({hotkeyMode === 'push_to_talk' ? 'PTT' : 'Toggle'})</span>
                  </span>

                  <button
                    onClick={() => setShowHotkeyModal(true)}
                    className="text-cyan-300 hover:text-white underline cursor-pointer"
                  >
                    Configure OS &amp; Hotkeys &rarr;
                  </button>
                </div>
              </div>

              {/* Quick Assistant Superpower Shortcuts */}
              <div className="w-full p-4 bg-[#05111c]/90 border border-emerald-500/25 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-tech text-emerald-400">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Desktop Superpowers
                  </span>
                  <button
                    onClick={() => setShowProtocolModal(true)}
                    className="text-[11px] text-emerald-300 hover:text-white hover:underline flex items-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-amber-400" /> Protocols &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-tech">
                  <button
                    onClick={() =>
                      sendMessage(
                        `G-IT, examine our active projects (${projects.map((p) => p.name).join(', ')}). What are our top priority tasks and milestones for today?`
                      )
                    }
                    className="p-2 bg-[#061824] hover:bg-emerald-950 border border-emerald-500/20 hover:border-emerald-400 text-left text-emerald-200 rounded transition-colors"
                  >
                    <span className="text-[10px] text-teal-400 block font-mono">Workspace Hub</span>
                    <span>Audit All Projects</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('daily_hub');
                      sendMessage(`G-IT, deliver my Morning Briefing. Review my schedule and readiness.`);
                    }}
                    className="p-2 bg-[#061824] hover:bg-emerald-950 border border-emerald-500/20 hover:border-emerald-400 text-left text-emerald-200 rounded transition-colors"
                  >
                    <span className="text-[10px] text-cyan-400 block font-mono">Daily Schedule</span>
                    <span>Morning Briefing</span>
                  </button>

                  <button
                    onClick={() =>
                      sendMessage(
                        `G-IT, engage high thinking mode. Analyze the code architecture of our current web app and propose 3 critical performance optimizations.`
                      )
                    }
                    className="p-2 bg-[#061824] hover:bg-emerald-950 border border-emerald-500/20 hover:border-emerald-400 text-left text-emerald-200 rounded transition-colors"
                  >
                    <span className="text-[10px] text-amber-400 block font-mono">Argon Reasoning</span>
                    <span>Deep Code Architect</span>
                  </button>

                  <button
                    onClick={() => setShowProtocolModal(true)}
                    className="p-2 bg-[#061824] hover:bg-emerald-950 border border-emerald-500/20 hover:border-emerald-400 text-left text-emerald-200 rounded transition-colors"
                  >
                    <span className="text-[10px] text-emerald-400 block font-mono">Automation Bus</span>
                    <span>Custom Protocols</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Dialogue Console */}
            <div className="lg:col-span-7">
              <JarvisDialogueConsole
                messages={messages}
                isListening={isListening}
                isSpeaking={isSpeaking}
                transcript={transcript}
                speechSupported={speechSupported}
                highThinking={highThinking}
                onToggleHighThinking={() => setHighThinking(!highThinking)}
                onToggleListening={toggleListening}
                onSendMessage={sendMessage}
                onReplaySpeech={handleReplaySpeech}
                onStopSpeaking={stopSpeaking}
                userName={userName}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Spider-Man & Superman Hero AI Models in G-IT */}
        {activeTab === 'hero_ai' && (
          <HeroAiIntegratorTab
            onAskGit={handleConsultFromOtherTab}
            onSimulateAction={handleSimulateHeroAction}
          />
        )}

        {/* TAB 3: Global Web, Internet & Social Platforms Command Center */}
        {activeTab === 'web_internet' && (
          <WebInternetOmniboxTab
            onAskGit={handleConsultFromOtherTab}
            onSimulateAction={handleSimulateHeroAction}
            userName={userName}
          />
        )}

        {/* TAB 4: Workstation PC Projects Hub */}
        {activeTab === 'projects' && (
          <ProjectCommandCenter
            projects={projects}
            onUpdateProjects={setProjects}
            onAskGit={handleConsultFromOtherTab}
          />
        )}

        {/* TAB 4: Daily Activity & Focus Command Hub */}
        {activeTab === 'daily_hub' && (
          <DailyActivityHub
            schedule={schedule}
            onUpdateSchedule={setSchedule}
            projects={projects}
            onAskGit={handleConsultFromOtherTab}
            userName={userName}
          />
        )}

        {/* TAB 5: G-IT Architecture Blueprint */}
        {activeTab === 'architecture' && (
          <GitArchitectureBlueprint onAskGit={handleConsultFromOtherTab} />
        )}

        {/* TAB 6: Canonical J.A.R.V.I.S. Legacy Matrix */}
        {activeTab === 'mcu_legacy' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#05111c] border border-cyan-500/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-tech uppercase text-cyan-400">ARCHITECTURAL ANCESTOR</span>
                <h3 className="font-display font-bold text-white text-base">
                  J.A.R.V.I.S. Cinematic Matrix &amp; Lab Telemetry
                </h3>
                <p className="text-xs text-cyan-200/70 font-sans">
                  The 28 Marvel Cinematic Universe capabilities that inspired G-IT&apos;s real-world PC assistant architecture.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('voice_core')}
                className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 rounded-lg font-tech text-xs"
              >
                Return to G-IT &rarr;
              </button>
            </div>

            <CapabilityMatrixList
              onSelectSimulation={(cap) => setSelectedMcuSimulation(cap)}
              onAskJarvis={handleConsultFromOtherTab}
            />

            <SuitDiagnosticsPanel
              onActionTrigger={(action) => {
                sendMessage(`Simulate suit diagnostic result for: ${action}.`);
              }}
            />

            <ElementSynthesizerLab />
          </div>
        )}
      </main>

      {/* Protocol Runner & Creator Modal */}
      <GitProtocolRunnerModal
        isOpen={showProtocolModal}
        onClose={() => setShowProtocolModal(false)}
        onExecuteProtocolInChat={handleConsultFromOtherTab}
        userName={userName}
      />

      {/* MCU Simulation Modal (if triggered) */}
      <CapabilitySimulationModal
        capability={selectedMcuSimulation}
        onClose={() => setSelectedMcuSimulation(null)}
        onAskJarvis={handleConsultFromOtherTab}
      />

      {/* Global Hotkey Configuration Modal */}
      <GlobalHotkeyModal
        isOpen={showHotkeyModal}
        onClose={() => setShowHotkeyModal(false)}
        hotkey={hotkey}
        onHotkeyChange={setHotkey}
        mode={hotkeyMode}
        onModeChange={setHotkeyMode}
        mediaSessionEnabled={mediaSessionEnabled}
        onToggleMediaSession={setMediaSessionEnabled}
        isListening={isListening}
        onToggleListening={toggleListening}
        isPipActive={isPipActive}
        onTogglePip={toggleDocumentPip}
        hotkeyFiredIndicator={hotkeyFiredIndicator}
      />

      {/* Live System Telemetry Floating Window */}
      <LiveSystemTelemetryWindow
        logs={telemetryLogs}
        onClearLogs={() => setTelemetryLogs([])}
        isOpen={telemetryOpen}
        onToggleOpen={() => setTelemetryOpen(!telemetryOpen)}
      />
    </div>
  );
}
