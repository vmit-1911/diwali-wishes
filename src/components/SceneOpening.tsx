import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/soundEngine';

interface SceneOpeningProps {
  onComplete: () => void;
}

const NARRATIVE_LINES = [
  'Visnu made this for you...',
  'In a world full of stars, some lights shine just a little brighter.',
  'Every celebration has a beginning...',
  'Every light tells a story...',
  'And tonight, something magical is waiting for you, Pranika.',
];

export const SceneOpening: React.FC<SceneOpeningProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [hasExploded, setHasExploded] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const progressStartTimeRef = useRef<number | null>(null);

  // Progressive text narrative sequence
  useEffect(() => {
    if (currentLineIndex < NARRATIVE_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        sound.playSparkle(0.9 + currentLineIndex * 0.15);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex]);

  const showTouchTarget = currentLineIndex >= NARRATIVE_LINES.length;

  // Handle Touch & Hold Mechanics
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!showTouchTarget || hasExploded) return;
    setIsHolding(true);
    progressStartTimeRef.current = performance.now();
    sound.startAmbient();
    sound.playEnergyCharge(1);

    const checkProgress = (time: number) => {
      if (!progressStartTimeRef.current) return;
      const elapsed = time - progressStartTimeRef.current;
      const progress = Math.min(1, elapsed / 2200); // 2.2 seconds hold
      setHoldProgress(progress);

      if (progress % 0.2 < 0.05) {
        sound.playSparkle(1 + progress * 0.8);
      }

      if (progress >= 1) {
        setIsHolding(false);
        setHasExploded(true);
        sound.playFireworkExplosion();
        setTimeout(() => {
          onComplete();
        }, 1200);
        return;
      }

      animFrameRef.current = requestAnimationFrame(checkProgress);
    };

    animFrameRef.current = requestAnimationFrame(checkProgress);
  };

  const handlePointerUpOrLeave = () => {
    if (hasExploded) return;
    setIsHolding(false);
    setHoldProgress(0);
    progressStartTimeRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#020308] via-[#050714] to-[#010206] px-6 select-none"
      onPointerUp={handlePointerUpOrLeave}
      onPointerCancel={handlePointerUpOrLeave}
    >
      {/* Background Volumetric Light Ray */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(245, 197, 100, ${
            0.05 + holdProgress * 0.4
          }) 0%, rgba(5, 7, 20, 0.9) 70%, #020308 100%)`,
        }}
      />

      {/* Floating text narrative */}
      <div className="absolute top-1/4 sm:top-1/3 left-0 right-0 flex flex-col items-center justify-center text-center px-6 z-20 min-h-[120px]">
        <AnimatePresence mode="wait">
          {currentLineIndex < NARRATIVE_LINES.length ? (
            <motion.p
              key={currentLineIndex}
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-2xl md:text-3xl font-cormorant italic tracking-wide text-amber-100/90 max-w-xl text-center px-4"
            >
              "{NARRATIVE_LINES[currentLineIndex]}"
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-5xl font-cinzel tracking-widest gold-gradient-text uppercase mb-2 font-bold drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                DEEPAVALI
              </h1>
              <p className="text-xs sm:text-sm tracking-[0.3em] font-cinzel text-amber-300/80 uppercase">
                A World of Lights
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Central Star & Hold Interaction */}
      {showTouchTarget && !hasExploded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative flex flex-col items-center justify-center z-30 mt-20"
        >
          {/* Energy sphere & shockwaves */}
          <div
            onPointerDown={handlePointerDown}
            className="relative w-36 h-36 flex items-center justify-center cursor-pointer touch-none active:scale-95 transition-transform"
          >
            {/* Orbiting particles ring when holding */}
            {isHolding && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-amber-300/60"
                  style={{
                    scale: 1 + holdProgress * 0.4,
                    boxShadow: '0 0 35px rgba(255, 193, 7, 0.6)',
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-full border border-amber-400/40"
                  style={{ scale: 1 + holdProgress * 0.6 }}
                />
              </>
            )}

            {/* Hold progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="rgba(255, 215, 0, 0.15)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="url(#goldGradient)"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - holdProgress)}
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 10px #ffd700)' }}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff9d2" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#ff6f00" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Star Core */}
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                transform: `scale(${1 + holdProgress * 0.7})`,
                boxShadow: `0 0 ${25 + holdProgress * 60}px rgba(255, 215, 0, ${
                  0.7 + holdProgress * 0.3
                })`,
                background: 'radial-gradient(circle, #ffffff 15%, #ffe082 45%, #ff8f00 90%)',
              }}
            >
              {/* Star SVG symbol */}
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 text-white animate-spin"
                style={{ animationDuration: `${Math.max(1, 6 - holdProgress * 5)}s` }}
                fill="currentColor"
              >
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
          </div>

          {/* Contextual instruction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm sm:text-base font-cinzel text-amber-200/90 tracking-widest uppercase">
              {isHolding ? 'Summoning the light...' : 'Touch and hold the light to begin'}
            </p>
            <p className="text-xs text-amber-400/60 mt-1 font-outfit">
              Hold steadily until the light ignites
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Explosion effect on release */}
      {hasExploded && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 40, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-20 h-20 rounded-full bg-amber-100 filter blur-sm pointer-events-none z-50"
        />
      )}
    </div>
  );
};

