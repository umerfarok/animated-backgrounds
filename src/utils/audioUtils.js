/**
 * @fileoverview Audio-reactive utilities for animated backgrounds
 * @module AudioUtils
 */

/**
 * Audio analyzer class for real-time audio processing
 */
export class AudioAnalyzer {
  constructor() {
    this.audioContext = null;
    this.analyzer = null;
    this.dataArray = null;
    this.source = null;
    this.isListening = false;
    this.frequencyBands = 32;
    this.sensitivity = 1.0;
    this.smoothing = 0.8;
    this.callbacks = [];
  }

  /**
   * Initialize audio context and microphone access
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.analyzer = this.audioContext.createAnalyser();
      
      this.analyzer.fftSize = this.frequencyBands * 4;
      this.analyzer.smoothingTimeConstant = this.smoothing;
      this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
      
      this.source.connect(this.analyzer);
      
      return true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      return false;
    }
  }

  /**
   * Start listening to audio
   */
  startListening() {
    if (!this.analyzer || this.isListening) return;
    
    this.isListening = true;
    this.processAudio();
  }

  /**
   * Stop listening to audio
   */
  stopListening() {
    this.isListening = false;
  }

  /**
   * Process audio data and trigger callbacks
   */
  processAudio() {
    if (!this.isListening) return;
    
    this.analyzer.getByteFrequencyData(this.dataArray);
    
    const audioData = {
      frequencies: Array.from(this.dataArray),
      volume: this.getVolume(),
      bass: this.getBass(),
      mid: this.getMid(),
      treble: this.getTreble(),
      beat: this.detectBeat(),
      timestamp: performance.now()
    };
    
    this.callbacks.forEach(callback => callback(audioData));
    
    requestAnimationFrame(() => this.processAudio());
  }

  /**
   * Get overall volume level
   * @returns {number} Volume (0-1)
   */
  getVolume() {
    if (!this.dataArray) return 0;
    
    const sum = this.dataArray.reduce((acc, val) => acc + val, 0);
    return (sum / (this.dataArray.length * 255)) * this.sensitivity;
  }

  /**
   * Get bass frequencies (20-250 Hz)
   * @returns {number} Bass level (0-1)
   */
  getBass() {
    if (!this.dataArray) return 0;
    
    const bassRange = Math.floor(this.dataArray.length * 0.1);
    let sum = 0;
    for (let i = 0; i < bassRange; i++) {
      sum += this.dataArray[i];
    }
    return (sum / (bassRange * 255)) * this.sensitivity;
  }

