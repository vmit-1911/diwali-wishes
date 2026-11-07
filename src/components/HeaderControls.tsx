import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface HeaderControlsProps {
  currentChapter: number;
  totalChapters: number;
  chapterTitle?: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  currentChapter,
  totalChapters,
  chapterTitle,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
      {/* Chapter Indicator */}
      <div className="flex items-center gap-2 pointer-events-auto bg-[#0a0c18]/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-cinzel tracking-wider uppercase font-semibold">
          {currentChapter === 0
            ? 'Chapter 0'
            : currentChapter > 5
            ? 'Grand Finale'
            : `Chapter ${currentChapter}`}
        </span>
        {chapterTitle && (
          <>
            <span className="text-amber-500/40">•</span>
            <span className="text-amber-100/70 hidden sm:inline">{chapterTitle}</span>
          </>
        )}
      </div>

      {/* Progress Dots & Mute Button */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Step dots */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0a0c18]/60 backdrop-blur-md px-3 py-2 rounded-full border border-amber-500/20">
          {Array.from({ length: totalChapters }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentChapter
                  ? 'w-6 bg-gradient-to-r from-amber-400 to-amber-200 shadow-[0_0_8px_#ffd700]'
                  : idx < currentChapter
                  ? 'w-2 bg-amber-500/60'
                  : 'w-2 bg-slate-700/60'
              }`}
            />
          ))}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            onToggleMute();
            sound.playSparkle(1.2);
          }}
          className="p-2.5 rounded-full bg-[#0a0c18]/70 backdrop-blur-md border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:border-amber-400/60 transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(255,193,7,0.15)] cursor-pointer"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};

