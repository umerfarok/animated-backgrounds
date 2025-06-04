# Animated Backgrounds v2.0

> ✨ **A comprehensive React package for stunning animated backgrounds with interactive controls, themes, performance monitoring, and layered compositions.**

![npm version](https://img.shields.io/npm/v/animated-backgrounds.svg)
![npm downloads](https://img.shields.io/npm/dm/animated-backgrounds.svg)
![license](https://img.shields.io/npm/l/animated-backgrounds.svg)
![React](https://img.shields.io/badge/React-%2016.8%2B-blue)
[![Socket Badge](https://socket.dev/api/badge/npm/package/animated-backgrounds/2.0.0)](https://socket.dev/npm/package/animated-backgrounds/overview/2.0.0)

## 🚀 What's New in v2.0

**Major upgrade with powerful new features:**

- 🎨 **8 Stunning Themes** - Gaming, Portfolio, Landing, Presentation, Wellness, Party, Cyberpunk, Retro
- 🎮 **Interactive Animations** - Mouse/touch interactions with particle systems
- 🏗️ **Layered Backgrounds** - Multiple animation layers with blend modes
- 🎛️ **Animation Controls** - Play/pause/speed/reset functionality
- 📊 **Performance Monitoring** - Real-time FPS tracking and optimization
- 📱 **Mobile Optimized** - Touch gestures and responsive design
- ⚡ **Zero Flashing** - Smooth transitions without component remounting

## 📦 Installation

```bash
npm install animated-backgrounds
```

## 🎯 Quick Start

```jsx
import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function App() {
  return (
    <div>
      <AnimatedBackground 
        animationName="particleNetwork"
        theme="gaming"
      />
      <h1>Your content here</h1>
    </div>
  );
}
```

## 🎨 Available Animations

### Core Animations (19 total)
- **Nature**: `autumnLeaves`, `oceanWaves`, `starryNight`, `auroraBorealis`, `fireflies`
- **Tech**: `particleNetwork`, `neuralNetwork`, `matrixRain`, `quantumField`, `electricStorm`
- **Abstract**: `geometricShapes`, `gradientWave`, `floatingBubbles`, `cosmicDust`, `neonPulse`
- **Fun**: `fallingFoodFiesta`, `rainbowWaves`, `galaxySpiral`, `dnaHelix`

### Themes
Each theme applies unique color schemes and visual settings:

| Theme | Description | Best For |
|-------|-------------|----------|
| 🎮 **Gaming** | Cyberpunk colors, high energy | Gaming sites, tech demos |
| 💼 **Portfolio** | Professional monochrome | Business, resumes, corporate |
| 🌅 **Landing** | Warm sunset tones | Marketing pages, landing sites |
| 📊 **Presentation** | Subtle space theme | Slides, professional content |
| 🌿 **Wellness** | Calming nature colors | Health, wellness, meditation |
| 🎉 **Party** | Vibrant neon colors | Events, entertainment, festivals |
| 🤖 **Cyberpunk** | Classic sci-fi aesthetic | Futuristic themes, tech blogs |
| 🕹️ **Retro** | Nostalgic vintage colors | Creative projects, portfolios |

## 🎮 Interactive Features

### Basic Interaction
```jsx
<AnimatedBackground 
  animationName="particleNetwork"
  interactive={true}
  interactionConfig={{
    effect: 'attract',     // 'attract' | 'repel' | 'follow' | 'burst' | 'gravity'
    strength: 0.8,         // 0.1 to 2.0
    radius: 150,           // Interaction radius in pixels
    continuous: true       // Continuous vs single-click interaction
  }}
/>
```

### Interaction Effects
- **attract**: Particles move toward cursor/touch
- **repel**: Particles move away from cursor/touch  
- **follow**: Particles trail behind cursor movement
- **burst**: Explosive effect on click/touch
- **gravity**: Gravitational pull effect

### Mobile Gestures
- **Pinch**: Zoom effect on animations
- **Swipe**: Directional particle movement
- **Tap**: Burst effects
- **Multi-touch**: Multiple interaction points

## 🏗️ Layered Backgrounds

Create complex visual compositions by combining multiple animations:

```jsx
import { LayeredBackground } from 'animated-backgrounds';

<LayeredBackground 
  layers={[
    { 
      animation: 'starryNight', 
      opacity: 0.7, 
      blendMode: 'normal',
      speed: 0.5 
    },
    { 
      animation: 'particleNetwork', 
      opacity: 0.3, 
      blendMode: 'screen',
      speed: 1.2 
    },
    { 
      animation: 'cosmicDust', 
      opacity: 0.5, 
      blendMode: 'overlay',
      speed: 0.8 
    }
  ]}
/>
```

### Blend Modes
- `normal`, `multiply`, `screen`, `overlay`
- `darken`, `lighten`, `color-dodge`, `color-burn`
- `hard-light`, `soft-light`, `difference`, `exclusion`
- `hue`, `saturation`, `color`, `luminosity`

## 🎛️ Animation Controls

Take full control of your animations:

```jsx
import { AnimatedBackground, useAnimationControls } from 'animated-backgrounds';

function ControlledAnimation() {
  const controls = useAnimationControls({
    initialSpeed: 1,
    autoPlay: true
  });

  return (
    <div>
      <AnimatedBackground 
        animationName="galaxySpiral"
        animationControls={controls}
      />
      
      <div className="controls">
        <button onClick={controls.play}>▶️ Play</button>
        <button onClick={controls.pause}>⏸️ Pause</button>
        <button onClick={controls.reset}>🔄 Reset</button>
        <input 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1"
          value={controls.speed}
          onChange={(e) => controls.setSpeed(e.target.value)}
        />
      </div>
    </div>
  );
}
```

### Control Methods
- `play()` - Start/resume animation
- `pause()` - Pause animation
- `reset()` - Reset to initial state
- `toggle()` - Toggle play/pause
- `setSpeed(value)` - Set speed (0.1x to 5.0x)

## 📊 Performance Monitoring

Monitor and optimize animation performance:

```jsx
import { usePerformanceMonitor } from 'animated-backgrounds';

function MonitoredAnimation() {
  const performance = usePerformanceMonitor({
    sampleSize: 60,        // Frames to average over
    warningThreshold: 30,  // FPS warning threshold
    autoOptimize: true     // Auto-adjust for performance
  });

  return (
    <div>
      <AnimatedBackground 
        animationName="particleNetwork"
        enablePerformanceMonitoring={true}
        adaptivePerformance={true}
      />
      
      <div className="performance-panel">
        <div>FPS: {performance.fps}</div>
        <div>Avg FPS: {performance.avgFps}</div>
        <div>Level: {performance.performanceLevel}</div>
        <div>Memory: {performance.memoryUsage}MB</div>
        {performance.warnings.map(warning => (
          <div key={warning} className="warning">{warning}</div>
        ))}
      </div>
    </div>
  );
}
```

### Performance Levels
- **Excellent**: 55+ FPS
- **Good**: 40-54 FPS  
- **Fair**: 25-39 FPS
- **Poor**: <25 FPS

## 🎨 Advanced Examples

### Complete Feature Demo
```jsx
import React, { useState } from 'react';
import { 
  AnimatedBackground, 
  LayeredBackground,
  useAnimationControls,
  usePerformanceMonitor,
  THEMES 
} from 'animated-backgrounds';

function AdvancedDemo() {
  const [mode, setMode] = useState('themed');
  const [theme, setTheme] = useState('gaming');
  const [animation, setAnimation] = useState('particleNetwork');
  
  const controls = useAnimationControls();
  const performance = usePerformanceMonitor();

  const renderBackground = () => {
    switch (mode) {
      case 'interactive':
        return (
          <AnimatedBackground 
            animationName="particleNetwork"
            interactive={true}
            interactionConfig={{
              effect: 'attract',
              strength: 0.8,
              radius: 150
            }}
            theme={theme}
          />
        );
      
      case 'layered':
        return (
          <LayeredBackground 
            layers={[
              { animation: 'starryNight', opacity: 0.7, blendMode: 'normal' },
              { animation: 'particleNetwork', opacity: 0.4, blendMode: 'screen' }
            ]}
          />
        );
      
      case 'controlled':
        return (
          <AnimatedBackground 
            animationName={animation}
            animationControls={controls}
            theme={theme}
          />
        );
      
      default:
        return (
          <AnimatedBackground 
            animationName={animation}
            theme={theme}
            enablePerformanceMonitoring={true}
          />
        );
    }
  };

  return (
    <div className="demo-app">
      {renderBackground()}
      
      <div className="controls-panel">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="themed">🎨 Themed</option>
          <option value="interactive">🎮 Interactive</option>
          <option value="layered">🏗️ Layered</option>
          <option value="controlled">🎛️ Controlled</option>
        </select>

        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {Object.entries(THEMES).map(([key, themeData]) => (
            <option key={key} value={key}>{themeData.name}</option>
          ))}
        </select>

        {mode === 'controlled' && (
          <div className="animation-controls">
            <button onClick={controls.play}>▶️</button>
            <button onClick={controls.pause}>⏸️</button>
            <button onClick={controls.reset}>🔄</button>
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1"
              value={controls.speed}
              onChange={(e) => controls.setSpeed(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

## 📱 Mobile Optimization

### Responsive Design
```jsx
<AnimatedBackground 
  animationName="particleNetwork"
  interactive={true}
  adaptivePerformance={true}  // Auto-optimize for mobile
  enablePerformanceMonitoring={true}
/>
```

### Touch Gestures
```jsx
<AnimatedBackground 
  animationName="floatingBubbles"
  interactive={true}
  interactionConfig={{
    effect: 'follow',
    strength: 0.6,
    radius: 100,
    multiTouch: true  // Enable multi-touch support
  }}
/>
```

## ⚙️ Configuration Options

### AnimatedBackground Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationName` | `string` | `'geometricShapes'` | Animation to display |
| `theme` | `string` | `undefined` | Theme to apply |
| `interactive` | `boolean` | `false` | Enable interactions |
| `interactionConfig` | `object` | `{}` | Interaction settings |
| `animationControls` | `object` | `undefined` | Control object from hook |
| `enablePerformanceMonitoring` | `boolean` | `false` | Enable performance tracking |
| `adaptivePerformance` | `boolean` | `false` | Auto-optimize performance |
| `fps` | `number` | `60` | Target frames per second |
| `blendMode` | `string` | `'normal'` | Canvas blend mode |
| `fallbackAnimation` | `string` | `'geometricShapes'` | Fallback if main fails |

### InteractionConfig Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `effect` | `string` | `'attract'` | Interaction type |
| `strength` | `number` | `0.5` | Effect strength (0.1-2.0) |
| `radius` | `number` | `100` | Interaction radius |
| `continuous` | `boolean` | `true` | Continuous vs click-only |
| `multiTouch` | `boolean` | `false` | Multi-touch support |

## 🔧 TypeScript Support

Full TypeScript definitions included:

```typescript
import { 
  AnimatedBackground, 
  AnimationName, 
  ThemeName,
  InteractionConfig,
  PerformanceMetrics 
} from 'animated-backgrounds';

const config: InteractionConfig = {
  effect: 'attract',
  strength: 0.8,
  radius: 150,
  continuous: true
};
```

## 🚀 Performance Tips

### Optimization Best Practices
1. **Use appropriate themes** - `portfolio` and `presentation` are most performant
2. **Enable adaptive performance** - Auto-adjusts based on device capabilities
3. **Monitor performance** - Use performance monitoring to identify bottlenecks
4. **Reduce complexity on mobile** - Use simpler animations for touch devices
5. **Limit layered backgrounds** - More layers = higher resource usage

### Memory Management
- Animations automatically clean up on unmount
- Performance monitoring helps identify memory leaks
- Adaptive performance reduces particle counts on low-end devices

## 🌟 Examples & Demos

### Live Examples
- **QR Generator Demo**: Full-featured app showcasing all v2.0 capabilities
- **Theme Showcase**: Interactive theme comparison
- **Performance Test**: Real-time performance monitoring
- **Mobile Demo**: Touch interaction examples

### Code Examples
Check the `/examples` directory for:
- Basic usage patterns
- Advanced configurations  
- Integration examples
- Performance optimization

## 🔗 Related Packages

### Complementary Libraries
- **React**: Core framework (>= 16.8 required for hooks)
- **Framer Motion**: For additional animations
- **React Spring**: Alternative animation library
- **Three.js**: For 3D animated backgrounds

## 📈 Migration Guide

### From v1.x to v2.0

**Breaking Changes:**
- New theme system (optional upgrade)
- Performance monitoring API changes
- Some animation names updated

**Migration Steps:**
```jsx
// v1.x
<AnimatedBackground animation="stars" />

// v2.0  
<AnimatedBackground 
  animationName="starryNight"  // Renamed
  theme="portfolio"            // New theme system
/>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/umerfarok/animated-backgrounds.git
cd animated-backgrounds
npm install
npm run build
```

### Testing
```bash
npm test
npm run test:performance
npm run test:mobile
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋‍♂️ Support

- 📧 **Email**: umerfarooq.dev@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/umerfarok/animated-backgrounds/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/umerfarok/animated-backgrounds/discussions)
- 📖 **Documentation**: [Full API Docs](https://umerfarok.github.io/animated-backgrounds)

## 🌟 Show Your Support

If you like this project, please ⭐ star it on GitHub and share it with the community!

```bash
npm install animated-backgrounds
```

---

**Made with ❤️ by [Umer Farooq](https://github.com/umerfarok)**

*Transform your React applications with stunning animated backgrounds!* ✨
