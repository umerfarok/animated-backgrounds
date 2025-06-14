/**
 * @fileoverview Advanced animation sequencing and timeline controls
 * @module AnimationSequencer
 */

/**
 * Animation keyframe class
 */
export class Keyframe {
  constructor(time, properties = {}, easing = 'linear') {
    this.time = time;
    this.properties = properties;
    this.easing = easing;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  /**
   * Interpolate between this keyframe and another
   * @param {Keyframe} nextKeyframe - Next keyframe
   * @param {number} progress - Progress (0-1)
   * @returns {Object} Interpolated properties
   */
  interpolate(nextKeyframe, progress) {
    const easedProgress = this.applyEasing(progress, this.easing);
    const result = {};
    
    // Interpolate all properties
    Object.keys(this.properties).forEach(key => {
      const startValue = this.properties[key];
      const endValue = nextKeyframe.properties[key];
      
      if (typeof startValue === 'number' && typeof endValue === 'number') {
        result[key] = startValue + (endValue - startValue) * easedProgress;
      } else if (Array.isArray(startValue) && Array.isArray(endValue)) {
        result[key] = startValue.map((start, index) => 
          start + (endValue[index] - start) * easedProgress
        );
      } else if (typeof startValue === 'string' && startValue.startsWith('#')) {
        // Color interpolation
        result[key] = this.interpolateColor(startValue, endValue, easedProgress);
      } else {
        // Default to start value for non-interpolatable types
        result[key] = easedProgress < 0.5 ? startValue : endValue;
      }
    });
    
    return result;
  }

  /**
   * Apply easing function
   * @param {number} t - Time parameter (0-1)
   * @param {string} easingType - Easing type
   * @returns {number} Eased value
   */
  applyEasing(t, easingType) {
    switch (easingType) {
      case 'linear': return t;
      case 'easeIn': return t * t;
      case 'easeOut': return 1 - (1 - t) * (1 - t);
      case 'easeInOut': return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      case 'easeInCubic': return t * t * t;
      case 'easeOutCubic': return 1 - Math.pow(1 - t, 3);
      case 'easeInOutCubic': return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      case 'bounce': return this.bounceEasing(t);
      case 'elastic': return this.elasticEasing(t);
      default: return t;
    }
  }

  /**
   * Bounce easing function
   * @param {number} t - Time parameter
   * @returns {number} Bounced value
   */
  bounceEasing(t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }

  /**
   * Elastic easing function
   * @param {number} t - Time parameter
   * @returns {number} Elastic value
   */
  elasticEasing(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  }

  /**
   * Interpolate between two colors
   * @param {string} color1 - Start color (hex)
   * @param {string} color2 - End color (hex)
   * @param {number} progress - Progress (0-1)
   * @returns {string} Interpolated color
   */
  interpolateColor(color1, color2, progress) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);
    
    return this.rgbToHex(r, g, b);
  }

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color
   * @returns {Object} RGB object
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  /**
   * Convert RGB to hex
   * @param {number} r - Red component
   * @param {number} g - Green component
   * @param {number} b - Blue component
   * @returns {string} Hex color
   */
  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

/**
 * Animation track for organizing keyframes
 */
export class AnimationTrack {
  constructor(name, target = null) {
    this.name = name;
    this.target = target;
    this.keyframes = [];
    this.enabled = true;
    this.muted = false;
    this.solo = false;
    this.volume = 1.0;
  }

  /**
   * Add keyframe to track
   * @param {Keyframe} keyframe - Keyframe to add
   */
  addKeyframe(keyframe) {
    this.keyframes.push(keyframe);
    this.keyframes.sort((a, b) => a.time - b.time);
  }

  /**
   * Remove keyframe from track
   * @param {string} keyframeId - Keyframe ID to remove
   */
  removeKeyframe(keyframeId) {
    this.keyframes = this.keyframes.filter(kf => kf.id !== keyframeId);
  }

