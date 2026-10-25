import { useState, useRef, useEffect, useCallback } from 'react';
import { playSound } from '../utils/soundEffects';

interface UseJarvisVoiceOptions {
  voiceName?: string; // Gemini voice: Fenrir, Zephyr, Kore, Puck, Charon
  onTranscriptFinal?: (text: string) => void;
}

export function useJarvisVoice({ voiceName = 'Fenrir', onTranscriptFinal }: UseJarvisVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioFrequency, setAudioFrequency] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        playSound.click();
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        setTranscript(fullText);

        if (finalTranscript && onTranscriptFinal) {
          onTranscriptFinal(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [onTranscriptFinal]);

  // Audio frequency analyser loop
  const startFrequencyMonitor = (audioElement: HTMLAudioElement) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateFreq = () => {
        if (!isSpeaking && audioElement.paused) {
          setAudioFrequency(0);
          return;
        }
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength / 255;
        setAudioFrequency(avg);
        animFrameRef.current = requestAnimationFrame(updateFreq);
      };

      animFrameRef.current = requestAnimationFrame(updateFreq);
    } catch {
      // Audio element routing fallback
      const simulatedFreq = () => {
        if (!audioElement.paused) {
          setAudioFrequency(Math.random() * 0.4 + 0.3);
          animFrameRef.current = requestAnimationFrame(simulatedFreq);
        } else {
          setAudioFrequency(0);
        }
      };
      animFrameRef.current = requestAnimationFrame(simulatedFreq);
    }
  };

  // Start listening through mic
  const startListening = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  }, [isSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Stop currently playing speech
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setAudioFrequency(0);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  // Speak with Gemini TTS or browser British English voice
  const speak = useCallback(
    async (text: string) => {
      stopSpeaking();
      setIsSpeaking(true);

      // Clean text of markdown, math symbols, or prompt headers
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/[*_#~`>]/g, '')
        .replace(/\[.*?\]/g, '')
        .trim();

      try {
        // Attempt Server-Side Gemini 3.8 Flash Lite TTS
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, voiceName }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
            const audio = new Audio(audioSrc);
            currentAudioRef.current = audio;

            audio.onended = () => {
              setIsSpeaking(false);
              setAudioFrequency(0);
            };

            audio.onerror = () => {
              fallbackToSpeechSynthesis(cleanText);
            };

            await audio.play();
            startFrequencyMonitor(audio);
            return;
          }
        }
        // If TTS API returned non-OK or empty payload, fallback
        fallbackToSpeechSynthesis(cleanText);
      } catch (err) {
        console.warn('Server TTS unavailable, using browser SpeechSynthesis fallback:', err);
        fallbackToSpeechSynthesis(cleanText);
      }
    },
    [voiceName, stopSpeaking]
  );

  // Browser SpeechSynthesis fallback (British English voice)
  const fallbackToSpeechSynthesis = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Find British English voice if available (similar to Paul Bettany / JARVIS)
    const voices = window.speechSynthesis.getVoices();
    const britishVoice =
      voices.find((v) => v.lang === 'en-GB' && /male|george|oliver|david|daniel/i.test(v.name)) ||
      voices.find((v) => v.lang === 'en-GB') ||
      voices.find((v) => v.lang.startsWith('en'));

    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.rate = 1.02;
    utterance.pitch = 0.95;

    // Simulated frequency oscillation during speech
    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        setAudioFrequency(Math.random() * 0.45 + 0.2);
      } else {
        clearInterval(interval);
        setAudioFrequency(0);
        setIsSpeaking(false);
      }
    }, 100);

    utterance.onend = () => {
      clearInterval(interval);
      setAudioFrequency(0);
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      clearInterval(interval);
      setAudioFrequency(0);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    audioFrequency,
    speechSupported,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
  };
}
