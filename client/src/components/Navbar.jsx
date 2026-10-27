import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, FolderArchive, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Subtle ambient audio synthesizer using Web Audio API (no external asset dependencies!)
  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);

    if (nextState) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.warn('Audio not allowed yet:', e);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/10">
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-lg tracking-wider text-slate-100 group-hover:text-amber-300 transition-colors">
                AI MYSTERY ROOM
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-400" /> GEMINI
              </span>
            </div>
            <p className="text-[11px] font-mono-detective text-slate-400 tracking-tight">
              PROCEDURAL CRIME BUREAU
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Link
            to="/archive"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              isActive('/archive')
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Case Archives</span>
          </Link>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable ambient sound feedback'}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <Link
            to="/create"
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Case</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
