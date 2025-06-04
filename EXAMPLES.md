# 🎨 Examples & Use Cases

This document provides comprehensive examples of how to use animated-backgrounds v2.0 in various scenarios and applications.

## 📚 Table of Contents

- [Basic Examples](#basic-examples)
- [Theme Examples](#theme-examples)
- [Interactive Examples](#interactive-examples)
- [Performance Examples](#performance-examples)
- [Layered Examples](#layered-examples)
- [Control Examples](#control-examples)
- [Mobile Examples](#mobile-examples)
- [Integration Examples](#integration-examples)

---

## 🎯 Basic Examples

### Simple Background
```jsx
import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function SimpleExample() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground animationName="starryNight" />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Welcome to My App</h1>
        <p>Content appears above the animated background</p>
      </div>
    </div>
  );
}
```

### Multiple Animations Toggle
```jsx
import React, { useState } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

const animations = [
  'starryNight', 'oceanWaves', 'particleNetwork', 
  'matrixRain', 'geometricShapes', 'floatingBubbles'
];

function AnimationToggle() {
  const [currentAnimation, setCurrentAnimation] = useState(0);

  const nextAnimation = () => {
    setCurrentAnimation((prev) => (prev + 1) % animations.length);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        key={currentAnimation} // Force remount for demonstration
        animationName={animations[currentAnimation]}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Animation: {animations[currentAnimation]}</h1>
        <button onClick={nextAnimation}>Next Animation</button>
      </div>
    </div>
  );
}
```

---

## 🎨 Theme Examples

### Theme Showcase
```jsx
import React, { useState } from 'react';
import { AnimatedBackground, THEMES } from 'animated-backgrounds';

function ThemeShowcase() {
  const [theme, setTheme] = useState('gaming');
  const [animation, setAnimation] = useState('particleNetwork');

  const themeNames = Object.keys(THEMES);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName={animation}
        theme={theme}
      />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        margin: '2rem'
      }}>
        <h1>Theme: {THEMES[theme].name}</h1>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Theme: </label>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
          >
            {themeNames.map(themeName => (
              <option key={themeName} value={themeName}>
                {THEMES[themeName].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Animation: </label>
          <select 
            value={animation} 
            onChange={(e) => setAnimation(e.target.value)}
            style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
          >
            <option value="particleNetwork">Particle Network</option>
            <option value="starryNight">Starry Night</option>
            <option value="matrixRain">Matrix Rain</option>
            <option value="oceanWaves">Ocean Waves</option>
            <option value="geometricShapes">Geometric Shapes</option>
          </select>
        </div>
      </div>
    </div>
  );
}
```

### Business Website Example
```jsx
import { AnimatedBackground } from 'animated-backgrounds';

function BusinessWebsite() {
  return (
    <div className="business-container">
      <AnimatedBackground 
        animationName="geometricShapes"
        theme="portfolio"
        adaptivePerformance={true}
      />
      
      <header className="hero-section">
        <h1>Professional Services</h1>
        <p>Clean, modern design with subtle animation</p>
      </header>
      
      <main className="content">
        <section className="services">
          <h2>Our Services</h2>
          {/* Service content */}
        </section>
      </main>
    </div>
  );
}
```

---

## 🎮 Interactive Examples

### Mouse Attraction Effect
```jsx
import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function MouseAttraction() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName="particleNetwork"
        theme="gaming"
        interactive={true}
        interactionConfig={{
          effect: 'attract',
          strength: 1.2,
          radius: 200,
          continuous: true
        }}
      />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1>Move your mouse around!</h1>
        <p>Particles will be attracted to your cursor</p>
      </div>
    </div>
  );
}
```

### Multi-Effect Interactive
```jsx
import React, { useState } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function MultiEffectInteractive() {
  const [effect, setEffect] = useState('attract');
  const [strength, setStrength] = useState(0.8);

  const effects = [
    { value: 'attract', label: '🧲 Attract' },
    { value: 'repel', label: '💨 Repel' },
    { value: 'follow', label: '🎯 Follow' },
    { value: 'burst', label: '💥 Burst' },
    { value: 'gravity', label: '🌍 Gravity' }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName="particleNetwork"
        interactive={true}
        interactionConfig={{
          effect,
          strength,
          radius: 150,
          continuous: effect !== 'burst'
        }}
      />
      
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px',
        zIndex: 1000,
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h3>Interaction Controls</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Effect: </label>
          <select 
            value={effect} 
            onChange={(e) => setEffect(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            {effects.map(eff => (
              <option key={eff.value} value={eff.value}>
                {eff.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Strength: {strength}</label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1"
            value={strength}
            onChange={(e) => setStrength(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Performance Examples

### Performance Monitoring Dashboard
```jsx
import React from 'react';
import { AnimatedBackground, usePerformanceMonitor } from 'animated-backgrounds';

function PerformanceDashboard() {
  const performance = usePerformanceMonitor({
    sampleSize: 60,
    warningThreshold: 30,
    autoOptimize: true
  });

  const getPerformanceColor = (level) => {
    switch (level) {
      case 'excellent': return '#4ade80';
      case 'good': return '#facc15';
      case 'fair': return '#fb923c';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName="electricStorm"
        theme="cyberpunk"
        enablePerformanceMonitoring={true}
        adaptivePerformance={true}
      />
      
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px',
        zIndex: 1000,
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace'
      }}>
        <h3>Performance Monitor</h3>
        
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div>FPS: <span style={{ color: getPerformanceColor(performance.performanceLevel) }}>
            {performance.fps}
          </span></div>
          
          <div>Avg FPS: <span style={{ color: getPerformanceColor(performance.performanceLevel) }}>
            {performance.avgFps}
          </span></div>
          
          <div>Level: <span style={{ color: getPerformanceColor(performance.performanceLevel) }}>
            {performance.performanceLevel}
          </span></div>
          
          <div>Memory: {performance.memoryUsage}MB</div>
          
          {performance.warnings.length > 0 && (
            <div style={{ marginTop: '0.5rem', color: '#ef4444' }}>
              <strong>Warnings:</strong>
              {performance.warnings.map((warning, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem' }}>
                  • {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Adaptive Performance Example
```jsx
import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function AdaptivePerformanceExample() {
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    setDeviceInfo({
      cores: navigator.hardwareConcurrency || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      connection: navigator.connection?.effectiveType || 'unknown'
    });
  }, []);

  // Choose animation based on device capabilities
  const getOptimalAnimation = () => {
    if (deviceInfo.isMobile || deviceInfo.cores < 4) {
      return 'geometricShapes'; // Lightweight
    } else if (deviceInfo.cores >= 8) {
      return 'electricStorm'; // High-performance
    } else {
      return 'particleNetwork'; // Medium complexity
    }
  };

  const getOptimalFPS = () => {
    if (deviceInfo.isMobile) return 30;
    if (deviceInfo.cores >= 8) return 60;
    return 45;
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName={getOptimalAnimation()}
        theme="presentation"
        adaptivePerformance={true}
        fps={getOptimalFPS()}
        enablePerformanceMonitoring={true}
      />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        backgroundColor: 'rgba(255,255,255,0.9)',
        margin: '2rem',
        borderRadius: '8px'
      }}>
        <h1>Adaptive Performance</h1>
        <p>Animation automatically adjusts based on your device:</p>
        
        <ul>
          <li>CPU Cores: {deviceInfo.cores}</li>
          <li>Memory: {deviceInfo.memory} GB</li>
          <li>Mobile: {deviceInfo.isMobile ? 'Yes' : 'No'}</li>
          <li>Connection: {deviceInfo.connection}</li>
          <li>Selected Animation: {getOptimalAnimation()}</li>
          <li>Target FPS: {getOptimalFPS()}</li>
        </ul>
      </div>
    </div>
  );
}
```

---

## 🏗️ Layered Examples

### Complex Composition
```jsx
import React from 'react';
import { LayeredBackground } from 'animated-backgrounds';

function ComplexComposition() {
  const layers = [
    { 
      animation: 'starryNight', 
      opacity: 1.0, 
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
      animation: 'particleNetwork', 
      opacity: 0.4, 
      blendMode: 'overlay',
      speed: 1.2 
    }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <LayeredBackground layers={layers} />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1>Layered Space Scene</h1>
        <p>Three animations blended together</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Base: Starry Night (normal blend)</li>
          <li>Mid: Cosmic Dust (screen blend)</li>
          <li>Top: Particle Network (overlay blend)</li>
        </ul>
      </div>
    </div>
  );
}
```

### Dynamic Layering
```jsx
import React, { useState } from 'react';
import { LayeredBackground } from 'animated-backgrounds';

function DynamicLayering() {
  const [layerCount, setLayerCount] = useState(2);
  const [blendMode, setBlendMode] = useState('screen');

  const availableAnimations = [
    'starryNight', 'cosmicDust', 'particleNetwork', 
    'oceanWaves', 'auroraBorealis'
  ];

  const generateLayers = () => {
    return Array.from({ length: layerCount }, (_, index) => ({
      animation: availableAnimations[index % availableAnimations.length],
      opacity: 1 - (index * 0.2),
      blendMode: index === 0 ? 'normal' : blendMode,
      speed: 0.5 + (index * 0.3)
    }));
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <LayeredBackground layers={generateLayers()} />
      
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px',
        zIndex: 1000,
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h3>Layer Controls</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Layer Count: {layerCount}</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={layerCount}
            onChange={(e) => setLayerCount(parseInt(e.target.value))}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
        </div>
        
        <div>
          <label>Blend Mode: </label>
          <select 
            value={blendMode} 
            onChange={(e) => setBlendMode(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="multiply">Multiply</option>
            <option value="soft-light">Soft Light</option>
            <option value="hard-light">Hard Light</option>
          </select>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎛️ Control Examples

### Full Animation Controller
```jsx
import React, { useState } from 'react';
import { AnimatedBackground, useAnimationControls } from 'animated-backgrounds';

function AnimationController() {
  const controls = useAnimationControls({
    initialSpeed: 1,
    autoPlay: true
  });

  const [animation, setAnimation] = useState('galaxySpiral');

  const animations = [
    'starryNight', 'particleNetwork', 'matrixRain', 
    'oceanWaves', 'electricStorm', 'galaxySpiral'
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName={animation}
        theme="cyberpunk"
        animationControls={controls}
      />
      
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderRadius: '12px',
        color: 'white',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={controls.play}
          disabled={controls.isPlaying}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            backgroundColor: controls.isPlaying ? '#666' : '#4ade80',
            color: 'white',
            border: 'none',
            cursor: controls.isPlaying ? 'not-allowed' : 'pointer'
          }}
        >
          ▶️ Play
        </button>
        
        <button 
          onClick={controls.pause}
          disabled={!controls.isPlaying}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            backgroundColor: !controls.isPlaying ? '#666' : '#ef4444',
            color: 'white',
            border: 'none',
            cursor: !controls.isPlaying ? 'not-allowed' : 'pointer'
          }}
        >
          ⏸️ Pause
        </button>
        
        <button 
          onClick={controls.reset}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label>Speed: {controls.speed.toFixed(1)}x</label>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1"
            value={controls.speed}
            onChange={(e) => controls.setSpeed(parseFloat(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>
        
        <select 
          value={animation} 
          onChange={(e) => setAnimation(e.target.value)}
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px',
            backgroundColor: '#374151',
            color: 'white',
            border: '1px solid #6b7280'
          }}
        >
          {animations.map(anim => (
            <option key={anim} value={anim}>
              {anim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

---

## 📱 Mobile Examples

### Touch-Optimized Example
```jsx
import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

function TouchOptimizedExample() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground 
        animationName={isMobile ? "floatingBubbles" : "particleNetwork"}
        theme="wellness"
        interactive={true}
        interactionConfig={{
          effect: 'follow',
          strength: isMobile ? 0.6 : 0.8,
          radius: isMobile ? 80 : 120,
          multiTouch: true
        }}
        adaptivePerformance={true}
        fps={isMobile ? 30 : 60}
      />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        textAlign: 'center',
        color: '#333'
      }}>
        <h1>Touch Interactive Background</h1>
        <p>
          {isMobile 
            ? "Touch and drag to interact with bubbles!"
            : "Move your mouse to see particles follow!"
          }
        </p>
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: '8px'
        }}>
          <p>Device: {isMobile ? '📱 Mobile' : '🖥️ Desktop'}</p>
          <p>Animation: {isMobile ? 'Floating Bubbles' : 'Particle Network'}</p>
          <p>FPS: {isMobile ? '30' : '60'}</p>
          <p>Multi-touch: {isMobile ? 'Enabled' : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔗 Integration Examples

### Next.js Integration
```jsx
// pages/index.js
"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import to avoid SSR issues
const AnimatedBackground = dynamic(
  () => import('animated-backgrounds').then(mod => ({ default: mod.AnimatedBackground })),
  { ssr: false }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground 
        animationName="starryNight"
        theme="portfolio"
        adaptivePerformance={true}
      />
      
      <main className="relative z-10 p-8">
        <h1 className="text-4xl font-bold">Next.js + Animated Backgrounds</h1>
        <p>Seamless integration with SSR support</p>
      </main>
    </div>
  );
}
```

### React Router Integration
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatedBackground } from 'animated-backgrounds';

// Different themes for different pages
const pageThemes = {
  '/': 'landing',
  '/about': 'portfolio',
  '/services': 'presentation',
  '/contact': 'wellness'
};

function App() {
  const location = useLocation();
  const currentTheme = pageThemes[location.pathname] || 'portfolio';

  return (
    <div className="app">
      <AnimatedBackground 
        animationName="gradientWave"
        theme={currentTheme}
        adaptivePerformance={true}
      />
      
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
}
```

### Styled Components Integration
```jsx
import styled from 'styled-components';
import { AnimatedBackground } from 'animated-backgrounds';

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StyledBackground = styled(AnimatedBackground)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

function StyledExample() {
  return (
    <Container>
      <StyledBackground 
        animationName="auroraBorealis"
        theme="wellness"
        adaptivePerformance={true}
      />
      <Content>
        <h1>Styled Components Integration</h1>
        <p>Perfect harmony with styled-components</p>
      </Content>
    </Container>
  );
}
```

---

## 🚀 Advanced Patterns

### Context-Based Theme Switching
```jsx
import React, { createContext, useContext, useState } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('portfolio');
  
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemedApp() {
  const { currentTheme, setCurrentTheme } = useTheme();
  
  return (
    <div>
      <AnimatedBackground 
        animationName="particleNetwork"
        theme={currentTheme}
        adaptivePerformance={true}
      />
      <ThemeSelector />
    </div>
  );
}
```

### Performance-Based Animation Selection
```jsx
import { useState, useEffect } from 'react';
import { AnimatedBackground, usePerformanceMonitor } from 'animated-backgrounds';

function PerformanceAdaptiveBackground() {
  const [animationLevel, setAnimationLevel] = useState('medium');
  const performance = usePerformanceMonitor();

  useEffect(() => {
    if (performance.performanceLevel === 'poor') {
      setAnimationLevel('low');
    } else if (performance.performanceLevel === 'excellent') {
      setAnimationLevel('high');
    } else {
      setAnimationLevel('medium');
    }
  }, [performance.performanceLevel]);

  const getAnimationForLevel = (level) => {
    switch (level) {
      case 'low': return 'geometricShapes';
      case 'medium': return 'floatingBubbles';
      case 'high': return 'electricStorm';
      default: return 'starryNight';
    }
  };

  return (
    <AnimatedBackground 
      animationName={getAnimationForLevel(animationLevel)}
      theme="presentation"
      enablePerformanceMonitoring={true}
      adaptivePerformance={true}
    />
  );
}
```

---

These examples showcase the flexibility and power of animated-backgrounds v2.0. Mix and match these patterns to create unique experiences for your applications!

For more examples, check out our [live demo](https://qr-generator-murex.vercel.app/) and explore the [API documentation](https://umerfarok.github.io/animated-backgrounds/).

Happy coding! 🚀 