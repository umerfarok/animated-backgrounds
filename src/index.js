import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
    starryNight, floatingBubbles,
    gradientWave, particleNetwork, galaxySpiral,
    rainbowWaves, geometricShapes, fireflies,
    matrixRain, quantumField, electricStorm,
    cosmicDust, neonPulse, auroraBorealis, oceanWaves,
    neuralNetwork,
    dnaHelix, snowFall, realisticRain, autumnLeaves, realisticClouds, fireflyForest, fallingFoodFiesta,
    hauntedForest,
    ghostlyApparitions,
    spiderwebOverlay,
    undeadGraveyard,
    bloodRain,
    creepyCrawlies,
} from './backgroundAnimations';
import AnimatedText from './AnimatedText';
import LayeredBackground from './LayeredBackground';

// Import new features
import { useAnimationControls } from './hooks/useAnimationControls';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { createInteractionHandler, GestureRecognizer } from './utils/interactionUtils';
import { ThemeManager, themeManager, COLOR_SCHEMES, THEMES } from './utils/themeSystem';

/**
 * @fileoverview Animated Backgrounds v2.0 - Main entry point
 * @module AnimatedBackgrounds
 * @version 2.0.0
 */

/**
 * @typedef {Object} InteractionConfig
 * @property {'attract'|'repel'|'follow'|'burst'|'gravity'} [effect='attract'] - Type of interaction effect
 * @property {number} [strength=0.5] - Interaction strength (0.1 to 2.0)
 * @property {number} [radius=100] - Interaction radius in pixels
 * @property {boolean} [continuous=true] - Whether interaction continues after mouse leaves
 * @property {boolean} [multiTouch=false] - Enable multi-touch support for mobile
 * @example
 * // Basic interaction configuration
 * const interactionConfig = {
 *   effect: 'attract',
 *   strength: 0.8,
 *   radius: 150,
 *   continuous: true
 * };
 * 
 * // Mobile-optimized configuration
 * const mobileConfig = {
 *   effect: 'follow',
 *   strength: 0.6,
 *   radius: 100,
 *   multiTouch: true
 * };
 */

/**
 * @typedef {Object} AnimationControls
 * @property {boolean} isPlaying - Whether animation is currently playing
 * @property {number} speed - Current animation speed multiplier
 * @property {Function} play - Start/resume animation
 * @property {Function} pause - Pause animation
 * @property {Function} reset - Reset animation to initial state
 * @property {Function} setSpeed - Set animation speed (0.1x to 5.0x)
 * @property {Function} toggle - Toggle play/pause state
 */

/**
 * Main AnimatedBackground component that renders stunning animated backgrounds
 * with support for themes, interactions, performance monitoring, and controls.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.animationName='geometricShapes'] - Name of the animation to display
 * @param {string} [props.fallbackAnimation='geometricShapes'] - Fallback animation if main animation fails
 * @param {number} [props.fps=60] - Target frames per second
 * @param {string} [props.blendMode='normal'] - Canvas blend mode for visual effects
 * @param {Object} [props.style] - Inline styles for the canvas element
 * @param {boolean} [props.interactive=false] - Enable mouse/touch interactions
 * @param {InteractionConfig} [props.interactionConfig={}] - Configuration for interactions
 * @param {string} [props.theme] - Theme name to apply predefined color schemes
 * @param {string} [props.preset] - Preset configuration name
 * @param {AnimationControls} [props.animationControls] - External animation controls
 * @param {boolean} [props.enablePerformanceMonitoring=false] - Enable real-time performance tracking
 * @param {boolean} [props.adaptivePerformance=false] - Auto-optimize based on device performance
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @returns {JSX.Element} Animated background canvas element
 * 
 * @example
 * // Basic usage
 * <AnimatedBackground animationName="starryNight" />
 * 
 * @example
 * // With theme and interactivity
 * <AnimatedBackground 
 *   animationName="particleNetwork"
 *   theme="gaming"
 *   interactive={true}
 *   interactionConfig={{
 *     effect: 'attract',
 *     strength: 0.8,
 *     radius: 150
 *   }}
 * />
 * 
 * @example
 * // With performance monitoring and controls
 * function App() {
 *   const controls = useAnimationControls();
 *   
 *   return (
 *     <AnimatedBackground 
 *       animationName="matrixRain"
 *       theme="cyberpunk"
 *       animationControls={controls}
 *       enablePerformanceMonitoring={true}
 *       adaptivePerformance={true}
 *     />
 *   );
 * }
 * 
 * @example
 * // Mobile-optimized setup
 * <AnimatedBackground 
 *   animationName="floatingBubbles"
 *   theme="wellness"
 *   interactive={true}
 *   interactionConfig={{
 *     effect: 'follow',
 *     strength: 0.6,
 *     multiTouch: true
 *   }}
 *   adaptivePerformance={true}
 *   fps={30}
 * />
 * 
 * @since 1.0.0
 * @version 2.0.0
 */
