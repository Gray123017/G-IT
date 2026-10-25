import React, { useState } from 'react';
import { 
  Cpu, Layers, Shield, Radio, Sparkles, Terminal, 
  Workflow, ArrowRight, Brain, Zap, CheckCircle2 
} from 'lucide-react';
import { GIT_ARCHITECTURE_TIERS } from '../data/gitArchitecture';
import { playSound } from '../utils/soundEffects';

interface ArchitectureProps {
  onAskGit: (prompt: string) => void;
}

export const GitArchitectureBlueprint: React.FC<ArchitectureProps> = ({ onAskGit }) => {
  const [selectedTier, setSelectedTier] = useState<number>(1);

  const activeTier = GIT_ARCHITECTURE_TIERS.find((t) => t.tier === selectedTier) || GIT_ARCHITECTURE_TIERS[0];

  const mcuToRealWorldMappings = [
    {
      mcu: 'Mark II Holographic CAD & Stress Simulation',
      git: 'Full-Stack Code Generation & Architecture Sandbox',
      desc: 'Translates high-level prompts into multi-file component frameworks, data models, and API blueprints.',
    },
    {
      mcu: 'SR-71 Icing Problem & Extreme Altitude Telemetry',
      git: 'Workstation System Health & Memory Leak Monitoring',
      desc: 'Monitors CPU load, heap usage, network latency, and throttles heavy tasks before OS freeze.',
    },
    {
      mcu: '1974 Stark Expo Diorama Element Synthesis',
      git: 'Gemini 4 Argon High Thinking Quantum Reasoner',
      desc: 'Deploys deep recursive tree search for complex STEM equations, database schemas, and cryptographic proofs.',
    },
    {
      mcu: 'House Party Protocol & Autonomous Iron Legion Swarm',
      git: 'Multi-Agent Subroutine & Parallel Task Decomposition',
      desc: 'Dispatches parallel sub-threads to research, audit code, and draft documentation simultaneously.',
    },
    {
      mcu: 'Malibu Mansion Habitat Automation & Morning Briefing',
      git: 'Daily Agenda Command, Morning Audio Briefing & Deep Focus',
      desc: 'Schedules sprints, delivers voice summaries of pending milestones, and regulates work-rest pacing.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#05141f] via-[#092233] to-[#05141f] border border-emerald-500/40 rounded-xl shadow-[0_0_30px_rgba(0,255,170,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-tech uppercase tracking-widest text-emerald-400">
              G-IT SPECIFICATION // SOVEREIGN AI SYSTEM BLUEPRINT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
            G-IT Voice Assistant CPU Architecture
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-sans mt-1 max-w-2xl">
            Designed as the practical, real-world realization of J.A.R.V.I.S. for your personal workstation—combining neural voice synthesis, Gemini 4 Argon reasoning, and project task automation.
          </p>
        </div>

        <button
          onClick={() =>
            onAskGit(
              'G-IT, explain the technical architecture of your 5-tier neural engine and how each layer operates on my PC.'
            )
          }
          className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-500 hover:text-black border border-emerald-400/50 text-emerald-300 text-xs font-tech font-bold rounded-lg transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Brain className="w-4 h-4" /> Ask G-IT to Explain Architecture
        </button>
      </div>

      {/* 5-Tier Architecture Interactive Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tier Selector List */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[11px] font-tech uppercase text-emerald-400/80 tracking-wider block px-1">
            THE 5-TIER NEURAL HIERARCHY
          </span>

          <div className="space-y-2">
            {GIT_ARCHITECTURE_TIERS.map((tier) => {
              const isSelected = tier.tier === selectedTier;
              return (
                <div
                  key={tier.tier}
                  onClick={() => {
                    playSound.click();
                    setSelectedTier(tier.tier);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#081e2e] border-emerald-400 shadow-[0_0_20px_rgba(0,255,170,0.2)]'
                      : 'bg-[#05111c] border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#071725]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-tech text-emerald-400/80 mb-1">
                    <span>TIER 0{tier.tier} // {tier.codename}</span>
                    <span className="text-emerald-300 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {tier.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">{tier.name}</h4>
                  <p className="text-xs text-emerald-100/70 font-sans line-clamp-1 mt-0.5">
                    {tier.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Deep Dive Card */}
        <div className="lg:col-span-7 bg-[#05111c]/95 border border-emerald-500/35 rounded-xl p-5 shadow-[0_0_35px_rgba(0,255,170,0.12)] space-y-5">
          <div className="pb-3 border-b border-emerald-500/20">
            <span className="text-[11px] font-tech text-emerald-400 uppercase tracking-widest">
              SUBSYSTEM SPECIFICATION // TIER 0{activeTier.tier}
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-0.5">
              {activeTier.name} ({activeTier.codename})
            </h3>
            <span className="text-xs text-emerald-300 font-tech mt-1 block">
              Stack: {activeTier.techStack}
            </span>
          </div>

          <p className="text-sm text-emerald-100/90 font-sans leading-relaxed">
            {activeTier.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {activeTier.metrics.map((m, i) => (
              <div key={i} className="p-3 bg-[#061824] rounded-lg border border-emerald-500/20 text-center font-tech">
                <span className="text-[10px] text-emerald-400/70 block uppercase">{m.label}</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{m.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-emerald-500/20">
            <button
              onClick={() =>
                onAskGit(
                  `G-IT, demonstrate Tier 0${activeTier.tier} (${activeTier.name}). Run a live diagnostics or benchmark test on this layer.`
                )
              }
              className="w-full py-2.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-400/50 text-emerald-300 rounded-lg font-tech text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" /> Run Tier Benchmark on G-IT
            </button>
          </div>
        </div>
      </div>

      {/* Evolution Table: Movie J.A.R.V.I.S. -> Real-World G-IT PC Assistant */}
      <div className="bg-[#05111c]/95 border border-emerald-500/30 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
          <Workflow className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            FROM MOVIE J.A.R.V.I.S. TO YOUR G-IT PC WORKSTATION CPU
          </h3>
        </div>

        <div className="space-y-3">
          {mcuToRealWorldMappings.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#061624] border border-emerald-500/15 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="md:w-5/12">
                <span className="text-[10px] font-tech text-cyan-400 block uppercase">
                  Cinematic J.A.R.V.I.S. Feature
                </span>
                <span className="font-display font-bold text-cyan-100 text-sm">
                  {item.mcu}
                </span>
              </div>

              <div className="hidden md:flex items-center justify-center text-emerald-400">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="md:w-6/12">
                <span className="text-[10px] font-tech text-emerald-400 block uppercase">
                  G-IT PC Assistant Realization
                </span>
                <span className="font-display font-bold text-white text-sm block">
                  {item.git}
                </span>
                <span className="text-emerald-200/70 font-sans mt-0.5 block">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
