import React, { useState, useEffect } from 'react';
import { 
  X, Play, ShieldAlert, Cpu, Activity, Zap, Radio, 
  Terminal, Compass, Target, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { JarvisCapability } from '../data/jarvisCapabilities';
import { playSound } from '../utils/soundEffects';

interface SimulationModalProps {
  capability: JarvisCapability | null;
  onClose: () => void;
  onAskJarvis: (prompt: string) => void;
}

export const CapabilitySimulationModal: React.FC<SimulationModalProps> = ({
  capability,
  onClose,
  onAskJarvis,
}) => {
  const [stage, setStage] = useState<'idle' | 'running' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [simMetrics, setSimMetrics] = useState({
    altitude: 12400,
    temperature: -48,
    bloodToxicity: 24.3,
    swarmSuitsActive: 35,
    powerOutput: 98.4,
    laserAlignment: 0,
    cryptoBlock: 1,
  });

  useEffect(() => {
    if (capability) {
      setStage('idle');
      setProgress(0);
      setLogs([`Initializing protocol: ${capability.name}...`, 'Awaiting authorization, sir.']);
    }
  }, [capability]);

  if (!capability) return null;

  const runSimulation = () => {
    playSound.repulsorCharge();
    setStage('running');
    setProgress(0);
    setLogs([`Engaging ${capability.name}...`, 'Calibrating subroutines...']);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress((prev) => Math.min(prev + 5, 100));

      // Dynamic logs and telemetry based on capability simulationType
      if (currentProgress === 20) {
        playSound.click();
        if (capability.simulationType === 'element_synthesis') {
          setLogs((l) => [...l, 'Scanning 1974 Expo diorama... Removing perimeter parking and landscape...']);
          setSimMetrics((m) => ({ ...m, laserAlignment: 34 }));
        } else if (capability.simulationType === 'biometric_scan') {
          setLogs((l) => [...l, 'Vascular telemetry active: Palladium ionic dispersion tracking at 24.8%...']);
          setSimMetrics((m) => ({ ...m, bloodToxicity: 25.1 }));
        } else if (capability.simulationType === 'flight_telemetry') {
          setLogs((l) => [...l, 'Ascending beyond 45,000 feet. Mach 2.2 achieved. Monitoring airframe frost...']);
          setSimMetrics((m) => ({ ...m, altitude: 48000, temperature: -62 }));
        } else if (capability.simulationType === 'house_party') {
          setLogs((l) => [...l, 'Subterranean wine cellar vault unsealed. Igor, Silver Centurion, Heartbreaker deployed.']);
          setSimMetrics((m) => ({ ...m, swarmSuitsActive: 12 }));
        } else if (capability.simulationType === 'shield_hack') {
          setLogs((l) => [...l, 'Bypassing Level 7 Helicarrier firewalls... Decrypting "Phase 2" munitions ledger...']);
        } else {
          setLogs((l) => [...l, 'Telemetry stream synchronized. Vector calibration nominal.']);
        }
      }

      if (currentProgress === 55) {
        playSound.targetLock();
        if (capability.simulationType === 'element_synthesis') {
          setLogs((l) => [...l, 'Atomic lattice detected! Unsynthesized atomic mass: 294 amu. Priming particle beam...']);
          setSimMetrics((m) => ({ ...m, laserAlignment: 78, powerOutput: 104 }));
        } else if (capability.simulationType === 'flight_telemetry') {
          setLogs((l) => [...l, 'WARNING: 85,000 ft reached. Titanium alloy icing detected. Repulsor thermal vents engaged!']);
          setSimMetrics((m) => ({ ...m, altitude: 85200, temperature: -92 }));
        } else if (capability.simulationType === 'house_party') {
          setLogs((l) => [...l, '35 suits airborne over Norco oil tanker. Combat swarm telemetry locked on Extremis hostiles.']);
          setSimMetrics((m) => ({ ...m, swarmSuitsActive: 35 }));
        } else if (capability.simulationType === 'clean_slate') {
          setLogs((l) => [...l, 'Security overrides disabled. Mark IX through Mark XLI detonating in sequence. Happy Christmas, sir.']);
          setSimMetrics((m) => ({ ...m, swarmSuitsActive: 0 }));
        } else {
          setLogs((l) => [...l, 'Executing secondary quantum iterations...']);
        }
      }

      if (currentProgress === 85) {
        playSound.arcPulse();
        if (capability.simulationType === 'element_synthesis') {
          setLogs((l) => [...l, 'Beam refraction prism aligned. New non-toxic element synthesized into triangular housing!']);
          setSimMetrics((m) => ({ ...m, laserAlignment: 100, bloodToxicity: 0.1 }));
        } else if (capability.simulationType === 'nuclear_codes') {
          setLogs((l) => [...l, 'Nexus Oslo node locked. Nuclear encryption keys shifted. Ultron locked out of silo launch grid.']);
          setSimMetrics((m) => ({ ...m, cryptoBlock: 100 }));
        } else {
          setLogs((l) => [...l, 'Vector target secured. Stabilizing auxiliary reserves.']);
        }
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setStage('complete');
        playSound.jarvisActivate();
        setLogs((l) => [...l, 'Simulation successfully executed, sir. All parameters validated.']);
      }
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#071220] border border-cyan-500/50 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cyan-500/30 bg-[#0a1829]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-400/40 rounded-lg text-cyan-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-widest text-cyan-400 font-tech uppercase">
                  SIMULATION PROTOCOL // {capability.film}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${capability.badgeColor} font-tech`}>
                  {capability.category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-wide glow-cyan">
                {capability.name}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-950/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Quote & Description banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 bg-[#091524] border border-cyan-500/20 rounded-lg">
              <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-tech mb-1">Tactical Analysis</h4>
              <p className="text-sm text-cyan-100/90 leading-relaxed font-sans">{capability.description}</p>
              <p className="text-xs text-cyan-300/70 mt-2 font-mono">{capability.details}</p>
            </div>
            <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg flex flex-col justify-center">
              <span className="text-[10px] tracking-widest text-cyan-400/80 uppercase font-tech mb-1">
                Canonical MCU Quote
              </span>
              <p className="text-xs sm:text-sm italic font-tech text-cyan-200">
                {capability.movieQuote}
              </p>
            </div>
          </div>

          {/* Interactive Telemetry HUD Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#06101d] border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between text-cyan-400 mb-1">
                <span className="text-[11px] font-tech uppercase">Arc Power</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-bold font-tech text-white">
                {simMetrics.powerOutput}%
              </div>
              <div className="w-full bg-cyan-950/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(simMetrics.powerOutput, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-[#06101d] border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between text-cyan-400 mb-1">
                <span className="text-[11px] font-tech uppercase">Altitude</span>
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-bold font-tech text-white">
                {simMetrics.altitude.toLocaleString()} FT
              </div>
              <div className="text-[10px] text-cyan-300/70 font-mono">
                Temp: {simMetrics.temperature}°C
              </div>
            </div>

            <div className="p-3 bg-[#06101d] border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between text-emerald-400 mb-1">
                <span className="text-[11px] font-tech uppercase">Blood Toxicity</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold font-tech text-emerald-300">
                {simMetrics.bloodToxicity}%
              </div>
              <div className="text-[10px] text-emerald-400/70 font-mono">
                {simMetrics.bloodToxicity > 15 ? 'Vascular Strain' : 'Nominal Core'}
              </div>
            </div>

            <div className="p-3 bg-[#06101d] border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="text-[11px] font-tech uppercase">Iron Legion</span>
                <Radio className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold font-tech text-amber-300">
                {simMetrics.swarmSuitsActive} SUITS
              </div>
              <div className="text-[10px] text-amber-400/70 font-mono">
                Swarm Link Active
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Terminal Logs */}
          <div className="p-4 bg-black/70 border border-cyan-500/40 rounded-lg font-tech text-xs space-y-1.5 min-h-[140px] max-h-[180px] overflow-y-auto">
            <div className="flex items-center justify-between text-cyan-400/80 pb-2 border-b border-cyan-500/20">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> J.A.R.V.I.S. DIAGNOSTIC BUS OUTPUT
              </span>
              <span className="text-[10px] text-cyan-400/60 uppercase">
                {stage === 'running' ? 'PROCESSING...' : stage === 'complete' ? 'COMPLETE' : 'STANDBY'}
              </span>
            </div>
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-cyan-200">
                <span className="text-cyan-500 select-none">&gt;&gt;</span>
                <span className="leading-snug">{log}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar (when running) */}
          {stage === 'running' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-tech text-cyan-400">
                <span>SIMULATION INTEGRATION IN PROGRESS</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#06101d] h-2 rounded-full overflow-hidden border border-cyan-500/30">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-teal-300 to-cyan-400 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 sm:p-5 border-t border-cyan-500/30 bg-[#081524] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              playSound.click();
              onAskJarvis(`Tell me more about how you executed the ${capability.name} in ${capability.film}. What were the physics, algorithms, and tactical parameters involved?`);
              onClose();
            }}
            className="px-4 py-2 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 rounded-lg font-tech text-xs transition-colors flex items-center gap-2"
          >
            <Radio className="w-3.5 h-3.5" /> Ask J.A.R.V.I.S. to Explain
          </button>

          <div className="flex items-center gap-3">
            {stage === 'idle' ? (
              <button
                onClick={runSimulation}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" /> Run Live Simulation
              </button>
            ) : stage === 'running' ? (
              <button
                disabled
                className="px-5 py-2.5 bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-tech text-xs tracking-wider uppercase rounded-lg opacity-80 cursor-wait flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 animate-spin" /> Processing Vector...
              </button>
            ) : (
              <button
                onClick={runSimulation}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Re-Run Protocol
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
