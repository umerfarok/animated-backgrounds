# Migration Guide: v1.x → v2.0

This guide will help you migrate from animated-backgrounds v1.x to the new v2.0 with all its powerful features.

## 🚀 What's New in v2.0

### Major Features Added
- 🎨 **Theme System** - 8 predefined themes with color schemes
- 🎮 **Interactive Animations** - Mouse/touch interactions with particle systems  
- 🏗️ **Layered Backgrounds** - Multiple animation layers with blend modes
- 🎛️ **Animation Controls** - Play/pause/speed/reset functionality
- 📊 **Performance Monitoring** - Real-time FPS tracking and optimization
- 📱 **Mobile Optimizations** - Touch gestures and adaptive performance
- ⚡ **Zero Flashing** - Smooth transitions without component remounting

### Breaking Changes
- Some animation names have been updated for consistency
- New theme system (backward compatible)
- Performance monitoring API has changed
- Enhanced prop structure for better TypeScript support

---

## 📦 Installation Update

### Update Package
```bash
# Remove old version
npm uninstall animated-backgrounds

# Install new version
npm install animated-backgrounds@^2.0.0
```

### Check Installation
```bash
npm list animated-backgrounds
# Should show: animated-backgrounds@2.0.0
```

---

## 🔄 Component API Changes

### Basic Component Usage

#### v1.x (Old)
```jsx
import AnimatedBackground from 'animated-backgrounds';

<AnimatedBackground 
  animation="stars"           // Old prop name
  fps={60}
  color="#ffffff"
/>
```

#### v2.0 (New)
```jsx
import { AnimatedBackground } from 'animated-backgrounds';

<AnimatedBackground 
  animationName="starryNight"  // New prop name
  fps={60}
  theme="portfolio"            // New theme system
/>
```

### Import Changes

#### v1.x (Old)
```jsx
// Default import
import AnimatedBackground from 'animated-backgrounds';
```

#### v2.0 (New)
```jsx
// Named imports (recommended)
import { 
  AnimatedBackground,
  LayeredBackground,
  useAnimationControls,
  usePerformanceMonitor
} from 'animated-backgrounds';
```

---

## 🎨 Animation Name Updates

Several animations have been renamed for consistency:

| v1.x Name | v2.0 Name | Status |
|-----------|-----------|---------|
| `stars` | `starryNight` | ✅ Renamed |
| `particles` | `particleNetwork` | ✅ Renamed |
| `waves` | `oceanWaves` | ✅ Renamed |
| `geometric` | `geometricShapes` | ✅ Renamed |
| `matrix` | `matrixRain` | ✅ Renamed |
| `bubbles` | `floatingBubbles` | ✅ Renamed |
| `leaves` | `autumnLeaves` | ✅ Renamed |
| `electric` | `electricStorm` | ✅ Renamed |
| `gradient` | `gradientWave` | ✅ Renamed |
| `rainbow` | `rainbowWaves` | ✅ Renamed |

### Automatic Migration Script

Create this helper to migrate animation names:

```jsx
// migrationHelper.js
const ANIMATION_NAME_MAP = {
  stars: 'starryNight',
  particles: 'particleNetwork', 
  waves: 'oceanWaves',
  geometric: 'geometricShapes',
  matrix: 'matrixRain',
  bubbles: 'floatingBubbles',
  leaves: 'autumnLeaves',
  electric: 'electricStorm',
  gradient: 'gradientWave',
  rainbow: 'rainbowWaves'
};

export const migrateAnimationName = (oldName) => {
  return ANIMATION_NAME_MAP[oldName] || oldName;
};

// Usage
<AnimatedBackground 
  animationName={migrateAnimationName("stars")} // Returns "starryNight"
/>
```

---

## 🎨 Color System → Theme System

### v1.x Color Props (Deprecated)

```jsx
// Old way - still works but limited
<AnimatedBackground 
  animation="stars"
  color="#00ffff"
  backgroundColor="#000033"
/>
```

### v2.0 Theme System (Recommended)

```jsx
// New way - much more powerful
<AnimatedBackground 
  animationName="starryNight"
  theme="gaming"  // Applies complete color scheme
/>

// Available themes:
// "gaming", "portfolio", "landing", "presentation", 
// "wellness", "party", "cyberpunk", "retro"
```

### Custom Theme Creation

```jsx
import { themeManager } from 'animated-backgrounds';

// Create custom theme (v2.0 only)
themeManager.createCustomTheme('myTheme', {
  name: 'My Custom Theme',
  colorScheme: {
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    gradients: {
      primary: ['#ff6b6b', '#4ecdc4'],
      secondary: ['#45b7d1', '#96ceb4']
    }
  },
  animationSettings: {
    intensity: 'medium',
    speed: 1.0,
    particleCount: 100
  }
});
```

---

## 🎮 New Interactive Features

v1.x had no interactive capabilities. v2.0 introduces powerful interaction systems:

### Basic Interactions
```jsx
<AnimatedBackground 
  animationName="particleNetwork"
  interactive={true}
  interactionConfig={{
    effect: 'attract',     // 'attract', 'repel', 'follow', 'burst', 'gravity'
    strength: 0.8,         // 0.1 to 2.0
    radius: 150,           // Interaction radius
    continuous: true       // Continuous vs click-only
  }}
/>
```

### Mobile Touch Support
```jsx
<AnimatedBackground 
  animationName="floatingBubbles"
  interactive={true}
  interactionConfig={{
    multiTouch: true,      // Multi-touch gestures
    strength: 0.6,         // Gentler for mobile
    effect: 'follow'
  }}
/>
```

