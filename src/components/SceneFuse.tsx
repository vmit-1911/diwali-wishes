import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/soundEngine';

interface SceneFuseProps {
  onIgniteComplete: () => void;
}

export const SceneFuse: React.FC<SceneFuseProps> = ({ onIgniteComplete }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [fuseProgress, setFuseProgress] = useState(0); // 0 to 1
  const [isFired, setIsFired] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isFired) return;
    setIsHolding(true);
    startTimeRef.current = performance.now();
    sound.startFuseSound();

    const checkFuse = (time: number) => {
      if (!startTimeRef.current) return;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(1, elapsed / 2800); // 2.8s burn time
      setFuseProgress(progress);

      if (progress >= 1) {
        setIsHolding(false);
        setIsFired(true);
        sound.stopFuseSound();
        sound.playAnarFountain();
        setTimeout(() => {
          onIgniteComplete();
        }, 1100);
        return;
      }

      animFrameRef.current = requestAnimationFrame(checkFuse);
    };

    animFrameRef.current = requestAnimationFrame(checkFuse);
  };

  const handlePointerUp = () => {
    if (isFired) return;
    setIsHolding(false);
    setFuseProgress(0);
    startTimeRef.current = null;
    sound.stopFuseSound();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  // Fuse spark position along curve path: from (x: 210, y: 110) to (x: 150, y: 180)
  const fuseX = 210 - fuseProgress * 60;
  const fuseY = 110 + fuseProgress * 70;

  return (
    <div
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#020206] via-[#050612] to-[#010204] select-none p-4 sm:p-6"
    >
      {/* Night Sky Silhouette & Subtle Star Field */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,140,0,0.15)_0%,_transparent_60%)]" />

      {/* Narrative header */}
      <div className="relative z-20 text-center max-w-lg mx-auto mt-14 sm:mt-16">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm font-cinzel text-amber-300 tracking-[0.25em] uppercase"
        >
          Chapter Five
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-3xl font-cinzel text-slate-100 font-bold mt-1"
        >
          The Final Spark
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base font-cormorant italic text-amber-200/80 mt-1"
        >
          "Every magical night deserves an unforgettable ending."
        </motion.p>
      </div>

      {/* Center Interactive Anar (Flowerpot Firecracker) */}
      <div className="relative flex-1 w-full max-w-sm mx-auto my-auto flex flex-col items-center justify-center min-h-[380px]">
        {/* Glow halo behind Anar */}
        <div
          className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 50% 65%, rgba(255, 140, 0, ${
              0.1 + fuseProgress * 0.5
            }) 0%, transparent 70%)`,
          }}
        />

        {/* Anar SVG illustration */}
        <div className="relative w-72 h-80 flex items-center justify-center">
          <svg viewBox="0 0 300 320" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]">
            <defs>
              {/* Conical Cone Body Gradient */}
              <linearGradient id="anarBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="35%" stopColor="#b45309" />
                <stop offset="70%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>

              {/* Decorative Pattern Foil */}
              <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#FFE082" />
              </linearGradient>
            </defs>

            {/* Firecracker Base Pot (Conical Anar) */}
            <polygon
              points="150,180 80,300 220,300"
              fill="url(#anarBodyGrad)"
              stroke="#F59E0B"
              strokeWidth="2"
            />

            {/* Base platform ring */}
            <ellipse cx="150" cy="300" rx="72" ry="14" fill="#3E1A06" stroke="#92400E" strokeWidth="2" />

            {/* Decorative Golden Bands across cone */}
            <path
              d="M 120,230 Q 150,238 180,230"
              stroke="url(#goldFoil)"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M 100,265 Q 150,276 200,265"
              stroke="url(#goldFoil)"
              strokeWidth="6"
              fill="none"
            />

            {/* Top Nozzle / Mouth of Flowerpot */}
            <ellipse cx="150" cy="180" rx="14" ry="5" fill="#1F1005" stroke="#F59E0B" strokeWidth="1.5" />

            {/* Twisted Fuse String */}
            <path
              d="M 150,180 Q 170,140 210,110"
              stroke="#E2E8F0"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={fuseProgress > 0 ? `${120 * (1 - fuseProgress)} 200` : 'none'}
            />

            {/* Burning Fuse Spark & Smoke */}
            {isHolding && (
              <g transform={`translate(${fuseX}, ${fuseY})`}>
                <circle cx="0" cy="0" r="14" fill="rgba(255, 140, 0, 0.4)" filter="blur(3px)" />
                <circle cx="0" cy="0" r="6" fill="#FFF9C4" />
                {/* Random micro sparks */}
                <line x1="0" y1="0" x2="-8" y2="-10" stroke="#FFD54F" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="10" y2="-6" stroke="#FF9800" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="5" y2="8" stroke="#FFF" strokeWidth="1.5" />
              </g>
            )}

            {/* Grand Anar Fountain Eruption when completed */}
            {isFired && (
              <g transform="translate(150, 180)">
                <ellipse cx="0" cy="-60" rx="45" ry="90" fill="rgba(255, 215, 0, 0.4)" filter="blur(8px)" />
                <line x1="0" y1="0" x2="-30" y2="-150" stroke="#FFF" strokeWidth="3" />
                <line x1="0" y1="0" x2="30" y2="-150" stroke="#FFF" strokeWidth="3" />
                <line x1="0" y1="0" x2="0" y2="-180" stroke="#FFD700" strokeWidth="4" />
              </g>
            )}
          </svg>

          {/* Interactive Fuse Touch Area */}
          {!isFired && (
            <div
              onPointerDown={handlePointerDown}
              className="absolute top-[80px] right-[40px] w-20 h-20 rounded-full flex items-center justify-center cursor-pointer touch-none active:scale-95 z-30"
            >
              {/* Ping hint */}
              {!isHolding && (
                <span className="flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 shadow-[0_0_15px_#ff9900]" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Burn progress bar */}
        {isHolding && (
          <div className="w-56 h-2 bg-slate-800 rounded-full overflow-hidden border border-amber-500/30 mt-4">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100"
              style={{ width: `${fuseProgress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Contextual instruction */}
      <div className="relative z-20 w-full max-w-md mx-auto text-center mb-6">
        <p className="text-sm font-cinzel text-amber-200 uppercase tracking-widest">
          {isFired
            ? 'Ignited! Prepare for the sky...'
            : isHolding
            ? 'Burning the fuse... Hold on!'
            : 'Touch and hold the fuse to ignite the grand sky'}
        </p>
        <p className="text-xs text-amber-400/60 mt-1 font-outfit">
          Keep holding your finger until the fuse sparks to the bottom
        </p>
      </div>
    </div>
  );
};

