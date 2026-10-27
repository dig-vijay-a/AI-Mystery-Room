import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Compass,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Wand2,
} from 'lucide-react';
import { caseApi } from '../services/api';

const PRESET_PREMISES = [
  {
    title: 'Vintage Manor Poisoning',
    text: 'A reclusive billionaire botanist is found poisoned at midnight beside a rare glowing orchid inside a locked glasshouse conservatory.',
    theme: 'classic noir',
  },
  {
    title: 'Silicon Valley Cyber Vault',
    text: 'The chief quantum cryptographer is discovered unconscious inside a sub-zero server room with her biometric security dongle missing.',
    theme: 'cyberpunk sleuth',
  },
  {
    title: 'Arctic Expedition Sabotage',
    text: 'A research vessel captain is fatally struck in the chart room during a polar blizzard while communications cables are deliberately severed.',
    theme: 'modern espionage',
  },
  {
    title: 'Grand Museum Gem Heist',
    text: 'During a black-tie gala, the museum curator is found locked inside the ancient relic vault while the Empress Diamond is replaced with glass.',
    theme: 'victorian gothic',
  },
];

const THEMES = [
  { id: 'classic noir', name: 'Classic Noir', desc: 'Rainy streets, jazz bars, trenchcoats' },
  { id: 'cyberpunk sleuth', name: 'Cyberpunk Sleuth', desc: 'Neon skyscrapers, neural implants, hackers' },
  { id: 'victorian gothic', name: 'Victorian Gothic', desc: 'Gaslit cobblestones, dusty libraries, secrets' },
  { id: 'modern espionage', name: 'Modern Espionage', desc: 'High-tech surveillance, diplomacy, covert ops' },
];

export default function CreateCase() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDifficulty = searchParams.get('difficulty') || 'medium';
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [premise, setPremise] = useState('');
  const [theme, setTheme] = useState('classic noir');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    'Connecting to Gemini generative puzzle architect...',
    'Synthesizing airtight crime scene and incident timeline...',
    'Planting forensic, documentary, and physical clues...',
    'Establishing suspect alibis, motives, and hidden secrets...',
    'Encrypting solution on backend bureau...',
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await caseApi.createCase({
        premise: premise.trim() || undefined,
        difficulty,
        theme,
      });

      if (response.success && response.data?._id) {
        navigate(`/case/${response.data._id}`);
      } else {
        setError('Failed to generate mystery dossier. Please retry.');
      }
    } catch (err) {
      console.error('Case generation failed:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Connection to AI Mystery Bureau failed. Ensure backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const difficultySpecs = {
    easy: { suspects: 3, clues: 5, hints: 2, base: 100, label: 'Easy Sleuth' },
    medium: { suspects: 4, clues: 7, hints: 3, base: 150, label: 'Lead Detective' },
    hard: { suspects: 5, clues: 9, hints: 3, base: 200, label: 'Master Mind' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono-detective mb-3">
          <Wand2 className="w-3.5 h-3.5" />
          <span>BESPOKE MYSTERY GENERATION</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100">
          Commission a New Case Dossier
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono-detective max-w-lg mx-auto">
          Specify your mystery premise or choose a curated template. Gemini will build the crime scene, suspect lineup, and forensic clues.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Investigation Generation Halted</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="glass-panel rounded-2xl p-10 border border-amber-500/30 text-center space-y-6 animate-pulse-glow">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Search className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-slate-100">
              Gemini AI is Weaving the Mystery...
            </h3>
            <p className="mt-2 text-sm font-mono-detective text-amber-400">
              {loadingSteps[loadingStep]}
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Structuring clues, balancing alibis, and ensuring the solution is logically airtight and locked on the backend.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Premise Input & Quick Pick Chips */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-detective uppercase tracking-wider text-slate-200 font-bold flex items-center space-x-2">
                <span>1. Mystery Premise & Crime Concept</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono-detective">Optional</span>
            </div>

            <textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="Describe the crime scene, victim, or situation... (or leave blank for a surprise mystery)"
              rows={3}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 font-mono-detective focus:outline-none focus:border-amber-400 transition-colors resize-none placeholder-slate-600"
            />

            <div>
              <p className="text-xs text-slate-400 mb-2 font-mono-detective">
                Or pick a curated crime premise:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_PREMISES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPremise(preset.text);
                      setTheme(preset.theme);
                    }}
                    className="p-2.5 rounded-lg border border-white/5 bg-slate-900/60 hover:border-amber-500/40 hover:bg-slate-800/60 text-left transition-all text-xs group"
                  >
                    <p className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {preset.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {preset.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty Tier Selector */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <label className="text-xs font-mono-detective uppercase tracking-wider text-slate-200 font-bold block">
              2. Select Investigation Difficulty
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['easy', 'medium', 'hard']).map((level) => {
                const spec = difficultySpecs[level];
                const isSelected = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/30 ring-2 ring-amber-400/30'
                        : 'border-white/10 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-detective uppercase font-bold text-xs text-amber-400">
                          {level}
                        </span>
                        <span className="text-xs font-mono-detective font-bold text-slate-300">
                          {spec.base} PTS
                        </span>
                      </div>
                      <p className="font-display font-bold text-sm text-slate-100">
                        {spec.label}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1 text-[11px] font-mono-detective text-slate-400">
                      <p>👥 {spec.suspects} Suspects</p>
                      <p>🔍 {spec.clues} Forensic Clues</p>
                      <p>💡 {spec.hints} Strategic Hints</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <label className="text-xs font-mono-detective uppercase tracking-wider text-slate-200 font-bold block">
              3. Atmospheric Case Theme
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-400/20 text-white'
                        : 'border-white/10 bg-slate-900/50 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs">{t.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Mystery Dossier</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