  /**
   * Get interpolated properties at given time
   * @param {number} time - Current time
   * @returns {Object} Interpolated properties
   */
  getPropertiesAtTime(time) {
    if (!this.enabled || this.muted) return {};
    if (this.keyframes.length === 0) return {};
    
    // Find surrounding keyframes
    let prevKeyframe = null;
    let nextKeyframe = null;
    
    for (let i = 0; i < this.keyframes.length; i++) {
      const keyframe = this.keyframes[i];
      
      if (keyframe.time <= time) {
        prevKeyframe = keyframe;
      } else {
        nextKeyframe = keyframe;
        break;
      }
    }
    
    // If only one keyframe or time is before first keyframe
    if (!prevKeyframe) {
      return this.keyframes[0].properties;
    }
    
    // If time is after last keyframe
    if (!nextKeyframe) {
      return prevKeyframe.properties;
    }
    
    // Interpolate between keyframes
    const duration = nextKeyframe.time - prevKeyframe.time;
    const progress = duration > 0 ? (time - prevKeyframe.time) / duration : 0;
    
    const interpolated = prevKeyframe.interpolate(nextKeyframe, progress);
    
    // Apply volume scaling for numeric properties
    if (this.volume !== 1.0) {
      Object.keys(interpolated).forEach(key => {
        if (typeof interpolated[key] === 'number') {
          interpolated[key] *= this.volume;
        }
      });
    }
    
    return interpolated;
  }

  /**
   * Get all keyframes in time range
   * @param {number} startTime - Start time
   * @param {number} endTime - End time
   * @returns {Array} Keyframes in range
   */
  getKeyframesInRange(startTime, endTime) {
    return this.keyframes.filter(kf => kf.time >= startTime && kf.time <= endTime);
  }

  /**
   * Duplicate track
   * @returns {AnimationTrack} Duplicated track
   */
  duplicate() {
    const newTrack = new AnimationTrack(`${this.name} Copy`, this.target);
    newTrack.keyframes = this.keyframes.map(kf => 
      new Keyframe(kf.time, { ...kf.properties }, kf.easing)
    );
    newTrack.enabled = this.enabled;
    newTrack.volume = this.volume;
    return newTrack;
  }
}

/**
 * Advanced animation sequencer with timeline controls
 */
export class AnimationSequencer {
  constructor() {
    this.tracks = new Map();
    this.currentTime = 0;
    this.duration = 10000; // 10 seconds default
    this.isPlaying = false;
    this.isPaused = false;
    this.loop = false;
    this.playbackSpeed = 1.0;
    
    this.startTime = null;
    this.pauseTime = 0;
    this.lastUpdateTime = 0;
    
    this.markers = new Map();
    this.regions = new Map();
    
    this.onTimeUpdate = null;
    this.onPlayStateChange = null;
    this.onTrackUpdate = null;
    
    this.animationFrame = null;
  }

  /**
   * Add animation track
   * @param {AnimationTrack} track - Track to add
   */
  addTrack(track) {
    this.tracks.set(track.name, track);
    this.notifyTrackUpdate();
  }

  /**
   * Remove animation track
   * @param {string} trackName - Track name to remove
   */
  removeTrack(trackName) {
    this.tracks.delete(trackName);
    this.notifyTrackUpdate();
  }

  /**
   * Get track by name
   * @param {string} trackName - Track name
   * @returns {AnimationTrack} Track instance
   */
  getTrack(trackName) {
    return this.tracks.get(trackName);
  }

  /**
   * Create new track with keyframes
   * @param {string} name - Track name
   * @param {Array} keyframeData - Array of keyframe data
   * @param {*} target - Target object
   * @returns {AnimationTrack} Created track
   */
  createTrack(name, keyframeData = [], target = null) {
    const track = new AnimationTrack(name, target);
    
    keyframeData.forEach(data => {
      const keyframe = new Keyframe(data.time, data.properties, data.easing);
      track.addKeyframe(keyframe);
    });
    
    this.addTrack(track);
    return track;
  }

  /**
   * Start playback
   */
  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.isPaused = false;
    this.startTime = performance.now() - this.currentTime / this.playbackSpeed;
    
