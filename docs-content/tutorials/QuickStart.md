# Quick Start Guide

Welcome to Animated Backgrounds v2.0! This guide will get you up and running in minutes with stunning animated backgrounds for your React applications.

## 📦 Installation

### Using npm
```bash
npm install animated-backgrounds
```

### Using yarn
```bash
yarn add animated-backgrounds
```

### Using pnpm
```bash
pnpm add animated-backgrounds
```

## 🎯 Basic Setup

### 1. Simple Background
The quickest way to add an animated background:

```jsx
import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName="starryNight"
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Welcome to My App</h1>
        <p>Your content appears above the animated background!</p>
      </div>
    </div>
  );
}

export default App;
```

### 2. With Themes
Add predefined themes for instant visual appeal:

```jsx
import { AnimatedBackground } from 'animated-backgrounds';

// Gaming theme with cyberpunk colors
<AnimatedBackground 
  animationName="matrixRain"
  theme="gaming"
/>

// Professional theme for business sites
<AnimatedBackground 
  animationName="geometricShapes"
  theme="portfolio"
/>

// Calming theme for wellness apps
<AnimatedBackground 
  animationName="oceanWaves"
  theme="wellness"
/>
```

## 🎮 Interactive Backgrounds

Make your backgrounds respond to user interaction:

```jsx
<AnimatedBackground 
  animationName="particleNetwork"
  interactive={true}
  interactionConfig={{
    effect: 'attract',     // Particles move toward cursor
    strength: 0.8,         // Strong effect
    radius: 150            // Wide interaction area
  }}
/>
```

### Interaction Effects Available:
- **attract**: Particles move toward cursor/touch
- **repel**: Particles move away from cursor/touch  
- **follow**: Particles trail behind cursor movement
- **burst**: Explosive effect on click/touch
- **gravity**: Gravitational pull effect

## 🎨 Available Animations

Choose from 19 stunning animations:

### 🌟 Nature & Space
```jsx
<AnimatedBackground animationName="starryNight" />
<AnimatedBackground animationName="oceanWaves" />
<AnimatedBackground animationName="autumnLeaves" />
<AnimatedBackground animationName="auroraBorealis" />
<AnimatedBackground animationName="fireflies" />
<AnimatedBackground animationName="galaxySpiral" />
<AnimatedBackground animationName="cosmicDust" />
```

### 💻 Tech & Cyber
```jsx
<AnimatedBackground animationName="matrixRain" />
<AnimatedBackground animationName="particleNetwork" />
<AnimatedBackground animationName="neuralNetwork" />
<AnimatedBackground animationName="electricStorm" />
<AnimatedBackground animationName="quantumField" />
<AnimatedBackground animationName="neonPulse" />
```

### 🎨 Abstract & Fun
```jsx
<AnimatedBackground animationName="geometricShapes" />
<AnimatedBackground animationName="gradientWave" />
<AnimatedBackground animationName="floatingBubbles" />
<AnimatedBackground animationName="rainbowWaves" />
<AnimatedBackground animationName="dnaHelix" />
<AnimatedBackground animationName="fallingFoodFiesta" />
```

## 🎨 Theme Gallery

### 8 Predefined Themes Available:

| Theme | Colors | Best For | Example |
|-------|--------|----------|---------|
| 🎮 **gaming** | Cyberpunk neon | Gaming sites, tech demos | `theme="gaming"` |
| 💼 **portfolio** | Professional grayscale | Business, resumes | `theme="portfolio"` |
| 🌅 **landing** | Warm sunset tones | Marketing pages | `theme="landing"` |
| 📊 **presentation** | Subtle space colors | Slides, demos | `theme="presentation"` |
| 🌿 **wellness** | Calming nature colors | Health, meditation apps | `theme="wellness"` |
| 🎉 **party** | Vibrant neon colors | Events, entertainment | `theme="party"` |
| 🤖 **cyberpunk** | Classic sci-fi | Futuristic themes | `theme="cyberpunk"` |
| 🕹️ **retro** | Nostalgic vintage | Creative projects | `theme="retro"` |

## 📱 Mobile Optimization

Ensure great performance on mobile devices:

```jsx
<AnimatedBackground 
  animationName="geometricShapes"
  adaptivePerformance={true}  // Auto-optimize for device
  fps={30}                    // Lower FPS for mobile
  interactive={true}
  interactionConfig={{
    multiTouch: true,         // Support multi-touch gestures
    strength: 0.6             // Gentler interactions for mobile
  }}
/>
```

## 🚀 Performance Tips

### 1. Enable Adaptive Performance
```jsx
<AnimatedBackground 
  adaptivePerformance={true}
  enablePerformanceMonitoring={true}
/>
```

### 2. Choose Mobile-Friendly Animations
```jsx
// Good for mobile
const mobileAnimations = [
  'geometricShapes',
  'gradientWave', 
  'floatingBubbles',
  'starryNight'
];

// More intensive (better for desktop)
const desktopAnimations = [
  'particleNetwork',
  'matrixRain',
  'electricStorm',
  'neuralNetwork'
];
```

### 3. Use Performance-Optimized Themes
```jsx
// Most performant themes
<AnimatedBackground theme="portfolio" />    // Grayscale, simple
<AnimatedBackground theme="presentation" /> // Minimal effects
```

## 🏗️ Layered Backgrounds

Create complex compositions by layering multiple animations:

```jsx
import { LayeredBackground } from 'animated-backgrounds';

<LayeredBackground 
  layers={[
    { 
      animation: 'starryNight', 
      opacity: 0.8, 
      blendMode: 'normal' 
    },
    { 
      animation: 'cosmicDust', 
      opacity: 0.4, 
      blendMode: 'screen' 
    }
  ]}
/>
```

## 🎛️ Animation Controls

Take programmatic control of your animations:

```jsx
import { AnimatedBackground, useAnimationControls } from 'animated-backgrounds';

function ControlledAnimation() {
  const controls = useAnimationControls();

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
          max="3" 
          step="0.1"
          value={controls.speed}
          onChange={(e) => controls.setSpeed(e.target.value)}
        />
      </div>
    </div>
  );
}
```

## 💡 Next Steps

Now that you have the basics down, explore more advanced features:

- **[Themes & Colors](/module-ThemeSystem.html)** - Deep dive into the theme system
- **[Interactive Features](/module-InteractionUtils.html)** - Advanced interaction configurations
- **[Performance Monitoring](/module-usePerformanceMonitor.html)** - Optimize your animations
- **[Layered Backgrounds](/module-LayeredBackground.html)** - Create complex compositions
- **[Troubleshooting](/tutorial-Troubleshooting.html)** - Common issues and solutions

## 🎮 Live Examples

See all features in action at our **[Live Demo](https://qr-generator-murex.vercel.app/)**

---

Happy animating! 🚀 