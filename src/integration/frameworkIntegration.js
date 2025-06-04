/**
 * @fileoverview Framework integration utilities
 * @module FrameworkIntegration
 */

import { AnimatedBackground } from '../backgroundAnimations.js';
import { themeManager } from '../utils/themeSystem.js';
import { audioReactiveEffects } from '../utils/audioUtils.js';
import { intelligentOptimizer } from '../utils/aiFeatures.js';
import { physicsEngine } from '../utils/physicsEngine.js';
import { animationSequencer } from '../utils/animationSequencer.js';
import { projectManager } from '../utils/projectManager.js';

/**
 * React Hook for Animated Backgrounds
 */
export function useAnimatedBackground(options = {}) {
  const [instance, setInstance] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const canvasRef = React.useRef(null);

  const {
    animation = 'particleNetwork',
    theme = 'gaming',
    autoStart = true,
    enableAudio = false,
    enablePhysics = false,
    enableAI = true,
    customConfig = {},
    onReady = () => {},
    onError = () => {},
    onUpdate = () => {}
  } = options;

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const initializeBackground = async () => {
      try {
        setError(null);
        
        // Initialize AI optimizer if enabled
        if (enableAI) {
          await intelligentOptimizer.initialize();
        }

        // Create animated background instance
        const bg = new AnimatedBackground(canvasRef.current, {
          animation,
          theme,
          ...customConfig
        });

        // Apply theme
        themeManager.applyTheme(theme);
        
        // Initialize audio if enabled
        if (enableAudio) {
          const audioSuccess = await audioReactiveEffects.initialize();
          if (audioSuccess) {
            audioReactiveEffects.start();
          }
        }

        // Initialize physics if enabled
        if (enablePhysics) {
          const canvas = canvasRef.current;
          physicsEngine.setBounds(canvas.width, canvas.height);
        }

        // Set up update callback
        bg.onUpdate = (state) => {
          onUpdate(state);
        };

        setInstance(bg);
        setIsLoaded(true);

        if (autoStart) {
          bg.start();
        }

        onReady(bg);

      } catch (err) {
        setError(err.message);
        onError(err);
      }
    };

    initializeBackground();

    return () => {
      if (instance) {
        instance.destroy();
      }
      if (enableAudio) {
        audioReactiveEffects.stop();
      }
    };
  }, [animation, theme, enableAudio, enablePhysics]);

  const updateTheme = React.useCallback((newTheme) => {
    if (instance) {
      themeManager.applyTheme(newTheme);
      instance.updateTheme(newTheme);
    }
  }, [instance]);

  const updateAnimation = React.useCallback((newAnimation) => {
    if (instance) {
      instance.changeAnimation(newAnimation);
    }
  }, [instance]);

  const toggleAudio = React.useCallback(async () => {
    if (enableAudio) {
      if (audioReactiveEffects.isActive) {
        audioReactiveEffects.stop();
      } else {
        audioReactiveEffects.start();
      }
    }
  }, [enableAudio]);

  return {
    canvasRef,
    instance,
    isLoaded,
    error,
    updateTheme,
    updateAnimation,
    toggleAudio,
    themeManager,
    audioEffects: enableAudio ? audioReactiveEffects : null,
    optimizer: enableAI ? intelligentOptimizer : null
  };
}

/**
 * Vue Composition API for Animated Backgrounds
 */
