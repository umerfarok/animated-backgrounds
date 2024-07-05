// src/index.js
import React from 'react';
import {
    starryNight, floatingBubbles,
    gradientWave, particleNetwork, galaxySpiral,
    rainbowWaves, geometricShapes, fireflies,
    matrixRain, quantumField, electricStorm,
    cosmicDust, neonPulse, auroraBorealis
} from './backgroundAnimations';

class AnimatedBackground extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.animationFrameId = null;
    }

    componentDidMount() {
        this.setupCanvas();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.animationFrameId);
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
            quantumField, electricStorm,
            cosmicDust, neonPulse, auroraBorealis
        };

        const animation = animations[this.props.animationName](canvas, ctx);

        const animate = () => {
            animation();
            this.animationFrameId = requestAnimationFrame(animate);
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
    AnimatedBackground, starryNight,
    floatingBubbles,
    gradientWave,
    particleNetwork,
    galaxySpiral,
    rainbowWaves,
    geometricShapes,
    fireflies,
    matrixRain
};