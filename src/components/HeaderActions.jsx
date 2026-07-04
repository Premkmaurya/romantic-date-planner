import React from 'react';
import { Heart, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

export default function HeaderActions({ theme, setTheme, musicPlaying, handleMusicToggle, handleBtnClick }) {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center z-20">
      <div className="flex items-center gap-2 text-rose-500 font-serif font-bold text-xl">
        <Heart className="fill-rose-500 animate-pulse" size={22} />
        <span>Romantic Proposal</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleMusicToggle}
          className={`p-2.5 rounded-full glass-card transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50 flex items-center justify-center ${
            musicPlaying ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'text-gray-600 dark:text-gray-400'
          }`}
          title={musicPlaying ? "Turn off background music" : "Turn on background music"}
          aria-label="Toggle background music"
        >
          {musicPlaying ? (
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Volume2 size={18} className="z-10" />
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-40"></span>
            </span>
          ) : (
            <VolumeX size={18} />
          )}
        </button>

        <button
          onClick={() => { handleBtnClick(); setTheme(theme === 'dark' ? 'light' : 'dark'); }}
          className="p-2.5 rounded-full glass-card text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
