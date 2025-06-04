/**
 * @fileoverview Custom hook for animation controls
 * @module useAnimationControls
 * @requires react
 */

import { useState, useCallback, useRef } from 'react';

/**
 * @typedef {Object} AnimationControls
 * @property {boolean} isPlaying - Whether the animation is currently playing
 * @property {number} speed - Current animation speed multiplier (1 = normal speed)
 * @property {Function} play - Start/resume the animation
 * @property {Function} pause - Pause the animation
 * @property {Function} reset - Reset the animation to initial state
 * @property {Function} setSpeed - Set animation speed (0.1 to 5.0)
 * @property {Function} toggle - Toggle play/pause state
 */

/**
 * Custom hook for controlling animations
 * @param {Object} options - Configuration options
 * @param {number} [options.initialSpeed=1] - Initial speed multiplier
 * @param {boolean} [options.autoPlay=true] - Whether to start playing automatically
 * @returns {AnimationControls} Animation control functions and state
 */
export const useAnimationControls = ({ 
  initialSpeed = 1, 
  autoPlay = true 
} = {}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeedState] = useState(initialSpeed);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const reset = useCallback(() => {
    setIsPlaying(false);
    lastTimeRef.current = 0;
    // Reset will be handled by the animation component
  }, []);
  
  const setSpeed = useCallback((newSpeed) => {
    const clampedSpeed = Math.max(0.1, Math.min(5.0, newSpeed));
    setSpeedState(clampedSpeed);
  }, []);
  
  const toggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  return {
    isPlaying,
    speed,
    play,
    pause,
    reset,
    setSpeed,
    toggle,
    animationRef,
    lastTimeRef
  };
}; 