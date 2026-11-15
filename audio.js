/**
 * AUDIO CONTROLLER
 * Ensures the song restarts from the very beginning (0:00) every time the envelope opens,
 * and pauses & resets to 0:00 whenever the envelope closes.
 */

class SoundController {
  constructor() {
    this.audioEl = document.getElementById('bgAudio');
    this.isMuted = false;
    this.isPlaying = false;
    this.audioCtx = null;

    if (this.audioEl) {
      this.audioEl.volume = 0.95;
      this.audioEl.addEventListener('play', () => { this.isPlaying = true; });
      this.audioEl.addEventListener('pause', () => { this.isPlaying = false; });
      this.audioEl.addEventListener('error', (e) => {
        console.warn('Audio notice:', e);
      });
    }
  }

  initWebAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Plays strictly from the beginning (0.0s)
  async play() {
    this.initWebAudio();
    if (this.isMuted) return;

    if (this.audioEl) {
      try {
        this.audioEl.currentTime = 0; // ALWAYS restart from the start
        await this.audioEl.play();
        this.isPlaying = true;
      } catch (err) {
        console.log('Audio play handled:', err);
      }
    }
  }

  // Stops and resets completely to 0.0s
  stop() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0; // Reset to 0:00
    }
    this.isPlaying = false;
  }

  pause() {
    this.stop();
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      this.isMuted = true;
      return false;
    } else {
      this.isMuted = false;
      this.play();
      return true;
    }
  }

  // Soft romantic opening chime & envelope sound
  playPaperSound() {
    this.initWebAudio();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }
}

window.soundController = new SoundController();
