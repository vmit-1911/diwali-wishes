import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/soundEngine';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SceneLanternsProps {
  onComplete: () => void;
}

interface LanternItem {
  id: number;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  size: number;
  color: string;
  isLit: boolean;
  swaySpeed: number;
}

export const SceneLanterns: React.FC<SceneLanternsProps> = ({ onComplete }) => {
  const [lanterns, setLanterns] = useState<LanternItem[]>([
    { id: 1, xPercent: 14, yPercent: 18, size: 75, color: '#FF9100', isLit: true, swaySpeed: 4.2 },
    { id: 2, xPercent: 36, yPercent: 12, size: 85, color: '#FFD700', isLit: false, swaySpeed: 3.8 },
    { id: 3, xPercent: 64, yPercent: 14, size: 80, color: '#FF3366', isLit: false, swaySpeed: 4.5 },
    { id: 4, xPercent: 86, yPercent: 20, size: 70, color: '#B388FF', isLit: false, swaySpeed: 3.5 },
    { id: 5, xPercent: 25, yPercent: 42, size: 65, color: '#00E5FF', isLit: false, swaySpeed: 4.8 },
    { id: 6, xPercent: 75, yPercent: 40, size: 68, color: '#FF9100', isLit: false, swaySpeed: 4.0 },
  ]);

  const [sparklePoints, setSparklePoints] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const litCount = lanterns.filter((l) => l.isLit).length;
  const isSatisfied = litCount >= 4; // User can proceed after lighting several lanterns

  const handleTouchLantern = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    // Add touch sparkles at client location
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const newSparkle = { id: Date.now(), x: clientX, y: clientY };
    setSparklePoints((prev) => [...prev.slice(-6), newSparkle]);

    setLanterns((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          if (!l.isLit) {
            sound.playLanternRing();
            sound.playSparkle(1.2);
          } else {
            sound.playSparkle(1.5);
          }
          return { ...l, isLit: true };
        }
        return l;
      })
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#040612] via-[#0b1029] to-[#040614] select-none p-4 sm:p-6">
      {/* Decorative Traditional Indian Toran / Marigold Garland across top */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none flex items-center justify-around opacity-70 z-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm" />
            <div className="w-1 h-3 bg-amber-700/60" />
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-orange-500 to-red-600" />
          </div>
        ))}
      </div>

      {/* Fairy Light String Canopy connecting across scene */}
      <svg className="absolute inset-0 w-full h-64 pointer-events-none z-10">
        <path
          d="M 0,40 Q 250,90 500,40 T 1000,40"
          fill="none"
          stroke="rgba(255, 215, 0, 0.3)"
          strokeWidth="1.5"
        />
        <path
          d="M 0,90 Q 250,140 500,90 T 1000,90"
          fill="none"
          stroke="rgba(255, 215, 0, 0.25)"
          strokeWidth="1.2"
        />
      </svg>

      {/* Floating Sparkles from touch */}
      {sparklePoints.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2.2, y: -40 }}
          transition={{ duration: 0.8 }}
          className="fixed pointer-events-none z-50 text-amber-300"
          style={{ left: sp.x - 12, top: sp.y - 12 }}
        >
          <Sparkles className="w-6 h-6 animate-spin" />
        </motion.div>
      ))}

      {/* Narrative header */}
      <div className="relative z-20 text-center max-w-lg mx-auto mt-14 sm:mt-16">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm font-cinzel text-amber-300 tracking-[0.25em] uppercase"
        >
          Chapter Three
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-3xl font-cinzel text-slate-100 font-bold mt-1"
        >
          The World Comes Alive
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base font-cormorant italic text-amber-200/80 mt-1"
        >
          "The night is yours. Touch the lanterns and awaken the celebration!"
        </motion.p>
      </div>

      {/* Hanging Traditional Sky Lanterns (Kandils) */}
      <div className="relative flex-1 w-full max-w-xl mx-auto my-auto min-h-[360px]">
        {lanterns.map((lantern) => (
          <div
            key={lantern.id}
            onClick={(e) => handleTouchLantern(lantern.id, e)}
            onTouchStart={(e) => handleTouchLantern(lantern.id, e)}
            className="absolute cursor-pointer touch-none active:scale-95 transition-transform"
            style={{
              left: `${lantern.xPercent}%`,
              top: `${lantern.yPercent}%`,
              transform: 'translate(-50%, 0)',
            }}
          >
            {/* Hanging thread */}
            <div className="w-[1.5px] h-14 bg-gradient-to-b from-amber-200/40 to-amber-500/80 mx-auto" />

            {/* Lantern Body with gentle natural pendulum sway */}
            <motion.div
              animate={{ rotate: [-3, 3, -3] }}
              transition={{
                duration: lantern.swaySpeed,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex flex-col items-center"
              style={{ width: `${lantern.size}px` }}
            >
              {/* Radial glow when illuminated */}
              {lantern.isLit && (
                <div
                  className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-700 animate-pulse-glow"
                  style={{
                    background: `radial-gradient(circle, ${lantern.color} 0%, transparent 70%)`,
                    transform: 'scale(1.8)',
                  }}
                />
              )}

              {/* Traditional Octagonal Lantern SVG (Kandil) */}
              <svg
                viewBox="0 0 100 130"
                className="w-full h-auto filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]"
              >
                <defs>
                  <radialGradient id={`glow-${lantern.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor={lantern.color} />
                    <stop offset="100%" stopColor="#2A1002" />
                  </radialGradient>
                </defs>

                {/* Top hanger cap */}
                <polygon points="50,4 32,16 68,16" fill="#D4AF37" stroke="#996515" strokeWidth="1" />

                {/* Central Diamond / Prism Structure */}
                <polygon
                  points="50,16 85,50 50,84 15,50"
                  fill={lantern.isLit ? `url(#glow-${lantern.id})` : '#1a1d2e'}
                  stroke="#FFD700"
                  strokeWidth="2"
                  opacity={lantern.isLit ? 1 : 0.6}
                />

                {/* Inner filigree geometric star */}
                <circle
                  cx="50"
                  cy="50"
                  r="14"
                  fill="none"
                  stroke="#FFF2A0"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />

                {/* Four Corner Diamond Points */}
                <polygon points="50,22 56,50 50,78 44,50" fill={lantern.color} opacity={lantern.isLit ? 0.9 : 0.3} />

                {/* Hanging streamers / frills (Kandil tails) */}
                <path
                  d="M 28,84 Q 24,105 20,126"
                  stroke="#FFD700"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 40,84 Q 38,105 37,128"
                  stroke={lantern.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 50,84 L 50,130"
                  stroke="#FFF2A0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 60,84 Q 62,105 63,128"
                  stroke={lantern.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 72,84 Q 76,105 80,126"
                  stroke="#FFD700"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Indicator ping if unlit */}
              {!lantern.isLit && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Footer message & Transition */}
      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center gap-3 mb-6">
        <AnimatePresence>
          {!isSatisfied ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs sm:text-sm font-outfit text-amber-200/80 bg-[#0a0d1f]/60 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/20 text-center"
            >
              Touch any lantern to awaken its festive glow ({litCount}/4 awakened)
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={() => {
                  sound.playSparkle(1.5);
                  onComplete();
                }}
                className="group flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-cinzel font-bold text-sm tracking-widest shadow-[0_0_25px_rgba(255,193,7,0.5)] hover:shadow-[0_0_35px_rgba(255,193,7,0.8)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>OPEN YOUR SURPRISE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

