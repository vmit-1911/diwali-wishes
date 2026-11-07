import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/soundEngine';
import { ArrowRight, Heart, Sparkles, Mail } from 'lucide-react';

interface SceneEnvelopeProps {
  onComplete: () => void;
  letter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
  };
  friendName: string;
}

export const SceneEnvelope: React.FC<SceneEnvelopeProps> = ({
  onComplete,
  letter,
  friendName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterRevealed, setIsLetterRevealed] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    sound.playEnvelopeOpen();
    sound.playSparkle(1.2);

    setTimeout(() => {
      setIsLetterRevealed(true);
      sound.playSparkle(1.5);
    }, 1100);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#03040a] via-[#090b1c] to-[#020308] select-none px-4 pt-16 pb-[max(1.75rem,env(safe-area-inset-bottom,1.75rem))] sm:p-6">
      {/* Background radial gold glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />

      {/* Narrative header */}
      <div className="relative z-20 text-center max-w-lg mx-auto mt-14 sm:mt-16">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm font-cinzel text-amber-300 tracking-[0.25em] uppercase"
        >
          Chapter Four
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-3xl font-cinzel text-slate-100 font-bold mt-1"
        >
          A Little Surprise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base font-cormorant italic text-amber-200/80 mt-1"
        >
          "Every celebration becomes special because of the people in it."
        </motion.p>
      </div>

      {/* Main Interactive Center Area */}
      <div className="relative flex-1 w-full max-w-md mx-auto my-auto flex items-center justify-center min-h-[360px]">
        <AnimatePresence mode="wait">
          {!isLetterRevealed ? (
            /* Golden Envelope Component */
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={handleOpenEnvelope}
              className="relative cursor-pointer touch-none group"
            >
              {/* Outer Golden Glow */}
              <div className="absolute -inset-6 rounded-3xl bg-amber-500/20 blur-xl group-hover:bg-amber-400/30 transition-all duration-500 animate-pulse-glow" />

              {/* Envelope Container */}
              <div className="relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl bg-gradient-to-br from-[#1a150b] via-[#2c2210] to-[#120e06] border-2 border-amber-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-4">
                {/* Envelope Triangular Flap Fold */}
                <motion.div
                  animate={{
                    rotateX: isOpen ? 180 : 0,
                    transformOrigin: 'top',
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <svg viewBox="0 0 100 60" className="w-full h-full preserve-3d">
                    <polygon
                      points="0,0 100,0 50,55"
                      fill="#2f2412"
                      stroke="#FFD700"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                  </svg>
                </motion.div>

                {/* Royal Wax Seal */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    animate={
                      isOpen
                        ? { scale: 0, opacity: 0 }
                        : { scale: [1, 1.08, 1] }
                    }
                    transition={{
                      duration: 2,
                      repeat: isOpen ? 0 : Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 border-2 border-amber-200 flex items-center justify-center shadow-lg cursor-pointer"
                  >
                    <Heart className="w-6 h-6 text-amber-950 fill-amber-950" />
                  </motion.div>
                </div>

                {/* Envelope Front Base Lines */}
                <div className="mt-auto text-center z-10">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-cinzel text-xs tracking-widest uppercase">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Special Delivery</span>
                  </div>
                  <p className="text-amber-100/90 font-cormorant text-lg mt-1 italic">
                    For {friendName}
                  </p>
                </div>
              </div>

              {/* Touch hint */}
              {!isOpen && (
                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-cinzel text-amber-300/80 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Touch the envelope to open</span>
                </div>
              )}
            </motion.div>
          ) : (
            /* Glowing Royal Letter Component */
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#1b150c]/95 via-[#231a0e]/95 to-[#15100a]/95 border border-amber-400/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md"
            >
              {/* Corner Floral Filigree Ornaments */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg" />

              {/* Letter Header */}
              <div className="text-left mb-4">
                <span className="text-amber-400 font-cinzel text-xs uppercase tracking-widest">
                  Personal Letter
                </span>
                <h3 className="font-cormorant italic text-2xl text-amber-100 font-semibold mt-1">
                  {letter.salutation}
                </h3>
              </div>

              {/* Letter Body */}
              <div className="space-y-3 text-slate-200 font-cormorant text-base sm:text-lg leading-relaxed text-left">
                {letter.paragraphs.map((p, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.2 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* Closing */}
              <div className="mt-6 text-right">
                <p className="font-cormorant italic text-amber-300 font-medium">
                  {letter.closing}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center gap-1.5 mb-2 sm:mb-4">
        <AnimatePresence>
          {isLetterRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-xs text-amber-300/80 font-cormorant italic">
                "But wait... We're not done yet."
              </p>
              <button
                onClick={() => {
                  sound.playSparkle(1.5);
                  onComplete();
                }}
                className="group flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-cinzel font-bold text-sm tracking-widest shadow-[0_0_25px_rgba(255,193,7,0.5)] hover:shadow-[0_0_35px_rgba(255,193,7,0.8)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>LIGHT THE SKY</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