  /**
   * Get mid frequencies (250-4000 Hz)
   * @returns {number} Mid level (0-1)
   */
  getMid() {
    if (!this.dataArray) return 0;
    
    const start = Math.floor(this.dataArray.length * 0.1);
    const end = Math.floor(this.dataArray.length * 0.6);
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += this.dataArray[i];
    }
    return (sum / ((end - start) * 255)) * this.sensitivity;
  }

  /**
   * Get treble frequencies (4000+ Hz)
   * @returns {number} Treble level (0-1)
   */
  getTreble() {
    if (!this.dataArray) return 0;
    
    const start = Math.floor(this.dataArray.length * 0.6);
    let sum = 0;
    for (let i = start; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return (sum / ((this.dataArray.length - start) * 255)) * this.sensitivity;
  }

  /**
   * Simple beat detection
   * @returns {boolean} Beat detected
   */
  detectBeat() {
    const volume = this.getVolume();
    const bass = this.getBass();
    
    // Simple threshold-based beat detection
    return volume > 0.3 && bass > 0.4;
  }

  /**
   * Add callback for audio data
   * @param {Function} callback - Callback function
   */
  onAudioData(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Remove callback
   * @param {Function} callback - Callback to remove
   */
  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Set sensitivity
   * @param {number} sensitivity - Sensitivity multiplier
   */
  setSensitivity(sensitivity) {
    this.sensitivity = Math.max(0.1, Math.min(5.0, sensitivity));
  }

  /**
   * Set smoothing
   * @param {number} smoothing - Smoothing value (0-1)
   */
  setSmoothing(smoothing) {
    this.smoothing = Math.max(0, Math.min(1, smoothing));
    if (this.analyzer) {
      this.analyzer.smoothingTimeConstant = this.smoothing;
    }
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.stopListening();
    if (this.source) {
      this.source.disconnect();
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

/**
 * Audio-reactive animation effects
 */
export class AudioReactiveEffects {
  constructor() {
    this.analyzer = new AudioAnalyzer();
    this.isActive = false;
    this.effects = new Map();
  }

  /**
   * Initialize audio reactive effects
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    const success = await this.analyzer.initialize();
    if (success) {
      this.analyzer.onAudioData(this.processAudioData.bind(this));
      this.isActive = true;
    }
    return success;
  }

  /**
   * Start audio reactive effects
   */
  start() {
    if (this.isActive) {
      this.analyzer.startListening();
    }
  }

  /**
   * Stop audio reactive effects
   */
  stop() {
    this.analyzer.stopListening();
  }

  /**
   * Process audio data and apply effects
   * @param {Object} audioData - Audio analysis data
   */
  processAudioData(audioData) {
    // Color intensity based on volume
    this.effects.set('colorIntensity', audioData.volume);
    
    // Particle count based on bass
    this.effects.set('particleMultiplier', 1 + audioData.bass * 2);
    
    // Animation speed based on mid frequencies
    this.effects.set('speedMultiplier', 0.5 + audioData.mid * 1.5);
    
    // Size modulation based on treble
    this.effects.set('sizeMultiplier', 0.8 + audioData.treble * 0.4);
    
    // Beat detection for special effects
    this.effects.set('beatDetected', audioData.beat);
    
    // Frequency spectrum for visualizer effects
    this.effects.set('frequencySpectrum', audioData.frequencies);
  }

  /**
   * Get current effect value
   * @param {string} effectName - Name of the effect
   * @returns {*} Effect value
   */
  getEffect(effectName) {
    return this.effects.get(effectName) || 0;
  }

  /**
   * Set sensitivity
   * @param {number} sensitivity - Sensitivity value
   */
  setSensitivity(sensitivity) {
    this.analyzer.setSensitivity(sensitivity);
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.analyzer.dispose();
  }
}

// Audio-reactive animation modifiers
export const audioModifiers = {
  /**
   * Modify particle system based on audio
   * @param {Object} particles - Particle array
   * @param {AudioReactiveEffects} audioEffects - Audio effects instance
   */
  modifyParticles(particles, audioEffects) {
    const bassLevel = audioEffects.getEffect('colorIntensity');
    const beatDetected = audioEffects.getEffect('beatDetected');
    
    particles.forEach(particle => {
      // Pulse size on beat
      if (beatDetected) {
        particle.size *= 1.5;
        particle.opacity = Math.min(1, particle.opacity * 1.3);
      }
      
      // Modify velocity based on audio
      const audioInfluence = bassLevel * 0.1;
      particle.vx += (Math.random() - 0.5) * audioInfluence;
      particle.vy += (Math.random() - 0.5) * audioInfluence;
    });
  },

  /**
   * Create audio visualizer bars
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} frequencies - Frequency data
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawAudioBars(ctx, frequencies, width, height) {
    const barWidth = width / frequencies.length;
    const maxHeight = height * 0.8;
    
    frequencies.forEach((freq, index) => {
      const barHeight = (freq / 255) * maxHeight;
      const x = index * barWidth;
      const y = height - barHeight;
      
      const hue = (index / frequencies.length) * 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  },

  /**
   * Create circular audio visualizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} frequencies - Frequency data
   * @param {number} centerX - Center X coordinate
   * @param {number} centerY - Center Y coordinate
   * @param {number} radius - Base radius
   */
  drawCircularVisualizer(ctx, frequencies, centerX, centerY, radius) {
    const angleStep = (Math.PI * 2) / frequencies.length;
    
    ctx.beginPath();
    frequencies.forEach((freq, index) => {
      const angle = index * angleStep;
      const amplitude = (freq / 255) * radius * 0.5;
      const x = centerX + Math.cos(angle) * (radius + amplitude);
      const y = centerY + Math.sin(angle) * (radius + amplitude);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

// Export singleton instance
export const audioReactiveEffects = new AudioReactiveEffects(); 