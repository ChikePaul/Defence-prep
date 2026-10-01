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
  CheckCircle2,
  Cloud,
  LogIn,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { StudentProfile, Badge } from "../types/siwes";
import { SAMPLE_PROFILES } from "../data/sampleProfiles";
import { useBadges } from "../context/BadgeContext";
import { useAuth } from "../context/AuthContext";

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
  const [modalTab, setModalTab] = useState<"badges" | "switch_candidate" | "edit_info" | "cloud_sync">("badges");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const { badges, unlockedCount } = useBadges();
  const { user, signInWithGoogle, logout, saveProfileToCloud, loadProfileFromCloud, saveProgressToCloud } = useAuth();

  if (!isOpen) return null;

  const percentage = Math.round((unlockedCount / badges.length) * 100);

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-5 h-5 ${unlocked ? "text-[#10B981]" : "text-[#6B7280]"}` };
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

  const handleCloudSave = async () => {
    if (!user) {
      setSyncStatus("Please sign in with Google first.");
      return;
    }
    setSyncing(true);
    setSyncStatus(null);
    try {
      const pSuccess = await saveProfileToCloud(profile);
      const bSuccess = await saveProgressToCloud(
        badges.filter((b) => b.unlocked).map((b) => b.id)
      );
      if (pSuccess && bSuccess) {
        setSyncStatus("Dossier and honors successfully backed up to Firestore!");
      } else {
        setSyncStatus("Encountered an issue saving to Firestore.");
      }
    } catch (err: any) {
      setSyncStatus(err.message || "Cloud save failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleCloudLoad = async () => {
    if (!user) {
      setSyncStatus("Please sign in with Google first.");
      return;
    }
    setSyncing(true);
    setSyncStatus(null);
    try {
      const loaded = await loadProfileFromCloud();
      if (loaded) {
        setProfile(loaded);
        setSyncStatus("Successfully loaded candidate profile from Firestore!");
      } else {
        setSyncStatus("No saved profile found in your Firestore cloud store.");
      }
    } catch (err: any) {
      setSyncStatus(err.message || "Cloud load failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1A1D2B] border border-[#2E3447] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2E3447] bg-[#0F1118] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white font-bold shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {profile.studentName || "Candidate Profile"}
                </h3>
                <span className="text-[11px] font-mono text-[#06B6D4] bg-[#0F1118] border border-[#2E3447] px-2 py-0.5 rounded-md">
                  {profile.matricNo || "400L"}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {profile.department} · {profile.institution}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="!p-1.5 !rounded-md !bg-transparent text-[#6B7280] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#2E3447] bg-[#0F1118] px-5 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setModalTab("badges")}
            className={`!py-3 !px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap !rounded-none ${
              modalTab === "badges"
                ? "!border-[#3B82F6] !bg-transparent !text-white"
                : "!border-transparent !bg-transparent !text-[#6B7280] hover:!text-white"
            }`}
          >
            <Award className="w-4 h-4 text-[#10B981]" />
            <span>Honors & Badges ({unlockedCount}/{badges.length})</span>
          </button>

          <button
            onClick={() => setModalTab("switch_candidate")}
            className={`!py-3 !px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap !rounded-none ${
              modalTab === "switch_candidate"
                ? "!border-[#3B82F6] !bg-transparent !text-white"
                : "!border-transparent !bg-transparent !text-[#6B7280] hover:!text-white"
            }`}
          >
            <span>Preset Profiles</span>
          </button>

          <button
            onClick={() => setModalTab("edit_info")}
            className={`!py-3 !px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap !rounded-none ${
              modalTab === "edit_info"
                ? "!border-[#3B82F6] !bg-transparent !text-white"
                : "!border-transparent !bg-transparent !text-[#6B7280] hover:!text-white"
            }`}
          >
            <span>Edit Credentials</span>
          </button>

          <button
            onClick={() => setModalTab("cloud_sync")}
            className={`!py-3 !px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap !rounded-none ${
              modalTab === "cloud_sync"
                ? "!border-[#3B82F6] !bg-transparent !text-white"
                : "!border-transparent !bg-transparent !text-[#6B7280] hover:!text-white"
            }`}
          >
            <Cloud className="w-4 h-4 text-[#06B6D4]" />
            <span>Firestore Cloud Sync</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: DEFENSE HONORS & BADGES */}
          {modalTab === "badges" && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#06B6D4]" />
                      <span>SIWES Defense Preparedness Mastery</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#10B981] sm:hidden">
                      {percentage}% Complete
                    </span>
                  </div>
                  <p className="text-xs text-[#D1D5DB] leading-snug">
                    Earn academic honors by mastering CBT quizzes, conquering oral defense mock panels, auditing logbooks, and studying trap cards.
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#1A1D2B] rounded-full h-2 overflow-hidden border border-[#2E3447]">
                    <div
                      className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-right shrink-0 hidden sm:block pl-4 border-l border-[#2E3447]">
                  <div className="text-2xl font-extrabold text-[#10B981] font-mono tracking-tight">
                    {unlockedCount} <span className="text-xs text-[#6B7280]">/ {badges.length}</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] block uppercase tracking-wider font-semibold">
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
                    className={`!px-3 !py-1.5 !rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      badgeFilter === cat.id
                        ? "!bg-[#3B82F6] !text-white shadow-sm"
                        : "!bg-[#0F1118] border border-[#2E3447] !text-[#D1D5DB] hover:!text-white"
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
                    className={`p-4 rounded-lg border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                      b.unlocked
                        ? "bg-[#0F1118] border-[#3B82F6]/60 shadow-lg"
                        : "bg-[#0F1118] border-[#2E3447] opacity-70"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                        b.unlocked
                          ? "bg-[#1A1D2B] border border-[#10B981]/40"
                          : "bg-[#1A1D2B] border border-[#2E3447]"
                      }`}
                    >
                      {renderBadgeIcon(b.iconName, b.unlocked)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{b.title}</h4>
                        {b.unlocked ? (
                          <span className="text-[10px] font-mono text-[#10B981] bg-[#1A1D2B] border border-[#10B981]/40 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Earned</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-[#6B7280] font-semibold shrink-0">
                            <Lock className="w-3 h-3 text-[#6B7280]" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-[#D1D5DB] mt-1 leading-snug">
                        {b.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#2E3447] text-[10px] flex items-center justify-between gap-2">
                        <span className="text-[#6B7280] font-medium truncate">
                          {b.requirement}
                        </span>
                        {b.unlockedAt && (
                          <span className="text-[#10B981] font-mono shrink-0">
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
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
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
                      className={`p-4 rounded-lg border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "!bg-[#0F1118] border-[#3B82F6] !text-white shadow-md"
                          : "!bg-[#0F1118] border-[#2E3447] !text-[#D1D5DB] hover:!bg-[#24293D]"
                      }`}
                    >
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{sample.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#3B82F6]" />}
                      </div>
                      <span className="text-[11px] text-[#6B7280] mt-1.5">{sample.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EDIT CREDENTIALS */}
          {modalTab === "edit_info" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                Update Student Dossier Credentials:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.studentName}
                    onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                    className="w-full bg-[#0F1118] border border-[#2E3447] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                    Matric / Reg Number
                  </label>
                  <input
                    type="text"
                    value={profile.matricNo}
                    onChange={(e) => setProfile({ ...profile, matricNo: e.target.value })}
                    className="w-full bg-[#0F1118] border border-[#2E3447] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={profile.institution}
                    onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                    className="w-full bg-[#0F1118] border border-[#2E3447] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full bg-[#0F1118] border border-[#2E3447] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                    Organization / Employer
                  </label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full bg-[#0F1118] border border-[#2E3447] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FIRESTORE CLOUD SYNC */}
          {modalTab === "cloud_sync" && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-[#06B6D4]" />
                    <span>Firebase Auth & Firestore Database</span>
                  </span>
                  <p className="text-xs text-[#6B7280] leading-snug">
                    {user
                      ? `Signed in as ${user.displayName || user.email}`
                      : "Sign in with Google to securely persist your SIWES logbook dossier, readiness scores, and earned honors."}
                  </p>
                </div>

                {user ? (
                  <button
                    onClick={logout}
                    className="!px-4 !py-2 !rounded-md !bg-rose-600 hover:!bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => signInWithGoogle().catch((e) => console.error(e))}
                    className="!px-4 !py-2.5 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In with Google</span>
                  </button>
                )}
              </div>

              {syncStatus && (
                <div className="p-3.5 rounded-md bg-[#0F1118] border border-[#10B981] text-[#10B981] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{syncStatus}</span>
                </div>
              )}

              {user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleCloudSave}
                    disabled={syncing}
                    className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] hover:border-[#3B82F6] text-left transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <div className="font-bold text-white text-xs flex items-center justify-between">
                      <span>Save Current Profile to Firestore</span>
                      <Cloud className="w-4 h-4 text-[#06B6D4] group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#6B7280] mt-1">
                      Upload your edited logbook, company info, and earned badges to your private cloud record.
                    </p>
                  </button>

                  <button
                    onClick={handleCloudLoad}
                    disabled={syncing}
                    className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] hover:border-[#3B82F6] text-left transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <div className="font-bold text-white text-xs flex items-center justify-between">
                      <span>Load Profile from Firestore</span>
                      <RefreshCw className="w-4 h-4 text-[#06B6D4] group-hover:rotate-180 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#6B7280] mt-1">
                      Retrieve your previously saved SIWES materials and resume your preparation session.
                    </p>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0F1118] border-t border-[#2E3447] flex justify-end">
          <button
            onClick={onClose}
            className="!px-5 !py-2.5 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs cursor-pointer shadow-md transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
