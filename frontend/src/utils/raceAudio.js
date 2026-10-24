// Web Audio API Synthesizer for Drag Race effects (100% procedural, no external audio files needed)

class RaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.engineNodes = {};
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
    if (muted) {
      this.stopAllEngines();
    }
  }

  // Play countdown beeps (amber: 440Hz, green: 880Hz)
  playBeep(isGreen = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isGreen ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isGreen ? 880 : 440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isGreen ? 0.35 : 0.15));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (isGreen ? 0.35 : 0.15));
    } catch (e) {
      // Audio not permitted or interrupted
    }
  }

  // Tire screech on launch using noise buffer
  playTireScreech() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Start continuous engine drone for a car
  startEngineSound(carId, isEV = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.stopEngineSound(carId);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (isEV) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, this.ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();

      this.engineNodes[carId] = { osc, gain, filter, isEV };
    } catch (e) {}
  }

  // Update engine pitch and filter based on speed (0 to 100+ km/h)
  updateEngineSpeed(carId, speedKmh) {
    if (this.isMuted || !this.engineNodes[carId] || !this.ctx) return;

    try {
      const { osc, filter, isEV } = this.engineNodes[carId];
      const baseFreq = isEV ? 120 : 65;
      const targetFreq = baseFreq + speedKmh * (isEV ? 4.5 : 1.8);
      const filterFreq = isEV ? 800 + speedKmh * 10 : 350 + speedKmh * 8;

      osc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
      filter.frequency.setTargetAtTime(filterFreq, this.ctx.currentTime, 0.05);
    } catch (e) {}
  }

  stopEngineSound(carId) {
    if (this.engineNodes[carId]) {
      try {
        const { osc, gain } = this.engineNodes[carId];
        gain.gain.setValueAtTime(0.001, this.ctx?.currentTime || 0);
        osc.stop();
      } catch (e) {}
      delete this.engineNodes[carId];
    }
  }

  stopAllEngines() {
    Object.keys(this.engineNodes).forEach((id) => this.stopEngineSound(id));
  }

  // Finish line celebration fanfare
  playVictoryFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.4);
      });
    } catch (e) {}
  }
}

export const raceAudio = new RaceAudioEngine();
