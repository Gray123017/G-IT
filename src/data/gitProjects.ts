export interface PcProject {
  id: string;
  name: string;
  category: 'Software & Web' | 'AI & Data Science' | 'Hardware & IoT' | 'Creative & Media' | 'Writing & Research';
  description: string;
  status: 'In Progress' | 'In Review' | 'Planning' | 'Completed';
  techStack: string[];
  tasks: { id: string; title: string; completed: boolean }[];
  notes: string;
  lastUpdated: string;
}

export interface DailyActivity {
  id: string;
  time: string;
  title: string;
  category: 'Coding' | 'Meeting' | 'Deep Focus' | 'Exercise' | 'Review';
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export const INITIAL_PROJECTS: PcProject[] = [
  {
    id: 'proj-1',
    name: 'G-IT Voice Assistant Mainframe',
    category: 'Software & Web',
    description: 'Next-generation AI desktop assistant inspired by J.A.R.V.I.S., running full-stack React, Express, Gemini 4 Argon thinking mode, and Web Audio.',
    status: 'In Progress',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'Gemini 4 Argon', 'Web Audio API'],
    tasks: [
      { id: 't1', title: 'Integrate Web Speech Recognition with hands-free trigger', completed: true },
      { id: 't2', title: 'Configure Gemini 4 Argon with High Thinking Level', completed: true },
      { id: 't3', title: 'Build Project Workspace Manager & Daily Activity Hub', completed: true },
      { id: 't4', title: 'Add custom protocol automation engine', completed: false },
    ],
    notes: 'Primary sovereign AI CPU for daily desktop operations, code engineering, and personal productivity.',
    lastUpdated: 'Just now',
  },
  {
    id: 'proj-2',
    name: 'Autonomous Agent Workflow Pipeline',
    category: 'AI & Data Science',
    description: 'Multi-agent orchestration system for automatic research synthesis, GitHub PR reviews, and code unit test generation.',
    status: 'Planning',
    techStack: ['Python', 'LangGraph', 'Gemini API', 'PostgreSQL', 'Docker'],
    tasks: [
      { id: 't2-1', title: 'Design multi-agent message bus schema', completed: true },
      { id: 't2-2', title: 'Implement automated code linting agent', completed: false },
      { id: 't2-3', title: 'Benchmark latency on local workstation', completed: false },
    ],
    notes: 'Goal: Automate 80% of repetitive code review and documentation tasks.',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'proj-3',
    name: 'Personal Cloud & Homelab Setup',
    category: 'Hardware & IoT',
    description: 'Self-hosted microservices cluster with automated backups, local LLM inference fallback, and IoT smart office telemetry.',
    status: 'In Progress',
    techStack: ['Linux', 'Docker', 'WireGuard', 'Node.js', 'Grafana'],
    tasks: [
      { id: 't3-1', title: 'Set up WireGuard VPN mesh tunnel', completed: true },
      { id: 't3-2', title: 'Configure Prometheus workstation metric scrapers', completed: true },
      { id: 't3-3', title: 'Link G-IT assistant API to local ambient lighting', completed: false },
    ],
    notes: 'Allows G-IT to monitor PC hardware temperatures, fan speeds, and ambient lighting directly.',
    lastUpdated: 'Yesterday',
  },
];

export const INITIAL_SCHEDULE: DailyActivity[] = [
  { id: 'sch-1', time: '08:30', title: 'Morning Briefing & System Telemetry Check', category: 'Review', completed: true, priority: 'High' },
  { id: 'sch-2', time: '09:00', title: 'Deep Work Sprint 1: Architecture & Core Coding', category: 'Deep Focus', completed: true, priority: 'High' },
  { id: 'sch-3', time: '11:30', title: 'Code Review & Pull Request Verification', category: 'Coding', completed: false, priority: 'Medium' },
  { id: 'sch-4', time: '14:00', title: 'Project Research & Technical Documentation', category: 'Review', completed: false, priority: 'Medium' },
  { id: 'sch-5', time: '16:00', title: 'Deep Work Sprint 2: Optimization & Testing', category: 'Deep Focus', completed: false, priority: 'High' },
  { id: 'sch-6', time: '18:00', title: 'Daily Debrief & Protocol Clean Slate', category: 'Review', completed: false, priority: 'Low' },
];
