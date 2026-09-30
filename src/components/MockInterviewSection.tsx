import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Award,
  AlertTriangle,
  CheckCircle,
  Tag,
  Lightbulb,
  UserCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentProfile, InterviewQuestion, InterviewAnswerEvaluation } from "../types/siwes";
import { speakText, stopSpeaking, createSpeechRecognizer } from "../utils/speech";
import { useBadges } from "../context/BadgeContext";

interface MockInterviewSectionProps {
  profile: StudentProfile;
  audioEnabled: boolean;
}

export const MockInterviewSection: React.FC<MockInterviewSectionProps> = ({
  profile,
  audioEnabled,
}) => {
  const { awardBadge } = useBadges();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Student input state
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [evaluating, setEvaluating] = useState<Record<string, boolean>>({});
  const [evaluations, setEvaluations] = useState<Record<string, InterviewAnswerEvaluation>>({});
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const categories = [
    { id: "all", label: "All Pillars" },
    { id: "Technical Skills & Architecture", label: "1. Technical Skills" },
    { id: "Problem-Solving & Troubleshooting", label: "2. Problem-Solving" },
    { id: "Project Contributions & Impact", label: "3. Project Contributions" },
    { id: "Lessons Learned & Curriculum Tie-In", label: "4. Lessons & Curriculum" },
    { id: "Behavioral, HSE & Workplace Ethics", label: "5. Behavioral & Ethics" },
  ];

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setStudentAnswers({});
    setEvaluations({});
    try {
      const res = await fetch("/api/generate-interview-questions", {
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
      if (data.success && data.data?.interviewQuestions) {
        setQuestions(data.data.interviewQuestions);
      }
    } catch (err) {
      console.error("Error generating interview questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakQuestion = (q: InterviewQuestion) => {
    let persona: "academic" | "engineer" | "coordinator" = "academic";
    if (q.examinerPersona.toLowerCase().includes("engineer") || q.examinerPersona.toLowerCase().includes("industry")) {
      persona = "engineer";
    } else if (q.examinerPersona.toLowerCase().includes("coordinator") || q.examinerPersona.toLowerCase().includes("nwosu")) {
      persona = "coordinator";
    }
    speakText(q.question, persona);
  };

  // Toggle Speech-to-Text Microphone
  const handleToggleVoiceRecord = (qId: string) => {
    if (recordingId === qId) {
      setRecordingId(null);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setStudentAnswers((prev) => ({
          ...prev,
          [qId]: (prev[qId] ? prev[qId] + " " : "") + transcript,
        }));
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setRecordingId(null);
      },
      () => {
        setRecordingId(null);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        setRecordingId(qId);
      } catch (e) {
        console.error("Could not start speech recognition:", e);
        setRecordingId(null);
      }
    } else {
      alert("Speech recognition is not supported in this browser. Please type your response.");
    }
  };

  // Submit Answer for AI Academic Evaluation
  const handleSubmitAnswer = async (q: InterviewQuestion) => {
    const text = studentAnswers[q.id]?.trim();
    if (!text) return;

    setEvaluating((prev) => ({ ...prev, [q.id]: true }));
    try {
      const res = await fetch("/api/evaluate-interview-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          category: q.category,
          examinerPersona: q.examinerPersona,
          studentAnswer: text,
          evaluationCriteria: q.evaluationCriteria,
          logbookContext: profile.logbookSummary + "\n" + profile.reportSummary,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvaluations((prev) => ({ ...prev, [q.id]: data.data }));
        if (data.data.score >= 75) {
          awardBadge("oral_defense_pro");
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.65 },
          });
        }
        if (audioEnabled && data.data.spokenFeedback) {
          speakText(data.data.spokenFeedback);
        }
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
    } finally {
      setEvaluating((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (activeCategory === "all") return true;
    return q.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#081524] via-[#090d16] to-[#081524] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 flex items-center gap-2 tracking-wide uppercase">
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>Oral Defense Interview Simulation Engine</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Speech & Voice Powered</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            SIWES Defense Mock Interview: 5 Pillars
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Practice answering the 5 major categories of questions asked by departmental panels: Technical Skills, Problem-Solving, Contributions, Lessons Learned, and Workplace Behavioral/Safety Ethics. Submit your answers by voice or text for instant constructive feedback!
          </p>
        </div>

        <button
          onClick={handleGenerateQuestions}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Drafting Questions..." : "Generate Mock Interview Set"}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === c.id
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {questions.length === 0 && !loading && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800 flex items-center justify-center mx-auto text-cyan-400">
            <Mic className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Mock Interview Questions Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click "Generate Mock Interview Set" to produce tailored oral defense questions covering technical skills, troubleshooting anecdotes, contributions, and behavioral scenarios.
          </p>
          <button
            onClick={handleGenerateQuestions}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Defense Questions</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Synthesizing SIWES Defense Questions...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Formulating panel questions across technical architecture, project contributions, and workplace dilemmas for candidate at {profile.companyName}.
          </p>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 && !loading && (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const currentAnswer = studentAnswers[q.id] || "";
            const evalResult = evaluations[q.id];
            const isSubmitting = evaluating[q.id];
            const isRecording = recordingId === q.id;
            const isExpanded = expandedDetails[q.id];

            return (
              <div
                key={q.id}
                className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all"
              >
                {/* Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <span className="font-bold text-white">Question {idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-400 font-semibold">{q.category}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{q.examinerPersona}</span>
                    </span>

                    {/* Audio Play Question */}
                    <button
                      type="button"
                      onClick={() => handleSpeakQuestion(q)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
                      title="Listen to question spoken by examiner"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* The Oral Question */}
                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    "{q.question}"
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    <span className="font-semibold text-slate-300 not-italic">Why Examiners Ask: </span>
                    {q.whyExaminersAskThis}
                  </p>
                </div>

                {/* Answer Submission Box */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400">
                      Candidate Oral Response:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleVoiceRecord(q.id)}
                        className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isRecording
                            ? "bg-red-950 text-red-300 border-red-600 animate-pulse font-bold"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
                        }`}
                      >
                        {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{isRecording ? "Listening (Click to Stop)..." : "Answer by Voice (Mic)"}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={currentAnswer}
                    onChange={(e) =>
                      setStudentAnswers({ ...studentAnswers, [q.id]: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-[#070b12] border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    placeholder="Structure your defense answer using STAR (Situation, Task, Action, Result). State the tools, exact commands, and lessons learned..."
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>
                      {currentAnswer.length} characters typed
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSubmitAnswer(q)}
                      disabled={isSubmitting || !currentAnswer.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                      <span>{isSubmitting ? "Evaluating..." : "Submit Response"}</span>
                    </button>
                  </div>
                </div>

                {/* Automated Constructive Feedback Card */}
                {evalResult && (
                  <div className="p-5 rounded-2xl bg-[#070b12] border border-slate-800 space-y-4 animate-fade-in shadow-inner">
                    {/* Header Reaction & Score */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400 flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>Panelist Reaction:</span>
                        </span>
                        <span className="font-semibold text-slate-200">
                          {evalResult.reaction}
                        </span>
                      </div>

                      <div className="font-mono font-bold text-white">
                        Defense Score:{" "}
                        <span
                          className={
                            evalResult.score >= 75
                              ? "text-emerald-400"
                              : evalResult.score >= 50
                              ? "text-amber-400"
                              : "text-red-400"
                          }
                        >
                          {evalResult.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Examiner Spoken Remark */}
                    <div className="p-3.5 rounded-xl bg-[#0b101c] border border-cyan-900/30 text-xs text-cyan-200 italic flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-cyan-300 not-italic">
                          {q.examinerPersona}'s Remark:{" "}
                        </span>
                        "{evalResult.spokenFeedback}"
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Areas of Strength:
                      </span>
                      <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5 pl-1">
                        {evalResult.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas To Improve */}
                    {evalResult.areasToImprove.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Critical Areas for Improvement:
                        </span>
                        <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5 pl-1">
                          {evalResult.areasToImprove.map((ati, i) => (
                            <li key={i}>{ati}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Review Topics */}
                    {evalResult.suggestedReviewTopics.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-cyan-400 block">
                          Suggested Topics for Further Review:
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                          {evalResult.suggestedReviewTopics.map((top, i) => (
                            <span key={i} className="text-cyan-300 font-mono">
                              • {top}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pro Tip */}
                    {evalResult.defenseProTip && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-400">Oral Defense Pro-Tip: </span>
                          {evalResult.defenseProTip}
                        </div>
                      </div>
                    )}

                    {/* Model Answer Guideline Dropdown */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDetails((prev) => ({
                            ...prev,
                            [q.id]: !prev[q.id],
                          }))
                        }
                        className="text-xs text-slate-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{isExpanded ? "Hide High-Scoring Benchmark Answer" : "View High-Scoring Benchmark Model Answer (STAR Method)"}</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3.5 rounded-xl bg-[#0b101c] border border-slate-800 text-xs space-y-2 text-slate-300">
                          <div>
                            <span className="font-bold text-cyan-400 block mb-0.5">
                              Model Answer (STAR Format):
                            </span>
                            <p className="leading-relaxed">{evalResult.modelAnswer}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-400 block mb-0.5">
                              Panelist Evaluation Criteria:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5">
                              {q.evaluationCriteria.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
