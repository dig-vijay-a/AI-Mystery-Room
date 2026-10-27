import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldAlert,
  Award,
  Lock,
  ArrowRight,
  Eye,
  Key,
  FolderArchive,
  CheckCircle2,
} from 'lucide-react';
import { caseApi } from '../services/api';

export default function Home() {
  const [recentCases, setRecentCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await caseApi.listRecentCases();
        if (res.success) {
          setRecentCases(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch recent cases:', err);
      } finally {
        setLoadingCases(false);
      }
    }
    fetchCases();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center max-w-4xl mx-auto px-4">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-detective mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>POWERED BY GOOGLE GEMINI GENERATIVE AI</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-slate-100 tracking-tight leading-tight">
          Solve Procedural <span className="text-amber-400">Murder Mysteries</span> in Real-Time
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Step into the bureau. Uncover forensic clues, cross-examine suspect alibis, request strategic hints, and unmask the culprit before your score slips away.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Launch Case Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/archive"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-300 hover:text-white glass-panel-subtle hover:bg-slate-800/60 border border-white/10 flex items-center justify-center space-x-2 transition-all"
          >
            <FolderArchive className="w-4 h-4 text-slate-400" />
            <span>Browse Past Cases</span>
          </Link>
        </div>
      </section>

      {/* Difficulty & Scoring Matrix */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Case Difficulties & Scoring Rules
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono-detective">
            Fair play detective design: air-tight timelines, verifiable forensic clues, and backend-secured solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Easy */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded text-xs font-mono-detective font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                  Easy Tier
                </span>
                <span className="text-xl font-bold font-mono-detective text-emerald-400">
                  100 PTS
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-100 mb-2">
                The Novice Sleuth
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Direct evidence, obvious alibi contradictions, and clear motive. Ideal for a quick deductive challenge.
              </p>
              <ul className="space-y-2 text-xs font-mono-detective text-slate-400 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3 Suspects with clear alibis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5 Forensic & Physical Clues</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2 Tactical Hints</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create?difficulty=easy"
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-center transition-colors"
            >
              Play Easy Mode
            </Link>
          </div>

          {/* Medium */}
          <div className="glass-panel rounded-2xl p-6 border border-amber-500/40 hover:border-amber-500/60 gold-glow transition-all flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono-detective font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded text-xs font-mono-detective font-bold uppercase bg-amber-950/60 text-amber-400 border border-amber-800">
                  Medium Tier
                </span>
                <span className="text-xl font-bold font-mono-detective text-amber-400">
                  150 PTS
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-100 mb-2">
                Lead Investigator
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Overlapping motives, forensic trace evidence, and intricate electronic timestamp conflicts.
              </p>
              <ul className="space-y-2 text-xs font-mono-detective text-slate-400 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>4 Suspects with hidden secrets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>7 Interactive Clues</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>3 Tactical Hints</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create?difficulty=medium"
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 text-center transition-colors shadow-md shadow-amber-500/20"
            >
              Play Medium Mode
            </Link>
          </div>

          {/* Hard */}
          <div className="glass-panel rounded-2xl p-6 border border-rose-500/30 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded text-xs font-mono-detective font-bold uppercase bg-rose-950/60 text-rose-400 border border-rose-800">
                  Hard Tier
                </span>
                <span className="text-xl font-bold font-mono-detective text-rose-400">
                  200 PTS
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-100 mb-2">
                Master Mind
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Complex alibis, red herrings, circumstantial forensic layers, and tight deductive margin of error.
              </p>
              <ul className="space-y-2 text-xs font-mono-detective text-slate-400 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>5 Suspects with elaborate alibis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>9 In-Depth Clues</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>3 Tactical Hints</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create?difficulty=hard"
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-center transition-colors"
            >
              Play Hard Mode
            </Link>
          </div>
        </div>

        {/* Live Scoring Formula Pill */}
        <div className="mt-8 glass-panel-subtle rounded-xl p-4 border border-white/5 flex flex-wrap items-center justify-around gap-4 text-xs font-mono-detective text-slate-300">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Correct Accusation: <strong>+100 / +150 / +200</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Each Clue Discovered: <strong>+5 PTS</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-rose-400" />
            <span>Each Hint Used: <strong>-10 PTS</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Minimum Score: <strong>0 PTS</strong></span>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-100 mb-2">
              Gemini Generative Engine
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every mystery is synthesized on demand with dynamic characters, crime timelines, and custom crime scenes matching your chosen premise.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-100 mb-2">
              Zero Spoilers Network Security
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The true culprit, motive, and solution are strictly stripped from all network payloads until you formally submit your accusation.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-100 mb-2">
              Deterministic Scoring Engine
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Score calculations and validation happen server-side, preventing tampering and rewarding thorough forensic examination.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Cases Reel */}
      {recentCases.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-slate-100">
              Active & Solved Case Bureau
            </h3>
            <Link
              to="/archive"
              className="text-xs font-mono-detective text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>View all cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCases.slice(0, 6).map((c) => (
              <Link
                key={c._id}
                to={c.status === 'investigating' ? `/case/${c._id}` : `/case/${c._id}/results`}
                className="glass-panel rounded-xl p-4 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 text-[10px] font-mono-detective">
                    <span className="uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.difficulty}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase ${
                        c.status === 'solved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : c.status === 'failed'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {c.premise || 'Case file generated by bureau.'}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-detective text-slate-400">
                  <span>Score: {c.score?.total || 0} pts</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    Inspect &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
