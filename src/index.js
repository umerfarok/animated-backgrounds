// src/index.js
import React from 'react';
import {
    starryNight, floatingBubbles,
    gradientWave, particleNetwork, galaxySpiral,
    rainbowWaves, geometricShapes, fireflies,
    matrixRain, quantumField, electricStorm,
    cosmicDust, neonPulse, auroraBorealis, oceanWaves,
    neuralNetwork,
    dnaHelix, snowFall, realisticRain, autumnLeaves, realisticClouds, fireflyForest, fallingFoodFiesta
} from './backgroundAnimations';

class AnimatedBackground extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.animationFrameId = null;
    }

    handleResize = () => {
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.setupCanvas();
    }

    componentDidMount() {
        this.setupCanvas();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.handleResize);
    }

    setupCanvas = () => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animations = {
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
            oceanWaves,
            neuralNetwork,
            dnaHelix,
            snowFall,
            realisticRain, realisticClouds, fireflyForest,
            autumnLeaves,
            fallingFoodFiesta,
        };

        let animation = animations[this.props.animationName];

        if (!animation) {
            console.warn(`Animation "${this.props.animationName}" not found. Using fallback animation.`);
            animation = animations[this.props.fallbackAnimation] || animations.geometricShapes;
        }

        animation = animation(canvas, ctx);

        const animate = () => {
            animation();
            this.animationFrameId = setTimeout(() => {
                requestAnimationFrame(animate);
            }, 1000 / this.props.fps);
        };

        animate();
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    ...this.props.style
                }}
            />
        );
    }
}


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