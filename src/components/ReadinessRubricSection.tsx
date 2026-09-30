import React, { useState } from "react";
import {
  Award,
  Sparkles,
  Printer,
  CheckSquare,
  AlertCircle,
  FileText,
  BookOpen,
  Building,
  Target,
  RefreshCw,
  CheckCircle2,
  Download,
  Eye,
  Copy,
  Check,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentProfile, ReadinessAudit } from "../types/siwes";
import { useBadges } from "../context/BadgeContext";
import {
  downloadPdfReport,
  downloadTextReport,
  generateFormattedText,
} from "../utils/exportReport";

// Generated image asset
import defenseHallImg from "../assets/images/defense_hall_chamber_1790811464347.jpg";

interface ReadinessRubricSectionProps {
  profile: StudentProfile;
}

export const ReadinessRubricSection: React.FC<ReadinessRubricSectionProps> = ({
  profile,
}) => {
  const { awardBadge } = useBadges();
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<ReadinessAudit | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  const handleGenerateAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-readiness-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: profile.studentName,
          department: profile.department,
          institution: profile.institution,
          companyName: profile.companyName,
          unitAttached: profile.unitAttached,
          logbookContent: profile.logbookSummary,
          reportContent: profile.reportSummary,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAudit(data.data);
        awardBadge("nuc_certified");
        if (data.data.totalScore >= 75) {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error("Error generating audit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!audit) return;
    try {
      downloadPdfReport(profile, audit);
      awardBadge("dossier_commander");
      showNotice("PDF report downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      showNotice("Could not generate PDF directly, using print dialog instead.");
      window.print();
    }
  };

  const handleDownloadText = () => {
    if (!audit) return;
    downloadTextReport(profile, audit);
    awardBadge("dossier_commander");
    showNotice("Text summary report (.txt) downloaded successfully!");
  };

  const handleCopyText = () => {
    if (!audit) return;
    const text = generateFormattedText(profile, audit);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    showNotice("Report copied to clipboard!");
  };

  const showNotice = (msg: string) => {
    setDownloadSuccessNotice(msg);
    setTimeout(() => setDownloadSuccessNotice(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Header Banner with Atmospheric Academic Chamber Visual */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#0d1424] via-[#0b101c] to-[#0d1424] shadow-2xl print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 z-10">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2 tracking-wide uppercase">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>NUC / NBTE / ITF Defense Assessment Standard</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Official Rubric</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Readiness Scorecard & Morning Cheat Sheet
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Evaluates your dossier against standard departmental scoring criteria: Logbook (15%), Technical Report (25%), Practical Competence (30%), and Oral Defense Q&A (30%). Download a formatted PDF or text report with your defense morning emergency recovery cheat sheet.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={handleGenerateAudit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Grading Dossier..." : audit ? "Re-Run Official Audit" : "Run Official Rubric Audit"}</span>
              </button>

              {audit && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadText}
                    className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Text (.txt)</span>
                  </button>

                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all cursor-pointer"
                    title="Preview report summary"
                  >
                    <Eye className="w-4 h-4 text-teal-400" />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all cursor-pointer"
                    title="Print or Save via Browser"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
            <img
              src={defenseHallImg}
              alt="Academic defense conference hall"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d1424] via-[#0d1424]/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fade-in print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{downloadSuccessNotice}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessNotice(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {!audit && !loading && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4 print:hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Readiness Audit Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click "Run Official Rubric Audit" to evaluate your logbook and technical report. You can then download a complete formatted PDF summary or text report with your defense score, radar feedback, and morning cheat sheet.
          </p>
          <button
            onClick={handleGenerateAudit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Defense Audit</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-12 text-center space-y-4 print:hidden">
          <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Auditing SIWES Dossier & Scoring Rubrics...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Analyzing weekly logbook entries and technical report depth for {profile.studentName} at {profile.companyName}.
          </p>
        </div>
      )}

      {/* Audit Results */}
      {audit && !loading && (
        <div className="space-y-8">
          {/* Top Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs text-slate-400">Projected Defense Score</span>
              <div className="flex items-baseline gap-2 my-2 font-mono">
                <span className="text-4xl font-extrabold text-white">{audit.totalScore}</span>
                <span className="text-sm text-slate-500">/ 100</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                Grade: {audit.grade} ({audit.verdict})
              </span>
            </div>

            <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs text-slate-400">Practical Competence</span>
              <div className="text-2xl font-bold text-white font-mono my-2">
                {audit.radarMetrics.practicalTroubleshooting}%
              </div>
              <div className="w-full bg-[#070b12] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${audit.radarMetrics.practicalTroubleshooting}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs text-slate-400">Logbook Consistency</span>
              <div className="text-2xl font-bold text-white font-mono my-2">
                {audit.radarMetrics.logbookConsistency}%
              </div>
              <div className="w-full bg-[#070b12] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-400 h-full rounded-full"
                  style={{ width: `${audit.radarMetrics.logbookConsistency}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs text-slate-400">Defense Poise & Q&A</span>
              <div className="text-2xl font-bold text-white font-mono my-2">
                {audit.radarMetrics.presentationPoise}%
              </div>
              <div className="w-full bg-[#070b12] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${audit.radarMetrics.presentationPoise}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Export Bar */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl print:hidden">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Export & Download Defense Summary
              </span>
              <p className="text-xs text-slate-300">
                Save your score breakdown, panel feedback, and morning cheat sheet for offline revision.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Formatted PDF</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Download Text Report (.txt)</span>
              </button>

              <button
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-teal-400" />
                <span>Preview Report</span>
              </button>
            </div>
          </div>

          {/* Official Scoring Breakdown */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Standard 4-Part SIWES Marking Rubric Breakdown</span>
            </h3>

            <div className="space-y-3">
              {audit.rubricBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#070b12] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="font-bold text-xs sm:text-sm text-white">{item.category}</div>
                    <div className="text-xs text-slate-400">{item.comment}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {item.score} <span className="text-xs text-slate-500 font-normal">/ {item.maxScore}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Checklist For Tonight */}
          <div className="bg-[#0b101c] border border-amber-900/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Urgent Action Items (Review Tonight Before Stepping Into Hall)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {audit.urgentActionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#070b12] border border-amber-900/30 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Morning-of-Defense Cheat Sheet (Print-Friendly) */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 print:border-black pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide print:text-black">
                  Candidate Pocket Guide
                </span>
                <h3 className="text-xl font-bold text-white print:text-black mt-1">
                  Morning-of-Defense Quick-Reference Cheat Sheet
                </h3>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5">
                  {profile.studentName} · {profile.matricNo} · {profile.institution} ({profile.department})
                </p>
              </div>

              <div className="print:hidden flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleDownloadText}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Text</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* 60-Second Elevator Pitch */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 print:text-black uppercase tracking-wider block">
                1. 60-Second Defense Opening Statement (Elevator Pitch):
              </span>
              <div className="p-4 rounded-xl bg-[#070b12] print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs sm:text-sm text-slate-200 print:text-black leading-relaxed italic">
                "{audit.morningCheatSheet.elevatorPitch}"
              </div>
            </div>

            {/* Must-Know Definitions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-400 print:text-black uppercase tracking-wider block">
                2. Core Technical Definitions & Principles:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {audit.morningCheatSheet.mustKnowDefinitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#070b12] print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs"
                  >
                    <span className="font-bold text-teal-300 print:text-black block mb-0.5">
                      {def.term}
                    </span>
                    <p className="text-slate-300 print:text-gray-800">{def.oneLineDefinition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Metrics */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 print:text-black uppercase tracking-wider block">
                3. Quantified Technical Achievements:
              </span>
              <div className="space-y-1.5">
                {audit.morningCheatSheet.projectMetrics.map((met, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#070b12] print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs text-slate-300 print:text-black flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 print:text-black shrink-0 mt-0.5" />
                    <span>{met}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Recovery Script */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 print:text-black uppercase tracking-wider block">
                4. Emergency Recovery Script (When Cornered on Something Unknown):
              </span>
              <div className="p-4 rounded-xl bg-amber-950/20 print:bg-gray-100 border border-amber-900/40 print:border-gray-300 text-xs sm:text-sm text-amber-200 print:text-black leading-relaxed">
                <span className="font-bold block mb-1">Say Confidently:</span>
                "{audit.morningCheatSheet.emergencyRecoveryScript}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {previewOpen && audit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">SIWES Defense Readiness Report Preview</h3>
                  <p className="text-xs text-slate-400">
                    {profile.studentName || "Candidate"} · Projected Mark: {audit.totalScore}/100 ({audit.grade})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-[#070b12] border border-slate-800 rounded-2xl p-4">
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                  {generateFormattedText(profile, audit)}
                </pre>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#070b12] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadText}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