    this.update();
    this.notifyPlayStateChange();
  }

  /**
   * Pause playback
   */
  pause() {
    if (!this.isPlaying || this.isPaused) return;
    
    this.isPaused = true;
    this.pauseTime = this.currentTime;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.notifyPlayStateChange();
  }

  /**
   * Stop playback and reset
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTime = 0;
    this.pauseTime = 0;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.notifyPlayStateChange();
    this.notifyTimeUpdate();
  }

  /**
   * Seek to specific time
   * @param {number} time - Time to seek to
   */
  seekTo(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    
    if (this.isPlaying && !this.isPaused) {
      this.startTime = performance.now() - this.currentTime / this.playbackSpeed;
    } else {
      this.pauseTime = this.currentTime;
    }
    
    this.notifyTimeUpdate();
  }

  /**
   * Set playback speed
   * @param {number} speed - Playback speed multiplier
   */
  setPlaybackSpeed(speed) {
    const wasPlaying = this.isPlaying && !this.isPaused;
    
    this.playbackSpeed = Math.max(0.1, Math.min(4.0, speed));
    
    if (wasPlaying) {
      this.startTime = performance.now() - this.currentTime / this.playbackSpeed;
    }
  }

  /**
   * Set loop mode
   * @param {boolean} enabled - Loop enabled
   */
  setLoop(enabled) {
    this.loop = enabled;
  }

  /**
   * Set sequence duration
   * @param {number} duration - Duration in milliseconds
   */
  setDuration(duration) {
    this.duration = Math.max(1000, duration);
    if (this.currentTime > this.duration) {
      this.seekTo(this.duration);
    }
  }

  /**
   * Update animation frame
   */
  update() {
    if (!this.isPlaying || this.isPaused) return;
    
    const now = performance.now();
    this.currentTime = (now - this.startTime) * this.playbackSpeed;
    
    // Check for end of sequence
    if (this.currentTime >= this.duration) {
      if (this.loop) {
        this.seekTo(0);
      } else {
        this.stop();
        return;
      }
    }
    
    this.notifyTimeUpdate();
    
    // Schedule next frame
    this.animationFrame = requestAnimationFrame(() => this.update());
  }

  /**
   * Get current state of all tracks
   * @returns {Object} Current animation state
   */
  getCurrentState() {
    const state = {};
    
    this.tracks.forEach((track, name) => {
      if (track.enabled && !track.muted) {
        state[name] = track.getPropertiesAtTime(this.currentTime);
      }
    });
    
    return state;
  }

  /**
   * Add time marker
   * @param {string} name - Marker name
   * @param {number} time - Marker time
   * @param {string} color - Marker color
   */
  addMarker(name, time, color = '#ff0000') {
    this.markers.set(name, { time, color });
  }

  /**
   * Remove time marker
   * @param {string} name - Marker name
   */
  removeMarker(name) {
    this.markers.delete(name);
  }

  /**
   * Add time region
   * @param {string} name - Region name
   * @param {number} startTime - Start time
   * @param {number} endTime - End time
   * @param {string} color - Region color
   */
  addRegion(name, startTime, endTime, color = '#0080ff40') {
    this.regions.set(name, { startTime, endTime, color });
  }

  /**
   * Remove time region
   * @param {string} name - Region name
   */
  removeRegion(name) {
    this.regions.delete(name);
  }

  /**
   * Export sequence data
   * @returns {Object} Sequence data
   */
  export() {
    const tracksData = {};
    
    this.tracks.forEach((track, name) => {
      tracksData[name] = {
        enabled: track.enabled,
        muted: track.muted,
        volume: track.volume,
        keyframes: track.keyframes.map(kf => ({
          time: kf.time,
          properties: kf.properties,
          easing: kf.easing
        }))
      };
    });
    
    return {
      version: '2.0',
      duration: this.duration,
      tracks: tracksData,
      markers: Object.fromEntries(this.markers),
      regions: Object.fromEntries(this.regions)
    };
  }

  /**
   * Import sequence data
   * @param {Object} data - Sequence data
   */
  import(data) {
    this.stop();
    this.tracks.clear();
    this.markers.clear();
    this.regions.clear();
    
    this.duration = data.duration || 10000;
    
    // Import tracks
    Object.entries(data.tracks || {}).forEach(([name, trackData]) => {
      const track = new AnimationTrack(name);
      track.enabled = trackData.enabled !== false;
      track.muted = trackData.muted || false;
      track.volume = trackData.volume || 1.0;
      
      trackData.keyframes.forEach(kfData => {
        const keyframe = new Keyframe(kfData.time, kfData.properties, kfData.easing);
        track.addKeyframe(keyframe);
      });
      
      this.addTrack(track);
    });
    
    // Import markers
    Object.entries(data.markers || {}).forEach(([name, marker]) => {
      this.markers.set(name, marker);
    });
    
    // Import regions
    Object.entries(data.regions || {}).forEach(([name, region]) => {
      this.regions.set(name, region);
    });
  }

  /**
   * Generate animation preview
   * @param {number} samples - Number of time samples
   * @returns {Array} Preview data
   */
  generatePreview(samples = 100) {
    const preview = [];
    const timeStep = this.duration / samples;
    
    for (let i = 0; i <= samples; i++) {
      const time = i * timeStep;
      const state = {};
      
      this.tracks.forEach((track, name) => {
        state[name] = track.getPropertiesAtTime(time);
      });
      
      preview.push({ time, state });
    }
    
    return preview;
  }

  /**
   * Notify time update listeners
   */
  notifyTimeUpdate() {
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime, this.duration);
    }
  }

  /**
   * Notify play state change listeners
   */
  notifyPlayStateChange() {
    if (this.onPlayStateChange) {
      this.onPlayStateChange(this.isPlaying, this.isPaused);
    }
  }

  /**
   * Notify track update listeners
   */
  notifyTrackUpdate() {
    if (this.onTrackUpdate) {
      this.onTrackUpdate(Array.from(this.tracks.values()));
    }
  }

  /**
   * Batch operations for performance
   * @param {Function} operations - Operations to batch
   */
  batch(operations) {
    const wasNotifying = this.onTrackUpdate !== null;
    if (wasNotifying) {
      const originalCallback = this.onTrackUpdate;
      this.onTrackUpdate = null;
      
      operations();
      
      this.onTrackUpdate = originalCallback;
      this.notifyTrackUpdate();
    } else {
      operations();
    }
  }
}

