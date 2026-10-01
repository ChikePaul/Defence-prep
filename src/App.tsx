/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { LogbookEditor } from "./components/LogbookEditor";
import { GeminiChatbotSection } from "./components/GeminiChatbotSection";
import { AudioTranscriberSection } from "./components/AudioTranscriberSection";
import { SearchGroundingSection } from "./components/SearchGroundingSection";
import { LiveVoiceDefenseSection } from "./components/LiveVoiceDefenseSection";
import { SiwesGuideSection } from "./components/SiwesGuideSection";
import { CbtQuizSection } from "./components/CbtQuizSection";
import { MockInterviewSection } from "./components/MockInterviewSection";
import { OralDefensePanelLive } from "./components/OralDefensePanelLive";
import { TrapCardsSection } from "./components/TrapCardsSection";
import { ReadinessRubricSection } from "./components/ReadinessRubricSection";
import { ProfileModal } from "./components/ProfileModal";
import { BadgeToast } from "./components/BadgeToast";
import { BadgeProvider, useBadges } from "./context/BadgeContext";
import { AuthProvider } from "./context/AuthContext";
import { SAMPLE_PROFILES } from "./data/sampleProfiles";
import { StudentProfile, ReportAnalysis } from "./types/siwes";
import { GraduationCap, Award } from "lucide-react";

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
    <div className="min-h-screen bg-[#0F1118] text-[#D1D5DB] flex flex-col font-sans relative overflow-x-hidden">
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

        {activeTab === "chat" && <GeminiChatbotSection profile={profile} />}

        {activeTab === "transcribe" && <AudioTranscriberSection />}

        {activeTab === "grounding" && <SearchGroundingSection profile={profile} />}

        {activeTab === "live_voice" && (
          <LiveVoiceDefenseSection profile={profile} audioEnabled={audioEnabled} />
        )}

        {activeTab === "quiz" && <CbtQuizSection profile={profile} />}

        {activeTab === "interview" && (
          <MockInterviewSection profile={profile} audioEnabled={audioEnabled} />
        )}

        {activeTab === "traps" && <TrapCardsSection profile={profile} />}

        {activeTab === "readiness" && <ReadinessRubricSection profile={profile} />}

        {activeTab === "guide" && <SiwesGuideSection />}
      </main>

      {/* Profile, Badges & Firebase Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* Toast Notification when a Badge is newly earned */}
      <BadgeToast badge={activeNotification} onDismiss={dismissNotification} />

      {/* Footer */}
      <footer className="border-t border-[#2E3447] bg-[#1A1D2B] py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#6B7280] space-y-2.5 print:hidden">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1118] border border-[#2E3447] text-[#10B981] font-semibold text-[11px]">
            <Award className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Honors: {unlockedCount}/{badges.length} Badges Earned</span>
          </div>
          <span aria-hidden="true" className="text-[#2E3447]">·</span>
          <div className="flex items-center gap-1.5 text-[#D1D5DB]">
            <GraduationCap className="w-4 h-4 text-[#3B82F6]" />
            <span className="font-semibold text-white">
              SIWES Defense Prep & IT Internship Drill AI
            </span>
          </div>
          <span aria-hidden="true" className="text-[#2E3447]">·</span>
          <span>400-Level Penultimate Year IT Defense Simulator</span>
        </div>
        <p className="max-w-xl mx-auto leading-relaxed text-[11px] text-[#6B7280]">
          Built in accordance with the National Universities Commission (NUC), National Board for Technical Education (NBTE), and Industrial Training Fund (ITF) SIWES operational directives.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(SAMPLE_PROFILES[0].profile);

  return (
    <AuthProvider>
      <BadgeProvider studentId={profile.matricNo || "default"}>
        <AppContent profile={profile} setProfile={setProfile} />
      </BadgeProvider>
    </AuthProvider>
  );
}
