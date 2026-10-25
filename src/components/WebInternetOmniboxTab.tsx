import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Search, ExternalLink, Share2, Music, Play, Pause, Volume2, 
  ShieldCheck, RefreshCw, Send, CheckCircle2, Sparkles, 
  Github, Twitter, Youtube, MessageSquare, Linkedin, Radio, 
  ArrowUpRight, Cpu, Bookmark, Disc
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

interface WebSource {
  title: string;
  url: string;
}

interface WebSearchResult {
  query: string;
  category: string;
  summary: string;
  sources: WebSource[];
  latencyMs: number;
  timestamp: string;
}

interface SocialPlatform {
  id: string;
  name: string;
  category: 'code' | 'social' | 'media' | 'community' | 'pro';
  icon: any;
  color: string;
  borderColor: string;
  url: string;
  handle: string;
  status: 'AUTHENTICATED' | 'CONNECTED' | 'STANDBY';
  quickActions: { label: string; action: string }[];
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'github',
    name: 'GitHub Enterprise & Cloud',
    category: 'code',
    icon: Github,
    color: 'from-gray-900 to-emerald-950',
    borderColor: 'border-emerald-500/40',
    url: 'https://github.com',
    handle: '@CommanderGray',
    status: 'AUTHENTICATED',
    quickActions: [
      { label: 'Search Repositories', action: 'Search trending TypeScript and AI repos on GitHub' },
      { label: 'Draft Release Notes', action: 'Draft GitHub release notes for G-IT v5.0 milestone' },
      { label: 'Issue Triage', action: 'Summarize unresolved issues on repository' },
    ],
  },
  {
    id: 'twitter',
    name: 'X (formerly Twitter)',
    category: 'social',
    icon: Twitter,
    color: 'from-blue-950 to-cyan-950',
    borderColor: 'border-cyan-500/40',
    url: 'https://x.com',
    handle: '@GrayTacticalAI',
    status: 'AUTHENTICATED',
    quickActions: [
      { label: 'AI Trend Scanner', action: 'Scan latest #AI and #Tech trending topics on X' },
      { label: 'Draft Viral Thread', action: 'Compose a 4-tweet thread explaining G-IT architecture' },
      { label: 'Ecosystem Monitor', action: 'Check announcements from leading AI researchers' },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube Media & Streams',
    category: 'media',
    icon: Youtube,
    color: 'from-red-950 to-rose-950',
    borderColor: 'border-red-500/40',
    url: 'https://youtube.com',
    handle: 'Commander Gray Lab',
    status: 'CONNECTED',
    quickActions: [
      { label: 'Find Research Lectures', action: 'Find top video lectures on quantum neural networks' },
      { label: 'Stream Lo-Fi Station', action: 'Tune into 24/7 sci-fi coding synth stream' },
      { label: 'MCU J.A.R.V.I.S. Archive', action: 'Lookup Iron Man Mark 50 nanotech suit activation scenes' },
    ],
  },
  {
    id: 'reddit',
    name: 'Reddit Tech & Engineering',
    category: 'community',
    icon: MessageSquare,
    color: 'from-orange-950 to-amber-950',
    borderColor: 'border-amber-500/40',
    url: 'https://reddit.com',
    handle: 'u/GrayCommander',
    status: 'CONNECTED',
    quickActions: [
      { label: 'r/LocalLLaMA Intelligence', action: 'Search r/LocalLLaMA for newest reasoning benchmarks' },
      { label: 'r/webdev Discussions', action: 'Scan r/webdev for React 19 architecture discussions' },
      { label: 'Draft Forum Inquiry', action: 'Draft a Reddit discussion post about building sovereign AI assistants' },
    ],
  },
  {
    id: 'discord',
    name: 'Discord Neural Mesh & Comm',
    category: 'community',
    icon: Radio,
    color: 'from-indigo-950 to-purple-950',
    borderColor: 'border-purple-500/40',
    url: 'https://discord.com',
    handle: 'CommanderGray#0001',
    status: 'AUTHENTICATED',
    quickActions: [
      { label: 'Dev Server Ping', action: 'Check status of primary Discord developer webhooks' },
      { label: 'Broadcast Update', action: 'Compose markdown announcement for team server' },
      { label: 'Community Feedback', action: 'Synthesize user feedback log from support channels' },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Professional Matrix',
    category: 'pro',
    icon: Linkedin,
    color: 'from-blue-950 to-indigo-950',
    borderColor: 'border-blue-500/40',
    url: 'https://linkedin.com',
    handle: 'Commander Gray (AI Systems Architect)',
    status: 'AUTHENTICATED',
    quickActions: [
      { label: 'Executive Thought Post', action: 'Draft a LinkedIn article on sovereign AI CPUs' },
      { label: 'Industry Market Scan', action: 'Summarize enterprise sovereign AI adoption news' },
      { label: 'Profile Technical Bio', action: 'Refine professional bio emphasizing multi-modal AI orchestration' },
    ],
  },
];

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  freq: number;
  description: string;
}