/**
 * Preset animation templates
 */
export class AnimationPresets {
  /**
   * Create fade in/out animation
   * @param {number} duration - Animation duration
   * @returns {Object} Track data
   */
  static fadeInOut(duration = 5000) {
    return {
      opacity: [
        { time: 0, properties: { opacity: 0 }, easing: 'easeIn' },
        { time: duration * 0.3, properties: { opacity: 1 }, easing: 'easeOut' },
        { time: duration * 0.7, properties: { opacity: 1 }, easing: 'easeIn' },
        { time: duration, properties: { opacity: 0 }, easing: 'easeOut' }
      ]
    };
  }

  /**
   * Create bounce animation
   * @param {number} duration - Animation duration
   * @returns {Object} Track data
   */
  static bounce(duration = 3000) {
    return {
      transform: [
        { time: 0, properties: { y: 0, scale: 1 }, easing: 'easeOut' },
        { time: duration * 0.25, properties: { y: -50, scale: 1.1 }, easing: 'bounce' },
        { time: duration * 0.5, properties: { y: 0, scale: 1 }, easing: 'easeOut' },
        { time: duration * 0.75, properties: { y: -25, scale: 1.05 }, easing: 'bounce' },
        { time: duration, properties: { y: 0, scale: 1 }, easing: 'easeOut' }
      ]
    };
  }

  /**
   * Create color cycle animation
   * @param {Array} colors - Array of colors to cycle through
   * @param {number} duration - Animation duration
   * @returns {Object} Track data
   */
  static colorCycle(colors = ['#ff0000', '#00ff00', '#0000ff'], duration = 6000) {
    const keyframes = [];
    const timeStep = duration / colors.length;
    
    colors.forEach((color, index) => {
      keyframes.push({
        time: index * timeStep,
        properties: { color },
        easing: 'easeInOut'
      });
    });
    
    // Return to first color
    keyframes.push({
      time: duration,
      properties: { color: colors[0] },
      easing: 'easeInOut'
    });
    
    return { color: keyframes };
  }

  /**
   * Create pulsing animation
   * @param {number} duration - Animation duration
   * @param {number} pulseCount - Number of pulses
   * @returns {Object} Track data
   */
  static pulse(duration = 4000, pulseCount = 2) {
    const keyframes = [];
    const pulseInterval = duration / pulseCount;
    
    for (let i = 0; i < pulseCount; i++) {
      const startTime = i * pulseInterval;
      const midTime = startTime + pulseInterval * 0.5;
      const endTime = startTime + pulseInterval;
      
      keyframes.push(
        { time: startTime, properties: { scale: 1, opacity: 0.8 }, easing: 'easeOut' },
        { time: midTime, properties: { scale: 1.3, opacity: 1 }, easing: 'easeIn' },
        { time: endTime, properties: { scale: 1, opacity: 0.8 }, easing: 'easeOut' }
      );
    }
    
    return { pulse: keyframes };
  }

  /**
   * Create spiral animation
   * @param {number} duration - Animation duration
   * @param {number} radius - Spiral radius
   * @param {number} turns - Number of turns
   * @returns {Object} Track data
   */
  static spiral(duration = 8000, radius = 100, turns = 3) {
    const keyframes = [];
    const samples = 50;
    const timeStep = duration / samples;
    
    for (let i = 0; i <= samples; i++) {
      const progress = i / samples;
      const angle = progress * turns * Math.PI * 2;
      const currentRadius = radius * (1 - progress * 0.8);
      
      const x = Math.cos(angle) * currentRadius;
      const y = Math.sin(angle) * currentRadius;
      
      keyframes.push({
        time: i * timeStep,
        properties: { x, y, rotation: angle * 180 / Math.PI },
        easing: 'linear'
      });
    }
    
    return { spiral: keyframes };
  }
}

// Export singleton instance
export const animationSequencer = new AnimationSequencer(); 