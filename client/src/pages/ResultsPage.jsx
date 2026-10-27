import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Search,
  Key,
  Eye,
  FileText,
} from 'lucide-react';
import { caseApi } from '../services/api';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!location.state?.resultData);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResult() {
      if (result) return;
      try {
        setLoading(true);
        const res = await caseApi.getCaseResult(id);
        if (res.success && res.data) {
          setResult({
            verdict: {
              isCorrect: res.data.accusation?.isCorrect,
              status: res.data.status,
              accusedSuspect: res.data.accusation?.suspectName,
              actualCulprit: res.data.solution?.culpritName,
              score: res.data.score,
              solution: res.data.solution,
            },
            data: res.data,
          });
        }
      } catch (err) {
        console.error('Failed to load result:', err);
        setError(err.response?.data?.error || 'Unable to retrieve case debrief.');
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id, result]);

  // Trigger celebration confetti if solved!
  useEffect(() => {
    if (result?.verdict?.isCorrect) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#38bdf8'],
        });
      } catch (e) {
        // Fallback gracefully if canvas is blocked
      }
    }
  }, [result]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Search className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-mono-detective text-slate-300">
          Unsealing the sealed magistrate verdict...
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 glass-panel rounded-2xl border border-rose-500/40 text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="font-display font-bold text-xl text-slate-100">Case Unresolved</h2>
        <p className="text-xs text-slate-300 font-mono-detective">{error}</p>
        <Link
          to={`/case/${id}`}
          className="inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950"
        >
          Return to Investigation Room
        </Link>
      </div>
    );
  }

  const { verdict } = result;
  const isCorrect = verdict.isCorrect;
  const score = verdict.score || { base: 0, cluesBonus: 0, hintsDeduction: 0, total: 0 };
  const solution = verdict.solution;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 pb-16">
      {/* Dramatic Verdict Banner */}
      <section
        className={`glass-panel rounded-3xl p-8 sm:p-12 text-center border relative overflow-hidden transition-all ${
          isCorrect
            ? 'border-emerald-500/40 bg-emerald-950/20 shadow-2xl shadow-emerald-500/10'
            : 'border-rose-500/40 bg-rose-950/20 shadow-2xl shadow-rose-500/10'
        }`}
      >
        <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-inner border">
          {isCorrect ? (
            <div className="bg-emerald-500/20 border-emerald-500/40 text-emerald-400 p-4 rounded-2xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          ) : (
            <div className="bg-rose-500/20 border-rose-500/40 text-rose-400 p-4 rounded-2xl">
              <XCircle className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-mono-detective uppercase tracking-wider mb-3 border">
          {isCorrect ? (
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              OFFICIAL BUREAU VERDICT • SOLVED
            </span>
          ) : (
            <span className="text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
              OFFICIAL BUREAU VERDICT • WRONGFUL ACCUSATION
            </span>
          )}
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-100 tracking-tight">
          {isCorrect ? 'Case Closed: Master Detective!' : 'Wrongful Accusation: Killer Walks Free'}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-mono-detective leading-relaxed">
          {isCorrect
            ? `Your keen deduction brought ${verdict.actualCulprit} to justice with indisputable forensic corroboration.`
            : `You accused ${verdict.accusedSuspect}, but the real culprit was ${verdict.actualCulprit}.`}
        </p>

        {/* Score Breakdown Cards */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs font-mono-detective">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[10px]">BASE VERDICT</span>
            <span className="text-lg font-bold text-slate-100 font-display">
              {score.base} PTS
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[10px]">CLUES BONUS</span>
            <span className="text-lg font-bold text-emerald-400 font-display">
              +{score.cluesBonus} PTS
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[10px]">HINT PENALTY</span>
            <span className="text-lg font-bold text-rose-400 font-display">
              -{score.hintsDeduction} PTS
            </span>
          </div>

          <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/40">
            <span className="text-amber-300 block text-[10px] font-bold">TOTAL SCORE</span>
            <span className="text-xl font-extrabold text-amber-400 font-display">
              {score.total} PTS
            </span>
          </div>
        </div>
      </section>

      {/* The Culprit Unmasked & Full Debrief */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono-detective text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>CONFESSION & FORENSIC RECONSTRUCTION</span>
        </div>

        <div className="border-b border-white/10 pb-4">
          <h2 className="font-display font-bold text-2xl text-slate-100">
            The True Culprit: <span className="text-amber-400">{solution.culpritName}</span>
          </h2>
        </div>

        {/* Motive & Fatal Flaw */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-rose-400 font-mono-detective font-bold mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>THE TRUE MOTIVE</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono-detective">
              {solution.motive}
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono-detective font-bold mb-1.5">
              <Key className="w-4 h-4" />
              <span>THE FATAL FLAW IN THEIR DEFENSE</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono-detective">
              {solution.fatalFlaw}
            </p>
          </div>
        </div>

        {/* Narrative Reconstruction */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-2">
          <h3 className="font-mono-detective font-bold text-xs uppercase tracking-wider text-slate-400">
            Official Case Debrief:
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono-detective">
            {solution.explanation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to={`/case/${id}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel-subtle hover:bg-slate-800/80 border border-white/10 flex items-center justify-center space-x-2 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Review Evidence & Suspect Dossiers</span>
          </Link>

          <Link
            to="/create"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Investigate Another Mystery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
