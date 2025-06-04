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
 * Custom hook for monitoring animation performance
 * @param {Object} options - Configuration options
 * @param {number} [options.sampleSize=60] - Number of frames to average over
 * @param {number} [options.warningThreshold=30] - FPS threshold for warnings
 * @param {boolean} [options.autoOptimize=false] - Auto-adjust settings for performance
 * @returns {PerformanceMetrics} Performance metrics and controls
 */
export const usePerformanceMonitor = ({
  sampleSize = 60,
  warningThreshold = 30,
  autoOptimize = false
} = {}) => {
  const [fps, setFps] = useState(60);
  const [avgFps, setAvgFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [warnings, setWarnings] = useState([]);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef([]);
  const warningsRef = useRef(new Set());

  const getPerformanceLevel = useCallback((currentFps) => {
    if (currentFps >= 55) return 'excellent';
    if (currentFps >= 40) return 'good';
    if (currentFps >= 25) return 'fair';
    return 'poor';
  }, []);

  const updatePerformance = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    
    if (delta >= 1000) { // Update every second
      const currentFps = Math.round((frameCountRef.current * 1000) / delta);
      setFps(currentFps);
      
      // Update FPS history
      fpsHistoryRef.current.push(currentFps);
      if (fpsHistoryRef.current.length > sampleSize) {
        fpsHistoryRef.current.shift();
      }
      
      // Calculate average FPS
      const average = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      setAvgFps(Math.round(average));
      
      // Check for performance warnings
      const newWarnings = new Set(warningsRef.current);
      
      if (currentFps < warningThreshold) {
        newWarnings.add(`Low FPS detected: ${currentFps}`);
      } else {
        newWarnings.delete(`Low FPS detected: ${currentFps}`);
      }
      
      if (delta > 100) { // Frame took too long
        newWarnings.add('Frame rendering lag detected');
      }
      
      // Memory usage (if available)
      if (performance.memory) {
        const memUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        setMemoryUsage(memUsage);
        
        if (memUsage > 100) { // More than 100MB
          newWarnings.add(`High memory usage: ${memUsage}MB`);
        }
      }
      
      warningsRef.current = newWarnings;
      setWarnings(Array.from(newWarnings));
      
      // Reset counters
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  }, [sampleSize, warningThreshold]);

  const recordFrame = useCallback(() => {
    frameCountRef.current++;
    updatePerformance();
  }, [updatePerformance]);

  // Auto-optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = [];
    
    if (avgFps < 30) {
      suggestions.push('Reduce animation complexity');
      suggestions.push('Lower FPS target');
      suggestions.push('Use simpler blend modes');
    }
    
    if (memoryUsage > 100) {
      suggestions.push('Reduce particle count');
      suggestions.push('Optimize canvas size');
    }
    
    return suggestions;
  }, [avgFps, memoryUsage]);

  const performanceLevel = getPerformanceLevel(avgFps);
  const isOptimal = performanceLevel === 'excellent' || performanceLevel === 'good';

  return {
    fps,
    avgFps,
    memoryUsage,
    performanceLevel,
    warnings,
    isOptimal,
    recordFrame,
    getOptimizationSuggestions,
    reset: () => {
      fpsHistoryRef.current = [];
      setWarnings([]);
      warningsRef.current.clear();
    }
  };
}; 