import React, { useRef, useEffect, useCallback } from 'react';
import {
    starryNight, floatingBubbles,
    gradientWave, particleNetwork, galaxySpiral,
    rainbowWaves, geometricShapes, fireflies,
    matrixRain, quantumField, electricStorm,
    cosmicDust, neonPulse, auroraBorealis, oceanWaves,
    neuralNetwork,
    dnaHelix, snowFall, realisticRain, autumnLeaves, realisticClouds, fireflyForest, fallingFoodFiesta
} from './backgroundAnimations';

const AnimatedBackground = ({ animationName, fallbackAnimation = 'geometricShapes', fps = 60, style }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animations = {
            starryNight, floatingBubbles, gradientWave, particleNetwork, galaxySpiral,
            rainbowWaves, geometricShapes, fireflies, matrixRain, quantumField,
            electricStorm, cosmicDust, neonPulse, auroraBorealis, oceanWaves,
            neuralNetwork, dnaHelix, snowFall, realisticRain, realisticClouds,
            fireflyForest, autumnLeaves, fallingFoodFiesta
        };

        let animation = animations[animationName];

        if (!animation) {
            console.warn(`Animation "${animationName}" not found. Using fallback animation.`);
            animation = animations[fallbackAnimation] || animations.geometricShapes;
        }

        return animation(canvas, ctx);
    }, [animationName, fallbackAnimation]);

    useEffect(() => {
        const animate = () => {
            const animation = setupCanvas();
            let lastTime = 0;
            const frameInterval = 1000 / fps;

            const loop = (currentTime) => {
                animationRef.current = requestAnimationFrame(loop);

                const deltaTime = currentTime - lastTime;
                if (deltaTime >= frameInterval) {
                    lastTime = currentTime - (deltaTime % frameInterval);
                    animation();
                }
            };

            animationRef.current = requestAnimationFrame(loop);
        };

        animate();

        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                setupCanvas();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [fps, setupCanvas]);

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

export {
    AnimatedBackground,
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
    fallingFoodFiesta
};