const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    title: 'Stark Lab Deep Focus',
    artist: 'G-IT Synthetic Soundcore',
    genre: 'Lo-Fi Cyberpunk',
    freq: 432,
    description: 'Sub-bass ambient drone with rhythmic analog clicks designed for unbroken coding flow.',
  },
  {
    id: 'track-2',
    title: 'Kryptonian Solar Resonance',
    artist: 'Genesis Codex Chamber',
    genre: 'Binaural Harmonics',
    freq: 528,
    description: 'Cellular rejuvenation frequency (528 Hz) tuned for deep cognitive sprint sessions.',
  },
  {
    id: 'track-3',
    title: 'E.D.I.T.H. Orbital Surveillance',
    artist: 'Satellite Grid Matrix',
    genre: 'Cinematic Synthwave',
    freq: 120,
    description: 'Pulsing 120 BPM electro-arpeggio evoking high-altitude drone tactical coordinates.',
  },
  {
    id: 'track-4',
    title: 'Quantum Torus Singularity',
    artist: 'Reactor Zero',
    genre: 'Dark Ambient Drone',
    freq: 60,
    description: 'Ultra-low frequency magnetic resonance mimicking continuous arc-reactor containment.',
  },
];

interface WebInternetOmniboxTabProps {
  onAskGit: (prompt: string) => void;
  onSimulateAction: (title: string, details: string) => void;
  userName: string;
}

