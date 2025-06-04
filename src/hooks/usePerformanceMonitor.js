/**
 * @fileoverview Performance monitoring hook for animations
 * @module usePerformanceMonitor
 * @requires react
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @typedef {Object} PerformanceMetrics
 * @property {number} fps - Current frames per second
 * @property {number} avgFps - Average FPS over time
 * @property {number} memoryUsage - Memory usage in MB (if available)
 * @property {string} performanceLevel - 'excellent' | 'good' | 'fair' | 'poor'
 * @property {Array<string>} warnings - Performance warnings
 * @property {boolean} isOptimal - Whether performance is optimal
 */

/**
 * Enhanced performance monitoring hook with advanced analytics
 * @param {Object} options - Configuration options
 * @returns {Object} Performance metrics and controls
 */
export const usePerformanceMonitor = (options = {}) => {
  const {
    sampleSize = 60,
    warningThreshold = 30,
    autoOptimize = false,
    enableGPUMonitoring = true,
    enableMemoryMonitoring = true,
    enableBatteryMonitoring = true
  } = options;

  const [performanceData, setPerformanceData] = useState({
    fps: 0,
    avgFps: 0,
    minFps: Infinity,
    maxFps: 0,
    frameTime: 0,
    memoryUsage: 0,
    gpuUsage: 0,
    batteryLevel: 1,
    batteryCharging: false,
    performanceLevel: 'good',
    warnings: [],
    deviceInfo: {},
    renderingStats: {
      droppedFrames: 0,
      totalFrames: 0,
      averageFrameTime: 0,
      longestFrame: 0
    }
  });

  const frameTimesRef = useRef([]);
  const lastFrameTimeRef = useRef(performance.now());
  const gpuInfoRef = useRef(null);
  const memoryObserverRef = useRef(null);

  // Initialize device information
  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceInfo = {
        cores: navigator.hardwareConcurrency || 'unknown',
        memory: navigator.deviceMemory || 'unknown',
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        },
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      };

      // GPU Information (if available)
      if (enableGPUMonitoring) {
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              deviceInfo.gpu = {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
              };
            }
          }
        } catch (e) {
          console.warn('GPU info not available:', e);
        }
      }

      setPerformanceData(prev => ({ ...prev, deviceInfo }));
    };

    getDeviceInfo();
  }, [enableGPUMonitoring]);

  // Battery monitoring
  useEffect(() => {
    if (!enableBatteryMonitoring || !('getBattery' in navigator)) return;

    navigator.getBattery().then(battery => {
      const updateBatteryInfo = () => {
        setPerformanceData(prev => ({
          ...prev,
          batteryLevel: battery.level,
          batteryCharging: battery.charging
        }));
      };

      updateBatteryInfo();
      battery.addEventListener('levelchange', updateBatteryInfo);
      battery.addEventListener('chargingchange', updateBatteryInfo);

      return () => {
        battery.removeEventListener('levelchange', updateBatteryInfo);
        battery.removeEventListener('chargingchange', updateBatteryInfo);
      };
    });
  }, [enableBatteryMonitoring]);

  // Memory monitoring
  useEffect(() => {
    if (!enableMemoryMonitoring || !performance.memory) return;

    const updateMemoryInfo = () => {
      const memInfo = performance.memory;
      const memoryUsage = Math.round(memInfo.usedJSHeapSize / 1024 / 1024);
      
      setPerformanceData(prev => ({
        ...prev,
        memoryUsage,
        memoryDetails: {
          used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024)
        }
      }));
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 1000);
    return () => clearInterval(interval);
  }, [enableMemoryMonitoring]);

  const recordFrame = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > sampleSize) {
      frameTimesRef.current.shift();
    }

    const fps = Math.round(1000 / frameTime);
    const avgFps = Math.round(1000 / (frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length));
    
    setPerformanceData(prev => {
      const newStats = {
        ...prev.renderingStats,
        totalFrames: prev.renderingStats.totalFrames + 1,
        averageFrameTime: frameTime,
        longestFrame: Math.max(prev.renderingStats.longestFrame, frameTime)
      };

      if (fps < warningThreshold) {
        newStats.droppedFrames++;
      }

      const warnings = [];
      let performanceLevel = 'excellent';

      // Performance analysis
      if (avgFps < 20) {
        performanceLevel = 'poor';
        warnings.push('Very low FPS detected. Consider reducing animation complexity.');
      } else if (avgFps < 30) {
        performanceLevel = 'fair';
        warnings.push('Low FPS detected. Performance optimizations recommended.');
      } else if (avgFps < 50) {
        performanceLevel = 'good';
      }

      // Memory warnings
      if (prev.memoryDetails && prev.memoryDetails.used > prev.memoryDetails.limit * 0.8) {
        warnings.push('High memory usage detected. Memory cleanup recommended.');
      }

      // Battery warnings
      if (prev.batteryLevel < 0.2 && !prev.batteryCharging) {
        warnings.push('Low battery detected. Consider enabling power-saving mode.');
      }

      return {
        ...prev,
        fps,
        avgFps,
        minFps: Math.min(prev.minFps, fps),
        maxFps: Math.max(prev.maxFps, fps),
        frameTime,
        performanceLevel,
        warnings,
        renderingStats: newStats
      };
    });
  }, [sampleSize, warningThreshold]);

  const resetStats = useCallback(() => {
    frameTimesRef.current = [];
    setPerformanceData(prev => ({
      ...prev,
      fps: 0,
      avgFps: 0,
      minFps: Infinity,
      maxFps: 0,
      warnings: [],
      renderingStats: {
        droppedFrames: 0,
        totalFrames: 0,
        averageFrameTime: 0,
        longestFrame: 0
      }
    }));
  }, []);

  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = [];
    
    if (performanceData.avgFps < 30) {
      suggestions.push('Reduce particle count');
      suggestions.push('Lower animation complexity');
      suggestions.push('Disable expensive effects');
    }
    
    if (performanceData.memoryUsage > 100) {
      suggestions.push('Enable garbage collection');
      suggestions.push('Reduce texture sizes');
    }
    
    if (performanceData.batteryLevel < 0.3) {
      suggestions.push('Enable power-saving mode');
      suggestions.push('Reduce frame rate');
    }
    
    return suggestions;
  }, [performanceData]);

  return {
    ...performanceData,
    recordFrame,
    resetStats,
    getOptimizationSuggestions
  };
}; 