const AnimatedBackground = React.memo(({
    animationName,
    fallbackAnimation = 'geometricShapes',
    fps = 60,
    blendMode = 'normal',
    style,
    interactive = false,
    interactionConfig = {},
    theme,
    preset,
    animationControls,
    enablePerformanceMonitoring = false,
    adaptivePerformance = false
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const interactionHandlerRef = useRef(null);
    
    // Initialize performance monitoring if enabled
    const performanceMonitor = enablePerformanceMonitoring ? usePerformanceMonitor() : null;
    
    // Apply theme if specified
    useEffect(() => {
        if (theme) {
            themeManager.applyTheme(theme);
        }
    }, [theme]);

    // Own the interaction handler while interactive mode is on. Declared
    // before the animation effect so setupCanvas can hand it to the animation.
    useEffect(() => {
        if (!interactive) return;

        const handler = createInteractionHandler(canvasRef.current, interactionConfig);
        handler.attachListeners();
        interactionHandlerRef.current = handler;

        return () => {
            handler.removeListeners();
            interactionHandlerRef.current = null;
        };
    }, [interactive]);

    // Pass interaction config changes to the live handler
    useEffect(() => {
        if (interactionHandlerRef.current) {
            interactionHandlerRef.current.updateConfig(interactionConfig);
        }
    }, [interactionConfig]);

    const blendModes = [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity'
    ];

    // Memoize animations object to prevent recreation
    const animations = useMemo(() => ({
        starryNight, floatingBubbles, gradientWave, particleNetwork, galaxySpiral,
        rainbowWaves, geometricShapes, fireflies, matrixRain, quantumField,
        electricStorm, cosmicDust, neonPulse, auroraBorealis, oceanWaves,
        neuralNetwork, dnaHelix, snowFall, realisticRain, realisticClouds,
        fireflyForest, autumnLeaves, fallingFoodFiesta, hauntedForest,
        ghostlyApparitions,
        spiderwebOverlay,
        undeadGraveyard,
        bloodRain,
        creepyCrawlies,
    }), []);

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Set blend mode
        ctx.globalCompositeOperation = blendModes.includes(blendMode)
            ? blendMode
            : 'normal';

        let animation = animations[animationName];

        if (!animation) {
            console.warn(`Animation "${animationName}" not found. Using fallback animation.`);
            animation = animations[fallbackAnimation] || animations.geometricShapes;
        }

        // Get theme-specific settings if available
        const themeSettings = theme ? themeManager.getAnimationSettings(animationName) : {};
        
        return animation(canvas, ctx, {
            themeManager: theme ? themeManager : null,
            interactionHandler: interactionHandlerRef.current,
            performanceMonitor,
            adaptivePerformance,
            ...themeSettings
        });
    }, [animationName, fallbackAnimation, blendMode, interactive, theme, animations]);

    // Animation setup effect - only runs when animation or setup changes
    useEffect(() => {
        const animation = setupCanvas();
        let lastTime = 0;
        let lastEvalTime = 0;
        let currentFps = fps;

        const loop = (currentTime) => {
            // Check animation controls
            if (animationControls && !animationControls.isPlaying) {
                animationRef.current = requestAnimationFrame(loop);
                return;
            }

            animationRef.current = requestAnimationFrame(loop);

            // Adaptive performance adjustments
            if (adaptivePerformance && performanceMonitor) {
                const { avgFps, performanceLevel } = performanceMonitor;

                // Only evaluate adaptive adjustments once per second to prevent rapid toggling
                // and console spamming
                if (currentTime - lastEvalTime > 1000) {
                    lastEvalTime = currentTime;
                    if (performanceLevel === 'poor' && avgFps > 0 && avgFps < 25) {
                        if (currentFps > 15) {
                            // Automatically reduce fps to improve rendering stability
                            currentFps = Math.max(15, currentFps - 5);
                            console.warn(`Poor performance detected. Automatically reduced target FPS to ${currentFps}.`);
                        }
                    } else if (performanceLevel === 'excellent' && avgFps > 55 && currentFps < fps) {
                        // Gradually restore fps if performance is excellent
                        currentFps = Math.min(fps, currentFps + 1);
                    }
                }
            }

            const frameInterval = 1000 / currentFps;
            const deltaTime = currentTime - lastTime;
            const speedMultiplier = animationControls ? animationControls.speed : 1;
            const adjustedFrameInterval = frameInterval / speedMultiplier;

            if (deltaTime >= adjustedFrameInterval) {
                lastTime = currentTime - (deltaTime % adjustedFrameInterval);
                
                // Record frame for performance monitoring
                if (performanceMonitor) {
                    performanceMonitor.recordFrame();
                }
                
                animation();
            }
        };

        animationRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [setupCanvas, fps, animationControls, adaptivePerformance]); // Added adaptivePerformance as dependency

    // Resize handling effect - separate from animation
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                setupCanvas();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setupCanvas]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: interactive ? 'auto' : 'none',
                ...style
            }}
        />
    );
});

export {
    // Main components
    AnimatedBackground,
    AnimatedText,
    LayeredBackground,
    
    // Animation functions
    starryNight,
    floatingBubbles,
    gradientWave,
    particleNetwork,
    galaxySpiral,
    rainbowWaves,
    geometricShapes,
    fireflies,
    matrixRain,
    quantumField,
    electricStorm,
    cosmicDust,
    neonPulse,
    auroraBorealis,
    fallingFoodFiesta,
    hauntedForest,
    ghostlyApparitions,
    spiderwebOverlay,
    undeadGraveyard,
    bloodRain,
    creepyCrawlies,
    
    // New hooks
    useAnimationControls,
    usePerformanceMonitor,
    
    // Utilities
    createInteractionHandler,
    GestureRecognizer,
    
    // Theme system
    ThemeManager,
    themeManager,
    COLOR_SCHEMES,
    THEMES
};