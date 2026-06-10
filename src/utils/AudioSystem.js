// Romantic synth chord progressions and interactive sound effects using Web Audio API
class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.currentOscillators = [];
    this.isPlaying = false;
    this.chordTimeout = null;
    this.currentChordIndex = 0;
    
    // Cozy romantic chord progression: Cmaj7 -> Am9 -> Fmaj7 -> G11
    this.chords = [
      [130.81, 261.63, 329.63, 392.00, 493.88], // C3, C4, E4, G4, B4 (Cmaj7)
      [110.00, 220.00, 261.63, 329.63, 392.00], // A2, A3, C4, E4, G4 (Am7)
      [87.31, 174.61, 220.00, 261.63, 329.63],  // F2, F3, A3, C4, E4 (Fmaj7)
      [98.00, 196.00, 293.66, 349.23, 440.00]   // G2, G3, D4, F4, A4 (G9)
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    
    // Create master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    
    // Create music gain
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.15, this.ctx.currentTime); // keep music soft
    this.musicGain.connect(this.masterGain);
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    this.init();
    this.resumeContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08); // slide up to A5
    
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playNoHover() {
    this.init();
    this.resumeContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(329.63, t); // E4
    osc.frequency.exponentialRampToValueAtTime(196.00, t + 0.25); // slide down to G3 (comical slide)
    
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  playSuccess() {
    this.init();
    this.resumeContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    
    notes.forEach((freq, index) => {
      const delay = index * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, t + delay);
      
      gain.gain.setValueAtTime(0.12, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.005, t + delay + 0.8);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t + delay);
      osc.stop(t + delay + 0.9);
    });
  }

  startMusic() {
    this.init();
    this.resumeContext();
    if (!this.ctx || this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentChordIndex = 0;
    this.playNextChord();
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.chordTimeout) {
      clearTimeout(this.chordTimeout);
      this.chordTimeout = null;
    }
    this.fadeCurrentOscillators();
  }

  fadeCurrentOscillators() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.currentOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
        osc.stop(t + 1.2);
      } catch (e) {
        // ignore errors for already stopped oscillators
      }
    });
    this.currentOscillators = [];
  }

  playNextChord() {
    if (!this.isPlaying || !this.ctx) return;
    
    const t = this.ctx.currentTime;
    const chordNotes = this.chords[this.currentChordIndex];
    
    // Fade out previous notes
    this.fadeCurrentOscillators();
    
    // Play new chord notes
    chordNotes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      // Warm sawtooth/triangle mix: we will use triangle for warm tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      
      // Filter out high frequencies to make it soft and cozy
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 4.0);
      
      // Soft envelope fade in and fade out
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 1.5); // Slow fade-in (1.5s)
      gain.gain.setValueAtTime(0.12, t + 3.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 5.0); // Slow fade-out (1.5s)
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start(t);
      osc.stop(t + 5.1);
      
      this.currentOscillators.push({ osc, gain });
    });
    
    // Progress chord index
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
    
    // Schedule next chord (every 4.5 seconds for overlapping crossfade)
    this.chordTimeout = setTimeout(() => {
      this.playNextChord();
    }, 4500);
  }
}

export const audio = new AudioSystem();
