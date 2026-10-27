import React, { useState } from 'react';
import { X, Target, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AccusationModal({
  isOpen,
  onClose,
  suspects,
  selectedSuspect,
  onSelectSuspect,
  onSubmitAccusation,
  isSubmitting,
}) {
  const [reasoning, setReasoning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSuspect) {
      alert('Please choose a prime suspect before submitting your indictment!');
      return;
    }
    onSubmitAccusation({
      suspectId: selectedSuspect.id,
      reasoning,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-rose-500/40 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center space-x-2 text-rose-500">
            <Target className="w-6 h-6 animate-pulse" />
            <h3 className="font-display font-bold text-xl text-slate-100">
              Formal Indictment & Accusation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3.5 mb-5 flex items-start space-x-3 text-rose-300 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Irrevocable Detective Action</p>
            <p className="mt-0.5 text-rose-300/90 leading-relaxed">
              Once submitted, the case is officially closed and the backend will verify your accusation. If correct, you will earn your detective prestige score; if incorrect, the killer will walk free!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Suspect Selector */}
          <div>
            <label className="block text-xs font-mono-detective uppercase tracking-wider text-slate-300 mb-2">
              Select The Prime Suspect:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suspects.map((suspect) => {
                const isSelected = selectedSuspect?.id === suspect.id;
                return (
                  <button
                    key={suspect.id}
                    type="button"
                    onClick={() => onSelectSuspect(suspect)}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/30 text-white'
                        : 'border-white/10 bg-slate-900/50 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                        isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {suspect.name.slice(0, 1)}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-sm truncate">{suspect.name}</p>
                      <p className="text-[11px] font-mono-detective text-slate-400 truncate">
                        {suspect.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reasoning Input */}
          <div>
            <label className="block text-xs font-mono-detective uppercase tracking-wider text-slate-300 mb-1.5">
              Deductive Reasoning & Evidence Citation (Optional):
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Cite the contradictory alibi, physical clue, or forensic finding that breaks their defense..."
              rows={3}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 font-mono-detective focus:outline-none focus:border-rose-400 transition-colors resize-none placeholder-slate-600"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Return to Evidence
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedSuspect}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-900/50 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <Target className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying with Bureau...' : 'Confirm Indictment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
