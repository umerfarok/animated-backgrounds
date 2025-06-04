/**
 * @fileoverview Theme and color system for animated backgrounds
 * @module ThemeSystem
 */

/**
 * @typedef {Object} ColorScheme
 * @property {string} name - Theme name
 * @property {Array<string>} colors - Array of hex colors
 * @property {Object} gradients - Gradient definitions
 * @property {Object} effects - Special effect colors
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {string} name - Theme name
 * @property {ColorScheme} colorScheme - Color scheme for the theme
 * @property {Object} animationSettings - Theme-specific animation settings
 * @property {Array<string>} recommendedAnimations - Animations that work well with this theme
 */

/**
 * Predefined color schemes
 */
export const COLOR_SCHEMES = {
  cyberpunk: {
    name: 'Cyberpunk',
    colors: ['#ff0080', '#00ffff', '#ff8000', '#8000ff', '#ff0040'],
    gradients: {
      primary: ['#ff0080', '#8000ff'],
      secondary: ['#00ffff', '#ff8000'],
      accent: ['#ff0040', '#ff0080']
    },
    effects: {
      glow: '#00ffff',
      highlight: '#ff0080',
      shadow: '#000040'
    }
  },

  nature: {
    name: 'Nature',
    colors: ['#4a7c59', '#a7d0cd', '#f2e7d5', '#6d9773', '#99c7a1'],
    gradients: {
      primary: ['#4a7c59', '#99c7a1'],
      secondary: ['#a7d0cd', '#f2e7d5'],
      accent: ['#6d9773', '#a7d0cd']
    },
    effects: {
      glow: '#a7d0cd',
      highlight: '#f2e7d5',
      shadow: '#2d4832'
    }
  },

  ocean: {
    name: 'Ocean',
    colors: ['#003d5c', '#0074b7', '#0099cc', '#00bfff', '#87ceeb'],
    gradients: {
      primary: ['#003d5c', '#0099cc'],
      secondary: ['#0074b7', '#87ceeb'],
      accent: ['#00bfff', '#87ceeb']
    },
    effects: {
      glow: '#00bfff',
      highlight: '#87ceeb',
      shadow: '#001f2e'
    }
  },

  sunset: {
    name: 'Sunset',
    colors: ['#ff6b35', '#f7931e', '#ffd23f', '#ee4266', '#540d6e'],
    gradients: {
      primary: ['#ff6b35', '#ffd23f'],
      secondary: ['#f7931e', '#ee4266'],
      accent: ['#ee4266', '#540d6e']
    },
    effects: {
      glow: '#ffd23f',
      highlight: '#ff6b35',
      shadow: '#2a0637'
    }
  },

  monochrome: {
    name: 'Monochrome',
    colors: ['#000000', '#333333', '#666666', '#999999', '#ffffff'],
    gradients: {
      primary: ['#000000', '#666666'],
      secondary: ['#333333', '#999999'],
      accent: ['#666666', '#ffffff']
    },
    effects: {
      glow: '#ffffff',
      highlight: '#cccccc',
      shadow: '#000000'
    }
  },

  neon: {
    name: 'Neon',
    colors: ['#ff073a', '#39ff14', '#ffff00', '#ff1493', '#00ffff'],
    gradients: {
      primary: ['#ff073a', '#39ff14'],
      secondary: ['#ffff00', '#ff1493'],
      accent: ['#ff1493', '#00ffff']
    },
    effects: {
      glow: '#39ff14',
      highlight: '#ffff00',
      shadow: '#0a0a0a'
    }
  },

  space: {
    name: 'Space',
    colors: ['#0b0c2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'],
    gradients: {
      primary: ['#0b0c2a', '#415a77'],
      secondary: ['#1b263b', '#778da9'],
      accent: ['#415a77', '#e0e1dd']
    },
    effects: {
      glow: '#778da9',
      highlight: '#e0e1dd',
      shadow: '#050511'
    }
  },

  retro: {
    name: 'Retro',
    colors: ['#ff6b9d', '#c44569', '#f8b500', '#40e0d0', '#ee82ee'],
    gradients: {
      primary: ['#ff6b9d', '#f8b500'],
      secondary: ['#c44569', '#40e0d0'],
      accent: ['#40e0d0', '#ee82ee']
    },
    effects: {
      glow: '#f8b500',
      highlight: '#ff6b9d',
      shadow: '#2d1b3d'
    }
  }
};

/**
 * Predefined themes with complete configurations
 */
