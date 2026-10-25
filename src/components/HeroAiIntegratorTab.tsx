import React, { useState } from 'react';
import { 
  Sparkles, Shield, Cpu, Play, Radio, MessageSquare, 
  CheckCircle2, Compass, Layers, Zap, Orbit, Globe, Eye 
} from 'lucide-react';
import { HERO_AI_MODELS, HeroAiModel } from '../data/heroAiModels';
import { playSound } from '../utils/soundEffects';

interface HeroAiIntegratorProps {
  onAskGit: (prompt: string) => void;
  onSimulateAction: (title: string, details: string) => void;
}

export const HeroAiIntegratorTab: React.FC<HeroAiIntegratorProps> = ({
  onAskGit,
  onSimulateAction,
}) => {
  const [selectedHero, setSelectedHero] = useState<'All' | 'Spider-Man' | 'Superman'>('All');
  const [activeModelId, setActiveModelId] = useState<string>(HERO_AI_MODELS[0].id);
  const [integratedModels, setIntegratedModels] = useState<string[]>([
    'karen-ai',
    'edith-ai',
    'jorel-ai',
    'kelex-ai',
  ]);
  const [simulatingCapabilityId, setSimulatingCapabilityId] = useState<string | null>(null);

  const filteredModels = HERO_AI_MODELS.filter((m) => {
    if (selectedHero === 'All') return true;
    return m.originHero === selectedHero;
  });

  const activeModel = HERO_AI_MODELS.find((m) => m.id === activeModelId) || HERO_AI_MODELS[0];

  const handleSimulate = (cap: HeroAiModel['capabilities'][0], model: HeroAiModel) => {
    playSound.repulsorCharge();
    setSimulatingCapabilityId(cap.id);

    onSimulateAction(
      `[${model.name}] ${cap.name}`,
      `Executing ${cap.name} protocol on G-IT neural bus: ${cap.description}`
    );

    setTimeout(() => {
      playSound.jarvisActivate();
      setSimulatingCapabilityId(null);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 bg-gradient-to-r from-[#05141f] via-[#092233] to-[#05141f] border border-emerald-500/40 rounded-xl shadow-[0_0_30px_rgba(0,255,170,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-tech uppercase tracking-widest text-emerald-400">
              G-IT COGNITIVE REPOSITORY // HERO AI SYNTHESIS MATRIX
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
            Spider-Man &amp; Superman AI Models in G-IT
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-sans mt-1 max-w-2xl">
            G-IT incorporates the complete tactical intelligence of Spider-Man’s <strong>K.A.R.E.N.</strong> (576 web combos &amp; recon) and <strong>E.D.I.T.H.</strong> (orbital defense &amp; AR), alongside Superman’s Kryptonian <strong>Jor-El</strong> (genesis codex &amp; solar physics) and <strong>Kelex</strong> (fortress caretakers &amp; cosmic translation).
          </p>
        </div>

        {/* Filter by Hero */}
        <div className="flex items-center bg-[#061524] border border-emerald-500/30 p-1 rounded-xl text-xs font-tech">
          {(['All', 'Spider-Man', 'Superman'] as const).map((hero) => (
            <button
              key={hero}
              onClick={() => {
                playSound.click();
                setSelectedHero(hero);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedHero === hero
                  ? 'bg-emerald-500/30 border border-emerald-400 text-white font-bold shadow-[0_0_10px_rgba(0,255,170,0.25)]'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              {hero}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: AI Model Cards on Left, Capabilities Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Model Cards */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-tech uppercase text-emerald-400/80 tracking-wider block px-1">
            INTEGRATED HERO AI CORES ({filteredModels.length})
          </span>

          <div className="space-y-3">
            {filteredModels.map((model) => {
              const isSelected = model.id === activeModel.id;
              const isIntegrated = integratedModels.includes(model.id);

              return (
                <div
                  key={model.id}
                  onClick={() => {
                    playSound.click();
                    setActiveModelId(model.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#081e2e] border-emerald-400 shadow-[0_0_20px_rgba(0,255,170,0.2)]'
                      : 'bg-[#05111c] border-emerald-500/20 hover:border-emerald-400/50 hover:bg-[#071625]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-tech mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full border ${
                        model.originHero === 'Spider-Man'
                          ? 'border-red-500/40 text-red-300 bg-red-950/40'
                          : 'border-blue-500/40 text-blue-300 bg-blue-950/40'
                      }`}
                    >
                      {model.originHero.toUpperCase()} // {model.systemCodename}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> INTEGRATED IN G-IT
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white">{model.name}</h3>
                  <div className="text-xs text-emerald-300/80 font-tech mt-0.5">{model.originSource}</div>

                  <p className="text-xs text-emerald-100/75 font-sans mt-2 line-clamp-2">
                    {model.coreRole}
                  </p>

                  <div className="mt-3 pt-2 border-t border-emerald-500/15 flex items-center justify-between text-[11px] font-tech text-emerald-400/80">
                    <span>{model.capabilities.length} Advanced Capabilities</span>
                    <span className="text-white hover:underline">Inspect Subroutines &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Model's Deep Capabilities Matrix */}
        <div className="lg:col-span-7 bg-[#05111c]/95 border border-emerald-500/35 rounded-xl p-5 shadow-[0_0_35px_rgba(0,255,170,0.12)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/20 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-tech text-emerald-400">{activeModel.systemCodename}</span>
                <span className="text-xs text-emerald-300 font-mono">
                  Origin: {activeModel.originHero}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">{activeModel.name}</h3>
              <p className="text-xs text-emerald-200/80 font-tech mt-1">{activeModel.voiceStyle}</p>
            </div>

            <button
              onClick={() =>
                onAskGit(
                  `G-IT, engage your ${activeModel.name} neural subroutines (${activeModel.originSource}). Provide a tactical briefing on how you deploy its capabilities for Commander Gray.`
                )
              }
              className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-500 hover:text-black border border-emerald-400/50 text-emerald-300 text-xs font-tech font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,170,0.2)] flex-shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Consult via {activeModel.name}
            </button>
          </div>

          {/* Capabilities List */}
          <div className="space-y-4">
            <span className="text-xs font-tech uppercase text-emerald-400/80 tracking-wider block">
              OPERATIONAL CAPABILITIES &amp; SUBROUTINES
            </span>

            {activeModel.capabilities.map((cap) => {
              const isSimulating = simulatingCapabilityId === cap.id;

              return (
                <div
                  key={cap.id}
                  className="p-4 bg-[#061624] border border-emerald-500/25 hover:border-emerald-400/50 rounded-xl space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-tech px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-300 bg-emerald-950/40">
                          {cap.category}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white">{cap.name}</h4>
                    </div>

                    <button
                      onClick={() => handleSimulate(cap, activeModel)}
                      disabled={isSimulating}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold font-tech text-xs uppercase rounded-lg shadow-[0_0_12px_rgba(0,255,170,0.3)] transition-all flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>{isSimulating ? 'Simulating...' : 'Execute in G-IT'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-emerald-100/85 font-sans leading-relaxed">
                    {cap.description}
                  </p>

                  {/* Canonical Quote */}
                  <div className="p-2.5 bg-[#030a12] border-l-2 border-emerald-400 rounded-r text-xs font-tech text-emerald-200/90 italic">
                    {cap.canonicalQuote}
                  </div>

                  {/* Telemetry Parameter badges */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {cap.parameters.map((param, i) => (
                      <div
                        key={i}
                        className="p-2 bg-[#040d16] rounded border border-emerald-500/15 text-center font-tech"
                      >
                        <span className="text-[9px] text-emerald-400/70 block uppercase">
                          {param.label}
                        </span>
                        <span className="text-xs font-bold text-white mt-0.5 block">
                          {param.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
