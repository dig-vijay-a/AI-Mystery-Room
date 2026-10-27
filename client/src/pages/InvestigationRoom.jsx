import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  MapPin,
  UserX,
  Lightbulb,
  Search,
  AlertTriangle,
  Award,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { caseApi } from '../services/api';
import ScoreHUD from '../components/ScoreHUD';
import SuspectCard from '../components/SuspectCard';
import EvidenceCard from '../components/EvidenceCard';
import ScratchpadModal from '../components/ScratchpadModal';
import AccusationModal from '../components/AccusationModal';

export default function InvestigationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discoveringClueId, setDiscoveringClueId] = useState(null);
  const [requestingHint, setRequestingHint] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  // Modals state
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [accusationModalOpen, setAccusationModalOpen] = useState(false);
  const [submittingAccusation, setSubmittingAccusation] = useState(false);

  // Load case
  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        const res = await caseApi.getCase(id);
        if (res.success && res.data) {
          // If already resolved, redirect to results
          if (res.data.status !== 'investigating') {
            navigate(`/case/${id}/results`);
            return;
          }
          setCaseData(res.data);
        } else {
          setError('Failed to load case files.');
        }
      } catch (err) {
        console.error('Failed to load case:', err);
        setError(err.response?.data?.error || err.message || 'Error connecting to case repository.');
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id, navigate]);

  // Discover Clue handler
  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringClueId(clueId);
      const res = await caseApi.discoverClue(id, clueId);
      if (res.success && res.clue) {
        setCaseData((prev) => {
          const updatedClues = prev.clues.map((c) => (c.id === clueId ? res.clue : c));
          return {
            ...prev,
            clues: updatedClues,
            score: res.score || prev.score,
          };
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to inspect evidence');
    } finally {
      setDiscoveringClueId(null);
    }
  };

  // Request Hint handler
  const handleRequestHint = async () => {
    if (!window.confirm('Requesting a tactical hint will deduct 10 points from your score. Proceed?')) {
      return;
    }
    try {
      setRequestingHint(true);
      const res = await caseApi.requestHint(id);
      if (res.success && res.hint) {
        setCaseData((prev) => {
          const updatedHints = prev.hints.map((h) => (h.id === res.hint.id ? res.hint : h));
          return {
            ...prev,
            hints: updatedHints,
            score: res.score || prev.score,
          };
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request hint');
    } finally {
      setRequestingHint(false);
    }
  };

  // Accusation submission
  const handleSubmitAccusation = async ({ suspectId, reasoning }) => {
    try {
      setSubmittingAccusation(true);
      const res = await caseApi.accuseSuspect(id, { suspectId, reasoning });
      if (res.success) {
        navigate(`/case/${id}/results`, { state: { resultData: res } });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error submitting indictment');
      setSubmittingAccusation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Search className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-mono-detective text-slate-300">
          Unsealing evidence archives and perimeter files...
        </p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 glass-panel rounded-2xl border border-rose-500/40 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="font-display font-bold text-xl text-slate-100">Case Access Blocked</h2>
        <p className="text-xs text-slate-300 font-mono-detective">{error}</p>
        <button
          onClick={() => navigate('/create')}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950"
        >
          Create New Case
        </button>
      </div>
    );
  }

  const discoveredCluesCount = caseData.clues.filter((c) => c.discovered).length;
  const revealedHintsCount = caseData.hints.filter((h) => h.revealed).length;
  const hasMoreHints = revealedHintsCount < caseData.hints.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Sticky Score and Action HUD */}
      <ScoreHUD
        title={caseData.title}
        difficulty={caseData.difficulty}
        discoveredCluesCount={discoveredCluesCount}
        totalCluesCount={caseData.clues.length}
        usedHintsCount={revealedHintsCount}
        totalHintsCount={caseData.hints.length}
        score={caseData.score}
        onOpenNotebook={() => setNotebookOpen(true)}
        onAccuseClick={() => setAccusationModalOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Crime Briefing Dossier */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center space-x-2 text-xs font-mono-detective text-amber-400">
              <FileText className="w-4 h-4" />
              <span>INCIDENT BRIEFING & CRIME SCENE</span>
            </div>
            <span className="text-[11px] font-mono-detective text-slate-400">
              CASE REF: #{caseData._id.slice(-6).toUpperCase()}
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mb-4">
            {caseData.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-xs font-mono-detective">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
              <UserX className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">VICTIM:</span>
                <span className="font-bold text-slate-200">{caseData.story.victim}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">CRIME SCENE:</span>
                <span className="font-bold text-slate-200">{caseData.story.crimeScene}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">ESTIMATED TIME:</span>
                <span className="font-bold text-slate-200">{caseData.story.timeOfDeath}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono-detective">
            <p>{caseData.story.narrative}</p>
          </div>
        </section>

        {/* Suspects Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-100 flex items-center space-x-2">
                <span>Suspect Lineup & Interrogations</span>
                <span className="text-xs font-mono-detective text-amber-400 font-normal">
                  ({caseData.suspects.length} Persons of Interest)
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono-detective mt-0.5">
                Examine backgrounds, stated alibis, and motives. Spot the fatal discrepancy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseData.suspects.map((suspect) => (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                isSelected={selectedSuspect?.id === suspect.id}
                onSelect={(s) => {
                  setSelectedSuspect(s);
                  setAccusationModalOpen(true);
                }}
                canAccuse={true}
              />
            ))}
          </div>
        </section>

        {/* Evidence Board Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-100 flex items-center space-x-2">
                <span>Evidence & Forensics Board</span>
                <span className="text-xs font-mono-detective text-emerald-400 font-normal">
                  ({discoveredCluesCount} of {caseData.clues.length} Discovered • +5 pts each)
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono-detective mt-0.5">
                Inspect sealed forensic evidence bags to unlock critical details and contradict suspect alibis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseData.clues.map((clue) => (
              <EvidenceCard
                key={clue.id}
                clue={clue}
                onDiscover={handleDiscoverClue}
                isDiscovering={discoveringClueId === clue.id}
              />
            ))}
          </div>
        </section>

        {/* Tactical Hints Bureau */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>Tactical Hints Bureau</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono-detective mt-0.5">
                Unlock investigative leads if you are stuck. Each hint incurs a -10 point penalty.
              </p>
            </div>

            <button
              onClick={handleRequestHint}
              disabled={!hasMoreHints || requestingHint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>
                {requestingHint
                  ? 'Requesting...'
                  : hasMoreHints
                  ? `Request Hint (-10 pts) • ${revealedHintsCount}/${caseData.hints.length}`
                  : 'All Hints Unlocked'}
              </span>
            </button>
          </div>

          {caseData.hints.some((h) => h.revealed) ? (
            <div className="space-y-3">
              {caseData.hints
                .filter((h) => h.revealed)
                .map((hint, idx) => (
                  <div
                    key={hint.id || idx}
                    className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs sm:text-sm font-mono-detective text-amber-200/90 flex items-start space-x-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      #{hint.order || idx + 1}
                    </span>
                    <p className="leading-relaxed">{hint.text}</p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-center text-xs font-mono-detective text-slate-400">
              No tactical hints requested yet. Preserve maximum detective score!
            </div>
          )}
        </section>
      </div>

      {/* Scratchpad & Accusation Modals */}
      <ScratchpadModal
        isOpen={notebookOpen}
        onClose={() => setNotebookOpen(false)}
        caseId={id}
      />

      <AccusationModal
        isOpen={accusationModalOpen}
        onClose={() => setAccusationModalOpen(false)}
        suspects={caseData.suspects}
        selectedSuspect={selectedSuspect}
        onSelectSuspect={setSelectedSuspect}
        onSubmitAccusation={handleSubmitAccusation}
        isSubmitting={submittingAccusation}
      />
    </div>
  );
}
