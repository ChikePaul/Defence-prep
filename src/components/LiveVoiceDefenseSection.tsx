import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Radio,
  Users,
  PhoneCall,
  PhoneOff,
  Sparkles,
} from "lucide-react";
import { StudentProfile } from "../types/siwes";
import { speakText, createSpeechRecognizer } from "../utils/speech";
import { useBadges } from "../context/BadgeContext";
import confetti from "canvas-confetti";

interface LiveVoiceDefenseSectionProps {
  profile: StudentProfile;
  audioEnabled: boolean;
}

interface DialogueTurn {
  id: string;
  sender: "student" | "examiner";
  text: string;
  timestamp: number;
}

export const LiveVoiceDefenseSection: React.FC<LiveVoiceDefenseSectionProps> = ({
  profile,
  audioEnabled,
}) => {
  const { awardBadge } = useBadges();
  const [sessionActive, setSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [history, setHistory] = useState<DialogueTurn[]>([]);
  const [examinerRole, setExaminerRole] = useState<"academic" | "engineer" | "coordinator">("academic");
  const [loadingTurn, setLoadingTurn] = useState(false);

  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startSession = async () => {
    setSessionActive(true);
    setHistory([]);
    setCurrentTranscript("");

    const initialGreeting =
      examinerRole === "engineer"
        ? `Engr. Danladi here. Candidate ${profile.studentName || ""}, tell me about your IT internship at ${profile.companyName}. What system did you deploy?`
        : examinerRole === "coordinator"
        ? `Dr. Nwosu, SIWES coordinator. Did your 24 weeks meet ITF logbook requirements? Walk me through your organogram.`
        : `Prof. Adebayo presiding. Welcome to your 400L defense, candidate. Present your technical contribution in 2 sentences.`;

    const firstTurn: DialogueTurn = {
      id: `turn_${Date.now()}`,
      sender: "examiner",
      text: initialGreeting,
      timestamp: Date.now(),
    };

    setHistory([firstTurn]);
    if (audioEnabled) {
      speakText(initialGreeting, examinerRole);
    }
  };

  const endSession = () => {
    setSessionActive(false);
    setIsListening(false);
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
  };

  const startVoiceInput = () => {
    if (!sessionActive) return;

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setCurrentTranscript(transcript);
        handleSendTurn(transcript);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        setIsListening(true);
        recognizerRef.current = recognizer;
      } catch (e) {
        console.error("Could not start microphone:", e);
        setIsListening(false);
      }
    } else {
      alert("Speech recognition is not available in this browser. Please use text mode below.");
    }
  };

  const handleSendTurn = async (spokenText?: string) => {
    const text = (spokenText || currentTranscript).trim();
    if (!text || loadingTurn) return;

    const studentTurn: DialogueTurn = {
      id: `std_${Date.now()}`,
      sender: "student",
      text,
      timestamp: Date.now(),
    };

    const updatedHistory = [...history, studentTurn];
    setHistory(updatedHistory);
    setCurrentTranscript("");
    setLoadingTurn(true);

    try {
      const res = await fetch("/api/live-defense-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentUtterance: text,
          history: updatedHistory.slice(-4),
          examinerRole,
          profileContext: `${profile.studentName}, ${profile.department}, ${profile.companyName}. Tech: ${profile.technologies.join(", ")}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const examinerTurn: DialogueTurn = {
          id: `ex_${Date.now()}`,
          sender: "examiner",
          text: data.reply,
          timestamp: Date.now(),
        };

        setHistory((prev) => [...prev, examinerTurn]);

        if (audioEnabled) {
          speakText(data.reply, examinerRole);
        }

        if (updatedHistory.length >= 4) {
          awardBadge("oral_defense_pro");
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
          });
        }
      }
    } catch (err) {
      console.error("Live turn error:", err);
    } finally {
      setLoadingTurn(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="rounded-xl border border-[#2E3447] bg-[#1A1D2B] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-[#06B6D4] flex items-center gap-2 tracking-wide uppercase">
            <Radio className="w-4 h-4 text-[#06B6D4] animate-pulse" />
            <span>Real-Time Voice Conversations</span>
            <span aria-hidden="true" className="text-[#2E3447]">·</span>
            <span className="text-[#3B82F6]">gemini-3.8-live (Live API)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Live Oral Defense Voice Simulator
          </h2>

          <p className="text-[#D1D5DB] text-sm leading-relaxed">
            Have a continuous, spoken oral conversation with your departmental examiner. Powered by Gemini 3.8 Live, the examiner cross-examines your SIWES work out loud and responds to your spoken rebuttal.
          </p>
        </div>

        {/* Examiner Role Selector */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">
            Examiner Voice Persona:
          </span>
          <div className="bg-[#0F1118] border border-[#2E3447] p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setExaminerRole("academic")}
              className={`!px-3 !py-1.5 !rounded-md font-semibold transition-all cursor-pointer ${
                examinerRole === "academic"
                  ? "!bg-[#3B82F6] !text-white shadow-sm"
                  : "!bg-transparent !text-[#D1D5DB] hover:!text-white"
              }`}
            >
              Prof. Adebayo
            </button>
            <button
              onClick={() => setExaminerRole("engineer")}
              className={`!px-3 !py-1.5 !rounded-md font-semibold transition-all cursor-pointer ${
                examinerRole === "engineer"
                  ? "!bg-[#3B82F6] !text-white shadow-sm"
                  : "!bg-transparent !text-[#D1D5DB] hover:!text-white"
              }`}
            >
              Engr. Danladi
            </button>
            <button
              onClick={() => setExaminerRole("coordinator")}
              className={`!px-3 !py-1.5 !rounded-md font-semibold transition-all cursor-pointer ${
                examinerRole === "coordinator"
                  ? "!bg-[#3B82F6] !text-white shadow-sm"
                  : "!bg-transparent !text-[#D1D5DB] hover:!text-white"
              }`}
            >
              Dr. Nwosu
            </button>
          </div>
        </div>
      </div>

      {/* Main Chamber UI */}
      <div className="bg-[#1A1D2B] border border-[#2E3447] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E3447] pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                sessionActive
                  ? "bg-[#10B981] animate-pulse shadow-md"
                  : "bg-[#6B7280]"
              }`}
            />
            <div>
              <h3 className="text-sm font-bold text-white">
                {sessionActive ? "Live Defense Session in Progress" : "Oral Defense Chamber Idle"}
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                {sessionActive
                  ? "Examiner is listening and evaluating oral delivery in real-time."
                  : "Click Start Live Session to begin your continuous voice examination."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!sessionActive ? (
              <button
                onClick={startSession}
                className="!px-6 !py-3 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Live Voice Defense</span>
              </button>
            ) : (
              <button
                onClick={endSession}
                className="!px-6 !py-3 !rounded-md !bg-rose-600 hover:!bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Conclude Defense Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Conversation Transcript */}
        <div className="h-80 overflow-y-auto space-y-4 p-4 rounded-lg bg-[#0F1118] border border-[#2E3447]">
          {history.length > 0 ? (
            history.map((turn) => {
              const isStudent = turn.sender === "student";
              return (
                <div
                  key={turn.id}
                  className={`flex gap-3 max-w-2xl ${
                    isStudent ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isStudent
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1A1D2B] border border-[#2E3447] text-[#06B6D4]"
                    }`}
                  >
                    {isStudent ? "You" : "Panel"}
                  </div>

                  <div
                    className={`p-3.5 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                      isStudent
                        ? "bg-[#1A1D2B] border-[#3B82F6]/60 text-white rounded-tr-none"
                        : "bg-[#1A1D2B] border-[#2E3447] text-[#D1D5DB] rounded-tl-none"
                    }`}
                  >
                    <div className="text-[10px] text-[#6B7280] mb-1 font-mono font-semibold">
                      {isStudent
                        ? profile.studentName || "Candidate"
                        : examinerRole === "engineer"
                        ? "Engr. Danladi"
                        : examinerRole === "coordinator"
                        ? "Dr. Nwosu"
                        : "Prof. Adebayo"}
                    </div>
                    <div>{turn.text}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#6B7280] space-y-2">
              <Users className="w-8 h-8 opacity-40 text-[#3B82F6]" />
              <p className="text-xs">Chamber is silent. Start the session to begin dialogue.</p>
            </div>
          )}

          {loadingTurn && (
            <div className="flex gap-2 items-center text-xs text-[#06B6D4] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Examiner is evaluating your spoken answer via Live API...</span>
            </div>
          )}
        </div>

        {/* Microphone Speak Control Bar */}
        {sessionActive && (
          <div className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={startVoiceInput}
                disabled={loadingTurn}
                className={`!px-5 !py-3 !rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isListening
                    ? "!bg-rose-500 text-white animate-pulse"
                    : "!bg-[#3B82F6] hover:!bg-[#06B6D4] text-white"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? "Listening... Speak now" : "Push to Speak Response"}</span>
              </button>

              <span className="text-[11px] text-[#6B7280]">
                {isListening ? "Release when done speaking" : "Or type text below"}
              </span>
            </div>

            {/* Fallback Text Input */}
            <div className="flex items-center gap-2 w-full sm:w-96">
              <input
                type="text"
                value={currentTranscript}
                onChange={(e) => setCurrentTranscript(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendTurn();
                }}
                placeholder="Type your oral defense response..."
                className="w-full bg-[#1A1D2B] border border-[#2E3447] rounded-md px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6]"
              />
              <button
                onClick={() => handleSendTurn()}
                disabled={!currentTranscript.trim() || loadingTurn}
                className="!px-4 !py-2 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs cursor-pointer disabled:opacity-40"
              >
                Speak
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
