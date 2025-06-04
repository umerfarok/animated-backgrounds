/**
 * @fileoverview Utility functions for interactive animations
 * @module InteractionUtils
 */

/**
 * @typedef {Object} InteractionPoint
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} force - Interaction force (0-1)
 * @property {string} type - 'mouse' | 'touch'
 */

/**
 * @typedef {Object} InteractionConfig
 * @property {string} effect - 'attract' | 'repel' | 'follow' | 'burst' | 'gravity'
 * @property {number} strength - Effect strength (0-1)
 * @property {number} radius - Interaction radius in pixels
 * @property {boolean} continuous - Whether effect continues after interaction ends
 */

/**
 * Creates an interaction handler for canvas animations
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {InteractionConfig} config - Interaction configuration
 * @returns {Object} Interaction handler with event listeners and state
 */
export const createInteractionHandler = (canvas, config = {}) => {
  const {
    effect = 'attract',
    strength = 0.5,
    radius = 100,
    continuous = false
  } = config;

  let isInteracting = false;
  let interactionPoints = [];
  let touchPoints = new Map();

  /**
   * Get normalized coordinates from event
   * @param {Event} event - Mouse or touch event
   * @returns {InteractionPoint|null} Normalized interaction point
   */
  const getInteractionPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (event.type.startsWith('touch')) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
        force: touch.force || 0.5,
        type: 'touch'
      };
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
        force: 0.5,
        type: 'mouse'
      };
    }
  };

  /**
   * Calculate interaction force between two points
   * @param {Object} particle - Particle with x, y coordinates
   * @param {InteractionPoint} interactionPoint - Interaction point
   * @returns {Object} Force vector {fx, fy, distance}
   */
  const calculateInteractionForce = (particle, interactionPoint) => {
    const dx = interactionPoint.x - particle.x;
    const dy = interactionPoint.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0 || distance > radius) {
      return { fx: 0, fy: 0, distance };
    }

    const normalizedDistance = distance / radius;
    let forceMagnitude = (1 - normalizedDistance) * strength * interactionPoint.force;

    switch (effect) {
      case 'attract':
        forceMagnitude *= 1;
        break;
      case 'repel':
        forceMagnitude *= -1;
        break;
      case 'gravity':
        forceMagnitude *= (1 / (distance * distance + 1));
        break;
      case 'burst':
        forceMagnitude *= distance < radius * 0.3 ? -2 : 0;
        break;
      default:
        forceMagnitude = 0;
    }

    const fx = (dx / distance) * forceMagnitude;
    const fy = (dy / distance) * forceMagnitude;

    return { fx, fy, distance };
  };

  // Event handlers
  const handleMouseDown = (event) => {
    isInteracting = true;
    const point = getInteractionPoint(event);
    if (point) interactionPoints = [point];
  };

  const handleMouseMove = (event) => {
    if (isInteracting || continuous) {
      const point = getInteractionPoint(event);
      if (point) interactionPoints = [point];
    }
  };

  const handleMouseUp = () => {
    isInteracting = false;
    if (!continuous) interactionPoints = [];
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    Array.from(event.touches).forEach((touch, index) => {
      const point = {
        x: (touch.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width),
        y: (touch.clientY - canvas.getBoundingClientRect().top) * (canvas.height / canvas.getBoundingClientRect().height),
        force: touch.force || 0.5,
        type: 'touch'
      };
      touchPoints.set(touch.identifier, point);
    });
    interactionPoints = Array.from(touchPoints.values());
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    Array.from(event.touches).forEach((touch) => {
      const point = {
        x: (touch.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width),
        y: (touch.clientY - canvas.getBoundingClientRect().top) * (canvas.height / canvas.getBoundingClientRect().height),
        force: touch.force || 0.5,
        type: 'touch'
      };
      touchPoints.set(touch.identifier, point);
    });
    interactionPoints = Array.from(touchPoints.values());
  };

  const handleTouchEnd = (event) => {
    event.preventDefault();
    Array.from(event.changedTouches).forEach((touch) => {
      touchPoints.delete(touch.identifier);
    });
    interactionPoints = Array.from(touchPoints.values());
  };

  // Attach event listeners
  const attachListeners = () => {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
  };

  // Remove event listeners
  const removeListeners = () => {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mouseleave', handleMouseUp);
    
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchcancel', handleTouchEnd);
  };

  return {
    attachListeners,
    removeListeners,
    calculateInteractionForce,
    getInteractionPoints: () => interactionPoints,
    isInteracting: () => isInteracting,
    updateConfig: (newConfig) => {
      Object.assign(config, newConfig);
    }
  };
};

/**
 * Gesture recognition utilities
 */
export const GestureRecognizer = {
  /**
   * Detect pinch gesture for zoom
   * @param {TouchEvent} event - Touch event
   * @returns {Object|null} Pinch data or null
   */
  detectPinch: (event) => {
    if (event.touches.length !== 2) return null;
    
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    return {
      distance,
      centerX,
      centerY,
      rotation: Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX)
    };
  },

  /**
   * Detect swipe gesture
   * @param {Object} startPoint - Starting touch point
   * @param {Object} endPoint - Ending touch point
   * @param {number} minDistance - Minimum distance for swipe
   * @returns {Object|null} Swipe data or null
   */
  detectSwipe: (startPoint, endPoint, minDistance = 50) => {
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < minDistance) return null;
    
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    let direction = 'right';
    
    if (angle >= -45 && angle < 45) direction = 'right';
    else if (angle >= 45 && angle < 135) direction = 'down';
    else if (angle >= 135 || angle < -135) direction = 'left';
    else direction = 'up';
    
    return {
      direction,
      distance,
      deltaX,
      deltaY,
      velocity: distance / (endPoint.time - startPoint.time)
    };
  }
}; 