export function createAnimatedBackground(options = {}) {
  // Note: This would work with Vue 3 Composition API
  const canvasRef = Vue.ref(null);
  const instance = Vue.ref(null);
  const isLoaded = Vue.ref(false);
  const error = Vue.ref(null);

  const {
    animation = 'particleNetwork',
    theme = 'gaming',
    autoStart = true,
    enableAudio = false,
    enablePhysics = false,
    enableAI = true,
    customConfig = {}
  } = options;

  Vue.onMounted(async () => {
    if (!canvasRef.value) return;

    try {
      error.value = null;
      
      if (enableAI) {
        await intelligentOptimizer.initialize();
      }

      const bg = new AnimatedBackground(canvasRef.value, {
        animation,
        theme,
        ...customConfig
      });

      themeManager.applyTheme(theme);
      
      if (enableAudio) {
        const audioSuccess = await audioReactiveEffects.initialize();
        if (audioSuccess && autoStart) {
          audioReactiveEffects.start();
        }
      }

      if (enablePhysics) {
        physicsEngine.setBounds(canvasRef.value.width, canvasRef.value.height);
      }

      instance.value = bg;
      isLoaded.value = true;

      if (autoStart) {
        bg.start();
      }

    } catch (err) {
      error.value = err.message;
    }
  });

  Vue.onUnmounted(() => {
    if (instance.value) {
      instance.value.destroy();
    }
    if (enableAudio) {
      audioReactiveEffects.stop();
    }
  });

  const updateTheme = (newTheme) => {
    if (instance.value) {
      themeManager.applyTheme(newTheme);
      instance.value.updateTheme(newTheme);
    }
  };

  const updateAnimation = (newAnimation) => {
    if (instance.value) {
      instance.value.changeAnimation(newAnimation);
    }
  };

  return {
    canvasRef,
    instance: Vue.readonly(instance),
    isLoaded: Vue.readonly(isLoaded),
    error: Vue.readonly(error),
    updateTheme,
    updateAnimation,
    themeManager,
    audioEffects: enableAudio ? audioReactiveEffects : null
  };
}

/**
 * Vanilla JavaScript Integration Class
 */
export class AnimatedBackgroundManager {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      animation: 'particleNetwork',
      theme: 'gaming',
      autoStart: true,
      enableAudio: false,
      enablePhysics: false,
      enableAI: true,
      enableSequencer: false,
      enableProjectManager: false,
      ...options
    };
    
    this.instance = null;
    this.isInitialized = false;
    this.modules = {};
    
    this.callbacks = {
      onReady: [],
      onError: [],
      onUpdate: [],
      onThemeChange: [],
      onAnimationChange: []
    };
  }

  /**
   * Initialize the animated background with all requested modules
   */
  async initialize() {
    try {
      // Initialize AI optimizer
      if (this.options.enableAI) {
        await intelligentOptimizer.initialize();
        this.modules.ai = intelligentOptimizer;
      }

      // Initialize audio
      if (this.options.enableAudio) {
        const success = await audioReactiveEffects.initialize();
        if (success) {
          this.modules.audio = audioReactiveEffects;
        }
      }

      // Initialize physics
      if (this.options.enablePhysics) {
        physicsEngine.setBounds(this.canvas.width, this.canvas.height);
        this.modules.physics = physicsEngine;
      }

      // Initialize sequencer
      if (this.options.enableSequencer) {
        this.modules.sequencer = animationSequencer;
      }

      // Initialize project manager
      if (this.options.enableProjectManager) {
        this.modules.projectManager = projectManager;
      }

      // Create main animated background
      this.instance = new AnimatedBackground(this.canvas, {
        animation: this.options.animation,
        theme: this.options.theme
      });

      // Apply theme
      themeManager.applyTheme(this.options.theme);
      this.modules.themeManager = themeManager;

      // Set up callbacks
      this.instance.onUpdate = (state) => {
        this.trigger('onUpdate', state);
      };

      this.isInitialized = true;

      if (this.options.autoStart) {
        this.start();
      }

      this.trigger('onReady', this);

    } catch (error) {
      this.trigger('onError', error);
      throw error;
    }
  }

  /**
   * Start the animation
   */
  start() {
    if (this.instance) {
      this.instance.start();
    }
    if (this.modules.audio) {
      this.modules.audio.start();
    }
    if (this.modules.sequencer) {
      this.modules.sequencer.play();
    }
  }

  /**
   * Stop the animation
   */
  stop() {
    if (this.instance) {
      this.instance.stop();
    }
    if (this.modules.audio) {
      this.modules.audio.stop();
    }
    if (this.modules.sequencer) {
      this.modules.sequencer.stop();
    }
  }

  /**
   * Update theme
   */
  updateTheme(themeName) {
    if (this.modules.themeManager) {
      this.modules.themeManager.applyTheme(themeName);
      if (this.instance) {
        this.instance.updateTheme(themeName);
      }
      this.trigger('onThemeChange', themeName);
    }
  }

  /**
   * Update animation
   */
  updateAnimation(animationType) {
    if (this.instance) {
      this.instance.changeAnimation(animationType);
      this.trigger('onAnimationChange', animationType);
    }
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    const metrics = {
      fps: this.instance ? this.instance.getFPS() : 0,
      particleCount: this.instance ? this.instance.getParticleCount() : 0,
      isOptimized: false
    };

    if (this.modules.ai) {
      metrics.optimizedSettings = this.modules.ai.getOptimizedSettings();
      metrics.isOptimized = true;
    }

    return metrics;
  }

  /**
   * Export current configuration
   */
  exportConfig() {
    const config = {
      animation: this.options.animation,
      theme: this.options.theme,
      enabledModules: Object.keys(this.modules)
    };

    if (this.modules.projectManager) {
      config.project = this.modules.projectManager.currentProject;
    }

    if (this.modules.sequencer) {
      config.sequence = this.modules.sequencer.export();
    }

    return config;
  }

  /**
   * Import configuration
   */
  async importConfig(config) {
    if (config.theme) {
      this.updateTheme(config.theme);
    }

    if (config.animation) {
      this.updateAnimation(config.animation);
    }

    if (config.sequence && this.modules.sequencer) {
      this.modules.sequencer.import(config.sequence);
    }

    if (config.project && this.modules.projectManager) {
      // Import project logic would go here
    }
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  /**
   * Trigger event
   */
  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.stop();
    
    if (this.instance) {
      this.instance.destroy();
    }

    if (this.modules.audio) {
      this.modules.audio.dispose();
    }

    this.callbacks = {};
    this.modules = {};
    this.isInitialized = false;
  }
}

