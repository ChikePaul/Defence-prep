import React, { useState } from "react";
import {
  Users,
  Mic,
  MicOff,
  Send,
  Volume2,
  Award,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Radio,
  ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentProfile, DefenseExaminer, DefenseMessage } from "../types/siwes";
import { speakText, createSpeechRecognizer } from "../utils/speech";
import { useBadges } from "../context/BadgeContext";

// Generated image assets
import panelTableImg from "../assets/images/defense_panel_table_1790811486258.jpg";

interface OralDefensePanelLiveProps {
  profile: StudentProfile;
  audioEnabled: boolean;
}

export const OralDefensePanelLive: React.FC<OralDefensePanelLiveProps> = ({
  profile,
  audioEnabled,
}) => {
  const { awardBadge } = useBadges();
  const [loading, setLoading] = useState(false);
  const [panelChairIntro, setPanelChairIntro] = useState<string>("");
  const [examiners, setExaminers] = useState<DefenseExaminer[]>([]);
  const [activeExaminerId, setActiveExaminerId] = useState<string>("");
  const [messages, setMessages] = useState<DefenseMessage[]>([]);
  const [candidateInput, setCandidateInput] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Initialize live session
  const handleStartDefense = async () => {
    setLoading(true);
    setMessages([]);
    try {
      const res = await fetch("/api/init-defense-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { panelChairIntro: intro, examiners: exList, initialQuestions } = data.data;
        setPanelChairIntro(intro || "");
        setExaminers(exList || []);

        const initialMsgs: DefenseMessage[] = [
          {
            id: "msg_intro",
            sender: "system",
            text: `Departmental SIWES Defense Convened • Candidate: ${profile.studentName || "Candidate"} (${profile.matricNo || "400L"}). Venue: Academic Committee Boardroom.`,
            timestamp: Date.now(),
          },
        ];

        if (intro) {
          initialMsgs.push({
            id: "msg_chair",
            sender: "examiner",
            examinerName: exList?.[0]?.name || "Panel Chair",
            examinerId: exList?.[0]?.id,
            text: intro,
            timestamp: Date.now() + 100,
          });
        }

        // Add first starter question
        if (initialQuestions && initialQuestions.length > 0) {
          const q1 = initialQuestions[0];
          const exObj = exList?.find((e: DefenseExaminer) => e.id === q1.examinerId) || exList?.[0];
          initialMsgs.push({
            id: "msg_q1",
            sender: "examiner",
            examinerId: exObj?.id,
            examinerName: exObj?.name,
            text: q1.question,
            context: q1.context,
            timestamp: Date.now() + 200,
          });
          setActiveExaminerId(exObj?.id || "");
          if (audioEnabled && q1.question) {
            speakText(q1.question, exObj?.avatarRole || "academic");
          }
        }

        setMessages(initialMsgs);
      }
    } catch (err) {
      console.error("Error starting defense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit candidate answer to live panel
  const handleSendAnswer = async () => {
    const text = candidateInput.trim();
    if (!text || evaluating) return;

    const currentExaminer = examiners.find((e) => e.id === activeExaminerId) || examiners[0];
    const lastQuestionMsg = [...messages].reverse().find((m) => m.sender === "examiner");
    const lastQuestion = lastQuestionMsg ? lastQuestionMsg.text : "Explain your SIWES contributions.";

    const studentMsg: DefenseMessage = {
      id: `std_${Date.now()}`,
      sender: "student",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setCandidateInput("");
    setEvaluating(true);

    try {
      const res = await fetch("/api/evaluate-defense-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examiner: currentExaminer,
          question: lastQuestion,
          studentAnswer: text,
          reportContext: profile.logbookSummary + "\n" + profile.reportSummary,
          conversationHistory: messages.slice(-4),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const feedback = data.data;

        // Feedback / response message from examiner
        const feedbackMsg: DefenseMessage = {
          id: `ex_${Date.now()}`,
          sender: "examiner",
          examinerId: currentExaminer?.id,
          examinerName: currentExaminer?.name,
          text: feedback.examinerFeedback,
          score: feedback.score,
          reaction: feedback.reaction,
          critique: feedback.critique,
          modelRebuttal: feedback.modelRebuttal,
          defenseTip: feedback.defenseTip,
          timestamp: Date.now() + 100,
        };

        const updated = [...messages, studentMsg, feedbackMsg];

        // If examiner poses a follow-up question
        if (feedback.followUp?.question) {
          const nextEx =
            examiners.find((e) => e.name === feedback.followUp.nextExaminer) || currentExaminer;
          const followUpMsg: DefenseMessage = {
            id: `ex_next_${Date.now()}`,
            sender: "examiner",
            examinerId: nextEx?.id,
            examinerName: nextEx?.name,
            text: feedback.followUp.question,
            timestamp: Date.now() + 200,
          };
          updated.push(followUpMsg);
          setActiveExaminerId(nextEx?.id);

          if (audioEnabled) {
            speakText(feedback.followUp.question, nextEx?.avatarRole || "academic");
          }
        }

        setMessages(updated);

        if (feedback.score >= 8) {
          awardBadge("oral_defense_pro");
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
          });
        }
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // Toggle Speech Input
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setCandidateInput((prev) => (prev ? prev + " " : "") + transcript);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Could not start speech recognition:", e);
        setIsRecording(false);
      }
    } else {
      alert("Microphone speech recognition is not supported in this browser.");
    }
  };

  // Calculate cumulative defense grade
  const scoredMessages = messages.filter((m) => m.score !== undefined);
  const avgScore =
    scoredMessages.length > 0
      ? Math.round(
          (scoredMessages.reduce((acc, m) => acc + (m.score || 0), 0) / scoredMessages.length) * 10
        )
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner with Visual Committee Table Anchor */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#0d1424] via-[#0b101c] to-[#0d1424] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 z-10">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2 tracking-wide uppercase">
              <span>Oral Defense Simulation Chamber</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Multi-Examiner Grilling</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Live Academic Committee Chamber
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Step up to the podium before the 3-examiner departmental board: the strict Academic Chair (theoretical depth), the Industry Specialist (live debugging & tools), and the SIWES Coordinator (logbook authenticity & HSE).
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleStartDefense}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Convening Boardroom..." : messages.length > 0 ? "Re-convene Defense" : "Convene Defense Panel"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-60 lg:h-full relative overflow-hidden">
            <img
              src={panelTableImg}
              alt="Academic defense committee at high table"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d1424] via-[#0d1424]/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Examiners High Table */}
      {examiners.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Departmental Defense Committee (High Table)</span>
            </span>
            {avgScore !== null && (
              <span className="font-mono text-emerald-400 font-bold">
                Running Mark: {avgScore}% ({avgScore >= 70 ? "First Class" : "Credit Pass"})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examiners.map((ex) => {
              const isActive = activeExaminerId === ex.id;
              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-[#0f172a] border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500"
                      : "bg-[#0b101c] border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        ex.avatarRole === "academic"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                          : ex.avatarRole === "engineer"
                          ? "bg-teal-950/80 text-teal-400 border border-teal-800"
                          : "bg-cyan-950/80 text-cyan-400 border border-cyan-800"
                      }`}
                    >
                      {ex.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white truncate">{ex.name}</span>
                        {isActive && (
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-3 bg-emerald-400 animate-pulse rounded-full" />
                            <span className="w-1.5 h-4 bg-emerald-400 animate-pulse delay-75 rounded-full" />
                            <span className="w-1.5 h-2 bg-emerald-400 animate-pulse delay-150 rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-emerald-400 truncate">{ex.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{ex.focusArea}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Defense Dialogue Window */}
      {messages.length > 0 ? (
        <div className="bg-[#0b101c] border border-slate-800 rounded-3xl flex flex-col h-[580px] shadow-2xl overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              if (m.sender === "system") {
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-[#070b12] border border-slate-800/80 text-center text-xs text-slate-400 font-mono"
                  >
                    {m.text}
                  </div>
                );
              }

              if (m.sender === "examiner") {
                return (
                  <div key={m.id} className="flex flex-col items-start space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-emerald-400">
                        {m.examinerName || "Examiner"}
                      </span>
                      {m.reaction && (
                        <span className="text-[11px] text-slate-400">
                          · {m.reaction.replace("_", " ")}
                        </span>
                      )}
                      {m.score !== undefined && (
                        <span className="font-mono text-emerald-300 font-bold text-xs">
                          [{m.score}/10]
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => speakText(m.text)}
                        className="text-slate-500 hover:text-emerald-300 transition-colors p-1 cursor-pointer"
                        title="Speak question aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl rounded-tl-sm bg-[#121929] border border-slate-800 text-xs sm:text-sm text-slate-100 leading-relaxed shadow-md">
                      {m.text}
                    </div>

                    {/* Critique / Rebuttal Card if available */}
                    {m.critique && (
                      <div className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800 text-xs space-y-1.5 w-full">
                        {m.critique.strengths.length > 0 && (
                          <div className="text-emerald-400">
                            <span className="font-bold">Strengths: </span>
                            {m.critique.strengths.join("; ")}
                          </div>
                        )}
                        {m.critique.weaknesses.length > 0 && (
                          <div className="text-amber-400">
                            <span className="font-bold">Panel Critique: </span>
                            {m.critique.weaknesses.join("; ")}
                          </div>
                        )}
                        {m.defenseTip && (
                          <div className="text-teal-300 pt-1 border-t border-slate-800/80">
                            <span className="font-bold">Oral Defense Advice: </span>
                            {m.defenseTip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // Student message
              return (
                <div key={m.id} className="flex flex-col items-end space-y-1 max-w-3xl ml-auto">
                  <span className="text-xs text-slate-400">
                    Candidate ({profile.studentName || "You"})
                  </span>
                  <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-medium text-xs sm:text-sm leading-relaxed shadow-md">
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Candidate Response Dock */}
          <div className="p-4 bg-[#070b12] border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Defend your work before the panel:</span>
              </span>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-950 text-red-300 border-red-600 animate-pulse font-bold"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isRecording ? "Listening..." : "Speak by Mic"}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={candidateInput}
                onChange={(e) => setCandidateInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendAnswer())}
                placeholder="Respectfully address the panel: 'Thank you, Professor. In Week 7, we observed that...'"
                className="flex-1 bg-[#0b101c] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleSendAnswer}
                disabled={evaluating || !candidateInput.trim()}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                <Send className={`w-4 h-4 ${evaluating ? "animate-spin" : ""}`} />
                <span>{evaluating ? "Scoring..." : "Defend"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Defense Room Is Currently Empty</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click "Convene Defense Panel" above. The Academic Chair will call you up to the podium and initiate cross-examination.
          </p>
          <button
            onClick={handleStartDefense}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter Defense Room</span>
          </button>
        </div>
      )}
    </div>
  );
};
