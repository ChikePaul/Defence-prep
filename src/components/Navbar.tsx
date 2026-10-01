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
  MessageSquare,
  Globe,
  Radio,
  LogIn,
  LogOut,
} from "lucide-react";
import { StudentProfile } from "../types/siwes";
import { useBadges } from "../context/BadgeContext";
import { useAuth } from "../context/AuthContext";

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
  const { user, signInWithGoogle, logout } = useAuth();

  const navItems = [
    { id: "logbook", label: "Dossier & Logbook", icon: BookOpen },
    { id: "chat", label: "Gemini AI Coach", icon: MessageSquare },
    { id: "transcribe", label: "Audio Transcriber", icon: Mic },
    { id: "grounding", label: "Search Grounding", icon: Globe },
    { id: "live_voice", label: "Live Voice Defense", icon: Radio },
    { id: "quiz", label: "CBT & Quizzes", icon: HelpCircle },
    { id: "interview", label: "Mock Defense", icon: Users },
    { id: "traps", label: "Trap Cards", icon: ShieldAlert },
    { id: "readiness", label: "Readiness Rubric", icon: Award },
    { id: "guide", label: "Writing Guide", icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F1118]/95 border-b border-[#2E3447] backdrop-blur-xl">
      {/* 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-md text-white font-bold">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white block leading-none">
              SIWES DEFENSE AI
            </span>
            <div className="text-[10px] sm:text-[11px] text-[#6B7280] flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="text-[#3B82F6] font-semibold">400L IT Internship</span>
              <span aria-hidden="true" className="text-[#2E3447]">·</span>
              <span className="text-[#10B981]">ITF & NUC Rigor</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-1 text-xs font-semibold overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`!px-3 !py-1.5 !rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "!bg-[#3B82F6] !text-white shadow-sm"
                    : "!bg-transparent !text-[#D1D5DB] hover:!bg-[#1A1D2B] hover:!text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#6B7280]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Candidate, Firebase Auth & Voice Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Google Sign In / User Status */}
          {user ? (
            <div className="flex items-center gap-1.5 bg-[#1A1D2B] border border-[#2E3447] rounded-lg px-2.5 py-1.5 text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-5 h-5 rounded-full border border-[#3B82F6]"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#3B82F6] text-white font-bold flex items-center justify-center text-[10px]">
                  {user.displayName?.[0] || "U"}
                </div>
              )}
              <span className="hidden sm:inline font-semibold text-white max-w-[80px] truncate">
                {user.displayName?.split(" ")[0] || "Student"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" title="Firestore Synced" />
              <button
                onClick={logout}
                className="!p-1 !bg-transparent text-[#6B7280] hover:text-rose-400 ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle().catch((e) => console.error(e))}
              className="!px-3.5 !py-1.5 !rounded-lg !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Sign in with Google to sync defense progress & badges"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Badge Showcase Button */}
          <button
            onClick={onOpenProfileModal}
            className="!px-2.5 !py-1.5 !rounded-lg !bg-[#1A1D2B] hover:!bg-[#24293D] border border-[#2E3447] !text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="View Earned Badges & Profile"
          >
            <Award className="w-4 h-4 text-[#10B981]" />
            <span className="font-mono">{unlockedCount}/{badges.length}</span>
            <span className="hidden md:inline text-[11px] text-[#D1D5DB] font-normal">Badges</span>
          </button>

          {/* Candidate Switcher */}
          <button
            onClick={onOpenProfileModal}
            className="hidden sm:flex items-center gap-2 !bg-[#1A1D2B] hover:!bg-[#24293D] border border-[#2E3447] !rounded-lg !px-2.5 !py-1.5 text-xs transition-all cursor-pointer text-left shadow-sm !text-white"
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div className="leading-tight">
              <div className="font-semibold text-white truncate max-w-[90px]">
                {profile.studentName || "Candidate"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {/* Voice Speech Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`!p-2 !rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              audioEnabled
                ? "!bg-[#3B82F6] border-[#3B82F6] !text-white"
                : "!bg-[#1A1D2B] border-[#2E3447] !text-[#6B7280] hover:!text-white"
            }`}
            title={audioEnabled ? "Panelist Voice Active" : "Voice Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar for 2xl and below */}
      <div className="2xl:hidden flex space-x-1 overflow-x-auto px-4 py-2 border-t border-[#2E3447] scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`!px-3 !py-1.5 !rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "!bg-[#3B82F6] !text-white"
                  : "!bg-transparent !text-[#D1D5DB] hover:!bg-[#1A1D2B]"
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
