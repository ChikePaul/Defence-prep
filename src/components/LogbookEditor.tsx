import React, { useState } from "react";
import {
  BookOpen,
  Building,
  User,
  School,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Upload,
  FileText,
  ShieldCheck,
  ChevronRight,
  Target,
  Key,
  Layers,
} from "lucide-react";
import { StudentProfile, ReportAnalysis } from "../types/siwes";
import { SAMPLE_PROFILES } from "../data/sampleProfiles";
import { useBadges } from "../context/BadgeContext";

// Generated image asset
import logbookDossierImg from "../assets/images/siwes_logbook_dossier_1790811475973.jpg";

interface LogbookEditorProps {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  analysis: ReportAnalysis | null;
  setAnalysis: (a: ReportAnalysis | null) => void;
  onProceedToQuiz: () => void;
}

export const LogbookEditor: React.FC<LogbookEditorProps> = ({
  profile,
  setProfile,
  analysis,
  setAnalysis,
  onProceedToQuiz,
}) => {
  const { awardBadge } = useBadges();
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dossier" | "analysis">("dossier");
  const [tagInput, setTagInput] = useState("");
  const [fileNotice, setFileNotice] = useState<string | null>(null);

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_PROFILES.find((s) => s.id === sampleId);
    if (found) {
      setProfile({ ...found.profile });
      setAnalysis(null);
      setFileNotice(`Loaded ${found.label} profile`);
      setTimeout(() => setFileNotice(null), 3000);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!profile.technologies.includes(tagInput.trim())) {
      setProfile({
        ...profile,
        technologies: [...profile.technologies, tagInput.trim()],
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tech: string) => {
    setProfile({
      ...profile,
      technologies: profile.technologies.filter((t) => t !== tech),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setProfile({
          ...profile,
          logbookSummary: text.slice(0, 15000),
        });
        setFileNotice(`Imported ${file.name} (${text.length} chars)`);
        setTimeout(() => setFileNotice(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysis(json.data);
        setActiveTab("analysis");
        awardBadge("logbook_scholar");
      }
    } catch (err) {
      console.error("Failed to analyze report:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Showcase with Atmospheric Visual Anchor */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#0c101c] via-[#080b13] to-[#0c101c] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Zone */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 z-10">
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-2 tracking-wide uppercase">
              <span>National SIWES Assessment Framework</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">400 Level Penultimate Year</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Internship Logbook & Technical Dossier
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              SIWES defense examiners scrutinize your weekly logged tasks, tools operated, and architectural chapters. Audit your internship materials below to detect technical vulnerabilities before you face the panel.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`} />
                <span>{analyzing ? "Auditing Vulnerabilities..." : "Run AI Vulnerability Audit"}</span>
              </button>
              <button
                onClick={onProceedToQuiz}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0f1422] hover:bg-[#151c30] border border-slate-700/80 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>Take Technical CBT</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Right Image Feature Zone */}
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
            <img
              src={logbookDossierImg}
              alt="SIWES technical logbook and report binder on workbench"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c101c] via-[#0c101c]/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* 1-Click Realistic Preset Selectors */}
        <div className="p-5 bg-[#06080e]/80 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Load Benchmark SIWES Profiles:
            </span>
            <span className="text-[11px] text-slate-500">1-click populated technical records</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_PROFILES.map((sample) => {
              const isSelected = profile.companyName === sample.profile.companyName;
              return (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500/80 text-white shadow-md shadow-indigo-950"
                      : "bg-[#0b0e18] border-slate-800 text-slate-300 hover:bg-[#101422] hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-slate-100 mb-1">{sample.label}</div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{sample.tag}</span>
                    <span className="text-cyan-400 font-medium">Select</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {fileNotice && (
          <div className="m-4 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500 text-indigo-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{fileNotice}</span>
          </div>
        )}
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("dossier")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "dossier"
              ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Student Internship Dossier</span>
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "analysis"
              ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>AI Vulnerability & Risk Analysis</span>
          {analysis && (
            <span className="text-[11px] font-mono text-cyan-400 ml-1">
              ({analysis.itfComplianceScore}%)
            </span>
          )}
        </button>
      </div>

      {activeTab === "dossier" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Candidate Academic Profile</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={profile.studentName}
                    onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                    className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Elvis Okafor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Matric / Reg No.</label>
                    <input
                      type="text"
                      value={profile.matricNo}
                      onChange={(e) => setProfile({ ...profile, matricNo: e.target.value })}
                      className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="e.g. 190408044"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Level</label>
                    <input
                      type="text"
                      value={profile.level}
                      onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                      className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="400 Level"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Institution / University</label>
                  <input
                    type="text"
                    value={profile.institution}
                    onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                    className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. University of Lagos (UNILAG)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Department of Computer Science"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Internship Placement Details</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Organization / Employer</label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. PayDirect Africa Technologies Ltd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Unit / Department Attached</label>
                  <input
                    type="text"
                    value={profile.unitAttached}
                    onChange={(e) => setProfile({ ...profile, unitAttached: e.target.value })}
                    className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Backend Engineering & Cloud Infra"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Industry Supervisor</label>
                  <input
                    type="text"
                    value={profile.industrySupervisor}
                    onChange={(e) => setProfile({ ...profile, industrySupervisor: e.target.value })}
                    className="w-full bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Engr. Tunde Adeleke"
                  />
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Wrench className="w-4 h-4 text-indigo-400" />
                <span>Tools & Hardware Mastered</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="e.g. Docker, PostgreSQL, Cisco..."
                  className="flex-1 bg-[#06080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1322] border border-slate-800 text-xs text-slate-200"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tech)}
                      className="text-slate-500 hover:text-red-400 cursor-pointer text-sm leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Two Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Weekly Logbook Activities (Week 1 - 24)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tasks, equipment operated, troubleshooting, and daily notes logged in your hardcopy booklet.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1422] hover:bg-[#141b2e] border border-slate-800 text-xs text-slate-300 font-semibold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload .txt/.md</span>
                  <input
                    type="file"
                    accept=".txt,.md,.text"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={profile.logbookSummary}
                onChange={(e) => setProfile({ ...profile, logbookSummary: e.target.value })}
                rows={11}
                className="w-full bg-[#06080e] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                placeholder="WEEK 1: Company orientation, safety protocols...&#10;WEEK 2: Troubleshooting database query times..."
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Tip: Follow active verbs (Assisted, Measured, Configured, Inspected).</span>
                <span>{profile.logbookSummary.length} chars</span>
              </div>
            </div>

            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>SIWES Technical Report Chapters & Highlights</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chapters 1 (Standalone SIWES Intro), 2 (Organogram), 3 (Technical Work - 80%+ Source), 4 (Tools), 5 (Recommendations).
                </p>
              </div>

              <textarea
                value={profile.reportSummary}
                onChange={(e) => setProfile({ ...profile, reportSummary: e.target.value })}
                rows={11}
                className="w-full bg-[#06080e] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                placeholder="CHAPTER 1: INTRODUCTION TO SIWES&#10;CHAPTER 2: COMPANY PROFILE & ORGANOGRAM..."
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Panelists will cross-examine Figure numbers, organogram lines, and Chapter 3 projects.</span>
                <span>{profile.reportSummary.length} chars</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis View Tab */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {!analysis ? (
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-800 flex items-center justify-center mx-auto text-indigo-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">No Vulnerability Audit Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click the audit button to have Gemini evaluate your logbook and technical report against authentic NUC / NBTE SIWES defense standards.
              </p>
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{analyzing ? "Running Audit..." : "Run AI Defense Vulnerability Audit"}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Scorecard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-700/80 flex items-center justify-center text-cyan-400 font-extrabold text-2xl font-mono">
                    {analysis.itfComplianceScore}%
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">ITF SIWES Compliance Score</div>
                    <div className="text-sm font-bold text-white">
                      {analysis.itfComplianceScore >= 80 ? "Defense-Ready Quality" : "Needs Technical Expansion"}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-extrabold text-sm uppercase">
                    {analysis.technicalDepthRating}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Technical Depth Rating</div>
                    <div className="text-sm font-bold text-white">400-Level Academic Standard</div>
                  </div>
                </div>

                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-700/80 flex items-center justify-center text-amber-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Vulnerabilities Detected</div>
                    <div className="text-sm font-bold text-amber-400">
                      {analysis.highRiskAreas.length} Prime Grilling Targets
                    </div>
                  </div>
                </div>
              </div>

              {/* Dossier Summary & Organogram */}
              <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Dossier Scope & Executive Overview</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{analysis.summary}</p>
                <div className="p-3.5 rounded-xl bg-[#06080e] border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400">Organogram & Reporting Line Notice: </span>
                  {analysis.organogramCheck}
                </div>
              </div>

              {/* High Risk Areas */}
              <div className="bg-[#0b0f19] border border-amber-900/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">High-Risk Grilling Areas (Defense Panel Traps)</h3>
                    <p className="text-xs text-slate-400">
                      Examiners look for exaggerated claims, shallow logbook entries, and ungrounded architectures. Prepare these thoroughly!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.highRiskAreas.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#06080e] border border-amber-900/30 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-amber-300">{risk.area}</span>
                        <span className="text-[10px] font-mono text-amber-400">
                          Risk #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <span className="font-semibold text-slate-400">Why Examiners Target This: </span>
                        {risk.reason}
                      </p>
                      <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-xs text-cyan-300">
                        <span className="font-bold text-cyan-400">Recommended Defense Prep: </span>
                        {risk.recommendedPrep}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competencies & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Top Verified Competencies Documented</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysis.topCompetencies.map((comp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-400" />
                    <span>Key Defense Keywords (Must Define Flawlessly)</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keyDefenseKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#06080e] border border-slate-800 text-xs font-mono text-indigo-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
