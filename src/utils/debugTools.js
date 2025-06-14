/**
 * @fileoverview Debug and performance monitoring tools
 * @module DebugTools
 */

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      particleCount: 0,
      drawCalls: 0,
      averageFPS: 0,
      minFPS: Infinity,
      maxFPS: 0
    };
    
    this.frameHistory = [];
    this.maxHistoryLength = 60; // 1 second at 60fps
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.startTime = performance.now();
    
    this.thresholds = {
      lowFPS: 30,
      highMemory: 100 * 1024 * 1024, // 100MB
      highParticles: 1000
    };
    
    this.alerts = [];
    this.onAlert = null;
  }

  /**
   * Update performance metrics
   * @param {Object} data - Frame data
   */
  update(data = {}) {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    if (this.lastFrameTime > 0) {
      const fps = 1000 / deltaTime;
      this.metrics.fps = fps;
      this.metrics.frameTime = deltaTime;
      
      // Update FPS history
      this.frameHistory.push(fps);
      if (this.frameHistory.length > this.maxHistoryLength) {
        this.frameHistory.shift();
      }
      
      // Calculate average FPS
      this.metrics.averageFPS = this.frameHistory.reduce((sum, f) => sum + f, 0) / this.frameHistory.length;
      this.metrics.minFPS = Math.min(this.metrics.minFPS, fps);
      this.metrics.maxFPS = Math.max(this.metrics.maxFPS, fps);
      
      // Update other metrics
      if (data.particleCount !== undefined) {
        this.metrics.particleCount = data.particleCount;
      }
      
      if (data.drawCalls !== undefined) {
        this.metrics.drawCalls = data.drawCalls;
      }
      
      // Memory usage
      if (performance.memory) {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
      }
      
      // Check for performance issues
      this.checkPerformanceAlerts();
    }
    
    this.lastFrameTime = now;
    this.frameCount++;
  }

  /**
   * Check for performance alerts
   */
  checkPerformanceAlerts() {
    const alerts = [];
    
    if (this.metrics.fps < this.thresholds.lowFPS) {
      alerts.push({
        type: 'warning',
        message: `Low FPS detected: ${this.metrics.fps.toFixed(1)}`,
        metric: 'fps',
        value: this.metrics.fps,
        threshold: this.thresholds.lowFPS
      });
    }
    
    if (this.metrics.memoryUsage > this.thresholds.highMemory) {
      alerts.push({
        type: 'warning',
        message: `High memory usage: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`,
        metric: 'memory',
        value: this.metrics.memoryUsage,
        threshold: this.thresholds.highMemory
      });
    }
    
    if (this.metrics.particleCount > this.thresholds.highParticles) {
      alerts.push({
        type: 'info',
        message: `High particle count: ${this.metrics.particleCount}`,
        metric: 'particles',
        value: this.metrics.particleCount,
        threshold: this.thresholds.highParticles
      });
    }
    
    if (alerts.length > 0 && this.onAlert) {
      this.onAlert(alerts);
    }
    
    this.alerts = alerts;
  }

  /**
   * Get performance report
   * @returns {Object} Performance report
   */
  getReport() {
    const runTime = performance.now() - this.startTime;
    
    return {
      ...this.metrics,
      runTime,
      totalFrames: this.frameCount,
      alerts: this.alerts,
      recommendations: this.getRecommendations()
    };
  }

  /**
   * Get performance recommendations
   * @returns {Array} Recommendations
   */
  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.averageFPS < 45) {
      recommendations.push({
        type: 'performance',
        message: 'Consider reducing particle count or enabling performance optimizations',
        action: 'reduce_particles'
      });
    }
    
    if (this.metrics.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push({
        type: 'memory',
        message: 'High memory usage detected. Consider enabling garbage collection optimizations',
        action: 'optimize_memory'
      });
    }
    
    if (this.metrics.drawCalls > 1000) {
      recommendations.push({
        type: 'rendering',
        message: 'High draw call count. Consider using instanced rendering or batch processing',
        action: 'optimize_rendering'
      });
    }
    
    return recommendations;
  }

  /**
   * Reset metrics
   */
  reset() {
    this.frameHistory = [];
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastFrameTime = 0;
    this.metrics.minFPS = Infinity;
    this.metrics.maxFPS = 0;
    this.alerts = [];
  }

  /**
   * Set performance thresholds
   * @param {Object} thresholds - New thresholds
   */
  setThresholds(thresholds) {
    Object.assign(this.thresholds, thresholds);
  }
}

/**
 * Debug visualizer for rendering debug information
 */
