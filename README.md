# Animated Backgrounds v2.0

> ✨ **A comprehensive React package for stunning animated backgrounds with interactive controls, themes, performance monitoring, and layered compositions.**

![npm version](https://img.shields.io/npm/v/animated-backgrounds.svg)
![npm downloads](https://img.shields.io/npm/dm/animated-backgrounds.svg)
![license](https://img.shields.io/npm/l/animated-backgrounds.svg)
![React](https://img.shields.io/badge/React-%2016.8%2B-blue)
[![Socket Badge](https://socket.dev/api/badge/npm/package/animated-backgrounds/2.0.0)](https://socket.dev/npm/package/animated-backgrounds/overview/2.0.0)
[![Docs](https://img.shields.io/badge/Docs-📚_API_Reference-blue)](https://umerfarok.github.io/animated-backgrounds/)
[![Demo](https://img.shields.io/badge/Demo-🎮_Live_Example-green)](https://qr-generator-murex.vercel.app/)

## �� What's New in v2.0

**Major upgrade with powerful new features:**

### 🎮 Interactive Animations
- **Mouse & Touch Interactions**: 8 interaction effects (attract, repel, follow, burst, gravity, magnetic, vortex, wave)
- **Multi-touch Support**: Responsive mobile gestures and interactions
- **Real-time Force Simulation**: Physics-based particle interactions

### 🎨 Advanced Theme System
- **8 Predefined Themes**: Gaming, Portfolio, Landing, Presentation, Wellness, Party, Cyberpunk, Retro
- **Custom Color Schemes**: Dynamic color management and gradients
- **Theme-aware Animations**: Automatic color and style adaptation

### ⚡ Performance & Control
- **Animation Controls**: Play/pause/reset functionality with speed control (0.1x-5.0x)
- **Performance Monitoring**: Real-time FPS tracking and memory usage
- **Adaptive Optimization**: Automatic performance adjustments

### 🏗️ Layered Compositions  
- **Multiple Animation Layers**: Composite animations with individual opacity and blend modes
- **Independent Controls**: Per-layer speed and timing control
- **Advanced Blend Modes**: 16 CSS blend modes for stunning visual effects

## 📦 Installation

```bash
npm install animated-backgrounds
```

## 🎯 Quick Start

### Basic Animation
```jsx
import { AnimatedBackground } from 'animated-backgrounds';

function App() {
  return (
    <div>
      <AnimatedBackground animationName="particleNetwork" />
      <h1>Your content here</h1>
    </div>
  );
}
```

### Interactive Animation with Theme
```jsx
import { AnimatedBackground } from 'animated-backgrounds';

function App() {
  return (
    <AnimatedBackground 
      animationName="particleNetwork"
      theme="cyberpunk"
      interactive={true}
      interactionConfig={{
        effect: 'attract',
        strength: 0.8,
        radius: 150,
        continuous: true
      }}
    />
  );
}
```

### Animation with Controls
```jsx
import { AnimatedBackground, useAnimationControls } from 'animated-backgrounds';

function App() {
  const controls = useAnimationControls();
  
  return (
    <div>
      <AnimatedBackground 
        animationName="starryNight"
        animationControls={controls}
      />
      
      <div className="controls">
        <button onClick={controls.play}>Play</button>
        <button onClick={controls.pause}>Pause</button>
        <button onClick={() => controls.setSpeed(2.0)}>2x Speed</button>
      </div>
    </div>
  );
}
```

### Performance Monitoring
```jsx
import { AnimatedBackground, usePerformanceMonitor } from 'animated-backgrounds';

function App() {
  const performance = usePerformanceMonitor();
  
  return (
    <div>
      <AnimatedBackground 
        animationName="matrixRain"
        enablePerformanceMonitoring={true}
        adaptivePerformance={true}
      />
      
      <div className="performance-info">
        FPS: {performance.fps} | Level: {performance.performanceLevel}
      </div>
    </div>
  );
}
```

### Layered Background
```jsx
import { LayeredBackground } from 'animated-backgrounds';

function App() {
  const layers = [
    { animation: 'starryNight', opacity: 0.8, blendMode: 'normal', speed: 0.5 },
    { animation: 'cosmicDust', opacity: 0.6, blendMode: 'screen', speed: 1.0 },
    { animation: 'auroraBorealis', opacity: 0.4, blendMode: 'overlay', speed: 1.5 }
  ];
  
  return (
    <LayeredBackground layers={layers} />
  );
}
```

## 🎨 Available Animations

### Core Animations (Battle-tested)
- `particleNetwork` - Interactive particle system with connections
- `starryNight` - Twinkling stars with smooth movement
- `floatingBubbles` - Gentle bubbles with realistic physics
- `gradientWave` - Dynamic flowing gradient waves
- `geometricShapes` - Rotating geometric patterns
- `matrixRain` - Digital rain effect
- `auroraBorealis` - Northern lights simulation

### Nature & Organic
- `fireflies` - Glowing fireflies in the forest
- `oceanWaves` - Realistic ocean wave simulation
- `autumnLeaves` - Falling autumn leaves
- `snowFall` - Gentle snowfall effect

### Sci-Fi & Abstract
- `galaxySpiral` - Spinning galaxy animation
- `electricStorm` - Lightning and electrical effects
- `cosmicDust` - Cosmic particle field
- `quantumField` - Quantum physics visualization
- `neonPulse` - Pulsing neon lights
- `dnaHelix` - DNA double helix rotation

## 🎨 Theme System

### Predefined Themes
```jsx
<AnimatedBackground 
  animationName="particleNetwork"
  theme="cyberpunk" // gaming, portfolio, landing, presentation, wellness, party, cyberpunk, retro
/>
```

### Available Themes
- **`gaming`** - High-contrast gaming aesthetic
- **`portfolio`** - Professional and clean
- **`landing`** - Modern landing page style
- **`presentation`** - Business presentation ready
- **`wellness`** - Calm and soothing colors
- **`party`** - Vibrant and energetic
- **`cyberpunk`** - Neon and futuristic
- **`retro`** - Nostalgic color schemes

## 🎮 Interactive Features

### Interaction Effects
```jsx
const interactionConfig = {
  effect: 'attract',     // 'attract' | 'repel' | 'follow' | 'burst' | 'gravity' | 'magnetic' | 'vortex' | 'wave'
  strength: 0.8,         // 0.1 to 2.0
  radius: 150,           // pixels
  continuous: true,      // continue effect after mouse leaves
  multiTouch: true       // enable multi-touch for mobile
};

<AnimatedBackground 
  interactive={true}
  interactionConfig={interactionConfig}
/>
```

### Interaction Types
- **`attract`** - Particles are drawn toward cursor
- **`repel`** - Particles push away from cursor
- **`follow`** - Particles trail behind cursor movement
- **`burst`** - Explosive effect on interaction
- **`gravity`** - Realistic gravitational pull
- **`magnetic`** - Magnetic field interaction
- **`vortex`** - Spinning vortex effect
- **`wave`** - Ripple wave propagation

## ⚡ Performance Features

### Animation Controls
```jsx
import { useAnimationControls } from 'animated-backgrounds';

const controls = useAnimationControls();

// Available methods:
controls.play();           // Start animation
controls.pause();          // Pause animation
controls.reset();          // Reset to initial state
controls.toggle();         // Toggle play/pause
controls.setSpeed(1.5);    // Set speed (0.1x to 5.0x)

// Available properties:
controls.isPlaying;        // Current play state
controls.speed;            // Current speed multiplier
```

### Performance Monitoring
```jsx
import { usePerformanceMonitor } from 'animated-backgrounds';

const performance = usePerformanceMonitor();

// Available metrics:
performance.fps;                    // Current FPS
performance.avgFps;                 // Average FPS
performance.performanceLevel;       // 'excellent' | 'good' | 'fair' | 'poor'
performance.memoryUsage;           // Memory usage info
performance.frameTime;             // Frame render time
```

## 🏗️ Layered Backgrounds

Create complex visual compositions by layering multiple animations:

```jsx
import { LayeredBackground } from 'animated-backgrounds';

const cosmicScene = [
  { 
    animation: 'starryNight', 
    opacity: 0.8, 
    blendMode: 'normal',
    speed: 0.3 
  },
  { 
    animation: 'cosmicDust', 
    opacity: 0.6, 
    blendMode: 'screen',
    speed: 0.8 
  },
  { 
    animation: 'auroraBorealis', 
    opacity: 0.4, 
    blendMode: 'overlay',
    speed: 1.2 
  }
];

<LayeredBackground layers={cosmicScene} />
```

### Blend Modes
`normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`

## 🔧 API Reference

### AnimatedBackground Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationName` | `string` | `'geometricShapes'` | Name of the animation |
| `theme` | `string` | `undefined` | Theme name for colors |
| `interactive` | `boolean` | `false` | Enable mouse/touch interactions |
| `interactionConfig` | `object` | `{}` | Interaction configuration |
| `animationControls` | `object` | `undefined` | External animation controls |
| `enablePerformanceMonitoring` | `boolean` | `false` | Enable performance tracking |
| `adaptivePerformance` | `boolean` | `false` | Auto-optimize performance |
| `fps` | `number` | `60` | Target frames per second |
| `blendMode` | `string` | `'normal'` | Canvas blend mode |
| `style` | `object` | `{}` | Custom CSS styles |

### InteractionConfig Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `effect` | `string` | `'attract'` | Interaction effect type |
| `strength` | `number` | `0.5` | Effect strength (0.1-2.0) |
| `radius` | `number` | `100` | Interaction radius in pixels |
| `continuous` | `boolean` | `true` | Continue after mouse leaves |
| `multiTouch` | `boolean` | `false` | Enable multi-touch support |

## 🎯 Real-world Examples

### Gaming Website Header
```jsx
<AnimatedBackground 
  animationName="electricStorm"
  theme="gaming"
  interactive={true}
  interactionConfig={{
    effect: 'burst',
    strength: 1.2,
    radius: 200
  }}
  adaptivePerformance={true}
/>
```

### Professional Portfolio
```jsx
<AnimatedBackground 
  animationName="geometricShapes"
  theme="portfolio"
  fps={30}
  style={{ opacity: 0.6 }}
/>
```

### Mobile-Optimized
```jsx
<AnimatedBackground 
  animationName="floatingBubbles"
  theme="wellness"
  interactive={true}
  interactionConfig={{
    effect: 'follow',
    strength: 0.6,
    multiTouch: true
  }}
  adaptivePerformance={true}
  fps={30}
/>
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Mouse Interactions Not Working
**Problem**: Particles don't respond to mouse movement
**Solution**: Ensure `interactive={true}` and check that the canvas doesn't have `pointer-events: none`

```jsx
// Correct usage
<AnimatedBackground 
  interactive={true}
  style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled
/>
```

#### 2. Performance Issues
**Problem**: Low FPS or choppy animations
**Solutions**:
- Enable adaptive performance: `adaptivePerformance={true}`
- Reduce FPS: `fps={30}`
- Use simpler animations for mobile devices

#### 3. Theme Colors Not Applying
**Problem**: Theme doesn't change animation colors
**Solution**: Ensure the animation supports themes (check documentation)

```jsx
// Some animations support themes better than others
<AnimatedBackground 
  animationName="particleNetwork" // Good theme support
  theme="cyberpunk"
/>
```

### Performance Optimization

1. **Mobile Devices**: Use `fps={30}` and `adaptivePerformance={true}`
2. **Low-end Hardware**: Stick to basic animations like `starryNight` or `geometricShapes`
3. **Background Usage**: Consider using `style={{ opacity: 0.6 }}` for better text readability

## 📚 Documentation

- [Live Demo](https://qr-generator-murex.vercel.app/) - Interactive examples
- [API Documentation](https://umerfarok.github.io/animated-backgrounds/) - Complete API reference
- [GitHub Repository](https://github.com/umerfarok/animated-backgrounds) - Source code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔧 Technical Support

- **Node.js**: 16.x or higher
- **React**: 16.8 or higher (hooks support required)
- **Browsers**: Modern browsers with Canvas support
- **TypeScript**: Full TypeScript definitions included

---

**Made with ❤️ by [Umer Farooq](https://github.com/umerfarok)**

```bash
npm install animated-backgrounds
```
