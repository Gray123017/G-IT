import React, { useEffect, useRef } from 'react';

interface ArcReactorCanvasProps {
  isSpeaking: boolean;
  isListening: boolean;
  thinkingMode: boolean;
  audioFrequency?: number;
  colorTheme?: 'cyan' | 'gold' | 'crimson';
}

export const ArcReactorCanvas: React.FC<ArcReactorCanvasProps> = ({
  isSpeaking,
  isListening,
  thinkingMode,
  audioFrequency = 0,
  colorTheme = 'cyan',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pulseAngle = 0;

    // Theme color palettes
    const getColors = () => {
      if (colorTheme === 'gold' || thinkingMode) {
        return {
          glow: 'rgba(255, 190, 11, 0.8)',
          glowDim: 'rgba(255, 190, 11, 0.25)',
          stroke: '#ffbe0b',
          coreGlow: '#fff3b0',
        };
      }
      if (colorTheme === 'crimson') {
        return {
          glow: 'rgba(255, 0, 85, 0.8)',
          glowDim: 'rgba(255, 0, 85, 0.25)',
          stroke: '#ff0055',
          coreGlow: '#ffb3c6',
        };
      }
      return {
        glow: 'rgba(0, 240, 255, 0.85)',
        glowDim: 'rgba(0, 240, 255, 0.25)',
        stroke: '#00f0ff',
        coreGlow: '#d4fbff',
      };
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.42;

      ctx.clearRect(0, 0, width, height);

      const colors = getColors();
      const speakBoost = isSpeaking ? Math.sin(pulseAngle * 5) * 8 + (audioFrequency * 12) : 0;
      const listenBoost = isListening ? Math.sin(pulseAngle * 3) * 6 : 0;
      const dynamicRadius = radius + speakBoost + listenBoost;

      // 1. Subtle radial ambient backdrop
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, dynamicRadius * 1.3);
      bgGrad.addColorStop(0, colors.glowDim);
      bgGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Ring with Ticks
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.4);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = colors.stroke;
      ctx.shadowBlur = isSpeaking ? 18 : 8;

      ctx.beginPath();
      ctx.arc(0, 0, dynamicRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Outer radial tick marks (48 ticks)
      for (let i = 0; i < 48; i++) {
        const rad = (i * Math.PI * 2) / 48;
        const tickLength = i % 4 === 0 ? 10 : 5;
        const x1 = Math.cos(rad) * (dynamicRadius - tickLength);
        const y1 = Math.sin(rad) * (dynamicRadius - tickLength);
        const x2 = Math.cos(rad) * dynamicRadius;
        const y2 = Math.sin(rad) * dynamicRadius;

        ctx.lineWidth = i % 4 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Counter-rotating Segmented Gear Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 0.8);
      const ring2Radius = dynamicRadius * 0.82;

      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 3;
      ctx.shadowBlur = isSpeaking ? 15 : 6;

      const segments = 12;
      for (let i = 0; i < segments; i++) {
        const startRad = (i * Math.PI * 2) / segments + 0.08;
        const endRad = ((i + 1) * Math.PI * 2) / segments - 0.08;

        ctx.beginPath();
        ctx.arc(0, 0, ring2Radius, startRad, endRad);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Ten Arc Reactor Copper Coil Nodes (Mark I & III classic ring)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.2);
      const coilRadius = dynamicRadius * 0.62;
      const coilCount = 10;

      for (let i = 0; i < coilCount; i++) {
        const theta = (i * Math.PI * 2) / coilCount;
        const cx = Math.cos(theta) * coilRadius;
        const cy = Math.sin(theta) * coilRadius;

        // Coil bounding box
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(theta + Math.PI / 2);

        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.stroke;
        ctx.shadowBlur = 10;
        ctx.fillRect(-8, -12, 16, 24);

        // Inner filament wire
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -8, 6, 16);
        ctx.restore();
      }
      ctx.restore();

      // 5. Inner Inscribed Hexagon / Triangle (Mark VI Vibranium Core)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.6);
      const innerTriRadius = dynamicRadius * 0.38;

      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const rad = (i * Math.PI * 2) / 3 - Math.PI / 2;
        const x = Math.cos(rad) * innerTriRadius;
        const y = Math.sin(rad) * innerTriRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // 6. Central Palladium / Vibranium Glowing Core
      ctx.save();
      ctx.translate(centerX, centerY);

      const corePulse = Math.sin(pulseAngle * 4) * 0.15 + 0.85;
      const coreR = dynamicRadius * 0.22 * corePulse;

      const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, coreR);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, colors.coreGlow);
      coreGrad.addColorStop(0.8, colors.stroke);
      coreGrad.addColorStop(1, 'rgba(0,0,0,0.8)');

      ctx.fillStyle = coreGrad;
      ctx.shadowColor = colors.stroke;
      ctx.shadowBlur = isSpeaking ? 30 : 18;

      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Center laser crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-coreR * 0.6, 0);
      ctx.lineTo(coreR * 0.6, 0);
      ctx.moveTo(0, -coreR * 0.6);
      ctx.lineTo(0, coreR * 0.6);
      ctx.stroke();

      ctx.restore();

      // Speed of rotation accelerates when speaking or thinking
      const speedMultiplier = thinkingMode ? 2.5 : isSpeaking ? 1.8 : 1;
      angle += 0.008 * speedMultiplier;
      pulseAngle += 0.03 * speedMultiplier;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpeaking, isListening, thinkingMode, audioFrequency, colorTheme]);

  return (
    <div className="relative flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 pointer-events-none drop-shadow-[0_0_35px_rgba(0,240,255,0.35)]"
      />
    </div>
  );
};
