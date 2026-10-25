export interface GitProtocol {
  id: string;
  code: string;
  name: string;
  category: 'System Defense' | 'Neural Reasoning' | 'DevOps & Code' | 'Swarm Automation' | 'Biometrics & Focus';
  description: string;
  triggerPhrase: string;
  thinkingMode: boolean;
  colorScheme: 'emerald' | 'cyan' | 'amber' | 'purple' | 'crimson';
  steps: string[];
  executionSpeedMs: number;
}

export interface GitSubsystemSpec {
  tier: number;
  name: string;
  codename: string;
  status: 'ACTIVE' | 'CALIBRATING' | 'ARMED';
  description: string;
  techStack: string;
  metrics: { label: string; value: string }[];
}

export const GIT_ARCHITECTURE_TIERS: GitSubsystemSpec[] = [
  {
    tier: 1,
    name: 'Quantum Cognitive Core',
    codename: 'NEXUS-ARGON',
    status: 'ACTIVE',
    description: 'High-reasoning deliberative engine powered by Gemini 4 Argon with High Thinking Level. Handles complex vector calculations, code refactoring, and multi-step logic trees.',
    techStack: 'Gemini 4 Argon // ThinkingLevel.HIGH // Recursive Tree Search',
    metrics: [
      { label: 'Compute Level', value: 'High Thinking' },
      { label: 'Latency', value: 'Dynamic / Stream' },
      { label: 'Context Horizon', value: '1.0M+ Tokens' },
    ],
  },
  {
    tier: 2,
    name: 'Acoustic & Vocal Perception Matrix',
    codename: 'SONIC-VOX',
    status: 'ACTIVE',
    description: 'Bilateral speech interaction with continuous Web Speech input recognition and Gemini 3.8 Flash Lite neural speech synthesis with British-cadence frequency shaping.',
    techStack: 'Web Audio API // AnalyserNode // Gemini 3.8 Flash Lite TTS',
    metrics: [
      { label: 'Sample Rate', value: '24.0 kHz' },
      { label: 'Audio Latency', value: '<180 ms' },
      { label: 'Voice Profile', value: 'Fenrir / British AI' },
    ],
  },
  {
    tier: 3,
    name: 'Autonomous Protocol Engine',
    codename: 'ORCHESTRA-BUS',
    status: 'ARMED',
    description: 'State machine for custom macro execution, multi-agent task distribution, automated code audits, and simulated environmental actuation.',
    techStack: 'Asynchronous State Machine // Event-Driven Dispatcher',
    metrics: [
      { label: 'Active Protocols', value: '5 Built-in + Custom' },
      { label: 'Concurrency', value: '32 Sub-threads' },
      { label: 'Failsafe Tripwire', value: 'Zero Overrides' },
    ],
  },
  {
    tier: 4,
    name: 'Distributed Telemetry & Edge Hub',
    codename: 'HYPER-GRID',
    status: 'ACTIVE',
    description: 'Real-time telemetry pipeline ingesting system hardware specs, memory allocations, git branches, network latency, and environmental sensors.',
    techStack: 'Express.js Full-Stack Bridge // Vite Middleware // WebSockets Ready',
    metrics: [
      { label: 'Telemetry Bus', value: 'Sub-Millisecond' },
      { label: 'Grid Stability', value: '99.98%' },
      { label: 'Memory Footprint', value: 'Lightweight SPA' },
    ],
  },
  {
    tier: 5,
    name: 'Sovereign Enclave & Biometrics',
    codename: 'AEGIS-SHIELD',
    status: 'ACTIVE',
    description: 'Zero-trust cryptographic isolation, API key shielding on the server boundary, user callsign authentication, and cognitive focus pace tracking.',
    techStack: 'Server-Side Secret Isolation // TLS 1.3 // OAuth Scopes Ready',
    metrics: [
      { label: 'Key Exposure', value: '0% (Server Only)' },
      { label: 'Crypto Entropy', value: '256-bit AES' },
      { label: 'Access Control', value: 'Commander Level' },
    ],
  },
];