export const WebInternetOmniboxTab: React.FC<WebInternetOmniboxTabProps> = ({
  onAskGit,
  onSimulateAction,
  userName,
}) => {
  const [activeSubView, setActiveSubView] = useState<'search' | 'social' | 'player' | 'vault'>('search');
  
  // Web Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'general' | 'tech' | 'news' | 'academic'>('general');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<WebSearchResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Latest advancements in neuromorphic computing architectures',
    'Real-time Web Audio API frequency analysis patterns',
    'Comparison of Gemini 2.5 Flash vs Gemini 4 Argon reasoning benchmarks',
  ]);

  // Social Composer State
  const [composerPlatform, setComposerPlatform] = useState<string>('twitter');
  const [composerTopic, setComposerTopic] = useState('');
  const [composerTone, setComposerTone] = useState('tactical');
  const [isComposing, setIsComposing] = useState(false);
  const [composedOutput, setComposedOutput] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Audio Streamer State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0.4);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Stop procedural audio on unmount
  useEffect(() => {
    return () => {
      stopProceduralAudio();
    };
  }, []);

  const startProceduralAudio = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Main Oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // LFO for subtle cyber pulsation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.05, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(audioVolume * 0.15, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      lfoRef.current = lfo;
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn('Audio synth start error:', e);
    }
  };

  const stopProceduralAudio = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current.disconnect();
        lfoRef.current = null;
      }
      setIsPlayingAudio(false);
    } catch (e) {
      console.warn('Audio synth stop error:', e);
    }
  };

  const toggleTrackPlay = (index: number) => {
    triggerHaptic('repulsorCharge');
    if (isPlayingAudio && currentTrackIndex === index) {
      stopProceduralAudio();
      playSound.click();
    } else {
      stopProceduralAudio();
      setCurrentTrackIndex(index);
      startProceduralAudio(AUDIO_TRACKS[index].freq);
      playSound.repulsorCharge();
    }
  };

  // Execute Web Search
  const handleExecuteSearch = async (queryText?: string) => {
    const q = (queryText || searchQuery).trim();
    if (!q) return;

    playSound.quantumThinking();
    triggerHaptic('scanTick');
    setIsSearching(true);
    setSearchResult(null);

    try {
      const response = await fetch('/api/web/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          category: searchCategory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data = await response.json();
      setSearchResult(data);
      playSound.targetLock();
      triggerHaptic('biometricSuccess');

      // Update recent searches
      if (!recentSearches.includes(q)) {
        setRecentSearches((prev) => [q, ...prev.slice(0, 4)]);
      }

      onSimulateAction(
        `Web Intelligence Sweep: "${q.slice(0, 35)}"`,
        `Retrieved grounded intelligence with ${data.sources?.length || 0} external citations.`
      );
    } catch (err: any) {
      console.error('Web search error:', err);
      playSound.warningAlert();
      triggerHaptic('quantumThinking');
    } finally {
      setIsSearching(false);
    }
  };

  // Execute Social Composer
  const handleComposePost = async () => {
    if (!composerTopic.trim()) return;

    playSound.quantumThinking();
    triggerHaptic('scanTick');
    setIsComposing(true);

    try {
      const response = await fetch('/api/web/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: composerPlatform,
          topic: composerTopic,
          tone: composerTone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Compose error: HTTP ${response.status}`);
      }

      const data = await response.json();
      setComposedOutput(data.content);
      playSound.targetLock();
      triggerHaptic('biometricSuccess');

      onSimulateAction(
        `Social Broadcast Synthesized for ${composerPlatform.toUpperCase()}`,
        `Topic: ${composerTopic.slice(0, 40)}... Tone: ${composerTone}.`
      );
    } catch (err: any) {
      console.error('Compose error:', err);
      playSound.warningAlert();
    } finally {
      setIsComposing(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    playSound.click();
    triggerHaptic('scanTick');
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Global Web & Internet Status */}
      <div className="p-4 sm:p-5 bg-[#05111c] border border-cyan-500/35 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-950 border border-cyan-400/50 rounded-lg text-cyan-400">
                <Globe className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-xl font-bold font-display text-white tracking-wide">
                G-IT Global Internet &amp; Social Command Center
              </h2>
            </div>
            <p className="text-xs text-cyan-200/80 font-sans max-w-2xl">
              Real-time internet reconnaissance, Google Search grounding engine, social media platform transmitters, and streaming audio workstation synthesized for {userName}.
            </p>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#030912] p-1.5 border border-cyan-500/25 rounded-xl text-xs font-tech">
            <button
              onClick={() => {
                playSound.click();
                setActiveSubView('search');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubView === 'search'
                  ? 'bg-cyan-500/30 border border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-cyan-300/70 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Web Omnibox</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                setActiveSubView('social');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubView === 'social'
                  ? 'bg-cyan-500/30 border border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-cyan-300/70 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Social Platforms ({SOCIAL_PLATFORMS.length})</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                setActiveSubView('player');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubView === 'player'
                  ? 'bg-cyan-500/30 border border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-cyan-300/70 hover:text-white'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-400 animate-spin' : 'text-amber-400'}`} />
              <span>Audio Workstation {isPlayingAudio && '(PLAYING)'}</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                setActiveSubView('vault');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeSubView === 'vault'
                  ? 'bg-cyan-500/30 border border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-cyan-300/70 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>SSO Gateway</span>
            </button>
          </div>
        </div>

        {/* Global Network Health Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-cyan-500/20 text-[11px] font-tech">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-cyan-400/70">GATEWAY:</span>
            <span className="text-emerald-300 font-bold">100% ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400/70">GROUNDING:</span>
            <span className="text-white font-bold">GOOGLE SEARCH</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-cyan-400/70">MEDIA AUDIO:</span>
            <span className={isPlayingAudio ? 'text-amber-300 font-bold' : 'text-cyan-400/70'}>
              {isPlayingAudio ? `${AUDIO_TRACKS[currentTrackIndex].title}` : 'STANDBY'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-cyan-400/70">OPERATOR:</span>
            <span className="text-blue-300 font-bold">{userName}</span>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: Real-time Web Research Omnibox */}
      {activeSubView === 'search' && (
        <div className="space-y-6">
          {/* Omnibox Search Bar */}
          <div className="p-4 sm:p-5 bg-[#05111c] border border-cyan-500/30 rounded-xl space-y-4">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-400">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Internet Query Uplink
              </span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/60">Category:</span>
                {(['general', 'tech', 'news', 'academic'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      playSound.click();
                      setSearchCategory(cat);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                      searchCategory === cat
                        ? 'bg-cyan-500/30 text-white border border-cyan-400'
                        : 'bg-[#030912] text-cyan-400/60 hover:text-cyan-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteSearch();
              }}
              className="relative flex items-center"
            >
              <div className="absolute left-3.5 pointer-events-none text-cyan-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Access anything on the internet: research technologies, look up live news, search repos..."
                className="w-full bg-[#030a14] border border-cyan-500/40 rounded-xl pl-11 pr-28 py-3.5 text-sm text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/40 font-mono"
              />

              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className={`absolute right-2 px-4 py-2 rounded-lg font-tech text-xs tracking-wider uppercase font-bold transition-all flex items-center gap-1.5 ${
                  isSearching
                    ? 'bg-cyan-800 text-cyan-200 cursor-not-allowed animate-pulse'
                    : searchQuery.trim()
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-cyan-950 text-cyan-600 cursor-not-allowed'
                }`}
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sweeping...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-tech">
              <span className="text-cyan-400/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Instant Intel:
              </span>
              {[
                'Latest AI robotics breakthroughs 2026',
                'TypeScript 5.8 experimental features',
                'Next-gen sodium-ion battery advancements',
                'Top trending GitHub repositories today',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSearchQuery(chip);
                    handleExecuteSearch(chip);
                  }}
                  className="px-2.5 py-1 bg-[#040f1a] hover:bg-cyan-950/60 border border-cyan-500/25 hover:border-cyan-400 text-cyan-300 rounded-md transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Display */}
          {searchResult && (
            <div className="p-5 bg-[#05111c] border border-cyan-500/40 rounded-xl space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.15)] animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cyan-500/25 text-xs font-tech">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-bold uppercase">
                    INTERNET INTEL BRIEF
                  </span>
                  <span className="text-white font-mono">&ldquo;{searchResult.query}&rdquo;</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-400/70">
                  <span>Latency: {searchResult.latencyMs}ms</span>
                  <span>•</span>
                  <span>{searchResult.sources.length} Verified Sources Grounded</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-[#030a14] p-4 rounded-xl border border-cyan-500/25 space-y-3 font-sans text-sm text-cyan-100 leading-relaxed whitespace-pre-line">
                {searchResult.summary}
              </div>

              {/* Grounded Web Sources */}
              {searchResult.sources && searchResult.sources.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-tech uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> Cited Internet Sources &amp; Domains
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {searchResult.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-[#030a14] hover:bg-cyan-950/70 border border-cyan-500/25 hover:border-cyan-400 rounded-lg text-xs font-mono text-cyan-300 transition-all flex items-center justify-between group"
                      >
                        <span className="truncate pr-2">{src.title || src.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  onClick={() => {
                    playSound.click();
                    onAskGit(
                      `G-IT, take the findings from our internet search on "${searchResult.query}" and formulate a tactical implementation roadmap for our workstation projects.`
                    );
                  }}
                  className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 rounded-lg font-tech text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Synthesize into Workstation Project &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* Recent Queries Grid */}
          <div className="p-4 bg-[#05111c]/80 border border-cyan-500/20 rounded-xl space-y-2">
            <span className="text-xs font-tech uppercase text-cyan-400/80">Previous Reconnaissance Queries</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recentSearches.map((rec, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(rec);
                    handleExecuteSearch(rec);
                  }}
                  className="p-2.5 bg-[#030a14] hover:bg-cyan-950/50 border border-cyan-500/20 hover:border-cyan-400/50 text-left rounded-lg text-xs font-mono text-cyan-200 truncate transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{rec}</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan-400/60 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Social Media Platforms Command Deck */}
      {activeSubView === 'social' && (
        <div className="space-y-6">
          {/* Social Platform Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOCIAL_PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.id}
                  className={`bg-gradient-to-br ${platform.color} border ${platform.borderColor} rounded-xl p-4 space-y-3 shadow-lg relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-black/50 border border-white/10 rounded-lg text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-white text-sm">{platform.name}</h3>
                        <span className="text-[10px] font-mono text-cyan-300/80">{platform.handle}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-tech px-2 py-0.5 rounded bg-black/60 border border-emerald-400/50 text-emerald-400 uppercase">
                      {platform.status}
                    </span>
                  </div>

                  {/* Quick actions for this platform */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-tech text-white/60 uppercase">Tactical Automations:</span>
                    {platform.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          playSound.click();
                          setComposerPlatform(platform.id);
                          setComposerTopic(qa.action);
                          setActiveSubView('social');
                          onAskGit(`G-IT, execute social integration protocol for ${platform.name}: "${qa.action}".`);
                        }}
                        className="w-full text-left p-1.5 bg-black/40 hover:bg-black/70 border border-white/10 hover:border-cyan-400/50 rounded text-xs font-mono text-cyan-100 flex items-center justify-between transition-colors group"
                      >
                        <span className="truncate">{qa.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-cyan-400 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Direct Launch Button */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setComposerPlatform(platform.id);
                      }}
                      className="text-[11px] font-tech text-cyan-300 hover:text-white flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> Compose Broadcast
                    </button>

                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-tech text-white/80 hover:text-white bg-black/40 px-2.5 py-1 rounded border border-white/20 hover:border-white/50 flex items-center gap-1"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social Post / Broadcast Synthesizer */}
          <div className="p-5 bg-[#05111c] border border-cyan-500/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-tech text-cyan-400">
              <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <Share2 className="w-4 h-4 text-emerald-400 animate-pulse" /> G-IT Cross-Platform Broadcast Synthesizer
              </span>
              <span className="text-[10px] text-cyan-300/70">
                Target Platform: <strong className="text-white uppercase">{composerPlatform}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-tech text-cyan-300 block mb-1">Target Network:</label>
                <select
                  value={composerPlatform}
                  onChange={(e) => setComposerPlatform(e.target.value)}
                  className="w-full bg-[#030a14] border border-cyan-500/30 rounded-lg p-2.5 text-xs font-tech text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="twitter">X (Twitter) - Viral Single &amp; Thread</option>
                  <option value="github">GitHub - Release Notes &amp; README</option>
                  <option value="reddit">Reddit - In-depth Discussion Post</option>
                  <option value="linkedin">LinkedIn - Professional Engineering Update</option>
                  <option value="discord">Discord - Formatted Announcement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-tech text-cyan-300 block mb-1">Tone Calibration:</label>
                <select
                  value={composerTone}
                  onChange={(e) => setComposerTone(e.target.value)}
                  className="w-full bg-[#030a14] border border-cyan-500/30 rounded-lg p-2.5 text-xs font-tech text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="tactical">Tactical &amp; High-Intel (G-IT Signature)</option>
                  <option value="provocative">Bold &amp; Thought-Provoking (Engagement)</option>
                  <option value="engineering">Deep Technical &amp; Rigorous (Engineers)</option>
                  <option value="concise">Ultra-Concise &amp; Action-Oriented</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-tech text-cyan-300 block mb-1">Trigger Broadcast:</label>
                <button
                  onClick={handleComposePost}
                  disabled={isComposing || !composerTopic.trim()}
                  className={`w-full py-2.5 px-4 rounded-lg font-tech text-xs tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 ${
                    isComposing
                      ? 'bg-cyan-800 text-cyan-300 cursor-not-allowed animate-pulse'
                      : composerTopic.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-[0_0_15px_rgba(0,255,170,0.3)]'
                      : 'bg-cyan-950 text-cyan-600 cursor-not-allowed'
                  }`}
                >
                  {isComposing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesize Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-tech text-cyan-300 block mb-1">Broadcast Topic or Project Milestone:</label>
              <textarea
                value={composerTopic}
                onChange={(e) => setComposerTopic(e.target.value)}
                placeholder="E.g., Launching G-IT v5.0 with full J.A.R.V.I.S., Spider-Man, and Superman AI integrations. Live telemetry and real-time internet grounding..."
                rows={2}
                className="w-full bg-[#030a14] border border-cyan-500/30 rounded-lg p-3 text-xs font-mono text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Synthesized Output */}
            {composedOutput && (
              <div className="p-4 bg-[#030a14] border border-emerald-500/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-tech text-emerald-400">
                  <span className="flex items-center gap-1.5 uppercase font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ready to Broadcast on {composerPlatform.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleCopyText(composedOutput)}
                    className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-300 rounded font-tech text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedSuccess ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Bookmark className="w-3 h-3" />}
                    <span>{copiedSuccess ? 'COPIED TO CLIPBOARD' : 'COPY CONTENT'}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#02060e] rounded-lg border border-emerald-500/20 font-mono text-xs text-emerald-200 whitespace-pre-wrap leading-relaxed">
                  {composedOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Cyber Workstation Audio Streamer */}
      {activeSubView === 'player' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#05111c] border border-amber-500/35 rounded-xl space-y-5 shadow-[0_0_30px_rgba(255,190,11,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-950/80 border border-amber-400/50 rounded-lg text-amber-400">
                  <Disc className={`w-5 h-5 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    G-IT Neural Audio &amp; Media Workstation
                  </h3>
                  <span className="text-xs font-tech text-amber-400/70">
                    PROCEDURAL SYNTHESIZER // WORKSTATION IMMERSION
                  </span>
                </div>
              </div>

              {/* Master Play/Stop Control */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTrackPlay(currentTrackIndex)}
                  className={`px-4 py-2 rounded-xl font-tech text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                    isPlayingAudio
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-[0_0_20px_rgba(255,190,11,0.4)]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Halt Audio Core</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Stream Active Frequency</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Currently Playing Track Card */}
            <div className="p-4 bg-[#030914] border border-amber-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-amber-950 border border-amber-400/40 text-amber-300 uppercase">
                    ACTIVE FREQUENCY: {AUDIO_TRACKS[currentTrackIndex].freq} HZ
                  </span>
                  <span className="text-xs font-tech text-amber-400">{AUDIO_TRACKS[currentTrackIndex].genre}</span>
                </div>
                <h4 className="text-lg font-bold font-display text-white">
                  {AUDIO_TRACKS[currentTrackIndex].title}
                </h4>
                <p className="text-xs text-amber-200/70 font-sans max-w-xl">
                  {AUDIO_TRACKS[currentTrackIndex].description}
                </p>
              </div>

              {/* Volume & Equalizer Simulation */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-tech text-xs text-amber-400">
                  <Volume2 className="w-4 h-4" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioVolume}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value);
                      setAudioVolume(vol);
                      if (gainNodeRef.current && audioContextRef.current) {
                        gainNodeRef.current.gain.setValueAtTime(vol * 0.15, audioContextRef.current.currentTime);
                      }
                    }}
                    className="w-24 accent-amber-400 cursor-pointer"
                  />
                  <span>{(audioVolume * 100).toFixed(0)}%</span>
                </div>

                {/* Animated frequency equalizer bars */}
                <div className="flex items-end gap-1 h-8 px-2 bg-black/60 rounded border border-amber-500/20">
                  {[40, 70, 90, 50, 80, 60, 95, 30].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-t transition-all duration-150 ${
                        isPlayingAudio ? 'bg-amber-400' : 'bg-amber-500/30'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(15, Math.floor(h * Math.random()))}%` : '20%',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Track Selector List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {AUDIO_TRACKS.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => toggleTrackPlay(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentTrackIndex === idx && isPlayingAudio
                      ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(255,190,11,0.25)]'
                      : 'bg-[#030914] border-amber-500/20 hover:border-amber-400/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display text-white">{track.title}</span>
                      <span className="text-[10px] font-tech text-amber-400/80">({track.freq} Hz)</span>
                    </div>
                    <p className="text-[11px] text-amber-200/60 font-sans">{track.genre}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-black/50 border border-amber-500/30 text-amber-400">
                    {currentTrackIndex === idx && isPlayingAudio ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Universal SSO & Identity Vault */}
      {activeSubView === 'vault' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#05111c] border border-blue-500/35 rounded-xl space-y-4 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-display font-bold text-white text-base">
                  G-IT Universal SSO &amp; Identity Security Enclave
                </h3>
              </div>
              <span className="text-xs font-tech text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-400/40">
                CLEARANCE LEVEL: ALPHA PRIME
              </span>
            </div>

            <p className="text-xs text-blue-200/80 font-sans">
              All browser sessions, internet tokens, and social identities are protected under G-IT&apos;s Sovereign Enclave. Commander Gray is authenticated across all workstation endpoints.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                { name: 'Google Cloud & AI Studio', status: 'SYNCHRONIZED', account: 'gray.workstation@gmail.com' },
                { name: 'GitHub Enterprise', status: 'ACTIVE TOKEN', account: '@CommanderGray' },
                { name: 'X Developer API', status: 'AUTHENTICATED', account: '@GrayTacticalAI' },
                { name: 'Discord Webhook Mesh', status: 'CONNECTED', account: 'DevCluster-Main' },
                { name: 'AWS & Cloud Infrastructure', status: 'ARMED', account: 'IAM: CommanderGray-Root' },
                { name: 'HuggingFace & Model Hub', status: 'SYNCHRONIZED', account: 'hf_commander_gray' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-[#030a14] border border-blue-500/25 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs font-tech">
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-emerald-400">{item.status}</span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-300/70 block truncate">{item.account}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between">
              <span className="text-xs font-tech text-blue-400/70">Biometric Refresh Interval: 24 Hours</span>
              <button
                onClick={() => {
                  playSound.targetLock();
                  triggerHaptic('biometricSuccess');
                  onSimulateAction('SSO Vault Re-Authenticated', 'All session tokens and internet gateway keys refreshed.');
                }}
                className="px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-400/40 text-blue-200 rounded-lg font-tech text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Authenticate All Sessions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
