import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  Award,
  ChevronDown,
  ChevronUp,
  PenTool,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentProfile, QuizQuestion, ShortAnswerQuestion, ShortAnswerEvaluation } from "../types/siwes";
import { useBadges } from "../context/BadgeContext";

interface CbtQuizSectionProps {
  profile: StudentProfile;
}

export const CbtQuizSection: React.FC<CbtQuizSectionProps> = ({ profile }) => {
  const { awardBadge } = useBadges();
  const [subTab, setSubTab] = useState<"mcq" | "short_answer">("mcq");
  const [loading, setLoading] = useState(false);
  const [mcqQuestions, setMcqQuestions] = useState<QuizQuestion[]>([]);
  const [shortQuestions, setShortQuestions] = useState<ShortAnswerQuestion[]>([]);
  
  // MCQ state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [mcqFilter, setMcqFilter] = useState<string>("all");
  const [examTimer, setExamTimer] = useState<number>(900); // 15 mins
  const [timerActive, setTimerActive] = useState(false);

  // Short Answer state
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [evaluatingShort, setEvaluatingShort] = useState<Record<string, boolean>>({});
  const [shortEvaluations, setShortEvaluations] = useState<Record<string, ShortAnswerEvaluation>>({});
  const [expandedRubrics, setExpandedRubrics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let interval: any = null;
    if (timerActive && examTimer > 0) {
      interval = setInterval(() => {
        setExamTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (examTimer === 0 && timerActive) {
      setShowResults(true);
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, examTimer]);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    setShortAnswers({});
    setShortEvaluations({});
    try {
      const res = await fetch("/api/generate-quiz", {
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
      if (data.success && data.data) {
        setMcqQuestions(data.data.mcqQuestions || []);
        setShortQuestions(data.data.shortAnswerQuestions || []);
        setTimerActive(true);
        setExamTimer(900);
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleFinishMcq = () => {
    setShowResults(true);
    setTimerActive(false);
    const correctCount = mcqQuestions.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length;
    if (correctCount / mcqQuestions.length >= 0.7) {
      awardBadge("quiz_master");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSubmitShortAnswer = async (q: ShortAnswerQuestion) => {
    const studentText = shortAnswers[q.id]?.trim();
    if (!studentText) return;

    setEvaluatingShort((prev) => ({ ...prev, [q.id]: true }));
    try {
      const res = await fetch("/api/evaluate-short-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          studentAnswer: studentText,
          expectedKeyPoints: q.expectedKeyPoints,
          modelAnswer: q.modelAnswer,
          logbookContext: profile.logbookSummary,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShortEvaluations((prev) => ({ ...prev, [q.id]: data.data }));
        if (data.data.score >= 75) {
          awardBadge("troubleshooter");
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
      }
    } catch (err) {
      console.error("Error evaluating short answer:", err);
    } finally {
      setEvaluatingShort((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const filteredMcqs = mcqQuestions.filter((q) => {
    if (mcqFilter === "all") return true;
    return q.category === mcqFilter;
  });

  const mcqScore = mcqQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const progressPercentage =
    mcqQuestions.length > 0
      ? Math.round((Object.keys(selectedAnswers).length / mcqQuestions.length) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0c101c] via-[#080b13] to-[#0c101c] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 flex items-center gap-2 tracking-wide uppercase">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>SIWES Logbook-Grounded CBT Examination</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Technical Diagnostic</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Automated Quizzes: Tasks, Challenges & Solutions
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tests your technical depth across specific logbook weeks: operational procedures, real-world engineering bottlenecks faced, and architectural solutions implemented at <span className="text-cyan-400 font-semibold">{profile.companyName}</span>.
          </p>
        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Generating Quizzes..." : "Generate New Quiz Set"}</span>
        </button>
      </div>

      {/* Sub Tabs: Part A (MCQ) vs Part B (Short-Answer) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab("mcq")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === "mcq"
                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Part A: Multiple-Choice CBT ({mcqQuestions.length})</span>
          </button>
          <button
            onClick={() => setSubTab("short_answer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === "short_answer"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Part B: Short-Answer Troubleshooting ({shortQuestions.length})</span>
          </button>
        </div>

        {/* Status Indicators */}
        {subTab === "mcq" && mcqQuestions.length > 0 && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">{formatTimer(examTimer)}</span>
            </div>
            {showResults && (
              <span className="text-cyan-400 font-bold">
                Score: {mcqScore} / {mcqQuestions.length} ({Math.round((mcqScore / mcqQuestions.length) * 100)}%)
              </span>
            )}
          </div>
        )}
      </div>

      {/* MCQ Progress Bar */}
      {subTab === "mcq" && mcqQuestions.length > 0 && !showResults && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Progress: {Object.keys(selectedAnswers).length} of {mcqQuestions.length} answered</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-[#06080e] rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {mcqQuestions.length === 0 && shortQuestions.length === 0 && !loading && (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-800 flex items-center justify-center mx-auto text-cyan-400">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Quizzes Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click "Generate New Quiz Set" above. Gemini will parse your weekly logbook entries and technical report to generate rigorous MCQs and short-answer troubleshooting questions.
          </p>
          <button
            onClick={handleGenerateQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Grounded Quizzes</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Extracting Logbook Tasks & Generating Questions...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Reviewing your entries from Week 1 to Week 24 at {profile.companyName} to draft authentic technical cross-examinations.
          </p>
        </div>
      )}

      {/* Part A: Multiple Choice Questions */}
      {subTab === "mcq" && mcqQuestions.length > 0 && !loading && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 mr-1">Filter Dimension:</span>
            {[
              { id: "all", label: "All Questions" },
              { id: "task_performed", label: "Tasks Performed" },
              { id: "challenge_faced", label: "Challenges Faced" },
              { id: "solution_implemented", label: "Solutions Implemented" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setMcqFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  mcqFilter === f.id
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {filteredMcqs.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`bg-[#0b0f19] border rounded-3xl p-6 space-y-4 transition-all ${
                    showResults
                      ? isCorrect
                        ? "border-emerald-500/50 bg-[#091515]"
                        : "border-red-500/50 bg-[#170a0e]"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Question Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span className="font-bold text-slate-200">Question {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400">{q.derivedFrom}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {q.category && (
                        <span className="text-[11px] text-slate-400 capitalize">
                          {q.category.replace("_", " ")}
                        </span>
                      )}
                      {showResults && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            isCorrect ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-4 h-4" /> Correct
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" /> Incorrect
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isOptionCorrect = optIdx === q.correctIndex;

                      let btnStyle = "bg-[#06080e] border-slate-800 text-slate-300 hover:bg-[#101422]";
                      if (showResults) {
                        if (isOptionCorrect) {
                          btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold";
                        } else if (isChosen && !isOptionCorrect) {
                          btnStyle = "bg-red-950/80 border-red-500 text-red-200 line-through";
                        }
                      } else if (isChosen) {
                        btnStyle = "bg-indigo-950/70 border-indigo-500 text-white font-semibold";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-[#0f1422] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Defense Tip */}
                  {(showResults || isAnswered) && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-[#06080e] border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-cyan-400 block">Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>

                      {q.defenseTip && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-400">Oral Defense Tip: </span>
                            {q.defenseTip}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Finish Button */}
          {!showResults && (
            <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 sticky bottom-4 shadow-2xl">
              <div className="text-xs text-slate-300">
                <span>Questions Answered: </span>
                <span className="font-bold text-cyan-400 font-mono">
                  {Object.keys(selectedAnswers).length} / {mcqQuestions.length}
                </span>
              </div>
              <button
                onClick={handleFinishMcq}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center gap-2"
              >
                <span>Submit & Review Examination</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Part B: Short-Answer */}
      {subTab === "short_answer" && shortQuestions.length > 0 && !loading && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#0b0f19] border border-cyan-900/40 text-xs text-slate-300 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 text-sm block mb-1">
                Short-Answer Defense Preparation Instructions
              </span>
              Examiners frequently say:{" "}
              <em className="text-white">
                "Open your logbook to week X. You said you resolved this crash. Explain step-by-step how you did it."
              </em>{" "}
              Type your comprehensive technical response below. The AI examiner evaluates your accuracy, identifies strengths, flags missing points, and provides actionable topics to review before your defense.
            </div>
          </div>

          <div className="space-y-6">
            {shortQuestions.map((sq, idx) => {
              const currentAnswer = shortAnswers[sq.id] || "";
              const evalResult = shortEvaluations[sq.id];
              const isSubmitting = evaluatingShort[sq.id];
              const isRubricExpanded = expandedRubrics[sq.id];

              return (
                <div
                  key={sq.id}
                  className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span className="font-bold text-slate-200">Scenario {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400">{sq.derivedFrom}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 capitalize">
                        {sq.category.replace("_", " ")}
                      </span>
                      {evalResult && (
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          [{evalResult.score}/100 · {evalResult.verdict}]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question */}
                  <h4 className="text-base font-bold text-white leading-relaxed">
                    {sq.question}
                  </h4>

                  {/* Student Answer Box */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400">
                      Your Technical Explanation / Defense Answer:
                    </label>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) =>
                        setShortAnswers({ ...shortAnswers, [sq.id]: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-[#06080e] border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                      placeholder="Explain your approach, specific tool commands used, errors encountered, and how you verified the solution..."
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Be thorough. Mention exact tools, parameters, and results.</span>
                      <button
                        type="button"
                        onClick={() => handleSubmitShortAnswer(sq)}
                        disabled={isSubmitting || !currentAnswer.trim()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                        <span>{isSubmitting ? "Evaluating..." : "Submit Answer"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Automated Constructive Feedback Card */}
                  {evalResult && (
                    <div className="p-4 rounded-2xl bg-[#06080e] border border-slate-800 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs">
                        <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4" />
                          <span>Automated Academic Evaluation</span>
                        </span>
                        <span className="text-slate-400">{evalResult.feedbackSummary}</span>
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

                      {/* Missing Points */}
                      {evalResult.missingPoints.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Missing or Incomplete Technical Points:
                          </span>
                          <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5 pl-1">
                            {evalResult.missingPoints.map((mp, i) => (
                              <li key={i}>{mp}</li>
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

                      {/* Benchmark / Model Answer Toggle */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedRubrics((prev) => ({
                              ...prev,
                              [sq.id]: !prev[sq.id],
                            }))
                          }
                          className="text-xs text-slate-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {isRubricExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          <span>{isRubricExpanded ? "Hide Benchmark Model Answer" : "View Benchmark Model Answer & Grading Guide"}</span>
                        </button>

                        {isRubricExpanded && (
                          <div className="mt-2.5 p-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-xs space-y-2 text-slate-300">
                            <div>
                              <span className="font-bold text-cyan-400 block mb-0.5">Model Answer:</span>
                              <p className="leading-relaxed">{sq.modelAnswer}</p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-400 block mb-0.5">Expected Key Points:</span>
                              <ul className="list-disc list-inside space-y-0.5">
                                {sq.expectedKeyPoints.map((kp, i) => (
                                  <li key={i}>{kp}</li>
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
        </div>
      )}
    </div>
  );
};
