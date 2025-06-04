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
    colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD'],
    gradients: {
      primary: ['#0D1B2A', '#415A77'],
      secondary: ['#1B263B', '#778DA9'],
      accent: ['#415A77', '#E0E1DD']
    },
    effects: {
      glow: '#778DA9',
      highlight: '#E0E1DD',
      shadow: '#0D1B2A'
    }
  },

  nature: {
    name: 'Nature',
    colors: ['#2D5016', '#4F772D', '#90A955', '#C8D5B9', '#F8FFF4'],
    gradients: {
      primary: ['#2D5016', '#90A955'],
      secondary: ['#4F772D', '#C8D5B9'],
      accent: ['#90A955', '#F8FFF4']
    },
    effects: {
      glow: '#90A955',
      highlight: '#F8FFF4',
      shadow: '#2D5016'
    }
  },

  ocean: {
    name: 'Ocean',
    colors: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'],
    gradients: {
      primary: ['#03045E', '#00B4D8'],
      secondary: ['#0077B6', '#90E0EF'],
      accent: ['#00B4D8', '#CAF0F8']
    },
    effects: {
      glow: '#00B4D8',
      highlight: '#CAF0F8',
      shadow: '#03045E'
    }
  },

  sunset: {
    name: 'Sunset',
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#4ECDC4'],
    gradients: {
      primary: ['#FF6B35', '#FFD23F'],
      secondary: ['#F7931E', '#06FFA5'],
      accent: ['#06FFA5', '#4ECDC4']
    },
    effects: {
      glow: '#FFD23F',
      highlight: '#06FFA5',
      shadow: '#FF6B35'
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
    colors: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#00FFFF'],
    gradients: {
      primary: ['#FF0080', '#00FF80'],
      secondary: ['#8000FF', '#FF8000'],
      accent: ['#FF8000', '#00FFFF']
    },
    effects: {
      glow: '#00FF80',
      highlight: '#FF0080',
      shadow: '#000011'
    }
  },

  space: {
    name: 'Space',
    colors: ['#0C0C20', '#1A1A3E', '#2E2E5C', '#6B46C1', '#A855F7'],
    gradients: {
      primary: ['#0C0C20', '#2E2E5C'],
      secondary: ['#1A1A3E', '#6B46C1'],
      accent: ['#6B46C1', '#A855F7']
    },
    effects: {
      glow: '#A855F7',
      highlight: '#6B46C1',
      shadow: '#0C0C20'
    }
  },

  retro: {
    name: 'Retro',
    colors: ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5', '#FFBE0B'],
    gradients: {
      primary: ['#FF006E', '#8338EC'],
      secondary: ['#3A86FF', '#06FFA5'],
      accent: ['#06FFA5', '#FFBE0B']
    },
    effects: {
      glow: '#06FFA5',
      highlight: '#FFBE0B',
      shadow: '#FF006E'
    }
  },

  cosmic: {
    name: 'Cosmic',
    colors: ['#1A0B3D', '#6B2C91', '#B83DBA', '#EF4CE0', '#FFB3FD'],
    gradients: {
      primary: ['#1A0B3D', '#B83DBA'],
      secondary: ['#6B2C91', '#EF4CE0'],
      accent: ['#EF4CE0', '#FFB3FD']
    },
    effects: {
      glow: '#EF4CE0',
      highlight: '#FFB3FD',
      shadow: '#1A0B3D'
    }
  },

  aurora: {
    name: 'Aurora',
    colors: ['#003366', '#0066CC', '#00CCFF', '#66FFCC', '#CCFF99'],
    gradients: {
      primary: ['#003366', '#00CCFF'],
      secondary: ['#0066CC', '#66FFCC'],
      accent: ['#66FFCC', '#CCFF99']
    },
    effects: {
      glow: '#66FFCC',
      highlight: '#CCFF99',
      shadow: '#003366'
    }
  },

  volcano: {
    name: 'Volcano',
    colors: ['#1A0000', '#8B0000', '#FF4500', '#FF8C00', '#FFD700'],
    gradients: {
      primary: ['#1A0000', '#FF4500'],
      secondary: ['#8B0000', '#FF8C00'],
      accent: ['#FF8C00', '#FFD700']
    },
    effects: {
      glow: '#FF8C00',
      highlight: '#FFD700',
      shadow: '#1A0000'
    }
  },

  forest: {
    name: 'Forest',
    colors: ['#0D2818', '#1A4C32', '#2D7049', '#4A9960', '#66C2A5'],
    gradients: {
      primary: ['#0D2818', '#2D7049'],
      secondary: ['#1A4C32', '#4A9960'],
      accent: ['#4A9960', '#66C2A5']
    },
    effects: {
      glow: '#4A9960',
      highlight: '#66C2A5',
      shadow: '#0D2818'
    }
  },

  ice: {
    name: 'Ice',
    colors: ['#E8F4FD', '#A8DADC', '#457B9D', '#1D3557', '#F1FAEE'],
    gradients: {
      primary: ['#E8F4FD', '#457B9D'],
      secondary: ['#A8DADC', '#1D3557'],
      accent: ['#1D3557', '#F1FAEE']
    },
    effects: {
      glow: '#A8DADC',
      highlight: '#F1FAEE',
      shadow: '#1D3557'
    }
  },

  galaxy: {
    name: 'Galaxy',
    colors: ['#0F0F23', '#2D1B69', '#6A4C93', '#C490E4', '#FFEEDD'],
    gradients: {
      primary: ['#0F0F23', '#6A4C93'],
      secondary: ['#2D1B69', '#C490E4'],
      accent: ['#C490E4', '#FFEEDD']
    },
    effects: {
      glow: '#C490E4',
      highlight: '#FFEEDD',
      shadow: '#0F0F23'
    }
  },

  desert: {
    name: 'Desert',
    colors: ['#8B4513', '#CD853F', '#DEB887', '#FFE4B5', '#FFEFD5'],
    gradients: {
      primary: ['#8B4513', '#DEB887'],
      secondary: ['#CD853F', '#FFE4B5'],
      accent: ['#FFE4B5', '#FFEFD5']
    },
    effects: {
      glow: '#FFE4B5',
      highlight: '#FFEFD5',
      shadow: '#8B4513'
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
  },

  cyberpunk: {
    name: 'Cyberpunk',
    colorScheme: COLOR_SCHEMES.cyberpunk,
    animationSettings: {
      intensity: 'high',
      speed: 1.3,
      particleCount: 180,
      glowEffect: true
    },
    recommendedAnimations: ['matrixRain', 'electricStorm', 'neonPulse', 'quantumField']
  },

  retro: {
    name: 'Retro',
    colorScheme: COLOR_SCHEMES.retro,
    animationSettings: {
      intensity: 'medium',
      speed: 1.0,
      particleCount: 120,
      glowEffect: true
    },
    recommendedAnimations: ['rainbowWaves', 'geometricShapes', 'neonPulse', 'galaxySpiral']
  }
};

/**
 * Theme utility functions
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.customThemes = new Map();
    this.currentColors = [];
    this.isTransitioning = false;
    this.themeCycleInterval = null;
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
    this.currentColors = theme.colorScheme.colors;
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

  /**
   * Get current theme colors
   * @returns {Array<string>} Array of current colors
   */
  getCurrentColors() {
    if (!this.currentTheme) return ['#ffffff', '#cccccc', '#999999'];
    return this.currentColors || this.currentTheme.colorScheme.colors;
  }

  /**
   * Get background color for current theme
   * @param {number} [opacity=0.1] - Background opacity
   * @returns {string} Background color with opacity
   */
  getBackgroundColor(opacity = 0.1) {
    if (!this.currentTheme) return `rgba(15, 23, 42, ${opacity})`;
    
    // Use the darkest color from the theme as background
    const colors = this.getCurrentColors();
    const darkestColor = colors[colors.length - 1] || colors[0];
    
    // Convert hex to rgba with opacity
    const rgb = this.parseColor(darkestColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }

  /**
   * Get current theme name
   * @returns {string} Current theme name or 'default'
   */
  getCurrentThemeName() {
    return this.currentTheme ? this.currentTheme.name : 'default';
  }

  /**
   * Check if a theme is currently applied
   * @returns {boolean} True if a theme is applied
   */
  hasTheme() {
    return this.currentTheme !== null;
  }

  /**
   * Convert any color to rgba format
   * @param {string} color - Input color (hex, rgb, rgba)
   * @param {number} [opacity=1] - Opacity (0-1)
   * @returns {string} RGBA color string
   */
  toRgba(color, opacity = 1) {
    const rgb = this.parseColor(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }

  /**
   * Smooth transition between themes
   * @param {string} newTheme - Target theme name
   * @param {number} [duration=2000] - Transition duration in milliseconds
   * @param {Function} [easingFunction] - Custom easing function
   */
  transitionToTheme(newTheme, duration = 2000, easingFunction = this.easeInOutCubic) {
    if (!THEMES[newTheme] || this.isTransitioning) return;
    
    const startTheme = this.currentTheme;
    const startTime = Date.now();
    this.isTransitioning = true;
    
    const startColors = [...this.currentColors];
    const targetColors = THEMES[newTheme].colorScheme.colors;
    
    const transitionStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunction(progress);
      
      // Interpolate colors
      this.currentColors = startColors.map((startColor, index) => {
        const targetColor = targetColors[index] || targetColors[targetColors.length - 1];
        return this.interpolateColor(startColor, targetColor, easedProgress);
      });
      
      if (progress < 1) {
        requestAnimationFrame(transitionStep);
      } else {
        this.currentTheme = newTheme;
        this.isTransitioning = false;
      }
    };
    
    transitionStep();
  }

  /**
   * Interpolate between two colors
   * @param {string} color1 - Start color (hex or rgb)
   * @param {string} color2 - End color (hex or rgb)
   * @param {number} factor - Interpolation factor (0-1)
   * @returns {string} Interpolated color
   */
  interpolateColor(color1, color2, factor) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Parse color string to RGB object
   * @param {string} color - Color string
   * @returns {Object} RGB object
   */
  parseColor(color) {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    } else if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      return {
        r: parseInt(matches[0]),
        g: parseInt(matches[1]),
        b: parseInt(matches[2])
      };
    }
    return { r: 255, g: 255, b: 255 };
  }

  /**
   * Cubic easing function
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Enable automatic theme cycling
   * @param {Array} themes - Array of theme names to cycle through
   * @param {number} [interval=10000] - Time between changes in milliseconds
   */
  enableThemeCycling(themes, interval = 10000) {
    this.stopThemeCycling();
    
    let currentIndex = 0;
    this.themeCycleInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % themes.length;
      this.transitionToTheme(themes[currentIndex]);
    }, interval);
  }

  /**
   * Stop automatic theme cycling
   */
  stopThemeCycling() {
    if (this.themeCycleInterval) {
      clearInterval(this.themeCycleInterval);
      this.themeCycleInterval = null;
    }
  }
}

// Export a singleton instance
export const themeManager = new ThemeManager(); 