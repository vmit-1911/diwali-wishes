import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
}

export const FloatingPetals: React.FC<{ count?: number }> = ({ count = 28 }) => {
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

    // Marigold orange, golden yellow, saffron, ruby rose
    const petalColors = [
      '#FF8F00',
      '#FFA000',
      '#FFB300',
      '#FF6F00',
      '#E64A19',
      '#D81B60',
    ];

    const createPetal = (initY?: number): Petal => ({
      x: Math.random() * width,
      y: initY !== undefined ? initY : Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.9 + 0.6,
      size: Math.random() * 9 + 6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.04 + 0.02,
    });

    const petals: Petal[] = [];
    for (let i = 0; i < count; i++) {
      petals.push(createPetal());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.9;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          petals[i] = createPetal(-20);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw organic teardrop/oval petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.8, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.6, -p.size * 0.5, 0, -p.size);

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = 0.78;
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
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-15"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

