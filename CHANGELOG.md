# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-04

### 🐛 Fixed
- **Documentation Logo**: Fixed missing logo in documentation navigation bar - logo now displays correctly
- **Mouse Interactions**: Fixed particle interaction system - particles now properly respond to mouse movement
- **Canvas Pointer Events**: Fixed canvas pointer events to enable interactions when `interactive={true}`
- **Particle Physics**: Improved particle interaction force calculation and velocity management
- **Performance**: Enhanced particle network animation for better responsiveness

### ✨ Enhanced
- **Interaction System**: Better force accumulation and damping for smoother particle interactions
- **Theme Integration**: Improved theme color application across all supported animations
- **Documentation**: Simplified and focused documentation on core working features
- **Error Handling**: Better fallback behavior for interaction and theme systems

### 🎮 Interactive Animations
- **8 Interaction Effects**: attract, repel, follow, burst, gravity, magnetic, vortex, wave
- **Multi-touch Support**: Full mobile gesture support
- **Real-time Physics**: Improved force simulation for particle interactions

### 🎨 Advanced Theme System
- **8 Predefined Themes**: gaming, portfolio, landing, presentation, wellness, party, cyberpunk, retro
- **Dynamic Color Management**: Automatic color scheme application
- **Theme-aware Animations**: Consistent visual styling across animations

### ⚡ Performance & Control Features
- **Animation Controls**: Play/pause/reset with speed control (0.1x-5.0x)
- **Performance Monitoring**: Real-time FPS tracking and optimization
- **Adaptive Performance**: Automatic adjustments based on device capabilities
- **Memory Management**: Improved cleanup and resource management

### 🏗️ Layered Compositions
- **Multiple Animation Layers**: Composite multiple animations
- **Independent Controls**: Per-layer opacity, blend modes, and speed
- **16 Blend Modes**: Full CSS blend mode support for visual effects

### 📚 Core Animations
- **Battle-tested Animations**: particleNetwork, starryNight, floatingBubbles, gradientWave
- **Nature Effects**: fireflies, oceanWaves, autumnLeaves, snowFall
- **Sci-Fi Themes**: galaxySpiral, electricStorm, matrixRain, quantumField
- **Abstract Visuals**: geometricShapes, cosmicDust, neonPulse, auroraBorealis

### 🛠️ Technical Improvements
- **ES Module Support**: Full ES6 module compatibility
- **TypeScript Definitions**: Complete type definitions included
- **React 16.8+ Support**: Modern hooks-based architecture
- **Mobile Optimization**: Touch gestures and responsive design

### 💻 Developer Experience
- **Comprehensive API**: Simple props interface with powerful customization
- **Real-world Examples**: Production-ready code examples
- **Performance Tips**: Optimization guidelines for different use cases
- **Troubleshooting Guide**: Common issues and solutions

### 🚀 Migration from v1.x
- **100% Backward Compatibility**: Existing v1.x code continues to work
- **Optional Upgrades**: New features are opt-in enhancements
- **Progressive Enhancement**: Add new features gradually as needed

## [1.x] - Previous Versions
- Basic animated backgrounds
- Simple animation functions
- Basic React component wrapper

## [1.1.0] - 2023-12-01

### Added
- Additional animation types
- Improved blend mode support
- Better documentation

### Fixed
- Canvas resize issues
- Animation timing improvements

---

## [1.0.0] - 2023-11-15

### Added
- Initial release
- Basic animated background functionality
- Core animation library
- React component integration 