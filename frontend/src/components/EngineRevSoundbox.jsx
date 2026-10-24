import React, { useState, useEffect, useRef } from 'react';
import { engineAudio } from '../utils/engineAudio';
import { Power, Flame, Volume2, VolumeX, Gauge, Zap, Sparkles } from 'lucide-react';

export const EngineRevSoundbox = ({ car }) => {
  if (!car) return null;

  const isEV = car.fuelType?.toLowerCase() === 'electric';
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [rpm, setRpm] = useState(0);
  const [isPedalPressed, setIsPedalPressed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRedlining, setIsRedlining] = useState(false);

  const rpmRef = useRef(0);
  const animFrameRef = useRef(null);
  const popIntervalRef = useRef(null);

  const maxRpm = isEV ? 10000 : 7500;
  const idleRpm = isEV ? 0 : 850;
  const redlineRpm = isEV ? 9000 : 6600;

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    engineAudio.setMuted(next);
  };

  // Start / Stop Engine
  const toggleEngine = () => {
    if (isEngineOn) {
      engineAudio.stop();
      setIsEngineOn(false);
      setRpm(0);
      rpmRef.current = 0;
      setIsPedalPressed(false);
    } else {
      engineAudio.start(isEV);
      setIsEngineOn(true);
      // Needle sweep flare
      let sweep = 0;
      const flare = setInterval(() => {
        sweep += 200;
        if (sweep >= 2500) {
          clearInterval(flare);
          rpmRef.current = idleRpm;
          setRpm(idleRpm);
          engineAudio.updateRPM(idleRpm);
        } else {
          rpmRef.current = sweep;
          setRpm(sweep);
          engineAudio.updateRPM(sweep);
        }
      }, 30);
    }
  };

  // Spacebar throttle support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isEngineOn && !isPedalPressed) {
        e.preventDefault();
        setIsPedalPressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPedalPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      engineAudio.stop();
    };
  }, [isEngineOn, isPedalPressed]);

  // Physics animation loop for RPM inertia
  useEffect(() => {
    if (!isEngineOn) return;

    const updatePhysics = () => {
      let current = rpmRef.current;

      if (isPedalPressed) {
        // Accelerate up
        const climbRate = isEV ? 180 : 130;
        current = Math.min(maxRpm, current + climbRate);

        if (current >= redlineRpm && !isEV) {
          setIsRedlining(true);
          // Rev limiter bounce
          current = redlineRpm - Math.random() * 300;
          if (Math.random() > 0.6) {
            engineAudio.triggerExhaustPop();
          }
        } else {
          setIsRedlining(false);
        }
      } else {
        // Decelerate down towards idle
        setIsRedlining(false);
        const dropRate = 95;
        current = Math.max(idleRpm, current - dropRate);
      }

      rpmRef.current = current;
      setRpm(Math.round(current));
      engineAudio.updateRPM(current);

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isEngineOn, isPedalPressed, isEV]);

  // Calculate needle angle (-120deg at 0 to +120deg at maxRpm)
  const needleAngle = -120 + (rpm / maxRpm) * 240;

  return (
    <div className="rounded-3xl border border-gray-800 bg-gradient-to-b from-gray-950 via-neutral-900 to-gray-950 p-6 text-white shadow-2xl overflow-hidden relative">
      {/* Background ambient red glow if redlining */}
      {isRedlining && (
        <div className="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
        <div>
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[11px] font-black uppercase text-amber-400 inline-flex items-center gap-1.5 mb-1.5">
            <Flame className="h-3.5 w-3.5" />
            Interactive Sound Cockpit
          </span>
          <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{isEV ? 'Electric Drive Acoustic' : 'Engine & Exhaust Sound'}</span>
          </h3>
          <p className="text-xs text-gray-400">
            {isEV
              ? `${car.power} PS Synchronous Motor • Space Warp Sound Profile`
              : `${car.engineSize || 'Turbocharged Engine'} • ${car.power} PS • Redline ${redlineRpm} RPM`}
          </p>
        </div>

        <button
          onClick={handleToggleMute}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Cockpit Gauge & Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Analog Tachometer Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-56 w-56 sm:h-64 sm:w-64">
            {/* Outer Gauge Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-800 bg-neutral-950 shadow-inner flex items-center justify-center">
              
              {/* Gauge Numbers */}
              <div className="absolute inset-4 rounded-full border border-gray-800/80">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num, idx) => {
                  const angle = -120 + (idx / 8) * 240;
                  const rad = (angle - 90) * (Math.PI / 180);
                  const x = 50 + 38 * Math.cos(rad);
                  const y = 50 + 38 * Math.sin(rad);
                  const isRed = num >= 6;
                  return (
                    <span
                      key={num}
                      className={`absolute font-mono text-[11px] font-black -translate-x-1/2 -translate-y-1/2 ${
                        isRed ? 'text-red-500' : 'text-gray-400'
                      }`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {num}
                    </span>
                  );
                })}
              </div>

              {/* Redline zone arc indicator */}
              <div className="absolute top-7 right-8 text-[9px] font-mono font-extrabold text-red-500 tracking-wider">
                REDLINE
              </div>

              {/* Rotating Gauge Needle */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{ transform: `rotate(${needleAngle}deg)` }}
              >
                <div className="h-28 w-1 rounded-full bg-gradient-to-t from-red-600 via-amber-400 to-white shadow-lg shadow-red-500/50 mb-20" />
              </div>

              {/* Center Hub */}
              <div className="relative z-10 flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-gray-700 bg-gray-900 shadow-xl">
                <span className="font-mono text-sm font-black text-amber-400">{rpm}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">RPM</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-gray-400">
            <span>GEAR: <strong className="text-white">N</strong></span>
            <span>MODE: <strong className="text-amber-400">SPORT</strong></span>
            <span>STATUS: <strong className={isEngineOn ? 'text-emerald-400' : 'text-gray-500'}>
              {isEngineOn ? 'LIVE' : 'OFF'}
            </strong></span>
          </div>
        </div>

        {/* Cockpit Actions: Start Button & Gas Pedal */}
        <div className="flex flex-col items-center justify-center space-y-6">
          
          {/* Engine Start/Stop Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleEngine}
              className={`group relative flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 shadow-2xl transition-all active:scale-95 cursor-pointer ${
                isEngineOn
                  ? 'border-emerald-500 bg-gradient-to-b from-emerald-600 to-emerald-950 text-white shadow-emerald-500/30'
                  : 'border-red-600 bg-gradient-to-b from-red-600 to-neutral-950 text-white shadow-red-600/30 animate-pulse'
              }`}
            >
              <Power className="h-6 w-6 mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isEngineOn ? 'STOP' : 'START'}
              </span>
              <span className="text-[8px] font-bold uppercase opacity-80">ENGINE</span>
            </button>
            <p className="text-[11px] text-gray-400 mt-2 font-medium">
              {isEngineOn ? 'Engine running at idle' : 'Press to ignite'}
            </p>
          </div>

          {/* Interactive Gas Pedal */}
          <div className="w-full max-w-xs text-center">
            <button
              onMouseDown={() => isEngineOn && setIsPedalPressed(true)}
              onMouseUp={() => setIsPedalPressed(false)}
              onMouseLeave={() => setIsPedalPressed(false)}
              onTouchStart={() => isEngineOn && setIsPedalPressed(true)}
              onTouchEnd={() => setIsPedalPressed(false)}
              disabled={!isEngineOn}
              className={`w-full rounded-2xl border-2 py-4 px-6 text-sm sm:text-base font-black uppercase tracking-wider transition-all select-none shadow-xl ${
                !isEngineOn
                  ? 'border-gray-800 bg-gray-900/40 text-gray-600 cursor-not-allowed'
                  : isPedalPressed
                  ? 'border-amber-400 bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 text-white scale-95 shadow-amber-500/40'
                  : 'border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200 hover:border-amber-500/60 hover:text-white cursor-pointer active:scale-95'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Flame className={`h-5 w-5 ${isPedalPressed ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{isPedalPressed ? 'REV IN PROGRESS!' : 'HOLD TO REV PEDAL'}</span>
              </div>
            </button>
            <p className="text-[11px] text-gray-500 mt-2">
              Tip: You can also hold the <strong>[SPACEBAR]</strong> on your keyboard to rev!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EngineRevSoundbox;
