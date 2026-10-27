import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderArchive, Search, PlusCircle, Award, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { caseApi } from '../services/api';

export default function CaseArchive() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    async function fetchCases() {
      try {
        setLoading(true);
        const res = await caseApi.listRecentCases();
        if (res.success) {
          setCases(res.data);
        }
      } catch (err) {
        console.error('Failed to load archive:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.premise && c.premise.toLowerCase().includes(search.toLowerCase()));
    const matchesDiff = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-detective text-amber-400 mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>CENTRAL CASE ARCHIVES</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-100">
            Case Bureau Dossiers
          </h1>
        </div>

        <Link
          to="/create"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-1.5 transition-colors shadow-md shadow-amber-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Case</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases by title or premise keywords..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 font-mono-detective focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {['all', 'easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-detective uppercase font-semibold transition-all ${
                filterDifficulty === diff
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="py-20 text-center">
          <Search className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono-detective text-slate-400">Loading dossiers...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 space-y-3">
          <FolderArchive className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-display font-bold text-lg text-slate-200">No Cases Found</h3>
          <p className="text-xs text-slate-400 font-mono-detective">
            Start a new investigation to generate your first procedurally created mystery.
          </p>
          <Link
            to="/create"
            className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950"
          >
            Create First Mystery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c) => {
            const isSolved = c.status === 'solved';
            const isFailed = c.status === 'failed';
            const isInvestigating = c.status === 'investigating';

            return (
              <div
                key={c._id}
                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono-detective">
                    <span className="uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.difficulty}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase ${
                        isSolved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isFailed
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {c.premise || 'Custom generated case scenario.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono-detective">
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <Award className="w-3.5 h-3.5" />
                    <span>Score: {c.score?.total || 0} pts</span>
                  </div>

                  <Link
                    to={isInvestigating ? `/case/${c._id}` : `/case/${c._id}/results`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 border border-slate-700 transition-colors"
                  >
                    {isInvestigating ? 'Continue Case' : 'View Debrief'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
