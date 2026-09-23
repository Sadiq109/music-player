// Playlist state with no DOM access, so it can be unit tested in Node.
export class Playlist {
  constructor(tracks, { random = Math.random } = {}) {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      throw new Error('Playlist needs at least one track');
    }
    this.tracks = tracks;
    this.index = 0;
    this.shuffle = false;
    this.repeat = 'all'; // 'off' | 'all' | 'one'
    this.random = random;
    this.order = tracks.map((_, i) => i);
  }

  get current() {
    return this.tracks[this.index];
  }

  select(i) {
    if (!Number.isInteger(i) || i < 0 || i >= this.tracks.length) {
      throw new RangeError(`No track at position ${i}`);
    }
    this.index = i;
    return this.current;
  }

  setShuffle(on) {
    this.shuffle = Boolean(on);
    this.order = this.tracks.map((_, i) => i);
    if (this.shuffle) {
      // Fisher-Yates, keeping the current track first so playback doesn't jump.
      const rest = this.order.filter((i) => i !== this.index);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      this.order = [this.index, ...rest];
    }
  }

  cycleRepeat() {
    const modes = ['off', 'all', 'one'];
    this.repeat = modes[(modes.indexOf(this.repeat) + 1) % modes.length];
    return this.repeat;
  }

  // Returns the next track, or null when playback should stop.
  next({ auto = false } = {}) {
    if (auto && this.repeat === 'one') return this.current;
    const pos = this.order.indexOf(this.index);
    if (pos === this.order.length - 1) {
      if (auto && this.repeat === 'off') return null;
      this.index = this.order[0];
    } else {
      this.index = this.order[pos + 1];
    }
    return this.current;
  }

  previous() {
    const pos = this.order.indexOf(this.index);
    this.index = this.order[(pos - 1 + this.order.length) % this.order.length];
    return this.current;
  }
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
