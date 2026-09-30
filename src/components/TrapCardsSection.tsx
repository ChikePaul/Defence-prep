import React, { useState } from "react";
import {
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PenTool,
  RefreshCw,
  Search,
  RotateCw,
} from "lucide-react";
import { StudentProfile, TrapCard } from "../types/siwes";
import { useBadges } from "../context/BadgeContext";

interface TrapCardsSectionProps {
  profile: StudentProfile;
}

export const TrapCardsSection: React.FC<TrapCardsSectionProps> = ({ profile }) => {
  const { awardBadge } = useBadges();
  const [loading, setLoading] = useState(false);
  const [trapCards, setTrapCards] = useState<TrapCard[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleGenerateTraps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-trap-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: profile.department,
          companyName: profile.companyName,
          unitAttached: profile.unitAttached,
          logbookContent: profile.logbookSummary,
          reportContent: profile.reportSummary,
          technologies: profile.technologies,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.trapCards) {
        setTrapCards(data.data.trapCards);
      }
    } catch (err) {
      console.error("Error generating trap cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const flippedCount = Object.values(updated).filter(Boolean).length;
      if (flippedCount >= 2) {
        awardBadge("trap_buster");
      }
      return updated;
    });
  };

  const filteredCards = trapCards.filter((card) => {
    const matchesCategory = activeCategory === "all" || card.category === activeCategory;
    const matchesSearch =
      card.trapQuestion.toLowerCase().includes(search.toLowerCase()) ||
      card.masterDefenseAnswer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", ...Array.from(new Set(trapCards.map((c) => c.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#141209] via-[#0d1017] to-[#141209] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-2 tracking-wide uppercase">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>High-Stakes Defense Hot Seat</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Interactive 3D Flashcards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            The 12 Notorious SIWES Defense Trap Questions
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Examiners set ambush traps to check for plagiarized reports, fictitious logbook entries, and shallow understanding. Click any card to physically flip it and master the bulletproof STAR response.
          </p>
        </div>

        <button
          onClick={handleGenerateTraps}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Forging Traps..." : "Generate Custom Trap Cards"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      {trapCards.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap capitalize ${
                  activeCategory === cat
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search traps or topics..."
              className="w-full bg-[#0b101c] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {trapCards.length === 0 && !loading && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800 flex items-center justify-center mx-auto text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Defense Trap Cards Generated</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click "Generate Custom Trap Cards" to formulate the exact ambush questions academic panelists will spring on your specific logbook entries.
          </p>
          <button
            onClick={handleGenerateTraps}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Trap Cards</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Auditing Logbook For Attack Angles...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Detecting inconsistencies, complex technologies, and classic examiner traps for candidate at {profile.companyName}.
          </p>
        </div>
      )}

      {/* 3D Flip Trap Cards Grid */}
      {trapCards.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCards.map((card, idx) => {
            const isFlipped = flippedCards[card.id];

            return (
              <div
                key={card.id}
                className="perspective-1000 min-h-[380px] cursor-pointer"
                onClick={() => toggleFlip(card.id)}
              >
                <div
                  className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* FRONT: The Examiner's Ambush */}
                  <div className="absolute inset-0 backface-hidden bg-[#0b101c] border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-colors">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                        <span className="font-semibold text-amber-400 uppercase tracking-wide">
                          {card.category}
                        </span>
                        <span className="font-mono text-slate-500">Trap #{idx + 1}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>The Examiner's Ambush:</span>
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                          "{card.trapQuestion}"
                        </h4>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-slate-400 block">The Hidden Trap:</span>
                        <p>{card.whyExaminersAskThis}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-xs text-red-200 space-y-1">
                        <span className="font-bold text-red-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Fatal Rookie Answer (Avoid):
                        </span>
                        <p className="italic">"{card.rookieMistake}"</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Click to flip & see model rebuttal</span>
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> Flip Card
                      </span>
                    </div>
                  </div>

                  {/* BACK: Master Defense Rebuttal & Whiteboard Sketch */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0c1527] border border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                        <span className="font-semibold text-emerald-400 uppercase tracking-wide">
                          Master Defense Strategy (STAR)
                        </span>
                        <span className="font-mono text-slate-400">Trap #{idx + 1}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Bulletproof Model Rebuttal:</span>
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#070b12] p-4 rounded-xl border border-slate-800">
                          {card.masterDefenseAnswer}
                        </p>
                      </div>

                      {card.whiteboardChallenge && (
                        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-900/50 text-xs text-cyan-200 flex items-start gap-2">
                          <PenTool className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-cyan-300">Whiteboard Challenge: </span>
                            {card.whiteboardChallenge}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Click to flip back to question</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> Flip
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
