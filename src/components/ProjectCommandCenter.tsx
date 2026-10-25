import React, { useState } from 'react';
import { 
  FolderKanban, Plus, CheckCircle2, Circle, Code, 
  Terminal, Sparkles, Brain, Clock, Trash2, ArrowUpRight, MessageSquare 
} from 'lucide-react';
import { PcProject } from '../data/gitProjects';
import { playSound } from '../utils/soundEffects';

interface ProjectCommandCenterProps {
  projects: PcProject[];
  onUpdateProjects: (projects: PcProject[]) => void;
  onAskGit: (prompt: string) => void;
}

export const ProjectCommandCenter: React.FC<ProjectCommandCenterProps> = ({
  projects,
  onUpdateProjects,
  onAskGit,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    category: 'Software & Web' as PcProject['category'],
    description: '',
    techStack: '',
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const toggleTask = (taskId: string) => {
    playSound.click();
    if (!activeProject) return;
    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          lastUpdated: 'Just now',
        };
      }
      return p;
    });
    onUpdateProjects(updated);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;
    playSound.click();
    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          tasks: [
            ...p.tasks,
            { id: `task-${Date.now()}`, title: newTaskTitle.trim(), completed: false },
          ],
          lastUpdated: 'Just now',
        };
      }
      return p;
    });
    onUpdateProjects(updated);
    setNewTaskTitle('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    playSound.repulsorCharge();
    const created: PcProject = {
      id: `proj-${Date.now()}`,
      name: newProject.name.trim(),
      category: newProject.category,
      description: newProject.description.trim() || 'Custom PC workstation project.',
      status: 'In Progress',
      techStack: newProject.techStack
        ? newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Full-Stack', 'TypeScript'],
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Define project scope and requirements', completed: true },
        { id: `t-${Date.now()}-2`, title: 'Set up repository and environment', completed: false },
      ],
      notes: 'Initialized in G-IT Desktop Command Center.',
      lastUpdated: 'Just now',
    };
    onUpdateProjects([created, ...projects]);
    setSelectedProjectId(created.id);
    setShowNewModal(false);
    setNewProject({ name: '', category: 'Software & Web', description: '', techStack: '' });
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    playSound.click();
    const remaining = projects.filter((p) => p.id !== id);
    onUpdateProjects(remaining);
    setSelectedProjectId(remaining[0].id);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-[#05141f] via-[#071c2c] to-[#05141f] border border-emerald-500/40 rounded-xl shadow-[0_0_30px_rgba(0,255,170,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-tech uppercase tracking-widest text-emerald-400">
              G-IT COCKPIT // PC PROJECT &amp; WORKSPACE HUB
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
            Your Personal PC Project Assistant
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-sans mt-1 max-w-2xl">
            Track, architect, and execute every project on your workstation. Consult G-IT for real-time code generation, architecture reviews, debugging, and task coordination.
          </p>
        </div>

        <button
          onClick={() => {
            playSound.click();
            setShowNewModal(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-lg shadow-[0_0_15px_rgba(0,255,170,0.35)] transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Main Grid: Projects List + Active Project Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project Selector Cards */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[11px] font-tech uppercase text-emerald-400/80 tracking-wider block px-1">
            ACTIVE WORKSTATION PROJECTS ({projects.length})
          </span>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {projects.map((proj) => {
              const isSelected = proj.id === activeProject?.id;
              const completedTasks = proj.tasks.filter((t) => t.completed).length;
              const progressPct = proj.tasks.length > 0 ? Math.round((completedTasks / proj.tasks.length) * 100) : 0;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    playSound.click();
                    setSelectedProjectId(proj.id);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#061824] border-emerald-400/80 shadow-[0_0_20px_rgba(0,255,170,0.2)]'
                      : 'bg-[#05101a]/80 border-emerald-500/20 hover:border-emerald-400/50 hover:bg-[#071420]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-tech text-emerald-400/80 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30">
                      {proj.category}
                    </span>
                    <span className="text-emerald-300 font-mono">{progressPct}% Complete</span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-white truncate mb-1">
                    {proj.name}
                  </h4>

                  <p className="text-xs text-emerald-100/70 line-clamp-2 font-sans mb-3">
                    {proj.description}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-[#030910] h-1.5 rounded-full overflow-hidden border border-emerald-500/20">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Project Deep Dive & G-IT Assistant Actions */}
        {activeProject && (
          <div className="lg:col-span-8 bg-[#05111c]/95 border border-emerald-500/35 rounded-xl p-5 shadow-[0_0_35px_rgba(0,255,170,0.12)] space-y-6">
            {/* Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/20 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-tech text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/40">
                    {activeProject.category}
                  </span>
                  <span className="text-xs text-emerald-400/70 font-mono">
                    Last active: {activeProject.lastUpdated}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  {activeProject.name}
                </h3>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onAskGit(
                      `G-IT, act as the lead system architect on our project "${activeProject.name}". Here is the scope: ${activeProject.description}. What are our optimal next architectural steps, potential bottlenecks, and recommended test cases?`
                    )
                  }
                  className="px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-500 hover:text-black border border-emerald-400/50 text-emerald-300 text-xs font-tech font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,170,0.2)]"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Consult G-IT
                </button>

                {projects.length > 1 && (
                  <button
                    onClick={() => handleDeleteProject(activeProject.id)}
                    title="Delete project"
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded border border-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Description & Tech Stack */}
            <div className="space-y-3">
              <p className="text-sm text-emerald-100/90 font-sans leading-relaxed">
                {activeProject.description}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-tech text-emerald-400/80 mr-1 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" /> Stack:
                </span>
                {activeProject.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs font-tech px-2 py-0.5 rounded bg-[#061824] border border-emerald-500/30 text-emerald-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Tasks Checklist */}
            <div className="space-y-3 pt-2 border-t border-emerald-500/20">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-tech uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Project Execution Tasks
                </h4>
                <span className="text-xs font-tech text-emerald-300/80">
                  {activeProject.tasks.filter((t) => t.completed).length} of {activeProject.tasks.length} Done
                </span>
              </div>

              {/* Task list */}
              <div className="space-y-2">
                {activeProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="p-2.5 bg-[#061521] hover:bg-[#081b2a] border border-emerald-500/20 hover:border-emerald-400/40 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-emerald-500/40 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-sans ${
                          task.completed ? 'line-through text-emerald-400/50' : 'text-emerald-100'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskGit(
                          `G-IT, assist me with this task for ${activeProject.name}: "${task.title}". Provide step-by-step guidance, code snippet, and best practices.`
                        );
                      }}
                      className="text-[11px] font-tech text-emerald-400 hover:text-white flex items-center gap-1 flex-shrink-0"
                    >
                      <span>Help Me</span> <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add task form */}
              <form onSubmit={addTask} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new project task or sprint milestone..."
                  className="flex-1 bg-[#040c14] border border-emerald-500/30 focus:border-emerald-400 rounded-lg px-3 py-2 text-xs text-emerald-100 placeholder:text-emerald-500/40 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-800 disabled:opacity-40 text-emerald-300 font-tech text-xs rounded-lg border border-emerald-500/30 transition-colors"
                >
                  Add Task
                </button>
              </form>
            </div>

            {/* Quick G-IT Autonomous Subroutines for this Project */}
            <div className="space-y-2 pt-3 border-t border-emerald-500/20">
              <span className="text-[11px] font-tech uppercase text-emerald-400/80 tracking-wider block">
                ONE-CLICK G-IT PROJECT SUBROUTINES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    onAskGit(
                      `G-IT, execute a comprehensive code & security audit plan for ${activeProject.name}. Check for potential race conditions, bundle bloat, dependency vulnerabilities, and API authentication flows.`
                    )
                  }
                  className="p-2.5 bg-[#061824] hover:bg-emerald-950/60 border border-emerald-500/25 hover:border-emerald-400 text-left rounded-lg text-xs font-tech text-emerald-200 transition-colors flex items-center gap-2"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Run Security Audit
                </button>

                <button
                  onClick={() =>
                    onAskGit(
                      `G-IT, formulate a multi-tier technical architecture diagram and component outline for ${activeProject.name} utilizing ${activeProject.techStack.join(', ')}.`
                    )
                  }
                  className="p-2.5 bg-[#061824] hover:bg-emerald-950/60 border border-emerald-500/25 hover:border-emerald-400 text-left rounded-lg text-xs font-tech text-emerald-200 transition-colors flex items-center gap-2"
                >
                  <Brain className="w-3.5 h-3.5 text-amber-400" /> Generate Architecture
                </button>

                <button
                  onClick={() =>
                    onAskGit(
                      `G-IT, generate unit and integration test scenarios for the core logic of ${activeProject.name}. Provide automated test assertions.`
                    )
                  }
                  className="p-2.5 bg-[#061824] hover:bg-emerald-950/60 border border-emerald-500/25 hover:border-emerald-400 text-left rounded-lg text-xs font-tech text-emerald-200 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Generate Test Suite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#071522] border border-emerald-500/50 rounded-xl p-5 shadow-[0_0_40px_rgba(0,255,170,0.25)] space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Initialize New Workstation Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-tech text-emerald-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. NextGen Microservices Engine"
                  className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-tech text-emerald-400 block mb-1">Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                  className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-200 outline-none"
                >
                  <option value="Software & Web">Software &amp; Web</option>
                  <option value="AI & Data Science">AI &amp; Data Science</option>
                  <option value="Hardware & IoT">Hardware &amp; IoT</option>
                  <option value="Creative & Media">Creative &amp; Media</option>
                  <option value="Writing & Research">Writing &amp; Research</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-tech text-emerald-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What are the goals, constraints, and architecture of this project?"
                  className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-tech text-emerald-400 block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  placeholder="e.g. React, Node.js, PyTorch, Docker"
                  className="w-full bg-[#040c14] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-[#040c14] hover:bg-[#061521] text-xs font-tech text-emerald-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-tech text-xs rounded-lg shadow-[0_0_15px_rgba(0,255,170,0.3)]"
                >
                  Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
