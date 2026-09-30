/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { LogbookEditor } from "./components/LogbookEditor";
import { SiwesGuideSection } from "./components/SiwesGuideSection";
import { CbtQuizSection } from "./components/CbtQuizSection";
import { MockInterviewSection } from "./components/MockInterviewSection";
import { OralDefensePanelLive } from "./components/OralDefensePanelLive";
import { TrapCardsSection } from "./components/TrapCardsSection";
import { ReadinessRubricSection } from "./components/ReadinessRubricSection";
import { ProfileModal } from "./components/ProfileModal";
import { BadgeToast } from "./components/BadgeToast";
import { BadgeProvider, useBadges } from "./context/BadgeContext";
import { SAMPLE_PROFILES } from "./data/sampleProfiles";
import { StudentProfile, ReportAnalysis } from "./types/siwes";
import { GraduationCap, Award, Sparkles } from "lucide-react";

function AppContent({
  profile,
  setProfile,
}: {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
}) {
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>("logbook");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const { activeNotification, dismissNotification, unlockedCount, badges } = useBadges();

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Cool Modern Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === "logbook" && (
          <LogbookEditor
            profile={profile}
            setProfile={setProfile}
            analysis={analysis}
            setAnalysis={setAnalysis}
            onProceedToQuiz={() => setActiveTab("quiz")}
          />
        )}

        {activeTab === "guide" && <SiwesGuideSection />}

        {activeTab === "quiz" && <CbtQuizSection profile={profile} />}

        {activeTab === "interview" && (
          <MockInterviewSection profile={profile} audioEnabled={audioEnabled} />
        )}

        {activeTab === "live_panel" && (
          <OralDefensePanelLive profile={profile} audioEnabled={audioEnabled} />
        )}

        {activeTab === "traps" && <TrapCardsSection profile={profile} />}

        {activeTab === "readiness" && <ReadinessRubricSection profile={profile} />}
      </main>

      {/* Profile & Badges Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* Toast Notification when a Badge is newly earned */}
      <BadgeToast badge={activeNotification} onDismiss={dismissNotification} />

      {/* Footer */}
      <footer className="border-t border-[#121b2d] bg-[#060810] py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-2.5 print:hidden">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 font-semibold text-[11px]">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Honors: {unlockedCount}/{badges.length} Badges Earned</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">
              SIWES Defense Prep & IT Internship Drill AI
            </span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-slate-400">400-Level Penultimate Year IT Defense Simulator</span>
        </div>
        <p className="max-w-xl mx-auto leading-relaxed text-[11px] text-slate-500">
          Built in accordance with the National Universities Commission (NUC), National Board for Technical Education (NBTE), and Industrial Training Fund (ITF) SIWES operational directives.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(SAMPLE_PROFILES[0].profile);

  return (
    <BadgeProvider studentId={profile.matricNo || "default"}>
      <AppContent profile={profile} setProfile={setProfile} />
    </BadgeProvider>
  );
}
