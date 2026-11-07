import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/soundEngine';
import { ArrowRight, Flame } from 'lucide-react';

interface SceneDiyasProps {
  onComplete: () => void;
  diyaCount?: number;
}

export const SceneDiyas: React.FC<SceneDiyasProps> = ({
  onComplete,
  diyaCount = 7,
}) => {
  const [litDiyas, setLitDiyas] = useState<boolean[]>(
    new Array(diyaCount).fill(false)
  );

  const litCount = litDiyas.filter(Boolean).length;
  const allLit = litCount === diyaCount;

  const handleIgnite = (index: number) => {
    if (litDiyas[index]) return;
    const next = [...litDiyas];
    next[index] = true;
    setLitDiyas(next);
    sound.playDiyaIgnite(index);

    if (next.filter(Boolean).length === diyaCount) {
      setTimeout(() => {
        sound.playSparkle(1.4);
      }, 600);
    }
  };

  // Diya placement angles around courtyard circle
  const getDiyaPosition = (index: number, total: number) => {
    // Semi-oval / arc arrangement for beautiful natural perspective
    const angle = (index / (total - 1)) * Math.PI; // 0 to 180 deg
    // Mapping to an ellipse around the lower-middle courtyard
    const radiusX = 135; // px in mobile, scaled with responsive container
    const radiusY = 70;
    const x = Math.cos(angle - Math.PI) * radiusX;
    const y = Math.sin(angle) * radiusY + 30;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#02030a] via-[#080a1c] to-[#04060f] select-none px-4 pt-16 pb-[max(1.75rem,env(safe-area-inset-bottom,1.75rem))] sm:p-6">
      {/* Dynamic ambient illumination that expands as more diyas are lit */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 65%, rgba(255, 145, 0, ${
            0.05 + (litCount / diyaCount) * 0.35
          }) 0%, rgba(255, 193, 7, ${
            (litCount / diyaCount) * 0.15
          }) 40%, transparent 75%)`,
        }}
      />

      {/* Narrative header */}
      <div className="relative z-20 text-center max-w-lg mt-14 sm:mt-16">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm font-cinzel text-amber-300 tracking-[0.25em] uppercase"
        >
          Chapter Two
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-3xl font-cinzel text-slate-100 font-bold mt-1"
        >
          Light Up the Diyas
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base font-cormorant italic text-amber-200/80 mt-1"
        >
          "Every little light can brighten an entire world."
        </motion.p>
        <p className="text-xs font-cinzel text-amber-400/70 tracking-widest uppercase mt-2">
          {allLit ? 'All 7 Diyas Glowing' : `Lit: ${litCount} of ${diyaCount} Diyas`}
        </p>
      </div>

      {/* Traditional Indian Courtyard floor with 7 clay diyas */}
      <div className="relative w-full max-w-[440px] h-[340px] my-auto flex items-center justify-center">
        {/* Glowing Rangoli base at the center */}
        <div
          className="relative w-44 h-44 rounded-full border border-amber-500/30 flex items-center justify-center transition-all duration-700"
          style={{
            boxShadow: allLit
              ? '0 0 50px rgba(255, 160, 0, 0.4), inset 0 0 30px rgba(255, 215, 0, 0.25)'
              : '0 0 20px rgba(0, 0, 0, 0.6)',
            background:
              'radial-gradient(circle, rgba(255,215,0,0.08) 0%, rgba(10,12,24,0.6) 80%)',
          }}
        >
          {/* Inner decorative sacred mandala silhouette */}
          <div className="w-28 h-28 border border-amber-400/20 rounded-full rotate-45 flex items-center justify-center">
            <div className="w-20 h-20 border border-amber-300/15 rounded-full" />
          </div>
        </div>

        {/* 7 Interactive Clay Diyas placed organically in courtyard */}
        {litDiyas.map((isLit, idx) => {
          const pos = getDiyaPosition(idx, diyaCount);
          return (
            <div
              key={idx}
              onClick={() => handleIgnite(idx)}
              className="absolute cursor-pointer touch-none active:scale-95 transition-transform group"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                zIndex: Math.floor(pos.y + 100),
              }}
            >
              {/* Diya Ground Glow shadow */}
              {isLit && (
                <div
                  className="absolute -inset-4 rounded-full filter blur-xl pointer-events-none transition-opacity duration-700 animate-pulse-glow"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255, 140, 0, 0.8) 0%, rgba(255, 69, 0, 0.3) 60%, transparent 80%)',
                  }}
                />
              )}

              {/* Realistic Clay Diya SVG */}
              <div className="relative w-16 h-14 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 80"
                  className="w-full h-full filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.8)]"
                >
                  <defs>
                    {/* Terracotta Clay Gradient */}
                    <linearGradient id={`clayGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C45A30" />
                      <stop offset="50%" stopColor="#8D3715" />
                      <stop offset="100%" stopColor="#511B05" />
                    </linearGradient>
                    {/* Oil puddle gradient */}
                    <radialGradient id={`oilGrad-${idx}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF2A0" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#C87000" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#602800" />
                    </radialGradient>
                    {/* Flame Gradient */}
                    <radialGradient id={`flameGrad-${idx}`} cx="50%" cy="80%" r="60%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FFF685" />
                      <stop offset="60%" stopColor="#FF8C00" />
                      <stop offset="90%" stopColor="#FF2200" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#990000" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Diya Base / Clay Bowl */}
                  <path
                    d="M 12,38 C 12,65 30,76 50,76 C 70,76 88,65 88,38 C 88,34 82,32 75,32 C 60,32 50,30 35,32 C 20,32 12,34 12,38 Z"
                    fill={`url(#clayGrad-${idx})`}
                    stroke="#D87848"
                    strokeWidth="1.2"
                  />

                  {/* Inner lip / rim */}
                  <ellipse
                    cx="50"
                    cy="36"
                    rx="32"
                    ry="9"
                    fill={`url(#oilGrad-${idx})`}
                    stroke="#D87848"
                    strokeWidth="0.8"
                  />

                  {/* Diya Beak / Spout (Front left-tilted tip) */}
                  <path
                    d="M 22,35 C 16,33 13,31 10,29 C 14,28 20,31 24,34 Z"
                    fill="#A84318"
                  />

                  {/* Cotton Wick */}
                  <path
                    d="M 16,32 Q 13,26 12,21"
                    stroke={isLit ? '#FFE082' : '#2A1F18'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Burning Flame */}
                  {isLit && (
                    <g className="animate-flame" style={{ transformOrigin: '12px 21px' }}>
                      {/* Outer flame halo */}
                      <circle
                        cx="12"
                        cy="13"
                        r="14"
                        fill="rgba(255, 140, 0, 0.3)"
                        filter="blur(3px)"
                      />
                      {/* Teardrop Flame Body */}
                      <path
                        d="M 12,-2 C 16,7 18,14 18,19 C 18,24 15,26 12,26 C 9,26 6,24 6,19 C 6,14 8,7 12,-2 Z"
                        fill={`url(#flameGrad-${idx})`}
                      />
                      {/* Bright inner blue-white spark core */}
                      <ellipse cx="12" cy="20" rx="2" ry="3.5" fill="#C5E8FF" />
                    </g>
                  )}
                </svg>

                {/* Touch hint pulse on unlit diya */}
                {!isLit && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer message and next scene transition */}
      <div className="relative z-20 w-full max-w-md flex flex-col items-center gap-2 mb-2 sm:mb-4">
        <AnimatePresence>
          {!allLit ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs sm:text-sm font-outfit text-amber-200/70 bg-[#0a0d1f]/60 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/20"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Touch each diya to ignite its flame</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-sm sm:text-base text-amber-200 font-cormorant italic text-center px-4">
                "Look at that... You just brought light into this world."
              </p>
              <button
                onClick={() => {
                  sound.playSparkle(1.5);
                  onComplete();
                }}
                className="group flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-cinzel font-bold text-sm tracking-widest shadow-[0_0_25px_rgba(255,193,7,0.5)] hover:shadow-[0_0_35px_rgba(255,193,7,0.8)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>ENTER THE CELEBRATION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