export const DEFAULT_GIT_PROTOCOLS: GitProtocol[] = [
  {
    id: 'protocol-g1',
    code: 'G-IT // PROTOCOL 01',
    name: 'Deep Matrix Focus',
    category: 'Biometrics & Focus',
    description: 'Suppresses extraneous peripheral telemetry, tunes acoustic feedback to 432Hz harmonic tone, allocates 100% compute tokens to active problem solving, and initiates deep focus timer.',
    triggerPhrase: 'G-IT, engage Deep Matrix Focus',
    thinkingMode: true,
    colorScheme: 'emerald',
    steps: [
      'De-escalating background interrupt threads...',
      'Allocating high-thinking compute quota to active terminal query...',
      'Synthesizing harmonic resonance audio frequency...',
      'Deep Focus workspace engaged, Commander Gray. Time allocation: 45 min.',
    ],
    executionSpeedMs: 220,
  },
  {
    id: 'protocol-g2',
    code: 'G-IT // PROTOCOL 02',
    name: 'Code Fortress Defense',
    category: 'DevOps & Code',
    description: 'Conducts real-time security audit across client and server boundaries, verifies zero API key leakage in browser bundles, and scans for memory leaks.',
    triggerPhrase: 'G-IT, initiate Code Fortress Defense',
    thinkingMode: false,
    colorScheme: 'cyan',
    steps: [
      'Scanning client-side bundles for exposed secrets...',
      'Validating server-side /api/chat and /api/tts endpoint headers...',
      'Inspecting bundle size and DOM node retention...',
      'Fortress parameters verified: All tokens secured behind server bastion.',
    ],
    executionSpeedMs: 180,
  },
  {
    id: 'protocol-g3',
    code: 'G-IT // PROTOCOL 03',
    name: 'Autonomous Swarm Orchestration',
    category: 'Swarm Automation',
    description: 'Inspired by the MCU House Party Protocol, G-IT spins up simulated sub-agents to analyze multi-variable coding, physics, and design challenges in parallel.',
    triggerPhrase: 'G-IT, deploy Autonomous Swarm',
    thinkingMode: true,
    colorScheme: 'amber',
    steps: [
      'Spawning 4 specialized agent instances (Architect, Security, UI, Telemetry)...',
      'Distributing payload matrices across neural pipelines...',
      'Aggregating consensus vector calculations...',
      'Swarm synchronized. Consensus reached with 99.4% confidence.',
    ],
    executionSpeedMs: 240,
  },
  {
    id: 'protocol-g4',
    code: 'G-IT // PROTOCOL 04',
    name: 'Clean Slate Refactor',
    category: 'System Defense',
    description: 'Purges cached transient state, clears conversation buffers, resets acoustic baseline, and re-optimizes memory allocation for fresh missions.',
    triggerPhrase: 'G-IT, execute Clean Slate Refactor',
    thinkingMode: false,
    colorScheme: 'purple',
    steps: [
      'Flushing transient audio buffers and DOM cache...',
      'Resetting acoustic microphone gain calibration...',
      'Synchronizing local storage state...',
      'Clean Slate complete: Mainframe refreshed to baseline efficiency.',
    ],
    executionSpeedMs: 160,
  },
  {
    id: 'protocol-g5',
    code: 'G-IT // PROTOCOL 05',
    name: 'Quantum Synthesis Protocol',
    category: 'Neural Reasoning',
    description: 'Advanced heuristic problem solver deploying Gemini 4 Argon with High Thinking to formulate novel engineering solutions, algorithms, and architectures.',
    triggerPhrase: 'G-IT, initiate Quantum Synthesis',
    thinkingMode: true,
    colorScheme: 'crimson',
    steps: [
      'Engaging Gemini 4 Argon multi-layer reasoning lattice...',
      'Exploring non-linear problem space & theoretical constraints...',
      'Calculating predictive stability & edge cases...',
      'Synthesis crystallized: High-dimensional solution validated.',
    ],
    executionSpeedMs: 280,
  },
];
