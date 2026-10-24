import React, { useState, useEffect, useRef } from 'react';
import { getCarImageUrl, handleImageError } from '../utils/carImages';
import { raceAudio } from '../utils/raceAudio';
import {
  X,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  Gauge,
  Flame,
  Flag,
  Sparkles,
} from 'lucide-react';

export const DragRaceSimulator = ({ car1, car2, onClose }) => {
  if (!car1 || !car2) return null;

  // Race States: 'idle' | 'countdown' | 'racing' | 'finished'
  const [raceState, setRaceState] = useState('idle');
  const [treeLight, setTreeLight] = useState(0); // 0: off, 1: amber1, 2: amber2, 3: amber3, 4: green
  const [isMuted, setIsMuted] = useState(false);

  // Live telemetry: position is % of track (0 to 100)
  const [car1Pos, setCar1Pos] = useState(0);
  const [car2Pos, setCar2Pos] = useState(0);
  const [car1Speed, setCar1Speed] = useState(0);
  const [car2Speed, setCar2Speed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Results
  const [winner, setWinner] = useState(null);
  const [car1Stats, setCar1Stats] = useState(null);
  const [car2Stats, setCar2Stats] = useState(null);

  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  // Audio mute handler
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    raceAudio.setMuted(nextMuted);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        raceAudio.stopAllEngines();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      raceAudio.stopAllEngines();
    };
  }, [onClose]);

  // Car Physics Specs
  const acc1 = Number(car1.acceleration) || 10.5; // seconds to 100 km/h
  const acc2 = Number(car2.acceleration) || 10.5;
  const pwr1 = Number(car1.power) || 130;
  const pwr2 = Number(car2.power) || 130;
  const top1 = Number(car1.topSpeed) || 180;
  const top2 = Number(car2.topSpeed) || 180;
  const isEV1 = car1.fuelType?.toLowerCase() === 'electric';
  const isEV2 = car2.fuelType?.toLowerCase() === 'electric';

  // Start Countdown Sequence
  const handleStartRace = () => {
    if (raceState === 'racing' || raceState === 'countdown') return;

    raceAudio.init();
    setRaceState('countdown');
    setTreeLight(0);
    setCar1Pos(0);
    setCar2Pos(0);
    setCar1Speed(0);
    setCar2Speed(0);
    setElapsedTime(0);
    setWinner(null);

    // Christmas tree lights countdown: Amber 1 (0.5s), Amber 2 (1.0s), Amber 3 (1.5s), Green (2.0s)
    setTimeout(() => {
      setTreeLight(1);
      raceAudio.playBeep(false);
    }, 500);

    setTimeout(() => {
      setTreeLight(2);
      raceAudio.playBeep(false);
    }, 1000);

    setTimeout(() => {
      setTreeLight(3);
      raceAudio.playBeep(false);
    }, 1500);

    setTimeout(() => {
      setTreeLight(4);
      raceAudio.playBeep(true);
      raceAudio.playTireScreech();
      raceAudio.startEngineSound(car1._id, isEV1);
      raceAudio.startEngineSound(car2._id, isEV2);
      startPhysicsLoop();
    }, 2000);
  };

  // Main Race Physics Animation Frame Loop
  const startPhysicsLoop = () => {
    setRaceState('racing');
    startTimeRef.current = performance.now();

    // Track is 400 meters. 0 to 100% position.
    // Real kinematic equations:
    // a0 = (100 km/h in m/s) / acc_seconds
    const TRACK_DISTANCE_METERS = 400;
    const a1_base = (100 / 3.6) / acc1; // m/s^2
    const a2_base = (100 / 3.6) / acc2;

    let c1Done = false;
    let c2Done = false;
    let c1Time = 0;
    let c2Time = 0;
    let c1TrapSpeed = 0;
    let c2TrapSpeed = 0;

    const tick = (now) => {
      const t = (now - startTimeRef.current) / 1000; // seconds elapsed
      setElapsedTime(t);

      // Instant EV launch boost in first 2.5 seconds
      const evBoost1 = isEV1 && t < 2.5 ? 1.35 : 1.0;
      const evBoost2 = isEV2 && t < 2.5 ? 1.35 : 1.0;

      // High-end horsepower benefit over distance
      const hpFactor1 = 1 + (pwr1 - 100) * 0.001;
      const hpFactor2 = 1 + (pwr2 - 100) * 0.001;

      // Current Velocity in m/s (saturating towards top speed)
      const maxV1 = (top1 / 3.6);
      const maxV2 = (top2 / 3.6);

      const v1_ms = Math.min(maxV1, a1_base * evBoost1 * hpFactor1 * t);
      const v2_ms = Math.min(maxV2, a2_base * evBoost2 * hpFactor2 * t);

      // Current Distance in meters: s = 0.5 * a * t^2 (capped)
      const s1 = Math.min(TRACK_DISTANCE_METERS, 0.5 * (a1_base * evBoost1 * hpFactor1) * Math.pow(t, 2));
      const s2 = Math.min(TRACK_DISTANCE_METERS, 0.5 * (a2_base * evBoost2 * hpFactor2) * Math.pow(t, 2));

      // Percent of track (0 - 100)
      const pct1 = (s1 / TRACK_DISTANCE_METERS) * 100;
      const pct2 = (s2 / TRACK_DISTANCE_METERS) * 100;

      const speed1_kmh = Math.round(v1_ms * 3.6);
      const speed2_kmh = Math.round(v2_ms * 3.6);

      setCar1Pos(pct1);
      setCar2Pos(pct2);
      setCar1Speed(speed1_kmh);
      setCar2Speed(speed2_kmh);

      raceAudio.updateEngineSpeed(car1._id, speed1_kmh);
      raceAudio.updateEngineSpeed(car2._id, speed2_kmh);

      // Check finishes
      if (pct1 >= 100 && !c1Done) {
        c1Done = true;
        c1Time = t;
        c1TrapSpeed = speed1_kmh;
      }
      if (pct2 >= 100 && !c2Done) {
        c2Done = true;
        c2Time = t;
        c2TrapSpeed = speed2_kmh;
      }

      if (c1Done && c2Done) {
        // Race complete
        raceAudio.stopAllEngines();
        raceAudio.playVictoryFanfare();
        setRaceState('finished');

        const isCar1Winner = c1Time <= c2Time;
        setWinner(isCar1Winner ? car1 : car2);
        setCar1Stats({ time: c1Time.toFixed(2), trapSpeed: c1TrapSpeed });
        setCar2Stats({ time: c2Time.toFixed(2), trapSpeed: c2TrapSpeed });
        return;
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
  };

  const handleResetRace = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    raceAudio.stopAllEngines();
    setRaceState('idle');
    setTreeLight(0);
    setCar1Pos(0);
    setCar2Pos(0);
    setCar1Speed(0);
    setCar2Speed(0);
    setElapsedTime(0);
    setWinner(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          raceAudio.stopAllEngines();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl border border-gray-800 bg-gray-950 text-white shadow-2xl overflow-hidden cursor-default my-auto"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800/80 bg-gray-900/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-md">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <span>Quarter-Mile Drag Duel</span>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30">
                  LIVE PHYSICS
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                400m straight line simulation based on verified 0-100 acceleration, torque & horsepower
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                raceAudio.stopAllEngines();
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Race Arena Container */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* Drag Strip Asphalt Track */}
          <div className="relative rounded-2xl border-2 border-gray-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-4 shadow-inner overflow-hidden">
            
            {/* Christmas Tree Countdown Lights (Fixed Center Left) */}
            <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-gray-700/80 bg-black/80 px-3 py-1.5 backdrop-blur-md shadow-lg">
              <span className="text-[10px] font-bold uppercase text-gray-400 mr-1">TREE:</span>
              <div
                className={`h-3.5 w-3.5 rounded-full transition-all ${
                  treeLight >= 1 ? 'bg-amber-400 shadow-md shadow-amber-400' : 'bg-neutral-800'
                }`}
              />
              <div
                className={`h-3.5 w-3.5 rounded-full transition-all ${
                  treeLight >= 2 ? 'bg-amber-400 shadow-md shadow-amber-400' : 'bg-neutral-800'
                }`}
              />
              <div
                className={`h-3.5 w-3.5 rounded-full transition-all ${
                  treeLight >= 3 ? 'bg-amber-400 shadow-md shadow-amber-400' : 'bg-neutral-800'
                }`}
              />
              <div
                className={`h-4 w-4 rounded-full transition-all ${
                  treeLight === 4 ? 'bg-emerald-400 shadow-lg shadow-emerald-400 animate-pulse' : 'bg-neutral-800'
                }`}
              />
            </div>

            {/* Live Elapsed Stopwatch (Top Center) */}
            <div className="text-center mb-4">
              <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
                {elapsedTime.toFixed(2)}s
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase ml-2">Elapsed</span>
            </div>

            {/* Track Distance Markers (100m, 200m, 300m, 400m) */}
            <div className="relative h-4 w-full flex justify-between text-[10px] font-mono font-bold text-gray-600 px-12 mb-2 border-b border-gray-800">
              <span>0m</span>
              <span>100m</span>
              <span>200m</span>
              <span>300m</span>
              <span className="text-amber-500 font-extrabold flex items-center gap-0.5">
                <Flag className="h-3 w-3" /> 400m FINISH
              </span>
            </div>

            {/* LANE 1: Car 1 */}
            <div className="relative h-24 sm:h-28 border-b-2 border-dashed border-gray-700/60 my-2">
              {/* Lane Info Header */}
              <div className="absolute top-1 left-2 flex items-center gap-2 text-xs z-10">
                <span className="rounded bg-blue-600/80 px-2 py-0.5 font-bold uppercase text-[10px]">
                  LANE 1
                </span>
                <span className="font-bold text-gray-200">{car1.name}</span>
                <span className="text-[11px] text-gray-400">
                  ({car1.power} PS • {car1.acceleration}s to 100)
                </span>
              </div>

              {/* Finish Line Gate (Right edge) */}
              <div className="absolute right-6 inset-y-0 w-2.5 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-80" />

              {/* Moving Vehicle Sprite */}
              <div
                className="absolute bottom-2 flex items-center gap-2 transition-transform duration-75"
                style={{
                  left: `clamp(10px, ${car1Pos * 0.88}%, calc(100% - 130px))`,
                }}
              >
                {/* Exhaust flame & tire smoke when racing */}
                {raceState === 'racing' && (
                  <div className="flex items-center -mr-2">
                    <span className="h-3 w-5 bg-gradient-to-l from-amber-400 to-transparent rounded-full animate-ping opacity-75" />
                    <span className="h-2 w-3 bg-blue-400 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Car Thumbnail Image Card */}
                <div className="relative rounded-xl border border-gray-700 bg-gray-900 p-1 shadow-xl">
                  <img
                    src={getCarImageUrl(car1)}
                    alt={car1.name}
                    onError={(e) => handleImageError(e, car1.bodyType)}
                    className="h-10 w-16 sm:h-12 sm:w-20 rounded-lg object-cover"
                  />
                  {/* Live Speed Badge */}
                  <span className="absolute -top-2.5 right-0 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black text-white shadow-md">
                    {car1Speed} km/h
                  </span>
                </div>
              </div>
            </div>

            {/* LANE 2: Car 2 */}
            <div className="relative h-24 sm:h-28 my-2">
              {/* Lane Info Header */}
              <div className="absolute top-1 left-2 flex items-center gap-2 text-xs z-10">
                <span className="rounded bg-rose-600/80 px-2 py-0.5 font-bold uppercase text-[10px]">
                  LANE 2
                </span>
                <span className="font-bold text-gray-200">{car2.name}</span>
                <span className="text-[11px] text-gray-400">
                  ({car2.power} PS • {car2.acceleration}s to 100)
                </span>
              </div>

              {/* Finish Line Gate (Right edge) */}
              <div className="absolute right-6 inset-y-0 w-2.5 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-80" />

              {/* Moving Vehicle Sprite */}
              <div
                className="absolute bottom-2 flex items-center gap-2 transition-transform duration-75"
                style={{
                  left: `clamp(10px, ${car2Pos * 0.88}%, calc(100% - 130px))`,
                }}
              >
                {/* Exhaust flame & tire smoke when racing */}
                {raceState === 'racing' && (
                  <div className="flex items-center -mr-2">
                    <span className="h-3 w-5 bg-gradient-to-l from-rose-500 to-transparent rounded-full animate-ping opacity-75" />
                    <span className="h-2 w-3 bg-amber-400 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Car Thumbnail Image Card */}
                <div className="relative rounded-xl border border-gray-700 bg-gray-900 p-1 shadow-xl">
                  <img
                    src={getCarImageUrl(car2)}
                    alt={car2.name}
                    onError={(e) => handleImageError(e, car2.bodyType)}
                    className="h-10 w-16 sm:h-12 sm:w-20 rounded-lg object-cover"
                  />
                  {/* Live Speed Badge */}
                  <span className="absolute -top-2.5 right-0 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-black text-white shadow-md">
                    {car2Speed} km/h
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 pt-4">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Gauge className="h-4 w-4 text-blue-400" />
                <span>Lane 1: {car1Speed} km/h</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Gauge className="h-4 w-4 text-rose-400" />
                <span>Lane 2: {car2Speed} km/h</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {raceState === 'finished' ? (
                <button
                  onClick={handleResetRace}
                  className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Track</span>
                </button>
              ) : null}

              <button
                onClick={handleStartRace}
                disabled={raceState === 'racing' || raceState === 'countdown'}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>
                  {raceState === 'countdown'
                    ? 'Staging Tree...'
                    : raceState === 'racing'
                    ? 'Racing Down Strip!'
                    : 'Launch Drag Race'}
                </span>
              </button>
            </div>
          </div>

          {/* Victory Banner / Photo Finish Results */}
          {raceState === 'finished' && winner && car1Stats && car2Stats && (
            <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-gray-900 to-gray-950 p-6 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Winner Podium Callout */}
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20">
                    <Trophy className="h-8 w-8 fill-amber-400 text-amber-300 animate-bounce" />
                  </div>
                  <div>
                    <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase text-amber-300 border border-amber-500/30">
                      🏆 OFFICIAL WINNER
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">{winner.name}</h3>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Crossed the 400m line first with superior power delivery and acceleration curve!
                    </p>
                  </div>
                </div>

                {/* Timesheet Table */}
                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto font-mono text-xs">
                  <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-3.5 text-center">
                    <p className="text-[11px] font-bold text-blue-400 truncate">{car1.name}</p>
                    <p className="text-lg font-black text-white mt-1">{car1Stats.time}s</p>
                    <p className="text-[10px] text-gray-400">Trap: {car1Stats.trapSpeed} km/h</p>
                  </div>

                  <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-3.5 text-center">
                    <p className="text-[11px] font-bold text-rose-400 truncate">{car2.name}</p>
                    <p className="text-lg font-black text-white mt-1">{car2Stats.time}s</p>
                    <p className="text-[10px] text-gray-400">Trap: {car2Stats.trapSpeed} km/h</p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DragRaceSimulator;
