import { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

export type HotkeyTrigger = 'Space' | 'Ctrl+Space' | 'Alt+V' | 'Backquote';
export type HotkeyMode = 'toggle' | 'push_to_talk';

interface UseGlobalHotkeyProps {
  isListening: boolean;
  onToggleListening: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  enabled?: boolean;
}

export function useGlobalHotkey({
  isListening,
  onToggleListening,
  onStartListening,
  onStopListening,
  enabled = true,
}: UseGlobalHotkeyProps) {
  const [hotkey, setHotkey] = useState<HotkeyTrigger>(() => {
    return (localStorage.getItem('git_hotkey') as HotkeyTrigger) || 'Space';
  });
  const [mode, setMode] = useState<HotkeyMode>(() => {
    return (localStorage.getItem('git_hotkey_mode') as HotkeyMode) || 'toggle';
  });
  const [mediaSessionEnabled, setMediaSessionEnabled] = useState<boolean>(() => {
    return localStorage.getItem('git_media_session') !== 'false';
  });
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(false);
  const [hotkeyFiredIndicator, setHotkeyFiredIndicator] = useState<string | null>(null);
  const [isPipActive, setIsPipActive] = useState<boolean>(false);

  const isSpacePressedRef = useRef(false);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('git_hotkey', hotkey);
  }, [hotkey]);

  useEffect(() => {
    localStorage.setItem('git_hotkey_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('git_media_session', String(mediaSessionEnabled));
  }, [mediaSessionEnabled]);

  // Trigger visual indicator
  const notifyHotkeyTriggered = useCallback((source: string) => {
    playSound.jarvisActivate();
    triggerHaptic('scanTick');
    setHotkeyFiredIndicator(source);
    setTimeout(() => {
      setHotkeyFiredIndicator(null);
    }, 1500);
  }, []);

  // Configure navigator.mediaSession for OS-level background hardware hotkeys
  useEffect(() => {
    if (!mediaSessionEnabled || typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'G-IT Voice Command Engine',
        artist: 'General Intelligent Telemetry',
        album: 'Workstation Sovereign CPU',
      });

      const handleOsMediaToggle = () => {
        notifyHotkeyTriggered('OS Hardware Media Key');
        onToggleListening();
      };

      navigator.mediaSession.setActionHandler('play', handleOsMediaToggle);
      navigator.mediaSession.setActionHandler('pause', handleOsMediaToggle);

      // Create an ultra-quiet looping audio track if needed to keep background audio session alive in Chrome
      if (!silentAudioRef.current) {
        // 1-second silent WAV base64
        const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        const audio = new Audio(silentWav);
        audio.loop = true;
        audio.volume = 0.001;
        silentAudioRef.current = audio;
      }
    } catch (e) {
      console.warn('MediaSession setup:', e);
    }

    return () => {
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
        } catch {}
      }
    };
  }, [mediaSessionEnabled, onToggleListening, notifyHotkeyTriggered]);

  // Document keyboard event listener
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in a text field
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      let matched = false;

      if (hotkey === 'Space') {
        // Spacebar triggers if not currently typing in a text input
        if (e.code === 'Space' && !isInput && !e.repeat) {
          matched = true;
          e.preventDefault();
        }
      } else if (hotkey === 'Ctrl+Space') {
        if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
          matched = true;
          e.preventDefault();
        }
      } else if (hotkey === 'Alt+V') {
        if (e.altKey && (e.key === 'v' || e.key === 'V')) {
          matched = true;
          e.preventDefault();
        }
      } else if (hotkey === 'Backquote') {
        if (e.code === 'Backquote' && !isInput) {
          matched = true;
          e.preventDefault();
        }
      }

      if (matched) {
        if (mode === 'push_to_talk') {
          if (!isSpacePressedRef.current) {
            isSpacePressedRef.current = true;
            notifyHotkeyTriggered(`Hotkey [${hotkey}] (Push-to-Talk)`);
            onStartListening();
          }
        } else {
          // Toggle mode
          notifyHotkeyTriggered(`Hotkey [${hotkey}]`);
          onToggleListening();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (mode !== 'push_to_talk') return;

      let matched = false;
      if (hotkey === 'Space' && e.code === 'Space') matched = true;
      else if (hotkey === 'Ctrl+Space' && e.code === 'Space') matched = true;
      else if (hotkey === 'Alt+V' && (e.key === 'v' || e.key === 'V')) matched = true;
      else if (hotkey === 'Backquote' && e.code === 'Backquote') matched = true;

      if (matched && isSpacePressedRef.current) {
        isSpacePressedRef.current = false;
        onStopListening();
        playSound.targetLock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, hotkey, mode, onStartListening, onStopListening, onToggleListening, notifyHotkeyTriggered]);

  // Document Picture-in-Picture API for Always-on-Top Floating Voice Pill
  const toggleDocumentPip = async () => {
    if (typeof window === 'undefined') return;

    const pipWindow = (window as any).documentPictureInPicture;
    if (!pipWindow) {
      alert('Document Picture-in-Picture is supported on Chrome/Edge 116+. You can still use the Spacebar or OS Media Keys!');
      return;
    }

    try {
      if (pipWindow.window) {
        pipWindow.window.close();
        setIsPipActive(false);
        return;
      }

      const pipWin = await pipWindow.requestWindow({
        width: 340,
        height: 200,
      });

      setIsPipActive(true);
      playSound.jarvisActivate();
      triggerHaptic('biometricSuccess');

      // Copy stylesheets to PiP window
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          if (styleSheet.href) {
            const link = pipWin.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            pipWin.document.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = pipWin.document.createElement('style');
            Array.from(styleSheet.cssRules).forEach((rule) => {
              style.appendChild(pipWin.document.createTextNode(rule.cssText));
            });
            pipWin.document.head.appendChild(style);
          }
        } catch {}
      });

      pipWin.document.body.style.margin = '0';
      pipWin.document.body.style.background = '#030813';
      pipWin.document.body.style.color = '#10b981';
      pipWin.document.body.style.fontFamily = 'monospace';

      // Render floating mini controller into PiP
      const container = pipWin.document.createElement('div');
      container.style.padding = '12px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.height = '100vh';
      container.style.boxSizing = 'border-box';
      container.style.textAlign = 'center';

      container.innerHTML = `
        <div style="font-size: 11px; color: #34d399; margin-bottom: 8px; letter-spacing: 1px; font-weight: bold;">
          G-IT DESKTOP ALWAYS-ON-TOP MIC
        </div>
        <button id="pip-mic-btn" style="
          background: #059669; 
          color: white; 
          border: 1px solid #34d399; 
          padding: 10px 18px; 
          border-radius: 8px; 
          font-weight: bold; 
          cursor: pointer; 
          font-size: 13px;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        ">
          🎙️ INITIATE VOICE COMMAND
        </button>
        <div style="font-size: 10px; color: #6ee7b7; margin-top: 8px; opacity: 0.8;">
          HOTKEY: [ ${hotkey} ] ACTIVE ACROSS APPS
        </div>
      `;

      pipWin.document.body.appendChild(container);

      const micBtn = pipWin.document.getElementById('pip-mic-btn');
      if (micBtn) {
        micBtn.onclick = () => {
          onToggleListening();
          notifyHotkeyTriggered('Floating PiP Controller');
        };
      }

      pipWin.addEventListener('pagehide', () => {
        setIsPipActive(false);
      });
    } catch (err) {
      console.error('Failed to open Picture-in-Picture window:', err);
    }
  };

  return {
    hotkey,
    setHotkey,
    mode,
    setMode,
    mediaSessionEnabled,
    setMediaSessionEnabled,
    wakeWordEnabled,
    setWakeWordEnabled,
    hotkeyFiredIndicator,
    isPipActive,
    toggleDocumentPip,
    notifyHotkeyTriggered,
  };
}