export const THEMES = {
  gaming: {
    name: 'Gaming',
    colorScheme: COLOR_SCHEMES.cyberpunk,
    animationSettings: {
      intensity: 'high',
      speed: 1.2,
      particleCount: 150,
      glowEffect: true
    },
    recommendedAnimations: ['matrixRain', 'electricStorm', 'neonPulse', 'particleNetwork']
  },

  portfolio: {
    name: 'Portfolio',
    colorScheme: COLOR_SCHEMES.monochrome,
    animationSettings: {
      intensity: 'medium',
      speed: 0.8,
      particleCount: 80,
      glowEffect: false
    },
    recommendedAnimations: ['geometricShapes', 'floatingBubbles', 'gradientWave']
  },

  landing: {
    name: 'Landing Page',
    colorScheme: COLOR_SCHEMES.sunset,
    animationSettings: {
      intensity: 'medium',
      speed: 1.0,
      particleCount: 100,
      glowEffect: true
    },
    recommendedAnimations: ['galaxySpiral', 'rainbowWaves', 'auroraBorealis']
  },

  presentation: {
    name: 'Presentation',
    colorScheme: COLOR_SCHEMES.space,
    animationSettings: {
      intensity: 'low',
      speed: 0.6,
      particleCount: 50,
      glowEffect: false
    },
    recommendedAnimations: ['starryNight', 'cosmicDust', 'quantumField']
  },

  wellness: {
    name: 'Wellness',
    colorScheme: COLOR_SCHEMES.nature,
    animationSettings: {
      intensity: 'low',
      speed: 0.7,
      particleCount: 60,
      glowEffect: false
    },
    recommendedAnimations: ['oceanWaves', 'autumnLeaves', 'fireflyForest']
  },

  party: {
    name: 'Party',
    colorScheme: COLOR_SCHEMES.neon,
    animationSettings: {
      intensity: 'high',
      speed: 1.5,
      particleCount: 200,
      glowEffect: true
    },
    recommendedAnimations: ['rainbowWaves', 'neonPulse', 'electricStorm']
  }
};

/**
 * Theme utility functions
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.customThemes = new Map();
  }

  /**
   * Apply a theme to animation settings
   * @param {string} themeName - Name of the theme to apply
   * @returns {Object} Theme configuration
   */
  applyTheme(themeName) {
    const theme = THEMES[themeName] || this.customThemes.get(themeName);
    if (!theme) {
      console.warn(`Theme "${themeName}" not found. Using default.`);
      return THEMES.portfolio;
    }
    
    this.currentTheme = theme;
    return theme;
  }

  /**
   * Get random color from current theme
   * @param {string} [category='colors'] - Color category ('colors', 'primary', 'secondary', 'accent')
   * @returns {string} Hex color string
   */
  getRandomColor(category = 'colors') {
    if (!this.currentTheme) return '#ffffff';
    
    const colorScheme = this.currentTheme.colorScheme;
    let colorArray;
    
    switch (category) {
      case 'primary':
        colorArray = colorScheme.gradients.primary;
        break;
      case 'secondary':
        colorArray = colorScheme.gradients.secondary;
        break;
      case 'accent':
        colorArray = colorScheme.gradients.accent;
        break;
      default:
        colorArray = colorScheme.colors;
    }
    
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  }

  /**
   * Get gradient colors for canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} gradientType - 'primary', 'secondary', or 'accent'
   * @param {Object} coordinates - {x1, y1, x2, y2} for linear gradient
   * @returns {CanvasGradient} Canvas gradient object
   */
  createGradient(ctx, gradientType = 'primary', coordinates = {x1: 0, y1: 0, x2: 0, y2: 100}) {
    if (!this.currentTheme) return null;
    
    const colors = this.currentTheme.colorScheme.gradients[gradientType];
    const gradient = ctx.createLinearGradient(coordinates.x1, coordinates.y1, coordinates.x2, coordinates.y2);
    
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    return gradient;
  }

  /**
   * Create a custom theme
   * @param {string} name - Theme name
   * @param {Object} config - Theme configuration
   */
  createCustomTheme(name, config) {
    this.customThemes.set(name, config);
  }

  /**
   * Get effect color from current theme
   * @param {string} effectType - 'glow', 'highlight', or 'shadow'
   * @returns {string} Hex color string
   */
  getEffectColor(effectType) {
    if (!this.currentTheme) return '#ffffff';
    return this.currentTheme.colorScheme.effects[effectType] || '#ffffff';
  }

  /**
   * Generate theme-appropriate settings for animations
   * @param {string} animationType - Type of animation
   * @returns {Object} Animation-specific settings
   */
  getAnimationSettings(animationType) {
    if (!this.currentTheme) return {};
    
    const baseSettings = this.currentTheme.animationSettings;
    const settings = { ...baseSettings };
    
    // Adjust settings based on animation type
    switch (animationType) {
      case 'particleNetwork':
      case 'matrixRain':
        settings.particleCount = Math.floor(baseSettings.particleCount * 1.2);
        break;
      case 'starryNight':
      case 'cosmicDust':
        settings.particleCount = Math.floor(baseSettings.particleCount * 0.8);
        break;
      case 'electricStorm':
      case 'neonPulse':
        settings.glowEffect = true;
        settings.intensity = 'high';
        break;
    }
    
    return settings;
  }

  /**
   * Get all available themes
   * @returns {Array<string>} Array of theme names
   */
  getAvailableThemes() {
    return [...Object.keys(THEMES), ...Array.from(this.customThemes.keys())];
  }

  /**
   * Get recommended animations for current theme
   * @returns {Array<string>} Array of animation names
   */
  getRecommendedAnimations() {
    if (!this.currentTheme) return [];
    return this.currentTheme.recommendedAnimations || [];
  }
}

// Export a singleton instance
export const themeManager = new ThemeManager(); 