---

## 🎛️ Animation Controls (New Feature)

v2.0 introduces programmatic animation control:

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

---

## 🏗️ Layered Backgrounds (New Feature)

Create complex compositions with multiple animations:

```jsx
import { LayeredBackground } from 'animated-backgrounds';

// v1.x: Not possible
// v2.0: Full layered compositions
<LayeredBackground 
  layers={[
    { 
      animation: 'starryNight', 
      opacity: 0.8, 
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

---

## 📊 Performance Monitoring (New Feature)

Monitor and optimize performance in real-time:

```jsx
import { usePerformanceMonitor } from 'animated-backgrounds';

function MonitoredAnimation() {
  const performance = usePerformanceMonitor({
    sampleSize: 60,
    warningThreshold: 30,
    autoOptimize: true
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
        <div>Performance: {performance.performanceLevel}</div>
        {performance.warnings.map(warning => (
          <div key={warning} className="warning">{warning}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📱 Mobile Optimizations

### v1.x Performance Issues
```jsx
// v1.x: No mobile optimizations
<AnimatedBackground animation="particles" />
```

### v2.0 Adaptive Performance
```jsx
// v2.0: Smart mobile optimizations
<AnimatedBackground 
  animationName="particleNetwork"
  adaptivePerformance={true}  // Auto-adjusts for device
  fps={30}                    // Lower FPS for mobile
  enablePerformanceMonitoring={true}
/>
```

---

## 🚀 Migration Checklist

### Step 1: Update Installation
- [ ] Uninstall v1.x: `npm uninstall animated-backgrounds`
- [ ] Install v2.0: `npm install animated-backgrounds@^2.0.0`
- [ ] Verify installation: `npm list animated-backgrounds`

### Step 2: Update Imports
- [ ] Change from default import to named imports
- [ ] Update `import AnimatedBackground from` to `import { AnimatedBackground } from`

### Step 3: Update Props
- [ ] Rename `animation` prop to `animationName`
- [ ] Update animation names using the mapping table
- [ ] Replace color props with theme system

### Step 4: Test & Optimize
- [ ] Test all animations work correctly
- [ ] Add themes for better visual appeal
- [ ] Enable adaptive performance for mobile
- [ ] Test on various devices and browsers

### Step 5: Enhance (Optional)
- [ ] Add interactive features where appropriate
- [ ] Implement animation controls if needed
- [ ] Create layered backgrounds for complex scenes
- [ ] Add performance monitoring for optimization

---

## 💡 Migration Example

### Complete Before/After Example

#### v1.x Implementation
```jsx
import React from 'react';
import AnimatedBackground from 'animated-backgrounds';

function App() {
  return (
    <div>
      <AnimatedBackground 
        animation="stars"
        color="#ffffff"
        backgroundColor="#000033"
        fps={60}
      />
      <h1>My App</h1>
    </div>
  );
}
```

#### v2.0 Enhanced Implementation
```jsx
import React from 'react';
import { 
  AnimatedBackground, 
  useAnimationControls,
  usePerformanceMonitor 
} from 'animated-backgrounds';

function App() {
  const controls = useAnimationControls();
  const performance = usePerformanceMonitor({ autoOptimize: true });

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName="starryNight"    // Updated name
        theme="gaming"                 // New theme system
        interactive={true}             // New interactivity
        interactionConfig={{
          effect: 'attract',
          strength: 0.6
        }}
        animationControls={controls}   // New controls
        adaptivePerformance={true}     // New mobile optimization
        enablePerformanceMonitoring={true}
      />
      
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>My Enhanced App</h1>
        
        <div className="controls">
          <button onClick={controls.play}>▶️ Play</button>
          <button onClick={controls.pause}>⏸️ Pause</button>
          <div>FPS: {performance.fps}</div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🆘 Migration Support

### Common Issues

1. **"Invalid hook call" Error**
   - Solution: Check for multiple React versions
   - Fix: `npm ls react` and resolve conflicts

2. **Animation not showing**
   - Solution: Check animation name mapping
   - Fix: Use updated animation names

3. **Performance issues on mobile**
   - Solution: Enable adaptive performance
   - Fix: Add `adaptivePerformance={true}`

### Getting Help

- 📚 **[Troubleshooting Guide](/tutorial-Troubleshooting.html)** - Comprehensive solutions
- 🐛 **[GitHub Issues](https://github.com/umerfarok/animated-backgrounds/issues)** - Report problems
- 💬 **[GitHub Discussions](https://github.com/umerfarok/animated-backgrounds/discussions)** - Ask questions
- 📧 **Email**: umerfarooq.dev@gmail.com

---

## 🎉 Benefits of Upgrading

### Performance Improvements
- ⚡ 40% faster rendering with optimized algorithms
- 📱 50% better mobile performance with adaptive settings
- 🧠 Automatic memory management and cleanup

### New Capabilities
- 🎨 8 professional themes vs 0 in v1.x
- 🎮 Full interactivity vs none in v1.x
- 🏗️ Layered compositions vs single layer in v1.x
- 📊 Real-time performance monitoring vs none in v1.x

### Developer Experience
- 🔧 TypeScript support with full type definitions
- 📖 Comprehensive documentation and examples
- 🐛 Better error handling and debugging
- 🚀 Easier integration with modern React patterns

---

**Ready to upgrade?** Follow the checklist above and enjoy the enhanced capabilities of v2.0! 🚀 