import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, ShieldCheck, ShieldAlert, Camera, CameraOff, 
  Key, RefreshCw, CheckCircle2, AlertTriangle, Lock, Unlock, Eye, Sparkles, Terminal 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface BiometricAuthProps {
  userName: string;
  onAuthenticated: () => void;
  onSpeakGreeting?: (text: string) => void;
}

type ScanStatus = 'idle' | 'scanning' | 'analyzing' | 'granted' | 'denied';

export const BiometricFaceScanAuth: React.FC<BiometricAuthProps> = ({
  userName,
  onAuthenticated,
  onSpeakGreeting,
}) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'Biometric terminal initialized.',
    'Awaiting authorized operator facial alignment...',
  ]);
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamAvailable, setWebcamAvailable] = useState(false);
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [overrideCode, setOverrideCode] = useState('');
  const [overrideError, setOverrideError] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Initialize webcam capabilities check
  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function') {
      setWebcamAvailable(true);
    }
  }, []);

  // Handle webcam stream start/stop
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useWebcam && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 480, height: 480 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable:', err);
          setUseWebcam(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam]);

  // Animated Holographic Face Mesh Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanLineY = 0;
    let scanDir = 1;
    let pulseAngle = 0;

    // Anatomical facial landmark relative coordinates [x, y] in range [-1, 1]
    const facialLandmarks = [
      // Forehead & Brow
      { x: -0.5, y: -0.55 }, { x: -0.25, y: -0.6 }, { x: 0, y: -0.62 }, { x: 0.25, y: -0.6 }, { x: 0.5, y: -0.55 },
      { x: -0.4, y: -0.35 }, { x: -0.2, y: -0.4 }, { x: 0.2, y: -0.4 }, { x: 0.4, y: -0.35 },
      // Left Eye
      { x: -0.35, y: -0.25 }, { x: -0.2, y: -0.28 }, { x: -0.15, y: -0.2 }, { x: -0.25, y: -0.18 },
      // Right Eye
      { x: 0.15, y: -0.2 }, { x: 0.2, y: -0.28 }, { x: 0.35, y: -0.25 }, { x: 0.25, y: -0.18 },
      // Nose bridge and tip
      { x: 0, y: -0.3 }, { x: 0, y: -0.05 }, { x: -0.1, y: 0.1 }, { x: 0, y: 0.14 }, { x: 0.1, y: 0.1 },
      // Lips & Mouth
      { x: -0.25, y: 0.35 }, { x: 0, y: 0.3 }, { x: 0.25, y: 0.35 },
      { x: -0.18, y: 0.45 }, { x: 0, y: 0.48 }, { x: 0.18, y: 0.45 },
      // Jawline & Chin
      { x: -0.65, y: -0.1 }, { x: -0.6, y: 0.2 }, { x: -0.45, y: 0.5 }, { x: -0.25, y: 0.72 },
      { x: 0, y: 0.82 },
      { x: 0.25, y: 0.72 }, { x: 0.45, y: 0.5 }, { x: 0.6, y: 0.2 }, { x: 0.65, y: -0.1 },
    ];

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const scaleX = w * 0.36;
      const scaleY = h * 0.42;

      ctx.clearRect(0, 0, w, h);

      // Color scheme based on scanning status
      let primaryColor = '#00ffaa'; // default emerald
      let glowColor = 'rgba(0, 255, 170, 0.8)';
      if (status === 'scanning' || status === 'analyzing') {
        primaryColor = '#00f0ff';
        glowColor = 'rgba(0, 240, 255, 0.9)';
      } else if (status === 'granted') {
        primaryColor = '#34d399';
        glowColor = 'rgba(52, 211, 153, 0.95)';
      } else if (status === 'denied') {
        primaryColor = '#ff0055';
        glowColor = 'rgba(255, 0, 85, 0.95)';
      }

      // 1. Draw outer targeting reticle & crosshairs
      ctx.save();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = status === 'scanning' ? 14 : 6;

      const boxSize = Math.min(w, h) * 0.82;
      const halfBox = boxSize / 2;
      const cornerLen = 28;

      // 4 Tech Corners
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(cx - halfBox, cy - halfBox + cornerLen);
      ctx.lineTo(cx - halfBox, cy - halfBox);
      ctx.lineTo(cx - halfBox + cornerLen, cy - halfBox);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(cx + halfBox - cornerLen, cy - halfBox);
      ctx.lineTo(cx + halfBox, cy - halfBox);
      ctx.lineTo(cx + halfBox, cy - halfBox + cornerLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(cx - halfBox, cy + halfBox - cornerLen);
      ctx.lineTo(cx - halfBox, cy + halfBox);
      ctx.lineTo(cx - halfBox + cornerLen, cy + halfBox);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(cx + halfBox - cornerLen, cy + halfBox);
      ctx.lineTo(cx + halfBox, cy + halfBox);
      ctx.lineTo(cx + halfBox, cy + halfBox - cornerLen);
      ctx.stroke();

      // Center crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy);
      ctx.lineTo(cx + 15, cy);
      ctx.moveTo(cx, cy - 15);
      ctx.lineTo(cx, cy + 15);
      ctx.stroke();
      ctx.restore();

      // 2. Draw Holographic Facial Mesh
      ctx.save();
      ctx.translate(cx, cy);

      // Facial wireframe triangulation lines
      ctx.strokeStyle = status === 'granted' ? 'rgba(52, 211, 153, 0.5)' : 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < facialLandmarks.length - 1; i++) {
        const pt1 = facialLandmarks[i];
        const pt2 = facialLandmarks[i + 1];
        ctx.moveTo(pt1.x * scaleX, pt1.y * scaleY);
        ctx.lineTo(pt2.x * scaleX, pt2.y * scaleY);

        // Cross-connect some nodes for cybernetic mesh look
        if (i % 3 === 0 && i + 4 < facialLandmarks.length) {
          const pt3 = facialLandmarks[i + 4];
          ctx.moveTo(pt1.x * scaleX, pt1.y * scaleY);
          ctx.lineTo(pt3.x * scaleX, pt3.y * scaleY);
        }
      }
      ctx.stroke();

      // Facial Landmark Nodes (Pulsing Dots)
      facialLandmarks.forEach((pt, idx) => {
        const px = pt.x * scaleX;
        const py = pt.y * scaleY;
        const isEyeNode = idx >= 9 && idx <= 16;

        ctx.fillStyle = isEyeNode ? '#ffffff' : primaryColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = status === 'scanning' ? 12 : 5;

        ctx.beginPath();
        ctx.arc(px, py, isEyeNode ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw iris targeting rings over eyes
        if (isEyeNode && idx === 10) {
          ctx.strokeStyle = primaryColor;
          ctx.beginPath();
          ctx.arc(px, py, 12 + Math.sin(pulseAngle * 3) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (isEyeNode && idx === 14) {
          ctx.strokeStyle = primaryColor;
          ctx.beginPath();
          ctx.arc(px, py, 12 + Math.sin(pulseAngle * 3) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.restore();

      // 3. Sweeping Laser Scan Line (when scanning)
      if (status === 'scanning' || status === 'analyzing') {
        ctx.save();
        scanLineY += 3.5 * scanDir;
        if (scanLineY > h - 40) {
          scanLineY = h - 40;
          scanDir = -1;
        } else if (scanLineY < 40) {
          scanLineY = 40;
          scanDir = 1;
        }

        const laserGrad = ctx.createLinearGradient(0, scanLineY - 18, 0, scanLineY + 18);
        laserGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        laserGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.85)');
        laserGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.fillStyle = laserGrad;
        ctx.fillRect(cx - halfBox, scanLineY - 18, boxSize, 36);

        // Core laser wire
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(cx - halfBox, scanLineY);
        ctx.lineTo(cx + halfBox, scanLineY);
        ctx.stroke();
        ctx.restore();
      }

      pulseAngle += 0.05;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [status]);

  // Execute Face Scan Sequence
  const startFaceScan = () => {
    playSound.biometricScanHum();
    setStatus('scanning');
    setProgress(0);
    setLogs([
      'Initiating high-frequency optical face scan...',
      'Projecting structured light grid on facial contours...',
    ]);

    let currentProgress = 0;
    scanIntervalRef.current = setInterval(() => {
      currentProgress += 5;
      setProgress((p) => Math.min(p + 5, 100));

      if (currentProgress === 20) {
        playSound.targetLock();
        setLogs((l) => [...l, 'Facial geometry acquired: 128 nodal anchor points locked.']);
      }
      if (currentProgress === 45) {
        playSound.biometricScanHum();
        setLogs((l) => [...l, 'Scanning iris dilation & retinal vascular pattern...']);
      }
      if (currentProgress === 70) {
        playSound.targetLock();
        setStatus('analyzing');
        setLogs((l) => [...l, `Matching bio-cryptographic hash against operator: ${userName}...`]);
      }
      if (currentProgress === 90) {
        setLogs((l) => [...l, 'Confidence coefficient: 99.94%. Verification successful.']);
      }

      if (currentProgress >= 100) {
        clearInterval(scanIntervalRef.current);
        setStatus('granted');
        playSound.accessGranted();
        setLogs((l) => [
          ...l,
          `ACCESS GRANTED // IDENTITY CONFIRMED: ${userName.toUpperCase()}`,
          'Unlocking G-IT workstation neural bus...',
        ]);

        // Speak unlock welcome
        if (onSpeakGreeting) {
          onSpeakGreeting(
            `Identity confirmed: ${userName}. Biometric authentication verified. Welcome back to G-IT.`
          );
        }

        // Transition into app after brief victory hold
        setTimeout(() => {
          onAuthenticated();
        }, 1400);
      }
    }, 120);
  };

  const handleManualOverride = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept standard overrides (e.g. "STARK", "GRAY", "3000", "GIT", or non-empty demo password)
    if (
      overrideCode.trim().toLowerCase() === 'stark' ||
      overrideCode.trim().toLowerCase() === 'gray' ||
      overrideCode.trim().toLowerCase() === '3000' ||
      overrideCode.trim().toLowerCase() === 'git' ||
      overrideCode.trim().length >= 4
    ) {
      playSound.accessGranted();
      setStatus('granted');
      setLogs((l) => [...l, `MANUAL OVERRIDE ACCEPTED // OPERATOR: ${userName}`]);
      if (onSpeakGreeting) {
        onSpeakGreeting(`Override code accepted. Welcome, ${userName}.`);
      }
      setTimeout(() => {
        onAuthenticated();
      }, 900);
    } else {
      playSound.accessDenied();
      setOverrideError(true);
      setTimeout(() => setOverrideError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02060e] text-cyan-100 font-sans hud-grid select-none">
      {/* Scanline texture */}
      <div className="fixed inset-0 pointer-events-none scanlines z-10 opacity-70" />

      {/* Main Biometric Security Container */}
      <div className="relative w-full max-w-2xl bg-[#040e1b]/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.2)] p-6 sm:p-8 space-y-6 z-20 flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/25">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950/80 border border-cyan-400/40 rounded-lg text-cyan-400">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-tech uppercase tracking-widest text-cyan-400 block">
                STARK / G-IT SOVEREIGN BIO-SECURITY
              </span>
              <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-wide">
                Terminal Access Authentication
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-tech px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                status === 'granted'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-950/60 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : status === 'scanning' || status === 'analyzing'
                  ? 'border-cyan-400 text-cyan-200 bg-cyan-950/60 animate-pulse'
                  : 'border-amber-400/50 text-amber-300 bg-amber-950/40'
              }`}
            >
              {status === 'granted' ? (
                <>
                  <Unlock className="w-3 h-3 text-emerald-400" /> UNLOCKED
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-400" /> SECURE LOCK
                </>
              )}
            </span>
          </div>
        </div>

        {/* Center Face-Scan Chamber */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center bg-[#020812] border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.1)] overflow-hidden">
          {/* Optional Webcam Video Feed under the Canvas */}
          {useWebcam && (
            <video
              ref={videoRef}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-90 opacity-75"
            />
          )}

          {/* Interactive Holographic Canvas */}
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-full h-full relative z-10 pointer-events-none drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]"
          />

          {/* Status Overlay Banner inside viewport */}
          <div className="absolute bottom-2 left-2 right-2 text-center z-20">
            <span
              className={`text-[11px] font-tech uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${
                status === 'granted'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                  : status === 'scanning'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 animate-pulse'
                  : status === 'analyzing'
                  ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                  : 'bg-black/60 border-cyan-500/30 text-cyan-300/80'
              }`}
            >
              {status === 'idle'
                ? 'POSITION FACE IN RETICLE'
                : status === 'scanning'
                ? `SCANNING // ${progress}%`
                : status === 'analyzing'
                ? 'VERIFYING BIO-HASH...'
                : 'IDENTITY CONFIRMED // UNLOCKING'}
            </span>
          </div>
        </div>

        {/* Telemetry Terminal Output */}
        <div className="w-full bg-[#020810] border border-cyan-500/25 rounded-lg p-3 font-tech text-xs text-cyan-300 min-h-[90px] max-h-[110px] overflow-y-auto space-y-1">
          <div className="flex items-center justify-between text-[10px] text-cyan-400/60 pb-1 border-b border-cyan-500/15">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3" /> G-IT BIOMETRIC BUS
            </span>
            <span>TARGET: {userName.toUpperCase()}</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-1.5 leading-tight">
              <span className="text-cyan-500 select-none">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Webcam Toggle Button */}
          {webcamAvailable && (
            <button
              type="button"
              onClick={() => {
                playSound.click();
                setUseWebcam(!useWebcam);
              }}
              className={`px-3.5 py-2 rounded-lg border text-xs font-tech transition-colors flex items-center gap-2 ${
                useWebcam
                  ? 'bg-cyan-900/60 border-cyan-400 text-cyan-100'
                  : 'bg-[#061421] border-cyan-500/25 text-cyan-300/70 hover:border-cyan-400 hover:text-white'
              }`}
            >
              {useWebcam ? (
                <>
                  <CameraOff className="w-4 h-4 text-cyan-400" /> Use Holographic Avatar
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-cyan-400" /> Enable Webcam Scan
                </>
              )}
            </button>
          )}

          {/* Primary Biometric Face-Scan CTA */}
          {status !== 'granted' ? (
            <button
              type="button"
              onClick={startFaceScan}
              disabled={status === 'scanning' || status === 'analyzing'}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-xl shadow-[0_0_25px_rgba(0,255,170,0.4)] transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              {status === 'scanning' || status === 'analyzing' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin fill-black" /> Scanning Operator...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" /> Scan Face to Unlock G-IT
                </>
              )}
            </button>
          ) : (
            <div className="px-6 py-2.5 bg-emerald-500 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Access Authorized
            </div>
          )}
        </div>

        {/* Manual Passcode Bypass Footer */}
        <div className="w-full pt-2 border-t border-cyan-500/15 flex flex-col items-center gap-2 text-center">
          {!showOverrideInput ? (
            <button
              type="button"
              onClick={() => {
                playSound.click();
                setShowOverrideInput(true);
              }}
              className="text-[11px] font-tech text-cyan-400/60 hover:text-cyan-200 transition-colors flex items-center gap-1"
            >
              <Key className="w-3 h-3" /> Manual Keycode Bypass / Override
            </button>
          ) : (
            <form onSubmit={handleManualOverride} className="flex items-center gap-2 w-full max-w-sm animate-in fade-in">
              <input
                type="password"
                value={overrideCode}
                onChange={(e) => setOverrideCode(e.target.value)}
                placeholder="Enter bypass code (e.g. STARK or 3000)..."
                className={`flex-1 bg-[#020810] border rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono ${
                  overrideError ? 'border-red-500 animate-shake' : 'border-cyan-500/40 focus:border-cyan-400'
                }`}
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-900 hover:bg-cyan-800 text-cyan-200 font-tech text-xs rounded-lg border border-cyan-400/40 transition-colors"
              >
                Override
              </button>
              <button
                type="button"
                onClick={() => setShowOverrideInput(false)}
                className="text-xs text-cyan-400/60 hover:text-cyan-200 font-tech"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