export class DebugVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.enabled = false;
    this.showFPS = true;
    this.showParticles = true;
    this.showMemory = true;
    this.showGrid = false;
    this.showBounds = false;
    this.showForces = false;
    
    this.gridSize = 50;
    this.fontSize = 14;
    this.textColor = '#ffffff';
    this.gridColor = '#333333';
    this.boundsColor = '#ff0000';
    this.forceColor = '#00ff00';
  }

  /**
   * Enable debug visualization
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable debug visualization
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Toggle debug features
   * @param {string} feature - Feature to toggle
   */
  toggle(feature) {
    if (this.hasOwnProperty(feature)) {
      this[feature] = !this[feature];
    }
  }

  /**
   * Render debug information
   * @param {Object} debugData - Debug data to display
   */
  render(debugData = {}) {
    if (!this.enabled) return;
    
    const ctx = this.ctx;
    ctx.save();
    
    // Set up text rendering
    ctx.font = `${this.fontSize}px monospace`;
    ctx.fillStyle = this.textColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    let yOffset = 30;
    const lineHeight = this.fontSize + 5;
    
    // Draw performance metrics
    if (this.showFPS && debugData.performance) {
      const perf = debugData.performance;
      this.drawText(`FPS: ${perf.fps.toFixed(1)} (avg: ${perf.averageFPS.toFixed(1)})`, 10, yOffset);
      yOffset += lineHeight;
      
      this.drawText(`Frame Time: ${perf.frameTime.toFixed(2)}ms`, 10, yOffset);
      yOffset += lineHeight;
    }
    
    // Draw particle information
    if (this.showParticles && debugData.particles) {
      const particles = debugData.particles;
      this.drawText(`Particles: ${particles.count} (active: ${particles.active})`, 10, yOffset);
      yOffset += lineHeight;
      
      if (particles.types) {
        Object.entries(particles.types).forEach(([type, count]) => {
          this.drawText(`  ${type}: ${count}`, 10, yOffset);
          yOffset += lineHeight;
        });
      }
    }
    
    // Draw memory information
    if (this.showMemory && debugData.memory) {
      const memory = debugData.memory;
      this.drawText(`Memory: ${(memory.used / 1024 / 1024).toFixed(1)}MB / ${(memory.total / 1024 / 1024).toFixed(1)}MB`, 10, yOffset);
      yOffset += lineHeight;
    }
    
    // Draw grid
    if (this.showGrid) {
      this.drawGrid();
    }
    
    // Draw bounds
    if (this.showBounds && debugData.bounds) {
      this.drawBounds(debugData.bounds);
    }
    
    // Draw force vectors
    if (this.showForces && debugData.forces) {
      this.drawForces(debugData.forces);
    }
    
    // Draw alerts
    if (debugData.alerts && debugData.alerts.length > 0) {
      this.drawAlerts(debugData.alerts, yOffset);
    }
    
    ctx.restore();
  }

  /**
   * Draw text with outline
   * @param {string} text - Text to draw
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  drawText(text, x, y) {
    const ctx = this.ctx;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  /**
   * Draw debug grid
   */
  drawGrid() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    
    ctx.save();
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Vertical lines
    for (let x = 0; x <= width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * Draw boundary boxes
   * @param {Array} bounds - Array of boundary objects
   */
  drawBounds(bounds) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.strokeStyle = this.boundsColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    bounds.forEach(bound => {
      ctx.strokeRect(bound.x, bound.y, bound.width, bound.height);
    });
    
    ctx.restore();
  }

  /**
   * Draw force vectors
   * @param {Array} forces - Array of force objects
   */
  drawForces(forces) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.strokeStyle = this.forceColor;
    ctx.lineWidth = 2;
    
    forces.forEach(force => {
      const { x, y, fx, fy, strength = 1 } = force;
      const length = Math.min(strength * 50, 100);
      const angle = Math.atan2(fy, fx);
      
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      // Draw force vector
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw arrowhead
      const arrowLength = 10;
      const arrowAngle = 0.5;
      
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.stroke();
    });
    
    ctx.restore();
  }

  /**
   * Draw performance alerts
   * @param {Array} alerts - Array of alert objects
   * @param {number} yOffset - Y offset for positioning
   */
  drawAlerts(alerts, yOffset) {
    const ctx = this.ctx;
    const lineHeight = this.fontSize + 5;
    
    ctx.save();
    
    alerts.forEach((alert, index) => {
      const y = yOffset + index * lineHeight;
      
      // Set color based on alert type
      switch (alert.type) {
        case 'error':
          ctx.fillStyle = '#ff4444';
          break;
        case 'warning':
          ctx.fillStyle = '#ffaa44';
          break;
        case 'info':
          ctx.fillStyle = '#4444ff';
          break;
        default:
          ctx.fillStyle = this.textColor;
      }
      
      this.drawText(`⚠ ${alert.message}`, 10, y);
    });
    
    ctx.restore();
  }
}

/**
 * Debug console for logging and command execution
 */
export class DebugConsole {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.commands = new Map();
    this.enabled = false;
    
