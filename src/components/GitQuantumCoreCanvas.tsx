import React, { useEffect, useRef } from 'react';

interface GitQuantumCoreCanvasProps {
  isSpeaking: boolean;
  isListening: boolean;
  thinkingMode: boolean;
  audioFrequency?: number;
  colorScheme?: 'emerald' | 'cyan' | 'amber' | 'purple' | 'crimson';
  onClick?: () => void;
}

export const GitQuantumCoreCanvas: React.FC<GitQuantumCoreCanvasProps> = ({
  isSpeaking,
  isListening,
  thinkingMode,
  audioFrequency = 0,
  colorScheme = 'emerald',
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    let pulseAngle = 0;

    // Palette mapping
    const getPalette = () => {
      if (colorScheme === 'emerald') {
        return {
          primary: '#00ffaa',
          secondary: '#10b981',
          glow: 'rgba(0, 255, 170, 0.85)',
          glowDim: 'rgba(0, 255, 170, 0.2)',
          highlight: '#e6fff7',
        };
      }
      if (colorScheme === 'amber' || thinkingMode) {
        return {
          primary: '#ffbe0b',
          secondary: '#f59e0b',
          glow: 'rgba(255, 190, 11, 0.85)',
          glowDim: 'rgba(255, 190, 11, 0.2)',
          highlight: '#fffbeb',
        };
      }
      if (colorScheme === 'purple') {
        return {
          primary: '#c084fc',
          secondary: '#a855f7',
          glow: 'rgba(192, 132, 252, 0.85)',
          glowDim: 'rgba(192, 132, 252, 0.2)',
          highlight: '#faf5ff',
        };
      }
      if (colorScheme === 'crimson') {
        return {
          primary: '#ff0055',
          secondary: '#e11d48',
          glow: 'rgba(255, 0, 85, 0.85)',
          glowDim: 'rgba(255, 0, 85, 0.2)',
          highlight: '#fff1f2',
        };
      }
      return {
        primary: '#00f0ff',
        secondary: '#0ea5e9',
        glow: 'rgba(0, 240, 255, 0.85)',
        glowDim: 'rgba(0, 240, 255, 0.2)',
        highlight: '#f0fdff',
      };
    };

    // Particles for quantum singularity
    const particles = Array.from({ length: 36 }, () => ({
      dist: Math.random() * 80 + 15,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2 + 1,
    }));

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);
      const palette = getPalette();

      const speakMod = isSpeaking ? Math.sin(pulseAngle * 5) * 8 + audioFrequency * 14 : 0;
      const listenMod = isListening ? Math.sin(pulseAngle * 4) * 6 : 0;
      const r = baseRadius + speakMod + listenMod;

      // 1. Ambient Hologram Backlight
      const ambient = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 1.25);
      ambient.addColorStop(0, palette.glowDim);
      ambient.addColorStop(0.7, 'rgba(0,0,0,0)');
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Octagonal Gimbal Frame (G-IT Signature)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.25);
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = isSpeaking ? 16 : 8;

      const octPoints = 8;
      ctx.beginPath();
      for (let i = 0; i < octPoints; i++) {
        const theta = (i * Math.PI * 2) / octPoints;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Gimbal tick marks on vertices
      for (let i = 0; i < octPoints; i++) {
        const theta = (i * Math.PI * 2) / octPoints;
        const vx = Math.cos(theta) * r;
        const vy = Math.sin(theta) * r;
        ctx.fillStyle = palette.highlight;
        ctx.beginPath();
        ctx.arc(vx, vy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Counter-Rotating Dual Telemetry Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 0.7);
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;

      const innerR = r * 0.8;
      const segments = 16;
      for (let i = 0; i < segments; i++) {
        if (i % 2 === 0) {
          const s = (i * Math.PI * 2) / segments;
          const e = ((i + 0.75) * Math.PI * 2) / segments;
          ctx.beginPath();
          ctx.arc(0, 0, innerR, s, e);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 4. Middle Elliptical 3D Orbital Rings (Quantum Core Orbitals)
      ctx.save();
      ctx.translate(cx, cy);
      [0, Math.PI / 4, (Math.PI * 2) / 3].forEach((incl, idx) => {
        ctx.save();
        ctx.rotate(incl + angle * (idx % 2 === 0 ? 0.4 : -0.4));
        ctx.scale(1, 0.45);
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = isSpeaking ? 12 : 5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      ctx.restore();

      // 5. Swirling Quantum Particles inside Singularity
      ctx.save();
      ctx.translate(cx, cy);
      particles.forEach((p) => {
        p.angle += p.speed * (thinkingMode ? 2.5 : isSpeaking ? 1.8 : 1);
        const px = Math.cos(p.angle) * p.dist * (r / baseRadius);
        const py = Math.sin(p.angle) * p.dist * (r / baseRadius);

        ctx.fillStyle = palette.highlight;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 6. Central G-IT Nexus Core with High-Frequency Pulse
      ctx.save();
      ctx.translate(cx, cy);

      const corePulse = Math.sin(pulseAngle * 4.5) * 0.18 + 0.82;
      const coreR = r * 0.24 * corePulse;

      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, coreR);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, palette.highlight);
      grad.addColorStop(0.7, palette.primary);
      grad.addColorStop(1, 'rgba(0,0,0,0.85)');

      ctx.fillStyle = grad;
      ctx.shadowColor = palette.primary;
      ctx.shadowBlur = isSpeaking ? 28 : 16;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Center Geometric 'G' Monogram crosshair
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, coreR * 0.5, 0.4, Math.PI * 1.6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(coreR * 0.2, 0);
      ctx.lineTo(coreR * 0.5, 0);
      ctx.stroke();

      ctx.restore();

      const speedFactor = thinkingMode ? 2.8 : isSpeaking ? 2.0 : 1.0;
      angle += 0.009 * speedFactor;
      pulseAngle += 0.035 * speedFactor;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSpeaking, isListening, thinkingMode, audioFrequency, colorScheme]);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center p-2 cursor-pointer transition-transform hover:scale-[1.02]"
      title="Click to trigger Quantum Pulse"
    >
      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 drop-shadow-[0_0_35px_rgba(0,255,170,0.35)]"
      />
    </div>
  );
};
