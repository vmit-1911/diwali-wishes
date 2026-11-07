import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { diwaliConfig } from './config/diwaliConfig';
import { sound } from './utils/soundEngine';

import { ParticleSystem } from './components/ParticleSystem';
import { FloatingPetals } from './components/FloatingPetals';
import { HeaderControls } from './components/HeaderControls';

import { SceneOpening } from './components/SceneOpening';
import { SceneRangoli } from './components/SceneRangoli';
import { SceneDiyas } from './components/SceneDiyas';
import { SceneLanterns } from './components/SceneLanterns';
import { SceneEnvelope } from './components/SceneEnvelope';
import { SceneFuse } from './components/SceneFuse';
import { SceneFinale } from './components/SceneFinale';

export function App() {
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const getChapterTitle = (ch: number) => {
    switch (ch) {
      case 0:
        return 'The Unknown World';
      case 1:
        return 'Create Your Magic';
      case 2:
        return 'Light Up The Diyas';
      case 3:
        return 'The World Comes Alive';
      case 4:
        return 'A Little Surprise';
      case 5:
        return 'The Final Spark';
      case 6:
        return 'A Sky Full of Magic';
      default:
        return '';
    }
  };

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#020208] text-slate-100 flex flex-col justify-between select-none font-outfit">
      {/* Universal Ambient Gold Floating Particles */}
      <ParticleSystem
        density={currentChapter === 0 ? 25 : currentChapter === 6 ? 60 : 40}
        sparkleMode={currentChapter >= 4}
      />

      {/* Floating Indian Marigold & Rose Petals (Chapters 2 to Finale) */}
      {currentChapter >= 2 && <FloatingPetals count={currentChapter === 6 ? 35 : 22} />}

      {/* Header HUD Controls */}
      <HeaderControls
        currentChapter={currentChapter}
        totalChapters={7}
        chapterTitle={getChapterTitle(currentChapter)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Animated Chapter Scene Switcher */}
      <div className="relative w-full h-full flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentChapter === 0 && (
            <motion.div
              key="ch0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneOpening onComplete={() => setCurrentChapter(1)} />
            </motion.div>
          )}

          {currentChapter === 1 && (
            <motion.div
              key="ch1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneRangoli
                onComplete={() => setCurrentChapter(2)}
                colors={diwaliConfig.rangoliColors}
              />
            </motion.div>
          )}

          {currentChapter === 2 && (
            <motion.div
              key="ch2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneDiyas
                onComplete={() => setCurrentChapter(3)}
                diyaCount={diwaliConfig.diyaCount}
              />
            </motion.div>
          )}

          {currentChapter === 3 && (
            <motion.div
              key="ch3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneLanterns onComplete={() => setCurrentChapter(4)} />
            </motion.div>
          )}

          {currentChapter === 4 && (
            <motion.div
              key="ch4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneEnvelope
                onComplete={() => setCurrentChapter(5)}
                letter={diwaliConfig.letter}
                friendName={diwaliConfig.friendName}
              />
            </motion.div>
          )}

          {currentChapter === 5 && (
            <motion.div
              key="ch5"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneFuse onIgniteComplete={() => setCurrentChapter(6)} />
            </motion.div>
          )}

          {currentChapter === 6 && (
            <motion.div
              key="ch6"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <SceneFinale
                finalGreeting={diwaliConfig.finalGreeting}
                senderName={diwaliConfig.senderName}
                fireworkColors={diwaliConfig.fireworkColors}
                onReplay={() => setCurrentChapter(0)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
