/**
 * G-IT Tactile Haptic Feedback Engine
 * Utilizes the Web Vibration API (navigator.vibrate) with custom rhythmic patterns,
 * paired with a visual haptic pulse emitter for devices without physical vibrators.
 */

export type HapticPatternType =
  | 'click'
  | 'scanTick'
  | 'biometricSuccess'
  | 'accessDenied'
  | 'targetLock'
  | 'repulsorCharge'
  | 'quantumThinking'
  | 'protocolEngaged'
  | 'alarmWarning';

// Millisecond duration arrays [vibrate, pause, vibrate, ...]
const HAPTIC_PATTERNS: Record<HapticPatternType, number | number[]> = {
  click: 8,
  scanTick: 12,
  biometricSuccess: [35, 45, 40, 60, 120],
  accessDenied: [90, 40, 100],
  targetLock: [25, 35, 30],
  repulsorCharge: [40, 30, 80, 40, 140],
  quantumThinking: [15, 25, 20, 30, 35],
  protocolEngaged: [40, 40, 80],
  alarmWarning: [120, 60, 120, 60, 180],
};

// Event emitter so the UI can optionally display a micro-haptic ripple
type HapticListener = (type: HapticPatternType) => void;
const listeners: Set<HapticListener> = new Set();

export const subscribeToHaptics = (fn: HapticListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const triggerHaptic = (type: HapticPatternType = 'click') => {
  try {
    // 1. Hardware vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
    }
  } catch (err) {
    // Graceful silent fallback if permission or hardware is restricted
  }

  // 2. Notify subscribers (for visual tactile pulse on desktop)
  listeners.forEach((listener) => {
    try {
      listener(type);
    } catch {}
  });
};