    this.setupCommands();
  }

  /**
   * Setup built-in debug commands
   */
  setupCommands() {
    this.addCommand('help', () => {
      this.log('Available commands:');
      this.commands.forEach((_, name) => {
        this.log(`  ${name}`);
      });
    });
    
    this.addCommand('clear', () => {
      this.logs = [];
      this.log('Console cleared');
    });
    
    this.addCommand('fps', (manager) => {
      if (manager && manager.performanceMonitor) {
        const metrics = manager.performanceMonitor.getReport();
        this.log(`FPS: ${metrics.fps.toFixed(1)} (avg: ${metrics.averageFPS.toFixed(1)})`);
      }
    });
    
    this.addCommand('memory', () => {
      if (performance.memory) {
        const used = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
        const total = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(1);
        this.log(`Memory: ${used}MB / ${total}MB`);
      }
    });
    
    this.addCommand('particles', (manager) => {
      if (manager && manager.instance) {
        const count = manager.instance.getParticleCount ? manager.instance.getParticleCount() : 'Unknown';
        this.log(`Particle count: ${count}`);
      }
    });
  }

  /**
   * Add custom debug command
   * @param {string} name - Command name
   * @param {Function} handler - Command handler
   */
  addCommand(name, handler) {
    this.commands.set(name, handler);
  }

  /**
   * Execute debug command
   * @param {string} command - Command string
   * @param {*} context - Execution context
   */
  execute(command, context = null) {
    const parts = command.trim().split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);
    
    if (this.commands.has(commandName)) {
      try {
        this.commands.get(commandName)(context, ...args);
      } catch (error) {
        this.error(`Command error: ${error.message}`);
      }
    } else {
      this.error(`Unknown command: ${commandName}`);
    }
  }

  /**
   * Log message
   * @param {string} message - Log message
   * @param {string} level - Log level
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message
    };
    
    this.logs.push(logEntry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    if (this.enabled) {
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    }
  }

  /**
   * Log error
   * @param {string} message - Error message
   */
  error(message) {
    this.log(message, 'error');
  }

  /**
   * Log warning
   * @param {string} message - Warning message
   */
  warn(message) {
    this.log(message, 'warn');
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   */
  debug(message) {
    this.log(message, 'debug');
  }

  /**
   * Get filtered logs
   * @param {string} level - Filter by level
   * @returns {Array} Filtered logs
   */
  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Export logs
   * @returns {string} Exported log data
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Enable console output
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable console output
   */
  disable() {
    this.enabled = false;
  }
}

/**
 * Unified debug manager
 */
export class DebugManager {
  constructor(canvas) {
    this.performanceMonitor = new PerformanceMonitor();
    this.visualizer = new DebugVisualizer(canvas);
    this.console = new DebugConsole();
    this.enabled = false;
    
    this.setupKeyboardShortcuts();
  }

  /**
   * Setup keyboard shortcuts for debug controls
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (!this.enabled) return;
      
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'd':
            event.preventDefault();
            this.visualizer.enabled = !this.visualizer.enabled;
            this.console.log(`Debug visualizer ${this.visualizer.enabled ? 'enabled' : 'disabled'}`);
            break;
          case 'g':
            event.preventDefault();
            this.visualizer.toggle('showGrid');
            this.console.log(`Grid display ${this.visualizer.showGrid ? 'enabled' : 'disabled'}`);
            break;
          case 'p':
            event.preventDefault();
            this.visualizer.toggle('showParticles');
            this.console.log(`Particle info ${this.visualizer.showParticles ? 'enabled' : 'disabled'}`);
            break;
          case 'f':
            event.preventDefault();
            this.visualizer.toggle('showFPS');
            this.console.log(`FPS display ${this.visualizer.showFPS ? 'enabled' : 'disabled'}`);
            break;
        }
      }
    });
  }

  /**
   * Enable debug mode
   */
  enable() {
    this.enabled = true;
    this.console.enable();
    this.console.log('Debug mode enabled');
    this.console.log('Keyboard shortcuts:');
    this.console.log('  Ctrl+D: Toggle debug visualizer');
    this.console.log('  Ctrl+G: Toggle grid');
    this.console.log('  Ctrl+P: Toggle particle info');
    this.console.log('  Ctrl+F: Toggle FPS display');
  }

  /**
   * Disable debug mode
   */
  disable() {
    this.enabled = false;
    this.visualizer.disable();
    this.console.disable();
  }

  /**
   * Update debug information
   * @param {Object} data - Debug data
   */
  update(data = {}) {
    if (!this.enabled) return;
    
    this.performanceMonitor.update(data.performance);
    
    const debugData = {
      performance: this.performanceMonitor.getReport(),
      particles: data.particles,
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize
      } : null,
      bounds: data.bounds,
      forces: data.forces,
      alerts: this.performanceMonitor.alerts
    };
    
    this.visualizer.render(debugData);
  }

  /**
   * Get comprehensive debug report
   * @returns {Object} Debug report
   */
  getReport() {
    return {
      performance: this.performanceMonitor.getReport(),
      console: this.console.getLogs(),
      visualizer: {
        enabled: this.visualizer.enabled,
        features: {
          showFPS: this.visualizer.showFPS,
          showParticles: this.visualizer.showParticles,
          showMemory: this.visualizer.showMemory,
          showGrid: this.visualizer.showGrid,
          showBounds: this.visualizer.showBounds,
          showForces: this.visualizer.showForces
        }
      }
    };
  }
}

// Export singleton instance creator
export function createDebugManager(canvas) {
  return new DebugManager(canvas);
} 