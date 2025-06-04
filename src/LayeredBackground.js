/**
 * @fileoverview Layered animated background component
 * @module LayeredBackground
 * @requires react
 */

import React, { useRef, useEffect, useCallback } from 'react';
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

/**
 * @typedef {Object} AnimationLayer
 * @property {string} animation - Animation name
 * @property {number} [opacity=1] - Layer opacity (0-1)
 * @property {string} [blendMode='normal'] - Canvas blend mode for this layer
 * @property {number} [speed=1] - Speed multiplier for this layer
 * @property {Object} [config] - Layer-specific configuration
 */

/**
 * LayeredBackground Component - Combines multiple animations in layers
 * @param {Object} props - Component props
 * @param {Array<AnimationLayer>} props.layers - Array of animation layers
 * @param {number} [props.fps=60] - Frames per second for the animation
 * @param {Object} [props.style] - Additional CSS styles for the canvas
 * @param {boolean} [props.enablePerformanceMonitoring=false] - Enable performance monitoring
 * @returns {React.Component} A canvas element with layered animated backgrounds
 */
const LayeredBackground = ({
    layers = [],
    fps = 60,
    style,
    enablePerformanceMonitoring = false
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const layerDataRef = useRef([]);

    const animations = {
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
    };

    const setupLayers = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Initialize layer data
        layerDataRef.current = layers.map((layer, index) => {
            const animation = animations[layer.animation];
            if (!animation) {
                console.warn(`Animation "${layer.animation}" not found in layer ${index}`);
                return null;
            }

            // Create a temporary canvas for this layer
            const layerCanvas = document.createElement('canvas');
            layerCanvas.width = canvas.width;
            layerCanvas.height = canvas.height;
            const layerCtx = layerCanvas.getContext('2d');

            return {
                canvas: layerCanvas,
                ctx: layerCtx,
                animation: animation(layerCanvas, layerCtx, layer.config || {}),
                opacity: layer.opacity || 1,
                blendMode: layer.blendMode || 'normal',
                speed: layer.speed || 1,
                lastUpdate: 0
            };
        }).filter(Boolean);

        return layerDataRef.current;
    }, [layers]);

    const renderLayers = useCallback((currentTime) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear the main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render each layer
        layerDataRef.current.forEach((layerData, index) => {
            const layer = layers[index];
            const frameInterval = (1000 / fps) / layerData.speed;

            // Check if it's time to update this layer
            if (currentTime - layerData.lastUpdate >= frameInterval) {
                // Clear layer canvas
                layerData.ctx.clearRect(0, 0, layerData.canvas.width, layerData.canvas.height);
                
                // Run layer animation
                layerData.animation();
                
                layerData.lastUpdate = currentTime;
            }

            // Composite layer onto main canvas
            ctx.save();
            ctx.globalAlpha = layerData.opacity;
            ctx.globalCompositeOperation = layerData.blendMode;
            ctx.drawImage(layerData.canvas, 0, 0);
            ctx.restore();
        });
    }, [layers, fps]);

    useEffect(() => {
        setupLayers();

        const animate = () => {
            let lastTime = 0;

            const loop = (currentTime) => {
                animationRef.current = requestAnimationFrame(loop);

                const deltaTime = currentTime - lastTime;
                if (deltaTime >= 16) { // ~60fps max
                    renderLayers(currentTime);
                    lastTime = currentTime;
                }
            };

            animationRef.current = requestAnimationFrame(loop);
        };

        animate();

        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                setupLayers();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [setupLayers, renderLayers]);

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
                ...style
            }}
        />
    );
};

export default LayeredBackground; 