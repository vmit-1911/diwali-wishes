import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FireworksCanvas } from './FireworksCanvas';
import { RotateCcw, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface SceneFinaleProps {
  finalGreeting: {
    hero: string;
    subHero: string;
    wishes: string[];
    signature: string;
  };
  senderName: string;
  fireworkColors: string[];
  onReplay: () => void;
}

export const SceneFinale: React.FC<SceneFinaleProps> = ({
  finalGreeting,
  senderName,
  fireworkColors,
  onReplay,
}) => {
  const [tapHint, setTapHint] = useState<boolean>(true);

  const handleCelebrateAgain = () => {
    sound.playFireworkExplosion();
    sound.playSparkle(1.5);
    // Fire celebration bursts
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#020207] select-none p-4 sm:p-6">
      {/* Dynamic Fullscreen HTML5 Canvas Fireworks Layer */}
      <FireworksCanvas
        colors={fireworkColors}
        onTapSky={() => {
          if (tapHint) setTapHint(false);
        }}
      />

      {/* Subtle bottom row of burning diyas along the floor */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex items-center justify-around z-20 opacity-80">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Flickering Flame */}
            <div className="w-2.5 h-4 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full animate-flame filter drop-shadow-[0_0_8px_#ff9900]" />
            {/* Diya Clay Base */}
            <div className="w-7 h-2 bg-gradient-to-b from-[#8D3715] to-[#511B05] rounded-b-full -mt-0.5" />
          </div>
        ))}
      </div>

      {/* Main Festive Reveal Content Card */}
      <div className="relative z-30 max-w-xl mx-auto my-auto flex flex-col items-center text-center px-4 pt-12">
        {/* Glowing Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 bg-[#0a0d20]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Festival of Lights</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black gold-gradient-text tracking-wider uppercase mb-2 filter drop-shadow-[0_0_35px_rgba(255,215,0,0.5)]"
        >
          {finalGreeting.hero}
        </motion.h1>

        {/* SubHero Dedication */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-cormorant italic text-amber-200 font-semibold mb-6 flex items-center justify-center gap-2"
        >
          <span>{finalGreeting.subHero}</span>
        </motion.h2>

        {/* Wishes Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="space-y-3 max-w-lg bg-[#070914]/75 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-amber-500/25 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
        >
          {finalGreeting.wishes.map((wish, idx) => (
            <p
              key={idx}
              className="font-cormorant text-base sm:text-lg text-slate-200 leading-relaxed italic"
            >
              {wish}
            </p>
          ))}

          {/* Editable Sender Signature */}
          <div className="pt-4 border-t border-amber-500/20 text-right">
            <p className="font-cormorant text-sm text-amber-400/80 italic">
              {finalGreeting.signature}
            </p>
            <p className="font-cinzel text-lg sm:text-xl gold-gradient-text font-bold">
              {senderName}
            </p>
          </div>
        </motion.div>

        {/* Tap Sky Hint */}
        {tapHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-xs font-outfit text-amber-300/80 mt-4 tracking-wider uppercase"
          >
            ✨ Tap anywhere in the sky to burst fireworks ✨
          </motion.p>
        )}
      </div>

      {/* Bottom Actions: Replay & Celebrate Again */}
      <div className="relative z-30 w-full max-w-md mx-auto flex items-center justify-center gap-3 sm:gap-4 mb-8">
        {/* Replay Full Experience */}
        <button
          onClick={() => {
            sound.playSparkle(1.2);
            onReplay();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#0a0d1f]/80 backdrop-blur-md border border-amber-500/30 text-amber-200 font-cinzel font-semibold text-xs tracking-wider uppercase hover:border-amber-400/70 hover:bg-[#121630] active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Magic</span>
        </button>

        {/* Celebrate Again (Fireworks burst) */}
        <button
          onClick={handleCelebrateAgain}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-cinzel font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:shadow-[0_0_30px_rgba(255,193,7,0.7)] active:scale-95 transition-all cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-slate-950" />
          <span>Celebrate Again</span>
        </button>
      </div>
    </div>
  );
};

