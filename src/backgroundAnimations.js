// src/backgroundAnimations.js

export const starryNight = (canvas, ctx) => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            vx: Math.floor(Math.random() * 50) - 25,
            vy: Math.floor(Math.random() * 50) - 25,
            twinkle: Math.random()
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        stars.forEach(star => {
            star.twinkle += 0.02;
            const opacity = Math.abs(Math.sin(star.twinkle));
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();

            star.x += star.vx / 60;
            star.y += star.vy / 60;

            if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
            if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
        });
    };
};

export const floatingBubbles = (canvas, ctx) => {
    const bubbles = [];
    for (let i = 0; i < 75; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 30 + 5,
            speed: Math.random() * 0.7 + 0.1,
            color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bubbles.forEach(bubble => {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.stroke();

            bubble.y -= bubble.speed;
            bubble.x += Math.sin(bubble.y * 0.03) * 0.5;
            if (bubble.y + bubble.radius < 0) {
                bubble.y = canvas.height + bubble.radius;
                bubble.x = Math.random() * canvas.width;
            }
        });
    };
};

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

export const particleNetwork = (canvas, ctx) => {
    const particles = [];
    const particleCount = 150;
    const maxDistance = 120;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            vx: Math.random() * 1.5 - 0.75,
            vy: Math.random() * 1.5 - 0.75,
            color: `hsl(${Math.random() * 360}, 70%, 70%)`
        });
    }

    return () => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    };
};
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