# 🔧 Troubleshooting Guide

## Table of Contents
- [React Hook Errors](#react-hook-errors)
- [Performance Issues](#performance-issues)
- [Animation Issues](#animation-issues)
- [Mobile & Touch Issues](#mobile--touch-issues)
- [Build & Import Issues](#build--import-issues)
- [Theme & Styling Issues](#theme--styling-issues)
- [Getting Help](#getting-help)

---

## React Hook Errors

### ❌ "Invalid hook call" Error

**Error Message:**
```
Error: Invalid hook call. Hooks can only be called inside the body of a function component.
```

**Root Cause:**
Multiple React versions in your project - typically React 17 and React 18 coexisting.

**Solution 1: Check React Versions**
```bash
# Check what versions are installed
npm ls react
npm ls react-dom

# You should see only one version of each
```

**Solution 2: Use Peer Dependencies (Recommended)**
```bash
# Uninstall and reinstall with correct peer deps
npm uninstall animated-backgrounds
npm install animated-backgrounds@^2.0.0
```

**Solution 3: Force Single React Version**
```json
// package.json - Add resolutions/overrides
{
  "overrides": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

**Solution 4: Clear node_modules**
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Hooks can only be called at the top level" Error

**Cause:** Using hooks conditionally or in loops.

**Solution:**
```jsx
// ❌ Wrong
function Component() {
  if (someCondition) {
    const controls = useAnimationControls(); // Error!
  }
}

// ✅ Correct
function Component() {
  const controls = useAnimationControls();
  
  if (someCondition) {
    // Use controls here
  }
}
```

---

## Performance Issues

### 🐌 Low FPS / Stuttering

**Symptoms:**
- Animation feels choppy
- Browser becomes unresponsive
- High CPU usage

**Solutions:**

**1. Enable Adaptive Performance**
```jsx
<AnimatedBackground 
  animationName="particleNetwork"
  adaptivePerformance={true}
  enablePerformanceMonitoring={true}
/>
```

**2. Reduce Animation Complexity**
```jsx
// Use simpler animations on lower-end devices
const animationName = window.navigator.hardwareConcurrency > 4 
  ? "particleNetwork" 
  : "geometricShapes";
```

**3. Lower Target FPS**
```jsx
<AnimatedBackground 
  animationName="matrixRain"
  fps={30} // Instead of 60
/>
```

**4. Use Performance-Optimized Themes**
```jsx
// These themes are optimized for performance
<AnimatedBackground theme="portfolio" />
<AnimatedBackground theme="presentation" />
```

### 📊 Memory Issues

**Symptoms:**
- Memory usage keeps increasing
- Browser tab crashes
- "Out of memory" errors

**Solutions:**

**1. Enable Performance Monitoring**
```jsx
import { usePerformanceMonitor } from 'animated-backgrounds';

function App() {
  const perf = usePerformanceMonitor({
    sampleSize: 60,
    warningThreshold: 30,
    autoOptimize: true
  });

  // Monitor memory usage
  console.log('Memory usage:', perf.memoryUsage);
}
```

**2. Cleanup on Component Unmount**
```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    return () => {
      // Cleanup happens automatically
      console.log('Animation cleaned up');
    };
  }, []);
}
```

---

## Animation Issues

### 🔄 Animation Flashing / Remounting

**Symptoms:**
- Animation briefly disappears and reappears
- Stuttering when changing props
- Animation restarts unexpectedly

**Solutions:**

**1. Use Stable Keys**
```jsx
// ❌ Dynamic keys cause remounting
<AnimatedBackground 
  key={`${animation}-${theme}`} // Changes every render
/>

// ✅ Use stable keys
<AnimatedBackground 
  key="main-bg" // Stays constant
/>
```

**2. Memoize Configuration Objects**
```jsx
import { useMemo } from 'react';

function App() {
  const interactionConfig = useMemo(() => ({
    effect: 'attract',
    strength: 0.8,
    radius: 150
  }), []); // Empty deps array

  return (
    <AnimatedBackground 
      interactionConfig={interactionConfig}
    />
  );
}
```

**3. Avoid Changing Animation Names Frequently**
```jsx
// ❌ Auto-changing causes flashing
const [animation, setAnimation] = useState('starryNight');

useEffect(() => {
  const interval = setInterval(() => {
    setAnimation(getRandomAnimation()); // Causes remounting
  }, 5000);
}, []);

// ✅ Let user control changes
const [animation, setAnimation] = useState('starryNight');
// Only change when user selects
```

### 🎨 Animation Not Loading

**Symptoms:**
- Black screen where animation should be
- Console error about animation not found
- Fallback animation shows instead

**Solutions:**

**1. Check Animation Name**
```jsx
// ❌ Incorrect name
<AnimatedBackground animationName="stars" />

// ✅ Correct name
<AnimatedBackground animationName="starryNight" />
```

**2. Verify Import**
```jsx
// Make sure you're importing from the correct package
import { AnimatedBackground } from 'animated-backgrounds';
```

**3. Use Fallback Animation**
```jsx
<AnimatedBackground 
  animationName="customAnimation"
  fallbackAnimation="geometricShapes" // Safe fallback
/>
```

---

## Mobile & Touch Issues

### 📱 Touch Interactions Not Working

**Symptoms:**
- Touch events don't trigger interactions
- Animation doesn't respond to gestures
- Works on desktop but not mobile

**Solutions:**

**1. Enable Mobile-Specific Settings**
```jsx
<AnimatedBackground 
  interactive={true}
  interactionConfig={{
    effect: 'attract',
    multiTouch: true, // Enable multi-touch
    strength: 0.6     // Lower strength for mobile
  }}
/>
```

**2. Add Touch Event Listeners**
```jsx
// The package handles this automatically, but you can add custom ones
useEffect(() => {
  const canvas = document.querySelector('canvas');
  
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent scrolling
  };
  
  canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });
  
  return () => {
    canvas?.removeEventListener('touchstart', handleTouchStart);
  };
}, []);
```

### 🔋 Battery Drain on Mobile

**Solutions:**

**1. Enable Adaptive Performance**
```jsx
<AnimatedBackground 
  adaptivePerformance={true}
  fps={30} // Lower FPS for mobile
/>
```

**2. Use Mobile-Optimized Animations**
```jsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

<AnimatedBackground 
  animationName={isMobile ? "geometricShapes" : "particleNetwork"}
/>
```

---

## Build & Import Issues

### 📦 Module Not Found Errors

**Error:**
```
Module not found: Can't resolve 'animated-backgrounds'
```

**Solutions:**

**1. Verify Installation**
```bash
npm list animated-backgrounds
# Should show version 2.0.0
```

**2. Clear Cache and Reinstall**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**3. Check Import Syntax**
```jsx
// ✅ Correct imports
import { AnimatedBackground } from 'animated-backgrounds';
import { useAnimationControls } from 'animated-backgrounds';

// ❌ Wrong imports
import AnimatedBackground from 'animated-backgrounds'; // Default import doesn't exist
```

### 🏗️ Build Errors

**Error:**
```
Failed to compile due to module resolution issues
```

**Solutions:**

**1. Add to Next.js Config (if using Next.js)**
```js
// next.config.js
module.exports = {
  transpilePackages: ['animated-backgrounds']
};
```

**2. Use Client-Side Only (Next.js)**
```jsx
"use client"; // Add this at the top

import { AnimatedBackground } from 'animated-backgrounds';
```

**3. Dynamic Import for SSR**
```jsx
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(
  () => import('animated-backgrounds').then(mod => ({ default: mod.AnimatedBackground })),
  { ssr: false }
);
```

---

## Theme & Styling Issues

### 🎨 Theme Not Applying

**Symptoms:**
- Animation uses default colors instead of theme colors
- Theme change doesn't take effect
- Console warnings about theme not found

**Solutions:**

**1. Check Theme Name**
```jsx
// ❌ Wrong theme name
<AnimatedBackground theme="game" />

// ✅ Correct theme name
<AnimatedBackground theme="gaming" />
```

**2. Available Themes List**
```jsx
import { THEMES } from 'animated-backgrounds';

console.log('Available themes:', Object.keys(THEMES));
// Output: ['gaming', 'portfolio', 'landing', 'presentation', 'wellness', 'party', 'cyberpunk', 'retro']
```

**3. Force Theme Update**
```jsx
import { themeManager } from 'animated-backgrounds';

// Manually apply theme
themeManager.applyTheme('gaming');
```

### 🖼️ CSS Conflicts

**Symptoms:**
- Animation appears behind other content
- Styling looks broken
- Z-index issues

**Solutions:**

**1. Add Container Styling**
```css
.animated-background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Behind content */
  pointer-events: none; /* Don't block clicks */
}
```

**2. Wrap in Styled Container**
```jsx
<div style={{
  position: 'relative',
  minHeight: '100vh'
}}>
  <AnimatedBackground />
  <div style={{ position: 'relative', zIndex: 1 }}>
    Your content here
  </div>
