import React from "react";
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Mic,
  Users,
  ShieldAlert,
  Award,
  Volume2,
  VolumeX,
  ChevronDown,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";
import { StudentProfile } from "../types/siwes";
import { useBadges } from "../context/BadgeContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  onOpenProfileModal: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfileModal,
  audioEnabled,
  setAudioEnabled,
}) => {
  const { unlockedCount, badges } = useBadges();

  const navItems = [
    { id: "logbook", label: "Dossier & Logbook", icon: BookOpen },
    { id: "guide", label: "SIWES Writing Guide", icon: BookmarkCheck },
    { id: "quiz", label: "CBT & Technical Quizzes", icon: HelpCircle },
    { id: "interview", label: "Mock Defense", icon: Mic },
    { id: "live_panel", label: "Live Panel Chamber", icon: Users },
    { id: "traps", label: "Trap Flashcards", icon: ShieldAlert },
    { id: "readiness", label: "Readiness Rubric", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070a14]/90 border-b border-[#142033] backdrop-blur-xl">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
            <GraduationCap className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white block leading-none">
              SIWES DEFENSE AI
            </span>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="text-cyan-400 font-semibold">400L Penultimate</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-indigo-400">ITF & NUC Standard</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 border border-cyan-500/35 shadow-sm shadow-cyan-950"
                    : "text-slate-400 hover:text-slate-100 hover:bg-[#0e1626]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Candidate, Badges & Voice Actions */}
        <div className="flex items-center gap-2">
          {/* Badge Showcase Button */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 hover:from-cyan-900/60 hover:to-indigo-900/60 border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold text-cyan-300 shadow-sm transition-all cursor-pointer"
            title="View Earned Badges & Profile"
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline font-mono">{unlockedCount}/{badges.length}</span>
            <span className="hidden md:inline text-[11px] text-slate-300 font-normal">Badges</span>
            {unlockedCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse hidden sm:block" />
            )}
          </button>

          {/* Candidate Switcher */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 bg-[#0c1322] hover:bg-[#121c32] border border-[#1a273e] hover:border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs transition-all cursor-pointer text-left shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <div className="leading-tight">
              <div className="font-semibold text-slate-200 truncate max-w-[100px] sm:max-w-[140px]">
                {profile.studentName || "Candidate"}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">
                {profile.companyName}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Voice Speech Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              audioEnabled
                ? "bg-cyan-950/60 border-cyan-600/60 text-cyan-300 hover:bg-cyan-900/70"
                : "bg-[#0c1322] border-[#1a273e] text-slate-500 hover:text-slate-300"
            }`}
            title={audioEnabled ? "Panelist Voice Active" : "Voice Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar for medium & mobile screens */}
      <div className="xl:hidden flex space-x-1 overflow-x-auto px-4 py-2 border-t border-[#121b2d] scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
