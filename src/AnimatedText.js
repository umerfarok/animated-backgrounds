/**
 * @fileoverview Animated Text Component for React applications
 * @module AnimatedText
 * @requires react
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';

/**
 * @typedef {Object} AnimatedTextConfig
 * @property {number} [speed=100] - Animation speed in milliseconds
 * @property {boolean} [loop=false] - Whether to loop the animation
 * @property {number} [delay=0] - Delay before animation starts
 * @property {string} [color='currentColor'] - Text color
 */

/**
 * @typedef {Object} AnimatedTextProps
 * @property {string} text - The text to animate
 * @property {('typewriter'|'fadeIn'|'bounce'|'glitch'|'rainbow')} [effect='typewriter'] - Animation effect
 * @property {AnimatedTextConfig} [config] - Animation configuration
 * @property {Object} [styles] - Custom CSS styles
 */

class TextErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <span>Animation failed to load.</span>;
        }
        return this.props.children;
    }
}

/**
 * AnimatedText Component
 * @param {AnimatedTextProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
const AnimatedText = ({
    text = '',
    effect = 'typewriter',
    config = {},
    styles = {}
}) => {
    const defaultConfig = {
        speed: 100,
        loop: false,
        delay: 0,
        color: 'currentColor',
        ...config
    };

    const defaultStyles = {
        base: {
            display: 'inline-block',
            fontFamily: 'inherit',
            color: defaultConfig.color,
        },
        typewriter: {
            whiteSpace: 'pre',
            overflow: 'hidden',
            borderRight: '0.15em solid currentColor',
        },
        fadeIn: {
            opacity: 0,
            animation: 'fadeIn 2s forwards',
        },
        bounce: {
            display: 'inline-block',
        },
        glitch: {
            position: 'relative',
            animation: 'glitch 1s linear infinite',
        },
        rainbow: {
            background: 'linear-gradient(to right, #6666ff, #0099ff , #00ff00, #ff3399, #6666ff)',
            backgroundSize: '400%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'rainbow 8s ease infinite',
        }
    };

    const effects = {
        typewriter: (text) => {
            const [displayText, setDisplayText] = useState('');
            const [isAnimating, setIsAnimating] = useState(true);

            useEffect(() => {
                if (!text) {
                    setIsAnimating(false);
                    return;
                }

                const startAnimation = () => {
                    let i = 0;
                    setDisplayText('');
                    setIsAnimating(true);

                    const timer = setInterval(() => {
                        try {
                            if (i < text.length) {
                                setDisplayText(prev => prev + text[i]);
                                i++;
                            } else {
                                setIsAnimating(false);
                                if (defaultConfig.loop) {
                                    setTimeout(startAnimation, defaultConfig.delay);
                                }
                                clearInterval(timer);
                            }
                        } catch (error) {
                            console.error('Animation error:', error);
                            clearInterval(timer);
                            setIsAnimating(false);
                        }
                    }, defaultConfig.speed);

                    return timer;
                };

                const timer = setTimeout(startAnimation, defaultConfig.delay);
                return () => clearTimeout(timer);
            }, [text, defaultConfig.loop, defaultConfig.speed, defaultConfig.delay]);

            return (
                <span
                    style={{
                        ...defaultStyles.base,
                        ...defaultStyles.typewriter,
                        ...styles,
                        borderRight: isAnimating ? '0.15em solid currentColor' : 'none'
                    }}
                    aria-label={text}
                >
                    {displayText}
                </span>
            );
        },

        fadeIn: (text) => (
            <span
                style={{
                    ...defaultStyles.base,
                    ...defaultStyles.fadeIn,
                    ...styles
                }}
            >
                {text}
            </span>
        ),

        bounce: (text) => (
            <span style={{ ...defaultStyles.base, ...styles }}>
                {text.split('').map((char, i) => (
                    <span
                        key={i}
                        style={{
                            ...defaultStyles.bounce,
                            animation: `bounce 0.5s ease infinite`,
                            animationDelay: `${i * 0.1}s`
                        }}
                    >
                        {char}
                    </span>
                ))}
            </span>
        ),

        glitch: (text) => (
            <span style={{ ...defaultStyles.base, ...defaultStyles.glitch, ...styles }}>
                {text}
                <span className="glitch-effect" data-text={text}></span>
            </span>
        ),

        rainbow: (text) => (
            <span style={{ ...defaultStyles.base, ...defaultStyles.rainbow, ...styles }}>
                {text}
            </span>
        )
    };

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes glitch {
        2%, 64% { transform: translate(2px,0) skew(0deg); }
        4%, 60% { transform: translate(-2px,0) skew(0deg); }
        62% { transform: translate(0,0) skew(5deg); }
      }
      @keyframes rainbow { 
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
        document.head.appendChild(styleSheet);
        return () => document.head.removeChild(styleSheet);
    }, []);

    const safeText = typeof text === 'string' ? text : String(text || '');
    const safeEffect = effects.hasOwnProperty(effect) ? effect : 'typewriter';

    return (
        <TextErrorBoundary>
            {effects[safeEffect](safeText)}
        </TextErrorBoundary>
    );
};

export default AnimatedText;