import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save, Trash2 } from 'lucide-react';

export default function ScratchpadModal({ isOpen, onClose, caseId }) {
  const storageKey = `detective_notes_${caseId}`;
  const [notes, setNotes] = useState('');
  const [savedStatus, setSavedStatus] = useState('');

  useEffect(() => {
    if (caseId) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setNotes(saved);
    }
  }, [caseId, storageKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem(storageKey, notes);
    setSavedStatus('Saved to Detective Archive');
    setTimeout(() => setSavedStatus(''), 2500);
  };

  const handleClear = () => {
    if (window.confirm('Clear all deduction notes for this case?')) {
      setNotes('');
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-amber-500/30 p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">
              Detective's Notebook
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 font-mono-detective mb-3">
          Jot down timelines, suspicious alibi contradictions, and suspect connections.
        </p>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Suspect 1 claims they were in the library at 11:15 PM, but the greenhouse sprinkler log proves..."
          rows={8}
          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 font-mono-detective focus:outline-none focus:border-amber-400 transition-colors resize-none placeholder-slate-600"
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-mono-detective text-emerald-400">
            {savedStatus}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Clear notes"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
