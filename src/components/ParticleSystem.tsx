import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  angle: number;
  spin: number;
}

interface ParticleSystemProps {
  density?: number;
  sparkleMode?: boolean;
  intensity?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  density = 45,
  sparkleMode = false,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#FFF3A1', '#FFD700', '#FFA000', '#FF7043', '#FFFFFF'];
    const particleCount = Math.floor(density * intensity);
    const particles: Particle[] = [];

    const createParticle = (initY?: number): Particle => ({
      x: Math.random() * width,
      y: initY !== undefined ? initY : Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.2),
      radius: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.3,
      maxAlpha: Math.random() * 0.6 + 0.3,
      decay: Math.random() * 0.006 + 0.003,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.angle) * 0.25;
        p.y += p.vy;
        p.angle += p.spin;

        p.alpha += p.decay;
        if (p.alpha > p.maxAlpha || p.alpha < 0.05) {
          p.decay = -p.decay;
        }

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[i] = createParticle(height + 10);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowBlur = sparkleMode ? 10 : 6;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, sparkleMode, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

