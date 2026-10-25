import React, { useState, useEffect, useRef } from 'react';
import { Atom, Zap, RefreshCw, CheckCircle2, Sliders, Play } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export const ElementSynthesizerLab: React.FC = () => {
  const [beamAlignment, setBeamAlignment] = useState(65);
  const [fluxFrequency, setFluxFrequency] = useState(88);
  const [isFiring, setIsFiring] = useState(false);
  const [synthesized, setSynthesized] = useState(false);
  const [thermalWarning, setThermalWarning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Atomic Lattice Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // 3D-projected rotating atomic orbitals
      const electronCount = 8;
      const ringRadius = 75;

      ctx.save();
      ctx.translate(cx, cy);

      // Orbital Rings
      [0, Math.PI / 3, (2 * Math.PI) / 3].forEach((inclination, i) => {
        ctx.save();
        ctx.rotate(inclination + (rotAngle * 0.3));
        ctx.scale(1, 0.35);

        ctx.strokeStyle = synthesized ? '#10b981' : isFiring ? '#ffbe0b' : '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = isFiring ? 15 : 6;

        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting particle
        const particleTheta = rotAngle * (i + 1) * 1.5;
        const px = Math.cos(particleTheta) * ringRadius;
        const py = Math.sin(particleTheta) * ringRadius;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Central Atomic Nucleus
      const nucleusGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 22);
      nucleusGrad.addColorStop(0, '#ffffff');
      nucleusGrad.addColorStop(0.5, synthesized ? '#10b981' : isFiring ? '#ffbe0b' : '#00f0ff');
      nucleusGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Laser Beam when firing
      if (isFiring) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ffbe0b';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(-cx, 0);
        ctx.lineTo(cx, 0);
        ctx.stroke();
      }

      ctx.restore();

      rotAngle += isFiring ? 0.05 : 0.015;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isFiring, synthesized]);

  const handleFireBeam = () => {
    playSound.repulsorCharge();
    setIsFiring(true);
    setThermalWarning(true);

    setTimeout(() => {
      playSound.arcPulse();
      setIsFiring(false);
      setSynthesized(true);
      setThermalWarning(false);
      playSound.jarvisActivate();
    }, 2800);
  };

  const handleReset = () => {
    playSound.click();
    setSynthesized(false);
    setIsFiring(false);
  };

  return (
    <div className="bg-[#060e1a]/90 border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.1)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-bold text-sm tracking-wider text-cyan-200 uppercase">
            ATOMIC SYNTHESIZER // HOWARD STARK EXPO LATTICE
          </h3>
        </div>
        <span
          className={`text-[10px] font-tech px-2 py-0.5 rounded-full border ${
            synthesized
              ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
              : 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40'
          }`}
        >
          {synthesized ? 'BADASSIUM FORGED' : 'AWAITING PRISM ALIGNMENT'}
        </span>
      </div>

      {/* Main interactive area: Canvas + Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Animated Canvas */}
        <div className="relative flex flex-col items-center justify-center p-2 bg-[#040810] border border-cyan-500/20 rounded-lg">
          <canvas
            ref={canvasRef}
            width={260}
            height={200}
            className="w-full h-44 drop-shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          />
          <div className="absolute bottom-2 text-center text-[10px] font-tech text-cyan-400/80">
            {isFiring
              ? 'COLLIDING PARTICLE BEAMS AT RELATIVISTIC SPEED...'
              : synthesized
              ? 'TRIANGULAR VIBRANIUM PRECURSOR STABILIZED'
              : '1974 EXPO DIORAMA ATOMIC BLUEPRINT'}
          </div>
        </div>

        {/* Sliders and Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-tech text-cyan-400 mb-1">
              <span>Prism Refraction Angle</span>
              <span>{beamAlignment}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={beamAlignment}
              onChange={(e) => setBeamAlignment(Number(e.target.value))}
              disabled={isFiring}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-tech text-cyan-400 mb-1">
              <span>Particle Accelerator Flux</span>
              <span>{fluxFrequency} GHz</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={fluxFrequency}
              onChange={(e) => setFluxFrequency(Number(e.target.value))}
              disabled={isFiring}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            {!synthesized ? (
              <button
                onClick={handleFireBeam}
                disabled={isFiring}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,190,11,0.35)]"
              >
                {isFiring ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Firing Particle Beam...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-black" /> Fire Laser Accelerator
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-emerald-950/70 border border-emerald-400 text-emerald-300 font-tech text-xs tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Element Synthesized // Reset Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
