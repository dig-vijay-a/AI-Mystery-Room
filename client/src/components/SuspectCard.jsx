import React from 'react';
import { UserCheck, ShieldAlert, Clock, HelpCircle, Target } from 'lucide-react';

export default function SuspectCard({ suspect, isSelected, onSelect, canAccuse = false }) {
  // Generate consistent pseudo-avatar initials and accent
  const initials = suspect.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between group ${
        isSelected
          ? 'border-amber-400 ring-2 ring-amber-400/30 gold-glow bg-amber-950/20'
          : 'border-white/10 hover:border-amber-500/40 hover:bg-slate-900/60'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center font-display font-bold text-amber-400 text-lg shadow-inner">
              {initials}
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                {suspect.name}
              </h3>
              <p className="text-xs font-mono-detective text-amber-400/90 font-medium">
                {suspect.role}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-detective font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
            ID: {suspect.id}
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
          {suspect.bio}
        </p>

        {/* Alibi Section */}
        <div className="space-y-2.5 mb-4 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono-detective font-semibold mb-1 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>STATED ALIBI</span>
            </div>
            <p className="text-slate-300 italic font-mono-detective text-[11px] leading-relaxed">
              "{suspect.alibi}"
            </p>
          </div>

          {/* Motive Section */}
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-1.5 text-rose-400 font-mono-detective font-semibold mb-1 text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUSPECTED MOTIVE</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {suspect.motive}
            </p>
          </div>
        </div>
      </div>

      {/* Action / Accuse Selection Button */}
      {canAccuse && (
        <button
          onClick={() => onSelect(suspect)}
          className={`w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            isSelected
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'bg-slate-800/80 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>{isSelected ? 'Prime Suspect Selected' : 'Mark as Prime Suspect'}</span>
        </button>
      )}
    </div>
  );
}
