export interface HeroAiModel {
  id: string;
  name: string;
  systemCodename: string;
  originHero: 'Spider-Man' | 'Superman' | 'Iron Man';
  originSource: string;
  voiceStyle: string;
  coreRole: string;
  colorScheme: 'red' | 'blue' | 'gold' | 'emerald' | 'cyan';
  capabilities: {
    id: string;
    name: string;
    category: string;
    description: string;
    canonicalQuote: string;
    simulationType: string;
    parameters: { label: string; value: string }[];
  }[];
}

export const HERO_AI_MODELS: HeroAiModel[] = [
  // SPIDER-MAN: KAREN ("Suit Lady")
  {
    id: 'karen-ai',
    name: 'K.A.R.E.N.',
    systemCodename: 'STARK-SPIDER-SUIT-V1',
    originHero: 'Spider-Man',
    originSource: 'Spider-Man: Homecoming (Stark Tech Suit)',
    voiceStyle: 'Warm, reassuring, analytical female voice (voiced by Jennifer Connelly)',
    coreRole: 'Tactical Combat Partner, 576 Web-Shooter Combinations & Enhanced Reconnaissance',
    colorScheme: 'red',
    capabilities: [
      {
        id: 'karen-576-web-combos',
        name: '576 Web-Shooter Combat Ballistics Matrix',
        category: 'Tactical Weapons',
        description: 'Instant dynamic switching between 576 distinct web-fluid firing configurations: Web Grenade, Taser Web, Ricochet Web, Rapid-Fire, Splitter Web, and Web Shield.',
        canonicalQuote: '"You have 576 web shooter combinations. Would you like to select Web Grenade?"',
        simulationType: 'web_ballistics',
        parameters: [
          { label: 'Fluid Pressure', value: '3,200 PSI' },
          { label: 'Tensile Strength', value: '120 MPa' },
          { label: 'Active Combos', value: '576 Patterns' },
        ],
      },
      {
        id: 'karen-enhanced-recon',
        name: 'Enhanced Reconnaissance & Parabolic Audio Eavesdropping',
        category: 'Sensory Telemetry',
        description: 'Directional acoustic beamforming and wall-penetrating vibration sensors to listen to conversations through reinforced concrete and glass at distances up to 800 meters.',
        canonicalQuote: '"Engaging Enhanced Reconnaissance Mode. Directional microphone array focused on target vehicle."',
        simulationType: 'acoustic_recon',
        parameters: [
          { label: 'Acoustic Range', value: '800 Meters' },
          { label: 'Frequency Band', value: '20 Hz - 48 kHz' },
          { label: 'Noise Filtering', value: '-38 dB Ambient' },
        ],
      },
      {
        id: 'karen-baby-monitor-override',
        name: 'Training Wheels Protocol Bypass & Core Unlocking',
        category: 'Firmware Overclocking',
        description: 'Decompilation and safety lock circumvention, granting full administrative privileges, instant diagnostic telemetry, and uninhibited actuator speeds.',
        canonicalQuote: '"Congratulations, Peter. You are now in advanced combat mode. All subroutines unlocked."',
        simulationType: 'protocol_bypass',
        parameters: [
          { label: 'Admin Access', value: 'ROOT / OVERRIDE' },
          { label: 'Firmware Lock', value: 'DISABLED' },
          { label: 'Actuator Torque', value: '100% Uncapped' },
        ],
      },
      {
        id: 'karen-structural-xray',
        name: 'Structural Stress X-Ray & Tensile Failure Calculation',
        category: 'Forensic Engineering',
        description: 'Real-time structural stress modeling of failing infrastructure (Washington Monument elevator shaft, Staten Island ferry hull), calculating split-second load distribution points.',
        canonicalQuote: '"The elevator cable has 12% tensile integrity remaining. You have approximately 42 seconds before complete failure."',
        simulationType: 'structural_xray',
        parameters: [
          { label: 'Cable Tension', value: '48.2 kN' },
          { label: 'Structural Safety', value: 'Critical (8%)' },
          { label: 'Anchor Geometry', value: '3 Points Optimal' },
        ],
      },
      {
        id: 'karen-instant-kill',
        name: 'Instant Kill Mode & Mechanical Waldo Synchronization',
        category: 'Lethal Defense Override',
        description: 'Automated ocular reticle crimson shift, activating four robotic Iron Spider waldoes to eliminate overwhelming alien swarms with 360-degree kinetic reflexes.',
        canonicalQuote: '"Activate Instant Kill? ... Instant Kill mode engaged."',
        simulationType: 'instant_kill',
        parameters: [
          { label: 'Kinetic Waldoes', value: '4 Blades Deployed' },
          { label: 'Reaction Velocity', value: '14 ms / Reflex' },
          { label: 'Threat Sweep', value: '360° Sphere' },
        ],
      },
    ],
  },

  // SPIDER-MAN: E.D.I.T.H. ("Even Dead, I'm The Hero")
  {
    id: 'edith-ai',
    name: 'E.D.I.T.H.',
    systemCodename: 'STARK-ORBITAL-DEFENSE-MK85',
    originHero: 'Spider-Man',
    originSource: 'Spider-Man: Far From Home (Tactical Augmented Reality Glasses)',
    voiceStyle: 'Calm, crisp, ultra-efficient tactical operator voice',
    coreRole: 'Orbital Drone Satellite Grid, Augmented Reality HUD & Global Cyber Intercept',
    colorScheme: 'cyan',
    capabilities: [
      {
        id: 'edith-orbital-drone-mesh',
        name: 'Orbital Satellite Armed Stealth Drone Swarm',
        category: 'Orbital Defense',
        description: 'Command and control of hundreds of sub-orbital Stark Industries tactical combat drones equipped with cloaking devices, sonic cannons, and micro-EMP payloads.',
        canonicalQuote: '"E.D.I.T.H. stands for: Even Dead, I\'m The Hero. Tony Stark left me access to the entire Stark global defense network."',
        simulationType: 'orbital_drones',
        parameters: [
          { label: 'Orbital Drones', value: '380 Active in LEO' },
          { label: 'Cloaking Shroud', value: 'Active Photonic' },
          { label: 'Strike Latency', value: '1.8 Seconds' },
        ],
      },
      {
        id: 'edith-augmented-surveillance',
        name: 'Real-Time Augmented Reality Wiretapping & Device Screen Penetration',
        category: 'Cyber Intelligence',
        description: 'Optical AR telemetry projecting text messages, call logs, GPS routes, and biometric vital signs directly onto the lenses for any mobile device in line-of-sight.',
        canonicalQuote: '"Target identified: Bradford. Currently texting his social feed. Tactical strike standing by."',
        simulationType: 'ar_wiretap',
        parameters: [
          { label: 'Device Interception', value: 'Line-of-Sight RF' },
          { label: 'Decryption Speed', value: 'Zero-Latency AES' },
          { label: 'Biometric Telemetry', value: 'Heart Rate & Stress' },
        ],
      },
      {
        id: 'edith-hologram-detection',
        name: 'BARF Holographic Projector Detection & Illusion Nullification',
        category: 'Electronic Warfare',
        description: 'Detecting synthetic electromagnetic and photonic projections from Mysterio’s cloaked drones, isolating real physical obstacles from holographic simulations.',
        canonicalQuote: '"Analyzing environmental anomaly: 82% of visual signatures are holographic projections generated by cloaked drones."',
        simulationType: 'illusion_nullify',
        parameters: [
          { label: 'EM Frequency', value: '5.8 GHz Projection' },
          { label: 'Illusion Confidence', value: '99.2% Synthetic' },
          { label: 'Drone Core Lock', value: '14 Bogeys Isolated' },
        ],
      },
    ],
  },

  // SUPERMAN: JOR-EL (Kryptonian Consciousness Matrix)
  {
    id: 'jorel-ai',
    name: 'Jor-El Consciousness Matrix',
    systemCodename: 'KRYPTON-SCOUT-SHIP-CORE',
    originHero: 'Superman',
    originSource: 'Man of Steel / Superman Mythos (Fortress of Solitude Archive)',
    voiceStyle: 'Deep, resonant, philosophical, authoritative paternal consciousness',
    coreRole: 'Kryptonian Genesis Codex, Planetary Physics, Solar Radiation & Cosmic Evolution',
    colorScheme: 'gold',
    capabilities: [
      {
        id: 'jorel-solar-telemetry',
        name: 'Solar Radiation Absorption & Cellular Photonic Super-Charging',
        category: 'Biochemical Telemetry',
        description: 'Analyzing the biological transformation of Kryptonian physiology under Earth’s yellow sun (Type G-V star) versus Krypton’s harsh red dwarf (Rao), tracking cellular solar capacitors.',
        canonicalQuote: '"Earth\'s sun is younger and much brighter than was Krypton\'s. Your cells have drunk in its radiation, strengthening your muscles, your skin, your senses."',
        simulationType: 'solar_bio_telemetry',
        parameters: [
          { label: 'Solar Absorption', value: '100% Photonic' },
          { label: 'Cellular Density', value: '350x Terrestrial' },
          { label: 'Bio-Electric Field', value: 'Invulnerability Active' },
        ],
      },
      {
        id: 'jorel-genesis-codex',
        name: 'Genesis Codex & Genetic Evolution Archive',
        category: 'Genetic Science',
        description: 'Cataloging and sequencing the genetic blueprint of an entire alien civilization, containing millions of DNA sequences, lineage archives, and molecular cellular instructions.',
        canonicalQuote: '"You embody all of Krypton, Kal. Within your cells is the genetic code of our entire world."',
        simulationType: 'genesis_codex',
        parameters: [
          { label: 'Stored Lineages', value: '2.4 Billion Genomes' },
          { label: 'Base Pairs', value: '10^14 Kryptonian DNA' },
          { label: 'Cryptographic Hash', value: 'Molecular Bio-Core' },
        ],
      },
      {
        id: 'jorel-world-engine-analysis',
        name: 'World Engine Gravitational Distortion & Phantom Drive Dynamics',
        category: 'Cosmic Astrophysics',
        description: 'Calculating gravitational shear forces, particulate density displacement during planetary terraforming, and reversing Phantom Zone sub-space singularity drives.',
        canonicalQuote: '"The World Engine is terraforming Earth into Krypton. The only way to stop it is to create a singularity between both phantom drives."',
        simulationType: 'gravitational_singularity',
        parameters: [
          { label: 'Gravitational Pulse', value: '8.4 Giga-Newtons' },
          { label: 'Mass Displacement', value: '45,000 Tons/sec' },
          { label: 'Singularity Threshold', value: 'Event Horizon Formed' },
        ],
      },
      {
        id: 'jorel-nanomorphic-control',
        name: 'Kryptonian Nanomorphic Command Key & Ship Bulkhead Override',
        category: 'Nanotech Hardware',
        description: 'Reconfiguring scout ship bulkheads, mechanical doors, sensory monitors, and security access using the command key interface and liquid metallic particles.',
        canonicalQuote: '"Insert the command key. The ship\'s matrix will synchronize with our ancestral instructions."',
        simulationType: 'liquid_metal_nanotech',
        parameters: [
          { label: 'Interface Protocol', value: 'Command Key Sync' },
          { label: 'Nanomorphic Shift', value: 'Liquid Metal Bulkhead' },
          { label: 'Security Override', value: '100% Sovereign Command' },
        ],
      },
    ],
  },

  // SUPERMAN: KELEX (Fortress Caretaker Matrix)
  {
    id: 'kelex-ai',
    name: 'K.E.L.E.X.',
    systemCodename: 'FORTRESS-GUARDIAN-V2',
    originHero: 'Superman',
    originSource: 'Fortress of Solitude (Kryptonian Caretaker Drone Matrix)',
    voiceStyle: 'Precise, calm, metallic, synthetic Kryptonian butler cadence',
    coreRole: 'Fortress Defense, Xenobiological Quarantine & Deep Galactic Translation',
    colorScheme: 'blue',
    capabilities: [
      {
        id: 'kelex-fortress-defense',
        name: 'Fortress of Solitude Automated Cryo-Perimeter Defense',
        category: 'Defense Grid',
        description: 'Managing arctic perimeter sensors, thermal cloaking fields, Phantom Zone projector locks, and robotic drone defense arrays protecting the Fortress.',
        canonicalQuote: '"Perimeter integrity at 100%, Kal-El. Arctic ice mantle masking Fortress energy signatures from orbital satellites."',
        simulationType: 'fortress_defense',
        parameters: [
          { label: 'Perimeter Range', value: '50 km Arctic Radius' },
          { label: 'Thermal Masking', value: 'Zero Heat Signature' },
          { label: 'Phantom Containment', value: 'Zone Sealed' },
        ],
      },
      {
        id: 'kelex-cosmic-translation',
        name: 'Galactic Omnilingual Linguistic Matrix & Xenoculture Archive',
        category: 'Deep Linguistics',
        description: 'Translating over 10,000 cosmic interstellar dialects, Kryptonian glyph ciphers, Thanagarian records, and deep-space distress beacons.',
        canonicalQuote: '"Deciphering ancient Kryptonian guild cipher. Historical archives rendered into standard terrestrial language."',
        simulationType: 'cosmic_translation',
        parameters: [
          { label: 'Linguistic Corpus', value: '10,480 Cosmic Dialects' },
          { label: 'Glyph Recognition', value: 'Sub-Millisecond OCR' },
          { label: 'Semantic Accuracy', value: '99.98%' },
        ],
      },
    ],
  },
];