</div>
```

---

## Performance Optimization Checklist

### ✅ Before Production Deployment

- [ ] Enable `adaptivePerformance={true}`
- [ ] Set appropriate FPS (30 for mobile, 60 for desktop)
- [ ] Use performance-optimized themes when possible
- [ ] Test on low-end devices
- [ ] Monitor memory usage with performance hooks
- [ ] Avoid auto-changing animations
- [ ] Use stable component keys
- [ ] Memoize configuration objects
- [ ] Test with React StrictMode enabled
- [ ] Verify no console errors or warnings

### 🧪 Testing Checklist

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS and Android devices
- [ ] Test with slow network connections
- [ ] Test with battery saver mode enabled
- [ ] Test touch interactions on mobile
- [ ] Test keyboard navigation
- [ ] Test with screen readers (accessibility)
- [ ] Test performance with multiple animations
- [ ] Test layered backgrounds performance
- [ ] Verify cleanup on component unmount

---

## Getting Help

### 📞 Support Channels

1. **GitHub Issues**: [Report bugs and feature requests](https://github.com/umerfarok/animated-backgrounds/issues)
2. **GitHub Discussions**: [Community Q&A](https://github.com/umerfarok/animated-backgrounds/discussions)
3. **Email Support**: umerfarooq.dev@gmail.com
4. **Documentation**: [Full API docs](https://umerfarok.github.io/animated-backgrounds)

### 🐛 Bug Report Template

When reporting issues, please include:

```markdown
**Environment:**
- Package version: 2.0.0
- React version: 18.3.1
- Browser: Chrome 120
- Device: Desktop/Mobile
- OS: Windows 10

**Expected Behavior:**
What should happen?

**Actual Behavior:**
What actually happens?

**Code Example:**
```jsx
// Minimal reproducible example
<AnimatedBackground 
  animationName="particleNetwork"
  theme="gaming"
/>
```

**Steps to Reproduce:**
1. Install package
2. Add component
3. See error

**Additional Context:**
Console errors, screenshots, etc.
```

### 💡 Feature Request Template

```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why is this feature needed?

**Proposed Solution:**
How should it work?

**Alternative Solutions:**
Other approaches considered

**Additional Context:**
Examples, mockups, etc.
```

---

**Need immediate help?** Join our community discussions or email us directly. We're here to help! 🚀 