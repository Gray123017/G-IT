import React, { useState } from 'react';
import { 
  X, Play, ShieldAlert, Cpu, Sparkles, CheckCircle2, 
  Terminal, RefreshCw, Plus, Sliders, Brain 
} from 'lucide-react';
import { GitProtocol, DEFAULT_GIT_PROTOCOLS } from '../data/gitArchitecture';
import { playSound } from '../utils/soundEffects';

interface GitProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteProtocolInChat: (prompt: string) => void;
  userName: string;
}

export const GitProtocolRunnerModal: React.FC<GitProtocolModalProps> = ({
  isOpen,
  onClose,
  onExecuteProtocolInChat,
  userName,
}) => {
  const [protocols, setProtocols] = useState<GitProtocol[]>(DEFAULT_GIT_PROTOCOLS);
  const [selectedProtocol, setSelectedProtocol] = useState<GitProtocol>(DEFAULT_GIT_PROTOCOLS[0]);
  const [executing, setExecuting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New protocol form state
  const [newProto, setNewProto] = useState({
    code: 'G-IT // PROTOCOL 06',
    name: '',
    category: 'DevOps & Code' as GitProtocol['category'],
    description: '',
    triggerPhrase: '',
    thinkingMode: true,
    steps: 'Initialize environment\nVerify configurations\nExecute target subroutines\nConfirm deployment stability',
  });

  if (!isOpen) return null;

  const runProtocol = (proto: GitProtocol) => {
    playSound.repulsorCharge();
    setExecuting(true);
    setStepIndex(0);
    setExecutionLogs([`[G-IT BUS] Engaging ${proto.name}...`, `Authorized by: ${userName}`]);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < proto.steps.length) {
        playSound.targetLock();
        setStepIndex(currentStep);
        setExecutionLogs((prev) => [...prev, `>> ${proto.steps[currentStep]}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        setExecuting(false);
        playSound.jarvisActivate();
        setExecutionLogs((prev) => [
          ...prev,
          `[COMPLETE] Protocol ${proto.name} executed successfully. Subsystems nominal.`,
        ]);
        onExecuteProtocolInChat(
          `G-IT, I just triggered ${proto.name} (${proto.code}). Report system telemetry status and next recommended operational vectors for ${userName}.`
        );
      }
    }, proto.executionSpeedMs || 220);
  };

  const handleSaveCustomProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProto.name.trim()) return;
    playSound.click();
    const created: GitProtocol = {
      id: `custom-proto-${Date.now()}`,
      code: newProto.code.trim() || `G-IT // PROTOCOL 0${protocols.length + 1}`,
      name: newProto.name.trim(),
      category: newProto.category,
      description: newProto.description.trim() || 'Custom G-IT workstation protocol.',
      triggerPhrase: newProto.triggerPhrase.trim() || `G-IT, execute ${newProto.name.trim()}`,
      thinkingMode: newProto.thinkingMode,
      colorScheme: 'emerald',
      steps: newProto.steps.split('\n').filter((s) => s.trim()),
      executionSpeedMs: 200,
    };
    setProtocols([...protocols, created]);
    setSelectedProtocol(created);
    setShowCreateModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#071320] border border-emerald-500/50 rounded-xl shadow-[0_0_50px_rgba(0,255,170,0.25)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-emerald-500/30 bg-[#0a1c2c]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-400/40 rounded-lg text-emerald-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs tracking-widest text-emerald-400 font-tech uppercase">
                G-IT PROTOCOL AUTOMATION ENGINE
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-wide">
                Custom Protocols &amp; Autonomous Workstation Macros
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Protocol Grid selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-tech uppercase text-emerald-400/80 tracking-wider">
                SELECT PROTOCOL TO ENGAGE ({protocols.length} AVAILABLE)
              </span>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-xs font-tech text-emerald-400 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Design Custom Protocol
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {protocols.map((proto) => {
                const isSelected = proto.id === selectedProtocol.id;
                return (
                  <div
                    key={proto.id}
                    onClick={() => {
                      playSound.click();
                      setSelectedProtocol(proto);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#092233] border-emerald-400 shadow-[0_0_15px_rgba(0,255,170,0.25)]'
                        : 'bg-[#061421] border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#081a2b]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-tech text-emerald-400/70 mb-1">
                      <span>{proto.code}</span>
                      {proto.thinkingMode && (
                        <span className="px-1 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30">
                          ARGON
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">{proto.name}</h4>
                    <p className="text-[11px] text-emerald-200/70 font-sans line-clamp-1 mt-0.5">
                      {proto.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Protocol Specs & Execution */}
          {selectedProtocol && (
            <div className="bg-[#05111c] border border-emerald-500/30 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-500/20 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-tech text-emerald-400">{selectedProtocol.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-300 font-tech">
                      {selectedProtocol.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-white mt-0.5">
                    {selectedProtocol.name}
                  </h3>
                </div>

                <button
                  onClick={() => runProtocol(selectedProtocol)}
                  disabled={executing}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-lg shadow-[0_0_20px_rgba(0,255,170,0.35)] transition-all flex items-center gap-2"
                >
                  {executing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Executing Protocol...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" /> Engage {selectedProtocol.name}
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-sans leading-relaxed">
                {selectedProtocol.description}
              </p>

              {/* Voice activation phrase */}
              <div className="p-2.5 bg-[#081d2e] border border-emerald-500/30 rounded-lg text-xs font-tech text-emerald-300 flex items-center justify-between">
                <span>Vocal Trigger Phrase:</span>
                <span className="text-white font-mono">&quot;{selectedProtocol.triggerPhrase}&quot;</span>
              </div>

              {/* Execution Steps */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-tech uppercase text-emerald-400/80 block">
                  MACRO EXECUTION SEQUENCE
                </span>
                <div className="space-y-1 text-xs font-tech">
                  {selectedProtocol.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded border flex items-center gap-2 transition-colors ${
                        executing && stepIndex === idx
                          ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                          : 'bg-[#071725] border-emerald-500/15 text-emerald-200/80'
                      }`}
                    >
                      <span className="text-emerald-400 font-mono">0{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Logs (if run) */}
              {executionLogs.length > 0 && (
                <div className="p-3 bg-black/80 border border-emerald-500/30 rounded-lg font-tech text-xs space-y-1 text-emerald-300 max-h-36 overflow-y-auto">
                  <div className="text-[10px] text-emerald-500/80 border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> G-IT AUTONOMOUS BUS LOGS
                  </div>
                  {executionLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Protocol Builder Sub-modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#071624] border border-emerald-500/50 rounded-xl p-5 shadow-[0_0_40px_rgba(0,255,170,0.25)] space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Design Custom G-IT Protocol</h3>
              <form onSubmit={handleSaveCustomProtocol} className="space-y-3">
                <div>
                  <label className="text-xs font-tech text-emerald-400 block mb-1">Protocol Name</label>
                  <input
                    type="text"
                    required
                    value={newProto.name}
                    onChange={(e) => setNewProto({ ...newProto, name: e.target.value })}
                    placeholder="e.g. Night Shift Standby"
                    className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-tech text-emerald-400 block mb-1">Category</label>
                  <select
                    value={newProto.category}
                    onChange={(e) => setNewProto({ ...newProto, category: e.target.value as any })}
                    className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-200 outline-none"
                  >
                    <option value="DevOps & Code">DevOps &amp; Code</option>
                    <option value="Neural Reasoning">Neural Reasoning</option>
                    <option value="System Defense">System Defense</option>
                    <option value="Swarm Automation">Swarm Automation</option>
                    <option value="Biometrics & Focus">Biometrics &amp; Focus</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-tech text-emerald-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProto.description}
                    onChange={(e) => setNewProto({ ...newProto, description: e.target.value })}
                    placeholder="What does this protocol automate on your PC?"
                    className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-tech text-emerald-400 block mb-1">
                    Execution Steps (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={newProto.steps}
                    onChange={(e) => setNewProto({ ...newProto, steps: e.target.value })}
                    className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-[#040c14] hover:bg-[#061521] text-xs font-tech text-emerald-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-tech text-xs rounded-lg"
                  >
                    Save Protocol
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
