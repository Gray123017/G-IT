import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, Circle, Flame, 
  Volume2, Play, Pause, RotateCcw, Activity, Shield, Sparkles, Plus, AlertCircle 
} from 'lucide-react';
import { DailyActivity, PcProject } from '../data/gitProjects';
import { playSound } from '../utils/soundEffects';

interface DailyActivityHubProps {
  schedule: DailyActivity[];
  onUpdateSchedule: (schedule: DailyActivity[]) => void;
  projects: PcProject[];
  onAskGit: (prompt: string) => void;
  userName: string;
}

export const DailyActivityHub: React.FC<DailyActivityHubProps> = ({
  schedule,
  onUpdateSchedule,
  projects,
  onAskGit,
  userName,
}) => {
  // Focus Timer state (e.g. 45 min sprint)
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeSession, setActiveSession] = useState('Deep Work Sprint');
  const [scratchpad, setScratchpad] = useState(
    '// G-IT Scratchpad\n- Complete core neural bus testing\n- Review pull requests on GitHub\n- Optimize bundle chunks for production'
  );
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('15:00');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      playSound.jarvisActivate();
      setIsTimerRunning(false);
      onAskGit(`G-IT, focus timer completed! Deliver a short congratulatory debrief to ${userName}.`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, onAskGit, userName]);

  const toggleActivity = (id: string) => {
    playSound.click();
    const updated = schedule.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateSchedule(updated);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;
    playSound.click();
    const created: DailyActivity = {
      id: `act-${Date.now()}`,
      time: newActivityTime,
      title: newActivityTitle.trim(),
      category: 'Coding',
      completed: false,
      priority: 'Medium',
    };
    onUpdateSchedule([...schedule, created]);
    setNewActivityTitle('');
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const triggerMorningBriefing = () => {
    playSound.jarvisActivate();
    const pendingTasks = schedule.filter((s) => !s.completed).length;
    const projectNames = projects.map((p) => p.name).join(', ');
    onAskGit(
      `G-IT, deliver my Morning Briefing. My callsign is ${userName}. I have ${pendingTasks} tasks scheduled today and ${projects.length} active workstation projects (${projectNames}). Give me a crisp, intelligent executive rundown and recommendations for optimal focus.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Morning Briefing Banner */}
      <div className="p-5 bg-gradient-to-r from-[#05141f] via-[#081e30] to-[#05141f] border border-cyan-500/40 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-tech uppercase tracking-widest text-cyan-400">
              DAILY OPERATIONAL TELEMETRY // {userName.toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
            Daily Activities &amp; Focus Command
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 font-sans mt-1 max-w-2xl">
            Coordinate your daily schedule, manage focused deep-work sprints, and let G-IT track your project cadence and workstation health.
          </p>
        </div>

        <button
          onClick={triggerMorningBriefing}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-bold font-tech text-xs tracking-wider uppercase rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Volume2 className="w-4 h-4" /> Request Morning Briefing
        </button>
      </div>

      {/* Main Grid: Agenda + Focus Timer + Scratchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daily Schedule / Agenda */}
        <div className="lg:col-span-7 bg-[#05111c]/95 border border-cyan-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.08)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-sm text-white tracking-wider uppercase">
                TODAY&apos;S SCHEDULE &amp; MILESTONES
              </h3>
            </div>
            <span className="text-xs font-tech text-cyan-300">
              {schedule.filter((s) => s.completed).length} / {schedule.length} COMPLETED
            </span>
          </div>

          {/* Schedule list */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {schedule.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleActivity(item.id)}
                className="p-3 bg-[#061624] hover:bg-[#081e30] border border-cyan-500/20 hover:border-cyan-400/40 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-cyan-500/40 flex-shrink-0" />
                  )}
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-sans block ${
                        item.completed ? 'line-through text-cyan-400/50' : 'text-cyan-100'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] font-tech text-cyan-400/70">{item.time}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-tech px-2 py-0.5 rounded border ${
                    item.priority === 'High'
                      ? 'border-red-500/40 text-red-300 bg-red-950/30'
                      : item.priority === 'Medium'
                      ? 'border-amber-500/40 text-amber-300 bg-amber-950/30'
                      : 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30'
                  }`}
                >
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          {/* Quick add agenda item */}
          <form onSubmit={handleAddActivity} className="flex gap-2 pt-2 border-t border-cyan-500/20">
            <input
              type="time"
              value={newActivityTime}
              onChange={(e) => setNewActivityTime(e.target.value)}
              className="bg-[#040c14] border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-xs text-cyan-200 outline-none"
            />
            <input
              type="text"
              value={newActivityTitle}
              onChange={(e) => setNewActivityTitle(e.target.value)}
              placeholder="Add schedule milestone (e.g. Test deployment pipeline)..."
              className="flex-1 bg-[#040c14] border border-cyan-500/30 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-cyan-500/40 outline-none"
            />
            <button
              type="submit"
              disabled={!newActivityTitle.trim()}
              className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 font-tech text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Right Column: Focus Timer & PC Workstation Telemetry */}
        <div className="lg:col-span-5 space-y-5">
          {/* Deep Work Sprint Timer */}
          <div className="bg-[#05111c]/95 border border-cyan-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.08)] flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-between w-full pb-2 border-b border-cyan-500/20">
              <span className="text-xs font-tech text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> DEEP WORK SPRINT ENGINE
              </span>
              <span className="text-[10px] font-tech text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                {isTimerRunning ? 'COUNTDOWN ACTIVE' : 'PAUSED'}
              </span>
            </div>

            <div className="relative p-6 my-1">
              <div className="text-4xl sm:text-5xl font-bold font-tech text-white tracking-widest glow-cyan">
                {formatTimer(timerSeconds)}
              </div>
              <span className="text-[11px] font-tech text-cyan-400/80 uppercase tracking-widest block mt-1">
                {activeSession}
              </span>
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound.click();
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`px-5 py-2 rounded-lg font-tech text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(255,190,11,0.3)]'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(0,255,170,0.3)]'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-black" /> Pause Sprint
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" /> Start Sprint
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  setIsTimerRunning(false);
                  setTimerSeconds(45 * 60);
                }}
                title="Reset to 45 min"
                className="p-2 bg-[#061624] hover:bg-cyan-950 border border-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Preset buttons */}
            <div className="flex gap-2 pt-1 text-[11px] font-tech">
              <button
                onClick={() => {
                  playSound.click();
                  setTimerSeconds(25 * 60);
                  setActiveSession('Pomodoro (25m)');
                }}
                className="px-2.5 py-1 rounded bg-[#061624] border border-cyan-500/20 hover:border-cyan-400 text-cyan-300"
              >
                25 min
              </button>
              <button
                onClick={() => {
                  playSound.click();
                  setTimerSeconds(45 * 60);
                  setActiveSession('Deep Work (45m)');
                }}
                className="px-2.5 py-1 rounded bg-[#061624] border border-cyan-500/20 hover:border-cyan-400 text-cyan-300"
              >
                45 min
              </button>
              <button
                onClick={() => {
                  playSound.click();
                  setTimerSeconds(60 * 60);
                  setActiveSession('Extended Flow (60m)');
                }}
                className="px-2.5 py-1 rounded bg-[#061624] border border-cyan-500/20 hover:border-cyan-400 text-cyan-300"
              >
                60 min
              </button>
            </div>
          </div>

          {/* PC Telemetry & Biometric Readiness */}
          <div className="bg-[#05111c]/95 border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-400 pb-2 border-b border-cyan-500/20">
              <span className="flex items-center gap-1.5 uppercase">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> PC WORKSTATION &amp; FOCUS TELEMETRY
              </span>
              <span className="text-emerald-400 font-mono">OPTIMAL</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-tech text-xs">
              <div className="p-2 bg-[#061624] rounded border border-cyan-500/15">
                <span className="text-[10px] text-cyan-400/70 block uppercase">Workstation CPU</span>
                <span className="text-base font-bold text-white">18.4%</span>
              </div>
              <div className="p-2 bg-[#061624] rounded border border-cyan-500/15">
                <span className="text-[10px] text-cyan-400/70 block uppercase">Memory Buffer</span>
                <span className="text-base font-bold text-emerald-300">4.2 GB</span>
              </div>
              <div className="p-2 bg-[#061624] rounded border border-cyan-500/15">
                <span className="text-[10px] text-cyan-400/70 block uppercase">Posture &amp; Hydration</span>
                <span className="text-base font-bold text-cyan-300">Nominal</span>
              </div>
            </div>
          </div>

          {/* Quick Scratchpad */}
          <div className="bg-[#05111c]/95 border border-cyan-500/30 rounded-xl p-4 space-y-2">
            <span className="text-xs font-tech uppercase text-cyan-400 flex items-center justify-between">
              <span>G-IT LIVE DESKTOP SCRATCHPAD</span>
              <span className="text-[10px] text-cyan-400/60 font-mono">Auto-saved</span>
            </span>
            <textarea
              rows={4}
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              className="w-full bg-[#040c14] border border-cyan-500/25 rounded-lg p-2.5 text-xs font-tech text-cyan-100 outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
