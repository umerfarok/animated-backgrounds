/**
 * @fileoverview AI-powered features for animated backgrounds
 * @module AIFeatures
 */

/**
 * Intelligent animation optimizer using machine learning principles
 */
export class IntelligentOptimizer {
  constructor() {
    this.performanceHistory = [];
    this.optimizationRules = new Map();
    this.deviceProfile = null;
    this.learningEnabled = true;
    this.adaptiveSettings = {
      particleCount: 100,
      animationSpeed: 1.0,
      effectIntensity: 0.8,
      renderQuality: 'medium'
    };
  }

  /**
   * Initialize device profiling and optimization
   */
  async initialize() {
    await this.profileDevice();
    this.loadOptimizationRules();
    this.startPerformanceMonitoring();
  }

  /**
   * Profile device capabilities
   */
  async profileDevice() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    this.deviceProfile = {
      // Hardware info
      gpu: this.getGPUInfo(gl),
      memory: this.getMemoryInfo(),
      cores: navigator.hardwareConcurrency || 4,
      
      // Performance benchmarks
      benchmarks: await this.runBenchmarks(canvas),
      
      // Device characteristics
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio
      },
      
      // Network info
      connection: this.getConnectionInfo(),
      
      // Battery info (if available)
      battery: await this.getBatteryInfo()
    };
  }

  /**
   * Get GPU information
   * @param {WebGLRenderingContext} gl - WebGL context
   * @returns {Object} GPU info
   */
  getGPUInfo(gl) {
    if (!gl) return { vendor: 'unknown', renderer: 'unknown' };
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
      version: gl.getParameter(gl.VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
    };
  }

  /**
   * Get memory information
   * @returns {Object} Memory info
   */
  getMemoryInfo() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }

  /**
   * Get connection information
   * @returns {Object} Connection info
   */
  getConnectionInfo() {
    if (navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    return { effectiveType: 'unknown', downlink: 0, rtt: 0, saveData: false };
  }

  /**
   * Get battery information
   * @returns {Promise<Object>} Battery info
   */
  async getBatteryInfo() {
    try {
      if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          dischargingTime: battery.dischargingTime,
          chargingTime: battery.chargingTime
        };
      }
    } catch (error) {
      console.warn('Battery API not available');
    }
    return { level: 1, charging: true, dischargingTime: Infinity, chargingTime: 0 };
  }

  /**
   * Run performance benchmarks
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @returns {Promise<Object>} Benchmark results
   */
  async runBenchmarks(canvas) {
    const benchmarks = {
      rendering: await this.benchmarkRendering(canvas),
      computation: await this.benchmarkComputation(),
      memory: await this.benchmarkMemory()
    };
    
    return benchmarks;
  }

  /**
   * Benchmark rendering performance
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @returns {Promise<Object>} Rendering benchmark
   */
  async benchmarkRendering(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    const startTime = performance.now();
    const iterations = 1000;
    
    // Simple rendering test
    for (let i = 0; i < iterations; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    return {
      renderTime,
      fps: (iterations / renderTime) * 1000,
      score: Math.min(100, Math.max(0, (60 * 1000) / renderTime))
    };
  }

  /**
   * Benchmark computation performance
   * @returns {Promise<Object>} Computation benchmark
   */
  async benchmarkComputation() {
    const startTime = performance.now();
    const iterations = 100000;
    
    // CPU-intensive calculation
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sin(i) * Math.cos(i) * Math.sqrt(i);
    }
    
    const endTime = performance.now();
    const computeTime = endTime - startTime;
    
    return {
      computeTime,
      score: Math.min(100, Math.max(0, 1000 / computeTime))
    };
  }

  /**
   * Benchmark memory performance
   * @returns {Promise<Object>} Memory benchmark
   */
  async benchmarkMemory() {
    const startMemory = this.getMemoryInfo();
    
    // Create large arrays to test memory allocation
    const arrays = [];
    const arraySize = 100000;
    const arrayCount = 50;
    
    const startTime = performance.now();
    
    for (let i = 0; i < arrayCount; i++) {
      arrays.push(new Float32Array(arraySize));
    }
    
    const midTime = performance.now();
    const midMemory = this.getMemoryInfo();
    
    // Cleanup
    arrays.length = 0;
    
    const endTime = performance.now();
    const endMemory = this.getMemoryInfo();
    
    return {
      allocationTime: midTime - startTime,
      cleanupTime: endTime - midTime,
      memoryUsed: midMemory.used - startMemory.used,
      score: Math.min(100, Math.max(0, 1000 / (midTime - startTime)))
    };
  }

  /**
   * Load optimization rules based on device profile
   */
  loadOptimizationRules() {
    const profile = this.deviceProfile;
    
    // Mobile device optimizations
    if (this.isMobileDevice()) {
      this.optimizationRules.set('particleCount', () => Math.min(50, this.adaptiveSettings.particleCount));
      this.optimizationRules.set('animationSpeed', () => 0.8);
      this.optimizationRules.set('effectIntensity', () => 0.6);
    }
    
    // Low-end device optimizations
    if (this.isLowEndDevice()) {
      this.optimizationRules.set('renderQuality', () => 'low');
      this.optimizationRules.set('particleCount', () => Math.min(30, this.adaptiveSettings.particleCount));
    }
    
    // High-end device optimizations
    if (this.isHighEndDevice()) {
      this.optimizationRules.set('particleCount', () => Math.min(500, this.adaptiveSettings.particleCount * 2));
      this.optimizationRules.set('effectIntensity', () => 1.0);
      this.optimizationRules.set('renderQuality', () => 'high');
    }
    
    // Battery-based optimizations
    if (profile.battery && profile.battery.level < 0.2 && !profile.battery.charging) {
      this.optimizationRules.set('batteryMode', () => true);
      this.optimizationRules.set('particleCount', () => Math.min(20, this.adaptiveSettings.particleCount));
      this.optimizationRules.set('animationSpeed', () => 0.5);
    }
  }

  /**
   * Check if device is mobile
   * @returns {boolean} Is mobile device
   */
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Check if device is low-end
   * @returns {boolean} Is low-end device
   */
  isLowEndDevice() {
    const profile = this.deviceProfile;
    return (
      profile.cores <= 2 ||
      profile.memory.limit < 1000000000 || // Less than 1GB heap
      profile.benchmarks.rendering.score < 30 ||
      profile.benchmarks.computation.score < 30
    );
  }

  /**
   * Check if device is high-end
   * @returns {boolean} Is high-end device
   */
  isHighEndDevice() {
    const profile = this.deviceProfile;
    return (
      profile.cores >= 8 &&
      profile.memory.limit > 4000000000 && // More than 4GB heap
      profile.benchmarks.rendering.score > 80 &&
      profile.benchmarks.computation.score > 80 &&
      profile.gpu.renderer.includes('GeForce') || profile.gpu.renderer.includes('Radeon')
    );
  }

  /**
   * Start performance monitoring
   */
  startPerformanceMonitoring() {
    setInterval(() => {
      this.collectPerformanceData();
      this.adaptSettings();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Collect performance data
   */
  collectPerformanceData() {
    const now = performance.now();
    const memory = this.getMemoryInfo();
    
    const data = {
      timestamp: now,
      memory: memory.used,
      fps: this.getCurrentFPS(),
      batteryLevel: this.deviceProfile.battery ? this.deviceProfile.battery.level : 1
    };
    
    this.performanceHistory.push(data);
    
    // Keep only last 60 entries (5 minutes of data)
    if (this.performanceHistory.length > 60) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Get current FPS estimate
   * @returns {number} Current FPS
   */
  getCurrentFPS() {
    // This would need to be integrated with the main animation loop
    // For now, return a placeholder
    return 60;
  }

  /**
   * Adapt settings based on performance history
   */
  adaptSettings() {
    if (!this.learningEnabled || this.performanceHistory.length < 5) return;
    
    const recentData = this.performanceHistory.slice(-5);
    const avgFPS = recentData.reduce((sum, data) => sum + data.fps, 0) / recentData.length;
    const memoryTrend = this.calculateMemoryTrend(recentData);
    
    // Adapt based on FPS
    if (avgFPS < 30) {
      this.adaptiveSettings.particleCount = Math.max(10, this.adaptiveSettings.particleCount * 0.8);
      this.adaptiveSettings.effectIntensity = Math.max(0.3, this.adaptiveSettings.effectIntensity * 0.9);
    } else if (avgFPS > 55) {
      this.adaptiveSettings.particleCount = Math.min(200, this.adaptiveSettings.particleCount * 1.1);
      this.adaptiveSettings.effectIntensity = Math.min(1.0, this.adaptiveSettings.effectIntensity * 1.05);
    }
    
    // Adapt based on memory usage
    if (memoryTrend > 0) { // Memory increasing
      this.adaptiveSettings.particleCount = Math.max(10, this.adaptiveSettings.particleCount * 0.9);
    }
    
    // Apply optimization rules
    this.optimizationRules.forEach((rule, key) => {
      this.adaptiveSettings[key] = rule();
    });
  }

  /**
   * Calculate memory usage trend
   * @param {Array} data - Performance data array
   * @returns {number} Memory trend (positive = increasing)
   */
  calculateMemoryTrend(data) {
    if (data.length < 2) return 0;
    
    const first = data[0].memory;
    const last = data[data.length - 1].memory;
    
    return (last - first) / first;
  }

  /**
   * Get optimized settings
   * @returns {Object} Optimized settings
   */
  getOptimizedSettings() {
    return { ...this.adaptiveSettings };
  }

  /**
   * Enable/disable learning
   * @param {boolean} enabled - Learning enabled
   */
  setLearningEnabled(enabled) {
    this.learningEnabled = enabled;
  }
}

/**
 * Content generation using AI-inspired algorithms
 */
export class ContentGenerator {
  constructor() {
    this.patterns = new Map();
    this.colorHarmony = new ColorHarmonyGenerator();
    this.animationPatterns = new AnimationPatternGenerator();
  }

  /**
   * Generate harmonious color palette
   * @param {string} baseColor - Base color in hex
   * @param {string} harmonyType - Type of color harmony
   * @returns {Array} Generated color palette
   */
  generateColorPalette(baseColor, harmonyType = 'complementary') {
    return this.colorHarmony.generate(baseColor, harmonyType);
  }

  /**
   * Generate animation sequence
   * @param {Object} parameters - Generation parameters
   * @returns {Object} Generated animation sequence
   */
  generateAnimationSequence(parameters) {
    return this.animationPatterns.generate(parameters);
  }
}

/**
 * Color harmony generation using color theory
 */
class ColorHarmonyGenerator {
  /**
   * Generate color palette based on harmony rules
   * @param {string} baseColor - Base color in hex
   * @param {string} harmonyType - Harmony type
   * @returns {Array} Color palette
   */
  generate(baseColor, harmonyType) {
    const hsl = this.hexToHsl(baseColor);
    const colors = [baseColor];
    
    switch (harmonyType) {
      case 'complementary':
        colors.push(this.hslToHex([(hsl[0] + 180) % 360, hsl[1], hsl[2]]));
        break;
        
      case 'triadic':
        colors.push(this.hslToHex([(hsl[0] + 120) % 360, hsl[1], hsl[2]]));
        colors.push(this.hslToHex([(hsl[0] + 240) % 360, hsl[1], hsl[2]]));
        break;
        
      case 'analogous':
        colors.push(this.hslToHex([(hsl[0] + 30) % 360, hsl[1], hsl[2]]));
        colors.push(this.hslToHex([(hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]]));
        break;
        
      case 'tetradic':
        colors.push(this.hslToHex([(hsl[0] + 90) % 360, hsl[1], hsl[2]]));
        colors.push(this.hslToHex([(hsl[0] + 180) % 360, hsl[1], hsl[2]]));
        colors.push(this.hslToHex([(hsl[0] + 270) % 360, hsl[1], hsl[2]]));
        break;
        
      case 'monochromatic':
        colors.push(this.hslToHex([hsl[0], hsl[1] * 0.7, hsl[2] * 1.2]));
        colors.push(this.hslToHex([hsl[0], hsl[1] * 1.3, hsl[2] * 0.8]));
        break;
    }
    
    return colors;
  }

  /**
   * Convert hex to HSL
   * @param {string} hex - Hex color
   * @returns {Array} HSL values
   */
  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;
    
    let h, s;
    
    if (diff === 0) {
      h = s = 0;
    } else {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;
      
      switch (max) {
        case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / diff + 2) / 6; break;
        case b: h = ((r - g) / diff + 4) / 6; break;
      }
    }
    
    return [h * 360, s, l];
  }

  /**
   * Convert HSL to hex
   * @param {Array} hsl - HSL values
   * @returns {string} Hex color
   */
  hslToHex([h, s, l]) {
    h /= 360;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}

/**
 * Animation pattern generation using procedural algorithms
 */
class AnimationPatternGenerator {
  /**
   * Generate animation pattern
   * @param {Object} parameters - Generation parameters
   * @returns {Object} Animation pattern
   */
  generate(parameters) {
    const {
      complexity = 'medium',
      style = 'organic',
      duration = 10000,
      elements = 100
    } = parameters;
    
    const pattern = {
      keyframes: this.generateKeyframes(complexity, duration),
      elements: this.generateElements(elements, style),
      timing: this.generateTiming(complexity)
    };
    
    return pattern;
  }

  /**
   * Generate keyframes for animation
   * @param {string} complexity - Animation complexity
   * @param {number} duration - Animation duration
   * @returns {Array} Keyframes
   */
  generateKeyframes(complexity, duration) {
    const frameCount = complexity === 'high' ? 20 : complexity === 'medium' ? 10 : 5;
    const keyframes = [];
    
    for (let i = 0; i <= frameCount; i++) {
      const progress = i / frameCount;
      const time = progress * duration;
      
      keyframes.push({
        time,
        transforms: {
          scale: 1 + Math.sin(progress * Math.PI * 2) * 0.2,
          rotation: progress * 360,
          opacity: 0.5 + Math.sin(progress * Math.PI) * 0.5
        },
        colors: this.interpolateColors(progress)
      });
    }
    
    return keyframes;
  }

  /**
   * Generate animation elements
   * @param {number} count - Element count
   * @param {string} style - Animation style
   * @returns {Array} Animation elements
   */
  generateElements(count, style) {
    const elements = [];
    
    for (let i = 0; i < count; i++) {
      const element = {
        id: i,
        position: {
          x: Math.random(),
          y: Math.random()
        },
        velocity: this.generateVelocity(style),
        properties: this.generateProperties(style)
      };
      
      elements.push(element);
    }
    
    return elements;
  }

  /**
   * Generate velocity based on style
   * @param {string} style - Animation style
   * @returns {Object} Velocity
   */
  generateVelocity(style) {
    switch (style) {
      case 'organic':
        return {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02
        };
      case 'geometric':
        return {
          x: Math.random() < 0.5 ? -0.01 : 0.01,
          y: Math.random() < 0.5 ? -0.01 : 0.01
        };
      case 'chaotic':
        return {
          x: (Math.random() - 0.5) * 0.05,
          y: (Math.random() - 0.5) * 0.05
        };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Generate element properties
   * @param {string} style - Animation style
   * @returns {Object} Properties
   */
  generateProperties(style) {
    return {
      size: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      shape: style === 'geometric' ? 'square' : 'circle',
      lifespan: Math.random() * 10000 + 5000
    };
  }

  /**
   * Generate timing function
   * @param {string} complexity - Animation complexity
   * @returns {string} Timing function
   */
  generateTiming(complexity) {
    const functions = {
      low: 'linear',
      medium: 'ease-in-out',
      high: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
    
    return functions[complexity] || 'ease';
  }

  /**
   * Interpolate colors for animation
   * @param {number} progress - Animation progress (0-1)
   * @returns {Object} Color values
   */
  interpolateColors(progress) {
    const hue1 = 240; // Blue
    const hue2 = 300; // Purple
    const currentHue = hue1 + (hue2 - hue1) * progress;
    
    return {
      primary: `hsl(${currentHue}, 70%, 60%)`,
      secondary: `hsl(${(currentHue + 60) % 360}, 50%, 40%)`,
      accent: `hsl(${(currentHue + 120) % 360}, 80%, 70%)`
    };
  }
}

// Export singleton instances
export const intelligentOptimizer = new IntelligentOptimizer();
export const contentGenerator = new ContentGenerator(); 