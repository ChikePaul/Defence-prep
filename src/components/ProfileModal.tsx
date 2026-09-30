import React, { useState } from "react";
import {
  X,
  User,
  Check,
  Award,
  Lock,
  Sparkles,
  HelpCircle,
  Mic,
  BookOpen,
  PenTool,
  ShieldAlert,
  Download,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { StudentProfile, Badge } from "../types/siwes";
import { SAMPLE_PROFILES } from "../data/sampleProfiles";
import { useBadges } from "../context/BadgeContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
}) => {
  const [modalTab, setModalTab] = useState<"badges" | "switch_candidate" | "edit_info">("badges");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const { badges, unlockedCount } = useBadges();

  if (!isOpen) return null;

  const percentage = Math.round((unlockedCount / badges.length) * 100);

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-5 h-5 ${unlocked ? "text-cyan-300" : "text-slate-500"}` };
    switch (iconName) {
      case "HelpCircle":
        return <HelpCircle {...props} />;
      case "Mic":
        return <Mic {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "PenTool":
        return <PenTool {...props} />;
      case "ShieldAlert":
        return <ShieldAlert {...props} />;
      case "Download":
        return <Download {...props} />;
      case "Award":
      default:
        return <Award {...props} />;
    }
  };

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === "all") return true;
    return b.category === badgeFilter;
  });

  const categories = [
    { id: "all", label: `All Honors (${unlockedCount}/${badges.length})` },
    { id: "CBT & Technical", label: "CBT & Technical" },
    { id: "Oral Defense", label: "Oral Defense" },
    { id: "Logbook & Dossier", label: "Logbook & Dossier" },
    { id: "Academic Rigor", label: "Academic Rigor" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#080d19] border border-[#162238] rounded-3xl w-full max-w-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#142033] bg-[#090e1c] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <User className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {profile.studentName || "Candidate Profile"}
                </h3>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                  {profile.matricNo || "400L"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.department} · {profile.institution}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142033] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#142033] bg-[#070b14] px-5 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setModalTab("badges")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              modalTab === "badges"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Honors & Badges ({unlockedCount}/{badges.length})</span>
          </button>

          <button
            onClick={() => setModalTab("switch_candidate")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              modalTab === "switch_candidate"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Preset Profiles</span>
          </button>

          <button
            onClick={() => setModalTab("edit_info")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              modalTab === "edit_info"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Edit Credentials</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: DEFENSE HONORS & BADGES */}
          {modalTab === "badges" && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1426] via-[#090e1c] to-[#0c1426] border border-[#1b2b46] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>SIWES Defense Preparedness Mastery</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 sm:hidden">
                      {percentage}% Complete
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Earn academic honors by mastering CBT quizzes, conquering oral defense mock panels, auditing logbooks, and studying trap cards.
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#101a2e] rounded-full h-2 overflow-hidden border border-[#18263f]">
                    <div
                      className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/50"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-right shrink-0 hidden sm:block pl-4 border-l border-[#1b2b46]">
                  <div className="text-2xl font-extrabold text-cyan-300 font-mono tracking-tight">
                    {unlockedCount} <span className="text-xs text-slate-500">/ {badges.length}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                    {percentage}% Mastered
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setBadgeFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      badgeFilter === cat.id
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "bg-[#0b1220] border border-[#16233b] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredBadges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                      b.unlocked
                        ? "bg-gradient-to-br from-[#0d172e] via-[#091122] to-[#0d172e] border-cyan-500/60 shadow-lg shadow-cyan-950/40"
                        : "bg-[#070b14] border-[#142033] opacity-80"
                    }`}
                  >
                    {b.unlocked && (
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-lg pointer-events-none" />
                    )}

                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                        b.unlocked
                          ? "bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/50 shadow-cyan-500/20"
                          : "bg-[#0c1424] border border-[#192740]"
                      }`}
                    >
                      {renderBadgeIcon(b.iconName, b.unlocked)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{b.title}</h4>
                        {b.unlocked ? (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Earned</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold shrink-0">
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {b.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#121c2e] text-[10px] flex items-center justify-between gap-2">
                        <span className="text-slate-400 font-medium truncate">
                          {b.requirement}
                        </span>
                        {b.unlockedAt && (
                          <span className="text-cyan-400 font-mono shrink-0">
                            {b.unlockedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SWITCH CANDIDATE PROFILE */}
          {modalTab === "switch_candidate" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Benchmark 400L SIWES Profile:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PROFILES.map((sample) => {
                  const isSelected = profile.companyName === sample.profile.companyName;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => {
                        setProfile({ ...sample.profile });
                      }}
                      className={`p-4 rounded-2xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 border-cyan-500/80 text-white shadow-md shadow-cyan-950"
                          : "bg-[#0a0f1d] border-[#16233b] text-slate-300 hover:bg-[#0f172b]"
                      }`}
                    >
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{sample.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1.5">{sample.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EDIT CREDENTIALS */}
          {modalTab === "edit_info" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Update Student Dossier Credentials:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.studentName}
                    onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-[#16233b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Matric / Reg Number
                  </label>
                  <input
                    type="text"
                    value={profile.matricNo}
                    onChange={(e) => setProfile({ ...profile, matricNo: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-[#16233b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={profile.institution}
                    onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-[#16233b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-[#16233b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Organization / Employer
                  </label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-[#16233b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070b14] border-t border-[#142033] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-cyan-500/20 transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