/**
 * Easy initialization function for quick setup
 */
export function createQuickBackground(canvasId, options = {}) {
  const canvas = typeof canvasId === 'string' 
    ? document.getElementById(canvasId) 
    : canvasId;
    
  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  const manager = new AnimatedBackgroundManager(canvas, options);
  return manager.initialize().then(() => manager);
}

/**
 * Preset configurations for common use cases
 */
export const presetConfigs = {
  gaming: {
    animation: 'particleNetwork',
    theme: 'cyberpunk',
    enableAudio: true,
    enableAI: true,
    enablePhysics: true
  },
  
  portfolio: {
    animation: 'geometricShapes',
    theme: 'monochrome',
    enableAI: true,
    enablePhysics: false
  },
  
  presentation: {
    animation: 'starryNight',
    theme: 'space',
    enableAI: true,
    enableAudio: false
  },
  
  party: {
    animation: 'rainbowWaves',
    theme: 'neon',
    enableAudio: true,
    enablePhysics: true,
    enableSequencer: true
  },
  
  minimal: {
    animation: 'floatingBubbles',
    theme: 'nature',
    enableAI: false,
    enableAudio: false
  },
  
  interactive: {
    animation: 'particleNetwork',
    theme: 'aurora',
    enablePhysics: true,
    enableAI: true,
    enableSequencer: true,
    enableProjectManager: true
  }
};

/**
 * Helper function to create background with preset
 */
export function createPresetBackground(canvasId, presetName, customOptions = {}) {
  const preset = presetConfigs[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }
  
  const options = { ...preset, ...customOptions };
  return createQuickBackground(canvasId, options);
} 