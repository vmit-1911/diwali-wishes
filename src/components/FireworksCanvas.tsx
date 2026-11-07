import React, { useRef, useEffect } from 'react';
import { sound } from '../utils/soundEngine';

interface FireworksCanvasProps {
  onTapSky?: (x: number, y: number) => void;
  colors: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  radius: number;
  gravity: number;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  onTapSky,
  colors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const createExplosion = (x: number, y: number, color: string) => {
      sound.playFireworkExplosion();
      const count = 75; // high density particles
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 5.5 + 2.0;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.012 + 0.008,
          color,
          radius: Math.random() * 2.4 + 1.2,
          gravity: 0.05,
          trail: [],
        });
      }
    };

    const launchRocket = (targetX?: number, targetY?: number) => {
      const startX = targetX !== undefined ? targetX : width * (0.2 + Math.random() * 0.6);
      const destY = targetY !== undefined ? targetY : height * (0.15 + Math.random() * 0.35);
      const color = colors[Math.floor(Math.random() * colors.length)];

      rocketsRef.current.push({
        x: startX,
        y: height + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 3 + 8),
        targetY: destY,
        color,
        exploded: false,
      });
    };

    // Initial volley of celebration
    setTimeout(() => launchRocket(width * 0.5, height * 0.25), 200);
    setTimeout(() => launchRocket(width * 0.3, height * 0.35), 600);
    setTimeout(() => launchRocket(width * 0.7, height * 0.28), 1000);
    setTimeout(() => launchRocket(width * 0.45, height * 0.2), 1500);

    // Continuous dynamic ambient fireworks every ~1.8 seconds
    const interval = setInterval(() => {
      launchRocket();
    }, 1800);

    // Expose click to launch anywhere
    (canvas as unknown as { launchAt: (x: number, y: number) => void }).launchAt = (
      x: number,
      y: number
    ) => {
      launchRocket(x, y);
    };

    const render = () => {
      // Cinematic motion blur trail
      ctx.fillStyle = 'rgba(2, 3, 10, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Render Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.x += r.vx;
        r.y += r.vy;

        // Trail spark
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF8E1';
        ctx.shadowBlur = 8;
        ctx.shadowColor = r.color;
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y, r.color);
          rocketsRef.current.splice(i, 1);
        }
      }

      // Render Explosion Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        // Spark trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        for (let t = p.trail.length - 1; t >= 0; t--) {
          ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.radius * 0.8;
        ctx.stroke();

        // Main Spark Head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [colors]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const launcher = (canvas as unknown as { launchAt?: (lx: number, ly: number) => void }).launchAt;
    if (launcher) launcher(x, y);
    if (onTapSky) onTapSky(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
    />
  );
};

