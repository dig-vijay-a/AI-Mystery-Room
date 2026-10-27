import React from 'react';
import { Lock, Unlock, Eye, Sparkles, AlertCircle, Fingerprint, FileText, Activity } from 'lucide-react';

const CATEGORY_CONFIG = {
  forensic: {
    label: 'Forensic Lab',
    color: 'text-purple-400 bg-purple-950/40 border-purple-800/50',
    icon: Activity,
  },
  physical: {
    label: 'Physical Evidence',
    color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    icon: Fingerprint,
  },
  documentary: {
    label: 'Record & Audit',
    color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
    icon: FileText,
  },
  testimony: {
    label: 'Witness Account',
    color: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
    icon: AlertCircle,
  },
};

export default function EvidenceCard({ clue, onDiscover, isDiscovering = false }) {
  const categoryMeta = CATEGORY_CONFIG[clue.category] || CATEGORY_CONFIG.forensic;
  const CategoryIcon = categoryMeta.icon;

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between overflow-hidden group ${
        clue.discovered
          ? 'border-emerald-500/30 bg-slate-900/80 shadow-lg shadow-emerald-500/5'
          : 'border-white/10 hover:border-amber-500/40 bg-slate-950/40 hover:bg-slate-900/40'
      }`}
    >
      {/* Top watermark / stamp */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-detective font-semibold border ${categoryMeta.color}`}
        >
          <CategoryIcon className="w-3.5 h-3.5" />
          <span>{categoryMeta.label}</span>
        </span>

        {clue.discovered ? (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono-detective font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Unlock className="w-3 h-3 mr-0.5" /> UNSEALED (+5 PTS)
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono-detective font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <Lock className="w-3 h-3 mr-0.5" /> CLASSIFIED
          </span>
        )}
      </div>

      {/* Clue Title */}
      <h4 className="font-display font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors mb-2">
        {clue.title}
      </h4>

      {/* Description / Findings */}
      <div className="flex-1 my-2">
        {clue.discovered ? (
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-500/20 text-slate-200 text-xs sm:text-sm font-mono-detective leading-relaxed animate-fadeIn">
            <p>{clue.description}</p>
            {clue.discoveredAt && (
              <p className="mt-2 text-[10px] text-slate-500">
                Discovered: {new Date(clue.discoveredAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-900/40 p-4 rounded-xl border border-dashed border-slate-700/60 flex flex-col items-center justify-center text-center min-h-[90px]">
            <Lock className="w-6 h-6 text-slate-500 mb-1.5 group-hover:text-amber-400 transition-colors" />
            <p className="text-xs text-slate-400 font-mono-detective">
              Forensic analysis sealed in evidence bag.
            </p>
          </div>
        )}
      </div>

      {/* Inspect Button */}
      {!clue.discovered && (
        <button
          onClick={() => onDiscover(clue.id)}
          disabled={isDiscovering}
          className="w-full mt-3 py-2 px-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
        >
          <Eye className="w-4 h-4" />
          <span>{isDiscovering ? 'Unsealing Clue...' : 'Inspect Evidence (+5 pts)'}</span>
        </button>
      )}
    </div>
  );
}
