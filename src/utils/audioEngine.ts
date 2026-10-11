/**
 * Synthesizes typewriter and mechanical keyboard audio via Web Audio API.
 * Supports simultaneous output to speaker and MediaStream recording destination.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private streamDestination: MediaStreamAudioDestinationNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create stream destination for video recording
      this.streamDestination = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.streamDestination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getAudioTrack(): MediaStreamTrack | null {
    this.initContext();
    if (this.streamDestination && this.streamDestination.stream.getAudioTracks().length > 0) {
      return this.streamDestination.stream.getAudioTracks()[0];
    }
    return null;
  }

  /**
   * Plays a snappy tactile mechanical click
   */
  public playClick(isSpace: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // 1. Noise burst for key impact
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.015); // 15ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for crisp switch snap
    const filter = this.ctx.createBiquadFilter();
    filter.type = isSpace ? 'lowpass' : 'highpass';
    filter.frequency.setValueAtTime(isSpace ? 650 : 2200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isSpace ? 0.3 : 0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);

    // 2. Subtle mechanical body resonance
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = isSpace ? 'triangle' : 'sine';
    const pitch = isSpace ? 180 + Math.random() * 30 : 620 + Math.random() * 120;
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + 0.025);

    oscGain.gain.setValueAtTime(0.12, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  /**
   * Vintage typewriter bell chime
   */
  public playBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, t); // A6 note
    osc.frequency.exponentialRampToValueAtTime(1750, t + 0.4);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  /**
   * Deep cinema sub-bass intro hit
   */
  public playIntroHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.5);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.65);
  }
}

export const audioEngine = new AudioEngine();
