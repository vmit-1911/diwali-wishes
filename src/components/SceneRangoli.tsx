import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/soundEngine';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface SceneRangoliProps {
  onComplete: () => void;
  colors: string[];
}

interface Point {
  x: number;
  y: number;
}

export const SceneRangoli: React.FC<SceneRangoliProps> = ({
  onComplete,
  colors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [symmetrySlices] = useState(8); // 8-fold Indian mandala symmetry
  const lastPointRef = useRef<Point | null>(null);

  // Initialize canvas with dark marble texture look
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      drawCourtyardGuide(ctx, rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const drawCourtyardGuide = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.42;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    // Concentric guide circles
    [0.3, 0.6, 0.9, 1.0].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Radial axis lines
    for (let i = 0; i < symmetrySlices; i++) {
      const angle = (i * 2 * Math.PI) / symmetrySlices;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
    }
    ctx.restore();
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const drawSymmetricalLine = useCallback(
    (p1: Point, p2: Point) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const angleStep = (2 * Math.PI) / symmetrySlices;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = selectedColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = selectedColor;

      for (let i = 0; i < symmetrySlices; i++) {
        const theta = i * angleStep;

        // Normal rotation
        const x1 = Math.cos(theta) * (p1.x - cx) - Math.sin(theta) * (p1.y - cy) + cx;
        const y1 = Math.sin(theta) * (p1.x - cx) + Math.cos(theta) * (p1.y - cy) + cy;
        const x2 = Math.cos(theta) * (p2.x - cx) - Math.sin(theta) * (p2.y - cy) + cx;
        const y2 = Math.sin(theta) * (p2.x - cx) + Math.cos(theta) * (p2.y - cy) + cy;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Mirrored slice for rich sacred geometry
        const mx1 = -(p1.x - cx);
        const my1 = p1.y - cy;
        const mx2 = -(p2.x - cx);
        const my2 = p2.y - cy;

        const rx1 = Math.cos(theta) * mx1 - Math.sin(theta) * my1 + cx;
        const ry1 = Math.sin(theta) * mx1 + Math.cos(theta) * my1 + cy;
        const rx2 = Math.cos(theta) * mx2 - Math.sin(theta) * my2 + cx;
        const ry2 = Math.sin(theta) * mx2 + Math.cos(theta) * my2 + cy;

        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }

      ctx.restore();
    },
    [selectedColor, symmetrySlices]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pt = getCanvasCoords(e);
    lastPointRef.current = pt;
    sound.playRangoliStroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    const currentPoint = getCanvasCoords(e);

    drawSymmetricalLine(lastPointRef.current, currentPoint);
    lastPointRef.current = currentPoint;

    setStrokeCount((prev) => {
      const next = prev + 1;
      if (next % 12 === 0) {
        sound.playRangoliStroke();
      }
      if (next > 40 && !isCompleted) {
        setIsCompleted(true);
      }
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawCourtyardGuide(ctx, rect.width, rect.height);
    setStrokeCount(0);
    sound.playSparkle(1.5);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#030612] via-[#080d24] to-[#040614] select-none p-4 sm:p-6">
      {/* Subtle Indian Palace Archway Ambient silhouette background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/30 via-transparent to-transparent" />

      {/* Header Narrative */}
      <div className="relative z-20 text-center max-w-lg mt-14 sm:mt-16">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm font-cinzel text-amber-300 tracking-[0.25em] uppercase"
        >
          Chapter One
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-3xl font-cinzel text-slate-100 font-bold mt-1"
        >
          Create Your Magic
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base font-cormorant italic text-amber-200/80 mt-1"
        >
          "Every beautiful celebration begins with a little colour."
        </motion.p>
      </div>

      {/* Center Interactive Rangoli Canvas */}
      <div className="relative w-full max-w-[420px] aspect-square my-auto flex items-center justify-center">
        {/* Glow halo behind rangoli */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${selectedColor}33 0%, transparent 70%)`,
          }}
        />

        {/* Decorative Flower Petals Ring around the boundary */}
        <div className="absolute inset-2 sm:inset-4 rounded-full border border-amber-500/20 pointer-events-none" />

        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full rounded-full bg-[#060814]/80 border-2 border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] cursor-crosshair touch-none"
        />

        {/* First-touch helper overlay */}
        {strokeCount === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <Sparkles className="w-8 h-8 text-amber-400 animate-bounce mb-2" />
            <p className="font-cinzel text-sm sm:text-base text-amber-200 font-semibold tracking-wider">
              Touch and drag across the floor
            </p>
            <p className="text-xs text-amber-300/60 mt-0.5">
              Watch sacred symmetry bloom instantly
            </p>
          </div>
        )}
      </div>

      {/* Controls & Color Palette */}
      <div className="relative z-20 w-full max-w-md flex flex-col items-center gap-4 mb-4">
        {/* Color Palette */}
        <div className="flex items-center gap-3 bg-[#0a0d1f]/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/30 shadow-xl">
          <span className="text-xs font-cinzel text-amber-200/70 mr-1 hidden sm:inline">
            Powder:
          </span>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color);
                sound.playSparkle(1.3);
              }}
              style={{ backgroundColor: color }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform duration-200 ${
                selectedColor === color
                  ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black shadow-[0_0_12px_currentColor]'
                  : 'hover:scale-110 opacity-75'
              }`}
              title="Select Color"
            />
          ))}
          <button
            onClick={clearCanvas}
            className="p-1.5 ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-amber-200 transition-colors"
            title="Reset Rangoli"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Proceed when user has created rangoli */}
        <AnimatePresence>
          {strokeCount >= 20 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={() => {
                  sound.playSparkle(1.5);
                  onComplete();
                }}
                className="group flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-cinzel font-bold text-sm tracking-widest shadow-[0_0_25px_rgba(255,193,7,0.4)] hover:shadow-[0_0_35px_rgba(255,193,7,0.6)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>BRING THE LIGHTS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-xs text-amber-300/70 font-cormorant italic text-center">
                "Beautiful! But something is still missing..."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

