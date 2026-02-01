"use client";

import { useEffect, useRef } from "react";

export default function Fireworks() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
            size: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                // Explode in random direction
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 2 + 0.5; // Slow/Subtle speed
                this.vx = Math.cos(angle) * velocity;
                this.vy = Math.sin(angle) * velocity;
                this.alpha = 1;
                this.color = color;
                this.size = Math.random() * 2;
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 0.005; // Slow fade
            }
        }

        const colors = ["#ff713e", "#e054b8", "#a855f7", "#ffffff"]; // Project colors

        const createFirework = () => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height / 2); // Top half only usually
            const color = colors[Math.floor(Math.random() * colors.length)];

            for (let i = 0; i < 30; i++) { // Fewer particles for "subtle"
                particles.push(new Particle(x, y, color));
            }
        };

        const animate = () => {
            ctx.fillStyle = "rgba(5, 5, 8, 0.4)"; // Faster trail fade
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear with trail

            // Randomly spawn fireworks
            if (Math.random() < 0.015) { // 1.5% chance per frame (~1 per sec)
                createFirework();
            }

            particles.forEach((p, index) => {
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    particles.splice(index, 1);
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-60"
        />
    );
}
