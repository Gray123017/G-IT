import React, { useState } from 'react';
import { Shield, Zap, Activity, Flame, Wind, Crosshair, AlertTriangle, CheckCircle } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface DiagnosticsProps {
  onActionTrigger: (actionName: string) => void;
}

export const SuitDiagnosticsPanel: React.FC<DiagnosticsProps> = ({ onActionTrigger }) => {
  const [armorIntegrity, setArmorIntegrity] = useState(96);
  const [powerOutput, setPowerOutput] = useState(98.4);
  const [flightSpeed, setFlightSpeed] = useState(0);
  const [unibeamCharged, setUnibeamCharged] = useState(false);
  const [flapsEngaged, setFlapsEngaged] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const testRepulsor = (side: 'left' | 'right') => {
    playSound.repulsorCharge();
    setActiveAlert(`${side.toUpperCase()} Repulsor test fired: 100% kinetic yield.`);
    setTimeout(() => setActiveAlert(null), 3000);
    onActionTrigger(`Repulsor ${side} test fire`);
  };

  const toggleUnibeam = () => {
    playSound.arcPulse();
    setUnibeamCharged(!unibeamCharged);
    setPowerOutput(unibeamCharged ? 98.4 : 82.1);
    setActiveAlert(unibeamCharged ? 'Unibeam power redirected to primary grid.' : 'Chest RT Unibeam primed for high-yield discharge.');
    setTimeout(() => setActiveAlert(null), 3500);
    onActionTrigger('Chest RT Unibeam test');
  };

  const toggleAirbrakes = () => {
    playSound.click();
    setFlapsEngaged(!flapsEngaged);
    setFlightSpeed(flapsEngaged ? 0 : 1420);
    setActiveAlert(flapsEngaged ? 'Flight stabilators retracted.' : 'Flight airbrakes & stabilator flaps deployed.');
    setTimeout(() => setActiveAlert(null), 3000);
  };

  return (
    <div className="bg-[#060e1a]/90 border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.1)] space-y-4">
      {/* Panel Title */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-bold text-sm tracking-wider text-cyan-200 uppercase">
            MARK VII TELEMETRY &amp; AVIONICS
          </h3>
        </div>
        <span className="text-[10px] font-tech text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> ONLINE
        </span>
      </div>

      {/* Alert toast if active */}
      {activeAlert && (
        <div className="p-2.5 bg-cyan-950/80 border border-cyan-400/50 rounded text-xs font-tech text-cyan-200 flex items-center gap-2 animate-in fade-in duration-150">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
          <span>{activeAlert}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-[#081525] border border-cyan-500/20 rounded-lg">
          <span className="text-[10px] font-tech uppercase text-cyan-400/70 block">Armor Plating</span>
          <span className="text-xl font-bold font-tech text-white">{armorIntegrity}%</span>
          <span className="text-[10px] text-cyan-300/60 block font-mono">Gold-Titanium</span>
        </div>

        <div className="p-3 bg-[#081525] border border-cyan-500/20 rounded-lg">
          <span className="text-[10px] font-tech uppercase text-cyan-400/70 block">RT Core Output</span>
          <span className="text-xl font-bold font-tech text-cyan-300">{powerOutput}%</span>
          <span className="text-[10px] text-cyan-300/60 block font-mono">8 GJ / sec</span>
        </div>

        <div className="p-3 bg-[#081525] border border-cyan-500/20 rounded-lg">
          <span className="text-[10px] font-tech uppercase text-cyan-400/70 block">Airspeed</span>
          <span className="text-xl font-bold font-tech text-white">{flightSpeed} MPH</span>
          <span className="text-[10px] text-cyan-300/60 block font-mono">Mach {flightSpeed > 0 ? (flightSpeed / 767).toFixed(1) : '0.0'}</span>
        </div>

        <div className="p-3 bg-[#081525] border border-cyan-500/20 rounded-lg">
          <span className="text-[10px] font-tech uppercase text-cyan-400/70 block">Icing Sensor</span>
          <span className="text-xl font-bold font-tech text-emerald-400">0.0%</span>
          <span className="text-[10px] text-emerald-400/70 block font-mono">Thermal Active</span>
        </div>
      </div>

      {/* Subsystem Interactive Actuators */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-tech uppercase text-cyan-400/80 tracking-wider block">
          AVIONICS ACTUATION &amp; WEAPONS TEST
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => testRepulsor('left')}
            className="p-2 bg-[#091729] hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 rounded text-xs font-tech transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Left Repulsor
          </button>

          <button
            onClick={() => testRepulsor('right')}
            className="p-2 bg-[#091729] hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 rounded text-xs font-tech transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Right Repulsor
          </button>

          <button
            onClick={toggleUnibeam}
            className={`p-2 border rounded text-xs font-tech transition-colors flex items-center justify-center gap-1.5 ${
              unibeamCharged
                ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                : 'bg-[#091729] hover:bg-cyan-950/60 border-cyan-500/30 hover:border-cyan-400 text-cyan-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" /> {unibeamCharged ? 'Unibeam Primed' : 'Charge Unibeam'}
          </button>

          <button
            onClick={toggleAirbrakes}
            className={`p-2 border rounded text-xs font-tech transition-colors flex items-center justify-center gap-1.5 ${
              flapsEngaged
                ? 'bg-cyan-900/60 border-cyan-300 text-cyan-100'
                : 'bg-[#091729] hover:bg-cyan-950/60 border-cyan-500/30 hover:border-cyan-400 text-cyan-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-cyan-400" /> {flapsEngaged ? 'Flaps Out' : 'Deploy Flaps'}
          </button>
        </div>
      </div>
    </div>
  );
};
