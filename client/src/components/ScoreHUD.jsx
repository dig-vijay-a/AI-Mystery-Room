import React from 'react';
import { Target, BookOpen, Key, Award, AlertTriangle } from 'lucide-react';

export default function ScoreHUD({
  title,
  difficulty,
  discoveredCluesCount,
  totalCluesCount,
  usedHintsCount,
  totalHintsCount,
  score,
  onOpenNotebook,
  onAccuseClick,
}) {
  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30',
    medium: 'text-amber-400 bg-amber-950/50 border-amber-500/30',
    hard: 'text-rose-400 bg-rose-950/50 border-rose-500/30',
  };

  return (
    <div className="sticky top-16 z-40 glass-panel border-b border-white/10 py-3 px-4 sm:px-6 shadow-xl backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Case Info */}
        <div className="flex items-center space-x-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono-detective font-bold uppercase tracking-wider border ${
              difficultyColors[difficulty] || difficultyColors.medium
            }`}
          >
            {difficulty}
          </span>
          <h2 className="font-display font-bold text-sm sm:text-base text-slate-100 truncate max-w-xs sm:max-w-md">
            {title}
          </h2>
        </div>

        {/* Stats Counters & Live Score */}
        <div className="flex items-center space-x-3 sm:space-x-6 text-xs font-mono-detective">
          {/* Clues Count */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Clues:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
              {discoveredCluesCount} / {totalCluesCount}
            </span>
          </div>

          {/* Hints Count */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Hints:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
              {usedHintsCount} / {totalHintsCount}
            </span>
          </div>

          {/* Score Indicator */}
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/10 to-amber-600/20 px-3 py-1 rounded-lg border border-amber-500/30">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-bold text-sm">
              +{score?.cluesBonus || 0} -{score?.hintsDeduction || 0}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenNotebook}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          <button
            onClick={onAccuseClick}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-rose-900/40 transition-all duration-200 active:scale-95 animate-pulse"
          >
            <Target className="w-4 h-4" />
            <span>Accuse Culprit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
