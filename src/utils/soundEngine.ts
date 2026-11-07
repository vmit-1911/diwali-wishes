/**
 * High quality Web Audio Synthesizer for rich cinematic Diwali soundscape.
 * Generates ambient music, sparkles, diya whooshes, fuse crackles, and booming fireworks
 * without depending on external network assets or broken media links.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isPlayingAmbient: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.25, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- AMBIENT SOUNDTRACK (Ethereal Indian Tanpura & Temple Drone with Chimes) ---
  public startAmbient() {
    if (this.isPlayingAmbient) return;
    this.initContext();
    if (!this.ctx) return;

    this.isPlayingAmbient = true;
    const now = this.ctx.currentTime;

    const masterAmb = this.ctx.createGain();
    masterAmb.gain.setValueAtTime(0.001, now);
    masterAmb.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : 0.22, now + 4);
    masterAmb.connect(this.ctx.destination);
    this.ambientGain = masterAmb;

    // Rich meditative harmonic drone: Root D (146.83 Hz), Fifth A (220 Hz), Octave (293.66 Hz), Major 9th (330 Hz)
    const droneFreqs = [73.42, 146.83, 220.00, 293.66, 366.5];
    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.4, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350 + idx * 80, now);

      gain.gain.setValueAtTime(0.06 / (idx + 1), now);

      // Subtle LFO modulation for warm breathing effect
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, now);
      lfoGain.gain.setValueAtTime(1.5, now);
      lfo.connect(filter.frequency);
      lfo.start(now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterAmb);
      osc.start(now);

      this.ambientOscillators.push(osc, lfo);
    });

    // Schedule gentle random windchime / bell harmonics
    this.scheduleEtherealChimes();
  }

  private scheduleEtherealChimes() {
    if (!this.isPlayingAmbient) return;
    const interval = Math.random() * 4000 + 3500;
    setTimeout(() => {
      if (this.isPlayingAmbient && !this.isMuted) {
        this.playGentleChime();
      }
      this.scheduleEtherealChimes();
    }, interval);
  }

  private playGentleChime() {
    if (!this.ctx || this.isMuted) return;
    const notes = [587.33, 659.25, 740, 880, 987.77, 1174.66]; // D Major Pentatonic / Raag Yaman
    const freq = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  // --- SOUND EFFECTS ---

  // Sparkle / Star Light Up
  public playSparkle(freqMultiplier = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C E G C pentatonic high
    freqs.forEach((baseFreq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * freqMultiplier, now + i * 0.04);
      gain.gain.setValueAtTime(0.035, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.4);
    });
  }

  // Diya Ignition: Soft gentle whoosh with glowing chime
  public playDiyaIgnite(diyaIndex: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Breath / warm flame whoosh (filtered noise)
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.18;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Warm ascending bell tone based on diya order (1..7 creates a joyous scale)
    const scale = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 587.33, 659.25];
    const baseFreq = scale[diyaIndex % scale.length];

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.3);

    oscGain.gain.setValueAtTime(0.001, now + 0.05);
    oscGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now + 0.05);
    osc.stop(now + 0.85);
  }

  // Rangoli sand / glitter stroke
  public playRangoliStroke() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const randomFreq = 400 + Math.random() * 800;
    osc.frequency.setValueAtTime(randomFreq, now);
    osc.frequency.exponentialRampToValueAtTime(randomFreq + 150, now + 0.06);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Lantern chime / touch
  public playLanternRing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 783.99, 987.77, 1318.51];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[Math.floor(Math.random() * notes.length)], now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.85);
  }

  // Envelope seal break / golden paper rustle
  public playEnvelopeOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Warm celestial chord
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscG = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.05);
      oscG.gain.setValueAtTime(0.04, now + 0.1 + idx * 0.05);
      oscG.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(oscG);
      oscG.connect(this.ctx.destination);
      osc.start(now + 0.1 + idx * 0.05);
      osc.stop(now + 1.3);
    });
  }

  // Fuse crackle loop
  private fuseInterval: ReturnType<typeof setInterval> | null = null;
  public startFuseSound() {
    if (this.isMuted || this.fuseInterval) return;
    this.initContext();

    this.fuseInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2000 + Math.random() * 3000, now);

      gain.gain.setValueAtTime(0.04 + Math.random() * 0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }, 40);
  }

  public stopFuseSound() {
    if (this.fuseInterval) {
      clearInterval(this.fuseInterval);
      this.fuseInterval = null;
    }
  }

  // Firecracker / Anar Launch / Fountain Whoosh
  public playAnarFountain() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.min(1, i / (0.3 * this.ctx.sampleRate));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // Fireworks explosion (deep boom + crackles)
  public playFireworkExplosion() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub Bass Thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);

    // Blast Noise
    const bufferSize = this.ctx.sampleRate * 0.7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.5);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // Cascading crackles
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const cNow = this.ctx.currentTime;
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = 'square';
        cOsc.frequency.setValueAtTime(1500 + Math.random() * 1500, cNow);
        cGain.gain.setValueAtTime(0.03, cNow);
        cGain.gain.exponentialRampToValueAtTime(0.0001, cNow + 0.05);
        cOsc.connect(cGain);
        cGain.connect(this.ctx.destination);
        cOsc.start(cNow);
        cOsc.stop(cNow + 0.06);
      }, 200 + i * 90 + Math.random() * 40);
    }
  }

  // Light Rays / Energy whoosh
  public playEnergyCharge(pitchRatio: number = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180 * pitchRatio, now);
    osc.frequency.exponentialRampToValueAtTime(540 * pitchRatio, now + 0.15);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const sound = new SoundEngine();

