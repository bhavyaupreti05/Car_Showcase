// Procedural Web Audio Engine for Real-Time Engine Rev, Exhaust Pops & EV Motor Sound

class EngineSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isRunning = false;

    // Audio nodes
    this.osc1 = null;
    this.osc2 = null;
    this.subOsc = null;
    this.filter = null;
    this.gain = null;
    this.noiseGen = null;
    this.isEV = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.gain) {
      this.gain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.gain && this.isRunning) {
      this.gain.gain.setValueAtTime(0.18, this.ctx?.currentTime || 0);
    }
  }

  start(isEV = false) {
    this.init();
    if (!this.ctx) return;
    this.stop();

    this.isEV = isEV;
    this.isRunning = true;

    const t = this.ctx.currentTime;

    // Master gain
    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(this.isMuted ? 0 : 0.01, t);
    this.gain.gain.exponentialRampToValueAtTime(this.isMuted ? 0 : 0.22, t + 0.35);

    // Filter
    this.filter = this.ctx.createBiquadFilter();

    if (isEV) {
      // EV Sound: Futuristic turbine/synth warp
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(120, t);

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(240, t);

      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(600, t);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
    } else {
      // Combustion Engine Sound: Rich harmonics with primary & sub-oscillators
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(45, t); // ~850 RPM base

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'square';
      this.osc2.frequency.setValueAtTime(90, t);

      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'triangle';
      this.subOsc.frequency.setValueAtTime(22.5, t);

      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(280, t);
      this.filter.Q.setValueAtTime(3.0, t);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.subOsc.connect(this.filter);
    }

    this.filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);

    this.osc1.start(t);
    this.osc2.start(t);
    if (this.subOsc) this.subOsc.start(t);
  }

  // Update pitch based on current RPM (800 to 7500)
  updateRPM(rpm) {
    if (!this.isRunning || !this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const clampedRpm = Math.max(800, Math.min(7500, rpm));

    if (this.isEV) {
      // EV pitch scaling
      const freq = 120 + (clampedRpm / 7500) * 850;
      this.osc1.frequency.setTargetAtTime(freq, t, 0.05);
      this.osc2.frequency.setTargetAtTime(freq * 1.5, t, 0.05);
      this.filter.frequency.setTargetAtTime(800 + (clampedRpm / 7500) * 2200, t, 0.05);
    } else {
      // Combustion pitch scaling (Crankshaft Hz = RPM / 60)
      const baseHz = (clampedRpm / 60) * 1.8;
      this.osc1.frequency.setTargetAtTime(baseHz, t, 0.04);
      this.osc2.frequency.setTargetAtTime(baseHz * 2, t, 0.04);
      if (this.subOsc) {
        this.subOsc.frequency.setTargetAtTime(baseHz * 0.5, t, 0.04);
      }

      // Filter opens up as RPM climbs
      const filterFreq = 260 + (clampedRpm / 7500) * 1200;
      this.filter.frequency.setTargetAtTime(filterFreq, t, 0.04);
    }
  }

  // Exhaust crackle / backfire pops on redline or aggressive throttle lift
  triggerExhaustPop() {
    if (!this.isRunning || !this.ctx || this.isMuted || this.isEV) return;

    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const popFilter = this.ctx.createBiquadFilter();
      popFilter.type = 'lowpass';
      popFilter.frequency.setValueAtTime(450, t);

      const popGain = this.ctx.createGain();
      popGain.gain.setValueAtTime(0.35, t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      noise.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(this.ctx.destination);

      noise.start(t);
    } catch (e) {}
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.gain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.gain.gain.setValueAtTime(this.gain.gain.value, t);
        this.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

        setTimeout(() => {
          if (this.osc1) {
            try { this.osc1.stop(); } catch (e) {}
            this.osc1 = null;
          }
          if (this.osc2) {
            try { this.osc2.stop(); } catch (e) {}
            this.osc2 = null;
          }
          if (this.subOsc) {
            try { this.subOsc.stop(); } catch (e) {}
            this.subOsc = null;
          }
        }, 220);
      } catch (e) {}
    }
  }
}

export const engineAudio = new EngineSoundSynthesizer();
