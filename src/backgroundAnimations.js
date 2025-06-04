/**
 * @module backgroundAnimations
 * @description Collection of animation functions with blend mode support
 */

/**
 * Creates a starry night animation with blend modes
 */
export const starryNight = (canvas, ctx) => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            vx: Math.floor(Math.random() * 50) - 25,
            vy: Math.floor(Math.random() * 50) - 25,
            twinkle: Math.random(),
            color: `hsla(${Math.random() * 360}, 70%, 70%, 0.8)`
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.twinkle += 0.02;
            const opacity = Math.abs(Math.sin(star.twinkle));
            
            // Create glow effect
            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.radius * 4
            );
            gradient.addColorStop(0, star.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw star core
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();

            star.x += star.vx / 60;
            star.y += star.vy / 60;

            if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
            if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
        });
    };
};

/**
 * Creates floating bubbles animation with blend modes
 */
export const floatingBubbles = (canvas, ctx) => {
    const bubbles = [];
    for (let i = 0; i < 75; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 30 + 5,
            speed: Math.random() * 0.7 + 0.1,
            color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`,
            glowColor: `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bubbles.forEach(bubble => {
            // Create glow effect
            const gradient = ctx.createRadialGradient(
                bubble.x, bubble.y, 0,
                bubble.x, bubble.y, bubble.radius * 2
            );
            gradient.addColorStop(0, bubble.glowColor);
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw bubble
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            
            // Add highlight
            ctx.beginPath();
            ctx.arc(
                bubble.x - bubble.radius * 0.3,
                bubble.y - bubble.radius * 0.3,
                bubble.radius * 0.2,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();

            bubble.y -= bubble.speed;
            bubble.x += Math.sin(bubble.y * 0.03) * 0.5;
            
            if (bubble.y + bubble.radius < 0) {
                bubble.y = canvas.height + bubble.radius;
                bubble.x = Math.random() * canvas.width;
            }
        });
    };
};

/**
 * Creates a starry gradientWave animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const gradientWave = (canvas, ctx) => {
    let time = 0;

    return () => {
        time += 0.01;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${time * 10 % 360}, 70%, 50%)`);
        gradient.addColorStop(1, `hsl(${(time * 10 + 180) % 360}, 70%, 50%)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.15 * i + Math.sin(time + i) * 30);
            for (let x = 0; x < canvas.width; x += 10) {
                ctx.lineTo(x, canvas.height * 0.15 * i + Math.sin(time + i + x * 0.01) * 30);
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - i * 0.01})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };
};
/**
 * Creates a starry particleNetwork animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const particleNetwork = (canvas, ctx, options = {}) => {
    const { themeManager, interactionHandler, performanceMonitor, adaptivePerformance } = options;
    
    const particles = [];
    const particleCount = adaptivePerformance ? Math.min(150, Math.max(50, navigator.hardwareConcurrency * 20)) : 150;
    const maxDistance = 120;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            vx: Math.random() * 1.5 - 0.75,
            vy: Math.random() * 1.5 - 0.75,
            originalVx: Math.random() * 1.5 - 0.75,
            originalVy: Math.random() * 1.5 - 0.75,
            color: themeManager ? themeManager.getCurrentColors()[0] : `hsl(${Math.random() * 360}, 70%, 70%)`
        });
    }

    return () => {
        // Use theme-aware background
        const bgColor = themeManager ? themeManager.getBackgroundColor() : 'rgba(15, 23, 42, 0.1)';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply interactions if available
        if (interactionHandler) {
            const interactionPoints = interactionHandler.getInteractionPoints();
            
            particles.forEach(particle => {
                // Reset to original velocity
                particle.vx = particle.originalVx;
                particle.vy = particle.originalVy;
                
                // Apply interaction forces
                interactionPoints.forEach(point => {
                    const force = interactionHandler.calculateInteractionForce(particle, point);
                    particle.vx += force.fx * 2; // Amplify force for visibility
                    particle.vy += force.fy * 2;
                });
            });
        }

        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls with dampening
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.vx *= -0.8;
                particle.originalVx *= -0.8;
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.vy *= -0.8;
                particle.originalVy *= -0.8;
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });

        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    const opacity = 1 - distance / maxDistance;
                    
                    // Get line color from theme or use default
                    let lineColor = 'rgba(255, 255, 255, 1)';
                    if (themeManager) {
                        const themeColors = themeManager.getCurrentColors();
                        const colorIndex = themeColors.length > 1 ? 1 : 0;
                        const hexColor = themeColors[colorIndex];
                        
                        // Convert hex to rgba
                        if (hexColor.startsWith('#')) {
                            const rgb = themeManager.parseColor(hexColor);
                            lineColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
                        } else {
                            // Handle already rgb/rgba colors
                            lineColor = hexColor.includes('rgba') ? hexColor : hexColor.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
                        }
                    } else {
                        lineColor = `rgba(255, 255, 255, ${opacity})`;
                    }
                    
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    };
};


/**
 * Creates a starry galaxySpiral animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const galaxySpiral = (canvas, ctx, speed = 0.0001) => {
    const stars = initializeStars(canvas, 2000);
    let rotation = 0;

    function initializeStars(canvas, starCount) {
        const stars = [];
        for (let i = 0; i < starCount; i++) {
            const distance = Math.random() * canvas.width * 0.4;
            const angle = Math.random() * Math.PI * 2;
            stars.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                radius: Math.random() * 1.5 + 0.5,
                color: `hsl(${Math.random() * 60 + 200}, 80%, 70%)`,
                angle: angle,
                distance: distance
            });
        }
        return stars;
    }

    function drawStars(ctx, stars, rotation, speed) {
        stars.forEach(star => {
            const x = Math.cos(star.angle) * star.distance;
            const y = Math.sin(star.angle) * star.distance;

            ctx.beginPath();
            ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();

            // Adjust the angle increment here to control the speed of star rotation
            star.angle += speed / (star.distance * 0.00008);
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation);

        drawStars(ctx, stars, rotation, speed);

        ctx.restore();
        // Adjust the rotation increment here to control the speed of galaxy rotation
        rotation += speed;
    };
};

/**
 * Creates a starry rainbowWaves animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const rainbowWaves = (canvas, ctx) => {
    let time = 0;
    const waves = 7;
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        for (let i = 0; i < waves; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let x = 0; x < canvas.width; x++) {
                const y = Math.sin(x * 0.01 + time + i * 0.5) * 50 +
                    Math.cos(x * 0.02 + time * 0.7 + i * 0.3) * 25 +
                    canvas.height / 2;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    };
};

/**
 * Creates a starry auroraBorealis animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const auroraBorealis = (canvas, ctx) => {
    let time = 0;
    const colorStops = [
        { pos: 0, color: 'rgba(0, 255, 128, 0.5)' },
        { pos: 0.5, color: 'rgba(0, 128, 255, 0.5)' },
        { pos: 1, color: 'rgba(128, 0, 255, 0.5)' }
    ];

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        time += 0.005;

        for (let i = 0; i < 3; i++) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            colorStops.forEach(stop => {
                gradient.addColorStop(stop.pos, stop.color);
            });

            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                const y = Math.sin(x * 0.01 + time + i) * 50 +
                    Math.sin(x * 0.02 - time * 1.5 + i) * 30 +
                    canvas.height * (0.4 + i * 0.2);
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            ctx.fillStyle = gradient;
            ctx.fill();
        }
    };
};

/**
 * Creates a starry neonPulse animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const neonPulse = (canvas, ctx) => {
    const circles = [];
    const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF00AA'];

    for (let i = 0; i < 20; i++) {
        circles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 50 + 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            phase: Math.random() * Math.PI * 2
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        circles.forEach(circle => {
            const glow = Math.sin(circle.phase) * 20 + 30;
            const gradient = ctx.createRadialGradient(
                circle.x, circle.y, 0,
                circle.x, circle.y, circle.radius
            );
            gradient.addColorStop(0, circle.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius + glow, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            circle.phase += 0.05;
        });
    };
};
/**
 * Creates a starry cosmicDust animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const cosmicDust = (canvas, ctx) => {
    const particles = [];
    const particleCount = 300;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
    };
};
/**
 * Creates a starry electricStorm animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const electricStorm = (canvas, ctx) => {
    let time = 0;
    const bolts = [];

    function createBolt() {
        const startX = Math.random() * canvas.width;
        let x = startX;
        let y = 0;
        const points = [{ x, y }];

        while (y < canvas.height) {
            x += (Math.random() - 0.5) * 50;
            y += Math.random() * 20 + 10;
            points.push({ x, y });
        }

        return {
            points,
            life: 5 + Math.random() * 5,
            width: Math.random() * 3 + 1
        };
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        time += 0.1;
        if (Math.random() < 0.1) bolts.push(createBolt());

        bolts.forEach((bolt, index) => {
            ctx.beginPath();
            ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for (let i = 1; i < bolt.points.length; i++) {
                ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
            }
            ctx.strokeStyle = `rgba(180, 220, 255, ${bolt.life / 10})`;
            ctx.lineWidth = bolt.width;
            ctx.stroke();

            bolt.life -= 0.2;
            if (bolt.life <= 0) bolts.splice(index, 1);
        });
    };
};
/**
 * Creates a starry quantumField animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const quantumField = (canvas, ctx) => {
    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            hue: Math.random() * 360
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, 0.8)`;
            ctx.fill();

            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 100%, 50%, ${1 - distance / 100})`;
                    ctx.stroke();
                }
            });

            particle.hue = (particle.hue + 0.5) % 360;
        });
    };
};
/**
 * Creates a starry geometricShapes animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const geometricShapes = (canvas, ctx) => {
    const shapes = [];
    const shapeCount = 50;

    for (let i = 0; i < shapeCount; i++) {
        shapes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 30 + 10,
            type: Math.floor(Math.random() * 3),
            rotation: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.5 + 0.1,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }

    return () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        shapes.forEach(shape => {
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation);
            ctx.fillStyle = shape.color;

            switch (shape.type) {
                case 0: // Square
                    ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                    break;
                case 1: // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 2: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(0, -shape.size / 2);
                    ctx.lineTo(shape.size / 2, shape.size / 2);
                    ctx.lineTo(-shape.size / 2, shape.size / 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }

            ctx.restore();

            shape.rotation += shape.speed * 0.05;
            shape.y += shape.speed;
            if (shape.y > canvas.height + shape.size) {
                shape.y = -shape.size;
                shape.x = Math.random() * canvas.width;
            }
        });
    };
};
/**
 * Creates a starry fireflies animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const fireflies = (canvas, ctx) => {
    const fireflies = [];
    const fireflyCount = 100;

    for (let i = 0; i < fireflyCount; i++) {
        fireflies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            brightness: Math.random(),
            angle: Math.random() * Math.PI * 2
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireflies.forEach(firefly => {
            firefly.brightness += Math.random() * 0.1 - 0.05;
            firefly.brightness = Math.max(0, Math.min(1, firefly.brightness));

            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 100, ${firefly.brightness})`;
            ctx.fill();

            firefly.x += Math.cos(firefly.angle) * firefly.speed;
            firefly.y += Math.sin(firefly.angle) * firefly.speed;

            if (firefly.x < 0 || firefly.x > canvas.width || firefly.y < 0 || firefly.y > canvas.height) {
                firefly.angle += Math.PI;
            }

            if (Math.random() < 0.01) {
                firefly.angle = Math.random() * Math.PI * 2;
            }
        });
    };
};
/**
 * Creates a starry matrixRain animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const matrixRain = (canvas, ctx) => {
    const columns = Math.floor(canvas.width / 20);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+[]{}|;:,.<>?';

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);

            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.6;
        }
    };
};

/**
 * Creates a starry dnaHelix animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const dnaHelix = (canvas, ctx) => {
    const speed = 0.02
    const baseRadius = 100
    const amplitude = 50
    const nucleotideSize = 5
    let t = 0;

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            for (let x = -canvas.width / 2; x < canvas.width / 2; x += 10) {
                const y = Math.sin(x * 0.01 + t + i * Math.PI) * amplitude;
                const r = baseRadius + y;
                ctx.lineTo(x, r);
            }
            ctx.strokeStyle = i === 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw nucleotides
            for (let x = -canvas.width / 2; x < canvas.width / 2; x += 40) {
                const y = Math.sin(x * 0.01 + t + i * Math.PI) * amplitude;
                const r = baseRadius + y;
                ctx.fillStyle = i === 0 ? 'rgba(255, 255, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(x, r, nucleotideSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
        t += speed;
    };
}
/**
 * Creates a starry neuralNetwork animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const neuralNetwork = (canvas, ctx) => {
    const nodeCount = 30;
    const connectionProbability = 0.2;
    const speed = 0.3;
    const nodes = [];
    const connections = [];

    // Create background gradient
    const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    backgroundGradient.addColorStop(0, '#000000');
    backgroundGradient.addColorStop(1, '#1a1a2e');

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            size: Math.random() * 2 + 2
        });
    }

    // Pre-compute connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() < connectionProbability) {
                connections.push([i, j]);
            }
        }
    }

    return () => {
        // Draw background
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach((node, index) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${index * (360 / nodeCount)}, 100%, 50%)`;
            ctx.fill();

            // Add glow effect
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size + 3, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(node.x, node.y, node.size, node.x, node.y, node.size + 3);
            gradient.addColorStop(0, `hsla(${index * (360 / nodeCount)}, 100%, 50%, 0.8)`);
            gradient.addColorStop(1, `hsla(${index * (360 / nodeCount)}, 100%, 50%, 0)`);
            ctx.fillStyle = gradient;
            ctx.fill();
        });

        // Draw connections
        connections.forEach(([i, j]) => {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const opacity = 1 - distance / Math.max(canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.stroke();
        });

        // Add subtle particle effect
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    };
}
/**
 * Creates a starry oceanWaves animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const oceanWaves = (canvas, ctx) => {
    const waveCount = 7;
    const amplitude = 30;
    const frequency = 0.02;
    const speed = 0.03;
    let time = 0;

    // Create sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');

    // Create sun
    const sun = {
        x: canvas.width * 0.8,
        y: canvas.height * 0.2,
        radius: 40,
        glow: 20
    };

    // Create clouds
    const clouds = [
        { x: canvas.width * 0.1, y: canvas.height * 0.15, radius: 30 },
        { x: canvas.width * 0.3, y: canvas.height * 0.1, radius: 40 },
        { x: canvas.width * 0.6, y: canvas.height * 0.2, radius: 35 }
    ];

    return () => {
        // Draw sky
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

        // Draw sun
        ctx.save();
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        const sunGradient = ctx.createRadialGradient(sun.x, sun.y, sun.radius - sun.glow, sun.x, sun.y, sun.radius + sun.glow);
        sunGradient.addColorStop(0, 'rgba(255, 255, 0, 1)');
        sunGradient.addColorStop(0.8, 'rgba(255, 255, 0, 0.3)');
        sunGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        ctx.fillStyle = sunGradient;
        ctx.fill();
        ctx.restore();

        // Draw clouds
        clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        });

        // Draw ocean
        for (let i = 0; i < waveCount; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);

            for (let x = 0; x <= canvas.width; x += 5) {
                const y = Math.sin(x * frequency + time + i * 0.5) * amplitude * (1 + i * 0.1) +
                    (canvas.height - (i + 1) * (canvas.height * 0.4 / waveCount));
                ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, canvas.height);
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `rgba(0, 100, 255, ${0.1 + (i / waveCount) * 0.15})`);
            gradient.addColorStop(1, `rgba(0, 50, 200, ${0.1 + (i / waveCount) * 0.15})`);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        time += speed;
    };
}
/**
 * Creates a starry snowFall animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const snowFall = (canvas, ctx) => {
    const snowflakeCount = 200;
    const snowflakes = [];
    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, '#0c1445');
    backgroundGradient.addColorStop(1, '#1c2754');

    // Create moon
    const moon = {
        x: canvas.width * 0.8,
        y: canvas.height * 0.2,
        radius: 50,
        glow: 20
    };

    // Create mountains
    const mountains = [
        { points: [[0, canvas.height], [canvas.width * 0.3, canvas.height * 0.7], [canvas.width * 0.5, canvas.height]], color: '#0a1128' },
        { points: [[canvas.width * 0.4, canvas.height], [canvas.width * 0.7, canvas.height * 0.75], [canvas.width, canvas.height]], color: '#0d1636' }
    ];

    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1 + 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.5
        });
    }

    return () => {
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw moon
        ctx.save();
        ctx.beginPath();
        ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
        const moonGradient = ctx.createRadialGradient(moon.x, moon.y, moon.radius - moon.glow, moon.x, moon.y, moon.radius + moon.glow);
        moonGradient.addColorStop(0, 'rgba(255, 255, 230, 1)');
        moonGradient.addColorStop(0.5, 'rgba(255, 255, 230, 0.3)');
        moonGradient.addColorStop(1, 'rgba(255, 255, 230, 0)');
        ctx.fillStyle = moonGradient;
        ctx.fill();
        ctx.restore();

        // Draw mountains
        mountains.forEach(mountain => {
            ctx.beginPath();
            ctx.moveTo(mountain.points[0][0], mountain.points[0][1]);
            mountain.points.forEach(point => ctx.lineTo(point[0], point[1]));
            ctx.fillStyle = mountain.color;
            ctx.fill();
        });

        snowflakes.forEach(flake => {
            flake.x += flake.vx + Math.sin(flake.y * 0.01) * 0.3;
            flake.y += flake.vy;

            if (flake.y > canvas.height) {
                flake.x = Math.random() * canvas.width;
                flake.y = -flake.size;
                flake.vx = (Math.random() - 0.5) * 1.5;
                flake.vy = Math.random() * 1 + 0.5;
            }

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            ctx.fill();
        });

        // Add a subtle glow effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
}

/**
 * Creates a starry fireflyForest animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const fireflyForest = (canvas, ctx) => {
    const fireflies = [];
    const fireflyCount = 100;
    const trees = [];
    const treeCount = 5;

    // Create trees
    for (let i = 0; i < treeCount; i++) {
        trees.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            height: Math.random() * 200 + 300,
            width: Math.random() * 100 + 50
        });
    }

    // Create fireflies
    for (let i = 0; i < fireflyCount; i++) {
        fireflies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.01,
            glowIntensity: Math.random()
        });
    }

    return () => {
        // Night sky
        ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw trees
        trees.forEach(tree => {
            ctx.beginPath();
            ctx.moveTo(tree.x, tree.y);
            ctx.lineTo(tree.x - tree.width / 2, tree.y - tree.height);
            ctx.lineTo(tree.x + tree.width / 2, tree.y - tree.height);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 50, 0, 0.8)';
            ctx.fill();
        });

        // Update and draw fireflies
        fireflies.forEach(fly => {
            fly.x += Math.cos(fly.angle) * fly.speed;
            fly.y += Math.sin(fly.angle) * fly.speed;
            fly.angle += fly.angleSpeed;

            if (fly.x < 0 || fly.x > canvas.width) fly.angle = Math.PI - fly.angle;
            if (fly.y < 0 || fly.y > canvas.height) fly.angle = -fly.angle;

            fly.glowIntensity = Math.sin(Date.now() * 0.002 + fly.x * 0.1) * 0.5 + 0.5;

            ctx.beginPath();
            ctx.arc(fly.x, fly.y, fly.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 100, ${fly.glowIntensity})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(fly.x, fly.y, fly.radius * 3, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, fly.radius * 3);
            gradient.addColorStop(0, `rgba(255, 255, 100, ${fly.glowIntensity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        });
    };
};
/**
 * Creates a starry realisticClouds animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const realisticClouds = (canvas, ctx) => {
    const clouds = [];
    const cloudCount = 10;
    let gradientHeight;

    function createCloud(x, y) {
        const particleCount = Math.floor(Math.random() * 50) + 50;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x + Math.random() * 200 - 100,
                y: y + Math.random() * 100 - 50,
                radius: Math.random() * 30 + 10
            });
        }

        return {
            particles,
            x,
            y,
            speed: Math.random() * 0.5 + 0.1
        };
    }

    for (let i = 0; i < cloudCount; i++) {
        clouds.push(createCloud(Math.random() * canvas.width, Math.random() * (canvas.height / 2)));
    }

    // Create gradient for the sky
    const createSkyGradient = () => {
        gradientHeight = canvas.height;
        const gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
        gradient.addColorStop(0, '#1e90ff');  // Dodger Blue
        gradient.addColorStop(0.5, '#87ceeb'); // Sky Blue
        gradient.addColorStop(1, '#e6f3ff');  // Very Light Blue
        return gradient;
    }

    let skyGradient = createSkyGradient();

    return () => {
        // Redraw sky gradient if canvas size has changed
        if (gradientHeight !== canvas.height) {
            skyGradient = createSkyGradient();
        }

        // Draw sky
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > canvas.width + 200) {
                cloud.x = -200;
            }

            ctx.save();
            ctx.translate(cloud.x, cloud.y);

            // Draw cloud shadow
            cloud.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x + 5, particle.y + 5, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fill();
            });

            // Draw cloud
            cloud.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            ctx.restore();
        });

        // Optional: Add sun
        const sunRadius = 40;
        const sunGlow = 20;
        ctx.beginPath();
        ctx.arc(canvas.width - 100, 100, sunRadius, 0, Math.PI * 2);
        const sunGradient = ctx.createRadialGradient(canvas.width - 100, 100, 0, canvas.width - 100, 100, sunRadius + sunGlow);
        sunGradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
        sunGradient.addColorStop(0.8, 'rgba(255, 255, 0, 0.3)');
        sunGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        ctx.fillStyle = sunGradient;
        ctx.fill();
    };
};
/**
 * Creates a starry autumnLeaves animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const autumnLeaves = (canvas, ctx) => {
    const leaves = [];
    const leafCount = 100;
    const leafColors = ['#ff6b6b', '#feca57', '#ff9ff3', '#ff9f43', '#e17055'];
    const leafImages = [
        '1.jpg',
        '2.jpg',
    ];
    const leafImagesLoaded = [];
    let imagesLoaded = false;

    // Load images
    const loadImages = () => {
        let loadedCount = 0;
        leafImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                leafImagesLoaded[index] = img;
                loadedCount++;
                if (loadedCount === leafImages.length) {
                    imagesLoaded = true;
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === leafImages.length) {
                    imagesLoaded = true;
                }
            };
            img.src = src;
        });
    };

    loadImages();

    for (let i = 0; i < leafCount; i++) {
        leaves.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 10,
            speed: Math.random() * 2 + 1,
            amplitude: Math.random() * 20 + 10,
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.05,
            imageIndex: Math.floor(Math.random() * leafImages.length),
            color: leafColors[Math.floor(Math.random() * leafColors.length)]
        });
    }

    const drawLeaf = (leaf) => {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);

        if (imagesLoaded && leafImagesLoaded[leaf.imageIndex]) {
            ctx.drawImage(leafImagesLoaded[leaf.imageIndex], -leaf.size / 2, -leaf.size / 2, leaf.size, leaf.size);
        } else {
            // Fallback: draw a colored oval if image is not available
            ctx.beginPath();
            ctx.ellipse(0, 0, leaf.size / 2, leaf.size / 4, 0, 0, Math.PI * 2);
            ctx.fillStyle = leaf.color;
            ctx.fill();
        }

        ctx.restore();
    };

    return () => {
        ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        leaves.forEach(leaf => {
            leaf.y += leaf.speed;
            leaf.x += Math.sin(leaf.y * 0.01) * leaf.amplitude * 0.05;
            leaf.angle += leaf.angleSpeed;

            if (leaf.y > canvas.height) {
                leaf.y = -leaf.size;
                leaf.x = Math.random() * canvas.width;
            }

            drawLeaf(leaf);
        });
    };
};
/**
 * Creates a starry realisticRain animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const realisticRain = (canvas, ctx) => {
    const raindrops = [];
    const dropCount = 1000;
    const splashes = [];

    for (let i = 0; i < dropCount; i++) {
        raindrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 10 + 15
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and update raindrops
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
        ctx.lineWidth = 1;
        raindrops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;

            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                splashes.push({
                    x: drop.x,
                    y: canvas.height,
                    radius: Math.random() * 3 + 1,
                    opacity: 1
                });
            }
        });

        // Draw and update splashes
        splashes.forEach((splash, index) => {
            ctx.beginPath();
            ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(174, 194, 224, ${splash.opacity})`;
            ctx.fill();

            splash.radius += 0.1;
            splash.opacity -= 0.03;

            if (splash.opacity <= 0) {
                splashes.splice(index, 1);
            }
        });
    };
};

/**
 * Creates a starry fallingFoodFiesta animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const fallingFoodFiesta = (canvas, ctx) => {
    const foodItems = [];
    const foodTypes = ['🍔', '🍕', '🌭', '🍟', '🌮', '🍣', '🍩', '🍦', '🍎', '🍇', '🍓', '🍑', '🍍', '🥑', '🥕', '🥪', '🥨', '🧀', '🥐', '🥯', '🍱', '🍜', '🍙', '🍗', '🥟', '🥘', '🍤', '🥞', '🧇', '🥓'];
    const numItems = 50;

    // Lighter gradient colors
    const colors = [
        { r: 255, g: 102, b: 102 },  // Light Red
        { r: 255, g: 178, b: 102 },  // Light Orange
        { r: 255, g: 255, b: 153 },  // Light Yellow
        { r: 153, g: 255, b: 153 },  // Light Green
        { r: 153, g: 204, b: 255 },  // Light Blue
        { r: 178, g: 102, b: 255 },  // Light Indigo
        { r: 255, g: 153, b: 255 }   // Light Violet
    ];

    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorT = 0;
    const colorSpeed = 0.005;

    for (let i = 0; i < numItems; i++) {
        foodItems.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            emoji: foodTypes[Math.floor(Math.random() * foodTypes.length)],
            size: Math.random() * 20 + 30,
            speed: Math.random() * 1.5 + 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 2 - 1) * 0.02
        });
    }

    const lerpColor = (color1, color2, t) => {
        return {
            r: Math.round(color1.r + (color2.r - color1.r) * t),
            g: Math.round(color1.g + (color2.g - color1.g) * t),
            b: Math.round(color1.b + (color2.b - color1.b) * t)
        };
    };

    return () => {
        // Update gradient colors
        colorT += colorSpeed;
        if (colorT >= 1) {
            colorT = 0;
            colorIndex = nextColorIndex;
            nextColorIndex = (nextColorIndex + 1) % colors.length;
        }
        const currentColor = lerpColor(colors[colorIndex], colors[nextColorIndex], colorT);

        // Create moving gradient with lighter colors
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`);
        gradient.addColorStop(1, `rgb(${255 - currentColor.r}, ${255 - currentColor.g}, ${255 - currentColor.b})`);

        // Apply blur effect to the gradient
        ctx.filter = 'blur(5px)';

        // Draw gradient background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset filter for subsequent drawing
        ctx.filter = 'none';

        // Draw food items
        foodItems.forEach(item => {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            ctx.font = `${item.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Add a white outline for better visibility
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.strokeText(item.emoji, 0, 0);

            // Fill with black for contrast
            ctx.fillStyle = 'black';
            ctx.fillText(item.emoji, 0, 0);
            ctx.restore();

            item.y += item.speed;
            item.rotation += item.rotationSpeed;
            if (item.y > canvas.height + item.size) {
                item.y = -item.size;
                item.x = Math.random() * canvas.width;
            }
        });
    };
};
/**
 * Creates a starry hauntedForest animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const hauntedForest = (canvas, ctx) => {
    const trees = [];
    const fireflies = [];
    const fog = [];

    // Initialize trees
    for (let i = 0; i < 20; i++) {
        trees.push({
            x: Math.random() * canvas.width,
            height: Math.random() * 200 + 100,
            width: Math.random() * 20 + 10,
        });
    }

    // Initialize fireflies
    for (let i = 0; i < 50; i++) {
        fireflies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random(),
        });
    }

    // Initialize fog
    for (let i = 0; i < 100; i++) {
        fog.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 50 + 20,
            speed: Math.random() * 0.2 + 0.1,
        });
    }

    return () => {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw trees
        ctx.fillStyle = '#1a1a1a';
        trees.forEach(tree => {
            ctx.beginPath();
            ctx.moveTo(tree.x, canvas.height);
            ctx.lineTo(tree.x - tree.width / 2, canvas.height - tree.height);
            ctx.lineTo(tree.x + tree.width / 2, canvas.height - tree.height);
            ctx.closePath();
            ctx.fill();
        });

        // Draw fog
        ctx.fillStyle = 'rgba(200, 200, 200, 0.05)';
        fog.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();

            particle.x += particle.speed;
            if (particle.x > canvas.width + particle.radius) {
                particle.x = -particle.radius;
            }
        });

        // Draw fireflies
        fireflies.forEach(firefly => {
            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, firefly.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 100, ${firefly.opacity})`;
            ctx.fill();

            firefly.x += Math.sin(Date.now() * 0.001) * firefly.speed;
            firefly.y += Math.cos(Date.now() * 0.001) * firefly.speed;
            firefly.opacity = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;

            if (firefly.x < 0) firefly.x = canvas.width;
            if (firefly.x > canvas.width) firefly.x = 0;
            if (firefly.y < 0) firefly.y = canvas.height;
            if (firefly.y > canvas.height) firefly.y = 0;
        });
    };
};
/**
 * Creates a starry ghostlyApparitions animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const ghostlyApparitions = (canvas, ctx) => {
    const ghosts = [];
    const numGhosts = 5;

    for (let i = 0; i < numGhosts; i++) {
        ghosts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 50 + 30,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.5,
        });
    }

    return () => {
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ghosts.forEach(ghost => {
            ctx.beginPath();
            ctx.moveTo(ghost.x, ghost.y);
            ctx.bezierCurveTo(
                ghost.x - ghost.size / 2, ghost.y - ghost.size / 2,
                ghost.x - ghost.size / 2, ghost.y + ghost.size / 2,
                ghost.x, ghost.y + ghost.size
            );
            ctx.bezierCurveTo(
                ghost.x + ghost.size / 2, ghost.y + ghost.size / 2,
                ghost.x + ghost.size / 2, ghost.y - ghost.size / 2,
                ghost.x, ghost.y
            );

            const gradient = ctx.createRadialGradient(
                ghost.x, ghost.y, 0,
                ghost.x, ghost.y, ghost.size
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${ghost.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fill();

            ghost.y -= ghost.speed;
            ghost.opacity = Math.sin(Date.now() * 0.001) * 0.2 + 0.3;

            if (ghost.y + ghost.size < 0) {
                ghost.y = canvas.height + ghost.size;
                ghost.x = Math.random() * canvas.width;
            }
        });
    };
};
/**
 * Creates a starry spiderwebOverlay animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const spiderwebOverlay = (canvas, ctx) => {
    const webs = [];
    const numWebs = 20;

    for (let i = 0; i < numWebs; i++) {
        webs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 100 + 50,
            rotation: Math.random() * Math.PI * 2,
        });
    }

    const drawWeb = (x, y, size, rotation) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }

        for (let r = size / 4; r < size; r += size / 4) {
            ctx.moveTo(r, 0);
            for (let i = 1; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
        ctx.restore();
    };

    return () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        webs.forEach(web => {
            drawWeb(web.x, web.y, web.size, web.rotation);
        });
    };
};

/**
 * Creates a starry undeadGraveyard animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const undeadGraveyard = (canvas, ctx) => {
    const graves = [];
    const zombies = [];
    const fog = [];

    // Initialize graves
    for (let i = 0; i < 15; i++) {
        graves.push({
            x: Math.random() * canvas.width,
            y: canvas.height - Math.random() * 100 - 50,
            width: Math.random() * 30 + 20,
            height: Math.random() * 40 + 30
        });
    }

    // Initialize zombies
    for (let i = 0; i < 10; i++) {
        zombies.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            speed: Math.random() * 0.5 + 0.1,
            size: Math.random() * 30 + 20
        });
    }

    // Initialize fog
    for (let i = 0; i < 50; i++) {
        fog.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 100 + 50,
            speed: Math.random() * 0.2 + 0.1
        });
    }

    return () => {
        // Dark, eerie sky
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a0a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Moon
        ctx.beginPath();
        ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
        ctx.fill();

        // Draw graves
        ctx.fillStyle = '#333';
        graves.forEach(grave => {
            ctx.fillRect(grave.x, grave.y, grave.width, grave.height);
            ctx.fillStyle = '#222';
            ctx.fillRect(grave.x + grave.width * 0.1, grave.y, grave.width * 0.8, grave.height * 0.1);
        });

        // Draw zombies
        zombies.forEach(zombie => {
            ctx.beginPath();
            ctx.arc(zombie.x, zombie.y - zombie.size, zombie.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#3a5';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(zombie.x, zombie.y - zombie.size);
            ctx.lineTo(zombie.x - zombie.size * 0.5, zombie.y);
            ctx.lineTo(zombie.x + zombie.size * 0.5, zombie.y);
            ctx.closePath();
            ctx.fillStyle = '#3a5';
            ctx.fill();

            zombie.y -= zombie.speed;
            if (zombie.y < canvas.height * 0.7) {
                zombie.y = canvas.height;
                zombie.x = Math.random() * canvas.width;
            }
        });

        // Draw fog
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        fog.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();

            particle.x += particle.speed;
            if (particle.x > canvas.width + particle.radius) {
                particle.x = -particle.radius;
            }
        });
    };
};
/**
 * Creates a starry bloodRain animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const bloodRain = (canvas, ctx) => {
    const drops = [];
    const splats = [];

    for (let i = 0; i < 200; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 5 + 5
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(20, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw rain
        ctx.strokeStyle = '#800';
        ctx.lineWidth = 1;
        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;

            if (drop.y > canvas.height) {
                drop.y = 0;
                drop.x = Math.random() * canvas.width;

                // Create a splat
                splats.push({
                    x: drop.x,
                    y: canvas.height,
                    size: Math.random() * 5 + 2,
                    opacity: 1
                });
            }
        });

        // Draw splats
        splats.forEach((splat, index) => {
            ctx.beginPath();
            ctx.arc(splat.x, splat.y, splat.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(128, 0, 0, ${splat.opacity})`;
            ctx.fill();

            splat.opacity -= 0.005;
            if (splat.opacity <= 0) {
                splats.splice(index, 1);
            }
        });
    };
};
/**
 * Creates a starry creepyCrawlies animation
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
 * @returns {Function} Animation loop function
 */
export const creepyCrawlies = (canvas, ctx) => {
    const bugs = [];
    const webNodes = [];

    for (let i = 0; i < 50; i++) {
        bugs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1
        });
    }

    for (let i = 0; i < 20; i++) {
        webNodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw web
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        webNodes.forEach((node, index) => {
            webNodes.slice(index + 1).forEach(otherNode => {
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(otherNode.x, otherNode.y);
            });
        });
        ctx.stroke();

        // Draw and move bugs
        ctx.fillStyle = '#400';
        bugs.forEach(bug => {
            ctx.beginPath();
            ctx.arc(bug.x, bug.y, bug.size, 0, Math.PI * 2);
            ctx.fill();

            bug.x += bug.speedX;
            bug.y += bug.speedY;

            if (bug.x < 0 || bug.x > canvas.width) bug.speedX *= -1;
            if (bug.y < 0 || bug.y > canvas.height) bug.speedY *= -1;

            // Occasionally change direction
            if (Math.random() < 0.01) {
                bug.speedX = Math.random() * 2 - 1;
                bug.speedY = Math.random() * 2 - 1;
            }
        });
    };
};