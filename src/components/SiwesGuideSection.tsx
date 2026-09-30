import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  Calendar,
  PenTool,
  Clock,
  ShieldAlert,
} from "lucide-react";

export const SiwesGuideSection: React.FC = () => {
  const [activeGuideTab, setActiveGuideTab] = useState<"logbook_guide" | "report_guide" | "defense_rubric">("logbook_guide");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const logbookChecklist = [
    { id: "c1", text: "Every working day has a dated, signed entry — no unexplained gaps or blank lines." },
    { id: "c2", text: "Each entry starts with an active past-tense verb (Assisted, Measured, Configured, Inspected, Calibrated, Prepared)." },
    { id: "c3", text: "Entries are specific: they state exact tools, quantities, figures, or standards worked with." },
    { id: "c4", text: "No entry describes what the department does in general instead of my personal activity." },
    { id: "c5", text: "Weekly summaries match the daily entries beneath them without introducing unrelated claims." },
    { id: "c6", text: "Supervisor's signature appears at the required weekly interval throughout the booklet." },
    { id: "c7", text: "Dates align with actual attendance record (no entries on public holidays or absence days)." },
    { id: "c8", text: "Handwriting and ink are consistent with entries being made day-by-day, not batched all at once." },
    { id: "c9", text: "The logbook's wording and figures align 100% with what is expanded in Chapter Three of the technical report." },
  ];

  const reportSpecifications = [
    { label: "Font Family", standard: "Times New Roman", detail: "Apply uniformly across all text, headings, captions, and tables." },
    { label: "Font Size", standard: "14 pt Standard", detail: "14 pt for body text and sub-headings; 14-16 pt Bold uppercase for major Chapter titles." },
    { label: "Line Spacing", standard: "1.5 Line Spacing", detail: "Maintain 1.5 spacing throughout paragraphs; single spacing allowed in dense tables and figure captions." },
    { label: "Minimum Length", standard: "32+ Pages Minimum", detail: "A comprehensive report demonstrating thorough 6-month industrial engagement must span at least 32 pages." },
    { label: "Page Margins", standard: "1.0 inch (25.4 mm)", detail: "Left margin may be extended to 1.25 inches (31.8 mm) for spiral or hardcover binding." },
    { label: "Numbering", standard: "Roman & Arabic", detail: "Lower-case Roman numerals (i, ii, iii) for Front Matter; Arabic numerals (1, 2, 3) from Chapter One onwards." },
  ];

  const weakVsStrongExamples = [
    {
      field: "Office & Admin",
      weak: "Worked in the office today.",
      strong: "Updated the incoming-mail register for 23 items and reconciled it against the dispatch log for Week 3.",
    },
    {
      field: "Engineering & Machinery",
      weak: "Learned about machines.",
      strong: "Observed the start-up sequence of the packaging line and recorded the three checkpoints inspected before production began.",
    },
    {
      field: "Software & IT",
      weak: "Did some coding.",
      strong: "Debugged a login-form validation error in the staff portal and tested the fix against three sample accounts.",
    },
    {
      field: "Civil & Construction",
      weak: "Helped on site with concrete.",
      strong: "Inspected formwork alignment using a spirit level and vibrated 1:2:4 mix concrete during rigid pavement casting at truck lane.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0d1424] via-[#090d16] to-[#0d1424] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2 tracking-wide uppercase">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Official Institutional SIWES Guidebook</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">ITF / NUC Standards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Logbook & Technical Report Writing Guide
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The definitive field-adaptable standard for filling your daily logbook, structuring your 5-chapter technical report, avoiding common examiner traps, and passing your 400-level defense.
          </p>
        </div>
      </div>

      {/* Guide Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveGuideTab("logbook_guide")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeGuideTab === "logbook_guide"
              ? "border-emerald-500 text-emerald-400 bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Part 1: Logbook Writing Guide & Checklist</span>
        </button>
        <button
          onClick={() => setActiveGuideTab("report_guide")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeGuideTab === "report_guide"
              ? "border-emerald-500 text-emerald-400 bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Part 2: 5-Chapter Technical Report Manual</span>
        </button>
        <button
          onClick={() => setActiveGuideTab("defense_rubric")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeGuideTab === "defense_rubric"
              ? "border-emerald-500 text-emerald-400 bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Part 3: 4-Core Defense Evaluation Areas</span>
        </button>
      </div>

      {/* TAB 1: Logbook Writing Guide */}
      {activeGuideTab === "logbook_guide" && (
        <div className="space-y-8 animate-fade-in">
          {/* Why the Logbook Matters */}
          <div className="p-6 rounded-3xl bg-[#0b101c] border border-emerald-900/40 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Why the Logbook Matters During SIWES Defense</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your logbook is the primary evidence that your Institution-Based Supervisor, Industry-Based Supervisor, and SIWES Coordinator use to confirm you actually attended and participated in training. It is also cross-checked directly against <span className="text-emerald-400 font-semibold">Chapter Three of your final report during defense</span>. Examiners often open to a random page and say: <em className="text-white">"Explain this entry directly from your logbook."</em> A well-kept logbook makes your defense effortless to pass.
            </p>
          </div>

          {/* Standard 6-Column Layout Visual */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Standard SIWES Logbook Row-Per-Day Layout (ITF Standard)
              </span>
              <span className="text-slate-400 font-mono">Row 1 of every week restates week & unit</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#070b12] text-slate-300 font-bold border-b border-slate-800">
                    <th className="p-3 w-16">Week</th>
                    <th className="p-3 w-28">Date</th>
                    <th className="p-3 w-24">Day</th>
                    <th className="p-3 w-44">Section / Department</th>
                    <th className="p-3">Activities Carried Out (Factual & Personal Account)</th>
                    <th className="p-3 w-32">Supervisor's Sig</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="bg-emerald-950/20">
                    <td className="p-3 font-mono font-bold text-emerald-400">3</td>
                    <td className="p-3 font-mono">14/07/2026</td>
                    <td className="p-3 font-semibold text-white">Monday</td>
                    <td className="p-3">Records / Admin Unit</td>
                    <td className="p-3 leading-relaxed">
                      Sorted and filed incoming correspondence; updated the visitors' register for 18 entries; assisted in cross-checking stock requisition forms against the central store ledger.
                    </td>
                    <td className="p-3 font-mono text-emerald-400 text-[11px] italic">Signed (Weekly)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-slate-500">3</td>
                    <td className="p-3 font-mono">15/07/2026</td>
                    <td className="p-3 font-semibold text-white">Tuesday</td>
                    <td className="p-3">Structural Site Unit</td>
                    <td className="p-3 leading-relaxed">
                      Assisted in checking formwork alignment for rigid pavement using spirit level; vibrated 1:2:4 mix concrete with poker vibrator during access lane casting.
                    </td>
                    <td className="p-3 text-slate-600">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5 Golden Rules of Effective Daily Entries */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>The 5 Golden Rules of Writing Effective Logbook Entries</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="font-bold text-sm text-emerald-400 block">1. Use Active Voice & Past Tense</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start every line with a strong action verb describing what you personally executed: <span className="text-white font-mono">Assisted, Supervised, Measured, Configured, Inspected, Compiled, Calibrated, Prepared, Cross-checked, Documented</span>.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-sm text-teal-400 block">2. Name Tools, Methods & Figures</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Note specific equipment, software, quantities, or standards (e.g. tool name, measurement, mix ratio, code framework). <strong className="text-white">Concrete nouns make an entry defensible; abstractions make it forgettable.</strong>
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-sm text-cyan-400 block">3. One Entry, One Day, Written That Day</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fill the logbook at the end of each working day while details are fresh, never in a batch weeks later. Supervisors and defense panelists immediately spot uniform handwriting and ink across 3 months.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-sm text-amber-400 block">4. Keep it Proportionate (2–4 Sentences)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Two to four sentences per day is ideal. The logbook is a concise record; the fuller technical narrative belongs in Chapter Three of your final report.
                </p>
              </div>
            </div>

            {/* Weak vs Strong Comparison Table */}
            <div className="space-y-3 pt-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Field Pattern: Weak (Vague) vs. Strong (Specific) Logbook Entries
              </span>

              <div className="space-y-2.5">
                {weakVsStrongExamples.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs"
                  >
                    <div className="md:col-span-3 font-bold text-slate-400 flex items-center">
                      <span>{item.field}</span>
                    </div>
                    <div className="md:col-span-4 p-2.5 rounded-xl bg-red-950/20 border border-red-900/30 text-red-300">
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-red-400 mb-0.5">
                        Weak (Vague):
                      </span>
                      "{item.weak}"
                    </div>
                    <div className="md:col-span-5 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-400 mb-0.5">
                        Strong (Specific & Defensible):
                      </span>
                      "{item.strong}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Pre-Submission Checklist */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <span>SIWES Logbook Pre-Submission Interactive Checklist</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verify these 9 crucial points before handing your logbook to your institution-based supervisor or the defense panel.
            </p>

            <div className="space-y-2 pt-2">
              {logbookChecklist.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-200"
                        : "bg-[#070b12] border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "border border-slate-700 bg-slate-900"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Technical Report Writing Manual */}
      {activeGuideTab === "report_guide" && (
        <div className="space-y-8 animate-fade-in">
          {/* General Formatting Specifications Table */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Standard Academic Formatting Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportSpecifications.map((spec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 block">{spec.label}</span>
                  <div className="text-sm font-bold text-emerald-400">{spec.standard}</div>
                  <p className="text-xs text-slate-400 leading-snug">{spec.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Master 5-Chapter Outline Breakdown */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>The Mandatory 5-Chapter Structure</span>
            </h3>

            <div className="space-y-4">
              {/* Chapter 1 */}
              <div className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sm text-teal-300">
                    CHAPTER ONE: Introduction to SIWES (Standalone Chapter)
                  </span>
                  <span className="font-mono text-slate-500">Statutory Background</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Standalone Rule:</strong> Chapter One explains everything about SIWES history, aims, and objectives. Never merge Chapter One with company profiles or technical work. Must cover: (1.1) Background in Nigeria (ITF established 1973, Decree No. 47 of 1971), (1.2) Bodies involved (ITF, NUC/NBTE/NCCE, Institutions, Employers), (1.3) Aims & Objectives, (1.4) Relevance to Student's Field.
                </p>
              </div>

              {/* Chapter 2 */}
              <div className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sm text-cyan-300">
                    CHAPTER TWO: Company Profile & Organogram (Establishment Focus)
                  </span>
                  <span className="font-mono text-slate-500">Host Firm Architecture</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Comprehensive profile of your placement host: (2.1) History and evolution of firm, (2.2) Mission & Vision, (2.3) Core services & products, (2.4) Functional departments, and (2.5) <strong className="text-white">Organizational Chart / Organogram</strong> — detailed hierarchical tree from MD/CEO down to site operative staff.
                </p>
              </div>

              {/* Chapter 3 - The Core Heart */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>CHAPTER THREE: Technical Work Carried Out (CORE HEART OF REPORT)</span>
                  </span>
                  <span className="font-bold text-emerald-400 font-mono text-xs">80%+ Defense Source</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                  <strong>The 80%+ Rule:</strong> Over 80% of all oral defense grilling originates directly from Chapter Three! Convert bullet points from your daily logbook into comprehensive, step-by-step descriptive technical write-ups.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-[#070b12] border border-slate-800">
                    <span className="font-bold text-white block mb-1">Required Details Per Task:</span>
                    • Raw materials & tools required<br />
                    • Formulations, batch calculations, or algorithms<br />
                    • Step-by-step operational procedure<br />
                    • Quality control tests & safety protocols
                  </div>
                  <div className="p-3 rounded-xl bg-[#070b12] border border-slate-800">
                    <span className="font-bold text-white block mb-1">Visuals & Schematics Rule:</span>
                    Include photos, workshop sketches, engineering schematics, or flowcharts at every single stage of the process to illustrate genuine personal work.
                  </div>
                </div>
              </div>

              {/* Chapter 4 */}
              <div className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sm text-teal-300">
                    CHAPTER FOUR: Specialized Equipment & Experience Gained
                  </span>
                  <span className="font-mono text-slate-500">Tools & Competencies</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focus on operating principles, maintenance routines, safety protocols, and operational workflows of major equipment or software frameworks used during training (e.g. lathe machines, theodolites, concrete vibrators, Docker, PLCs, Wireshark).
                </p>
              </div>

              {/* Chapter 5 */}
              <div className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sm text-amber-300">
                    CHAPTER FIVE: Problems Encountered, Conclusion & Recommendations
                  </span>
                  <span className="font-mono text-slate-500">Synthesis & Actionable Advice</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Honestly discuss genuine bottlenecks faced (equipment downtime, health exposure, weather delays). Frame recommendations into 3 targeted beneficiaries: <span className="text-white font-semibold">1. To the Host Establishment</span>, <span className="text-white font-semibold">2. To the Institution SIWES Unit</span>, and <span className="text-white font-semibold">3. To the Industrial Training Fund (ITF)</span>.
                </p>
              </div>

              {/* Back Matter */}
              <div className="p-4 rounded-2xl bg-[#070b12] border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="font-bold text-white block">
                  Back Matter: References & Citation Recency Rule (2020–2025)
                </span>
                <p>
                  All academic textbooks, technical manuals, and online journals must be formatted in standard APA 7th Edition or IEEE format. <strong className="text-amber-400">Critical Rule:</strong> Do not cite outdated references from decades ago; citations should preferably range from 2020 down to 2025.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Defense Evaluation Areas */}
      {activeGuideTab === "defense_rubric" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>The 4 Core Defense Evaluation Areas (Page 6 Guide Standard)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#070b12] border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Area 1: Logbook & Report Correlation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Core Defense Expectation:</strong> Examiners match Chapter Three entries directly against logbook weekly stamps and industry supervisor signatures.
                </p>
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300">
                  <span className="font-bold">Preparation Advice: </span>
                  Ensure logbook entries align 100% with dates and activities described in Chapter Three.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070b12] border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider block">
                  Area 2: Technical Process Mastery
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Core Defense Expectation:</strong> Ability to explain mechanisms, raw materials, formulas, calculations, and machine operating steps without reading slides.
                </p>
                <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-900/30 text-xs text-teal-300">
                  <span className="font-bold">Preparation Advice: </span>
                  Rehearse step-by-step procedures outlined in Chapter Three until fully memorized.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070b12] border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Area 3: Visuals & Schematics Verification
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Core Defense Expectation:</strong> Verification that included figures, photos, drawings, and organograms represent genuine personal work done during attachment.
                </p>
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/30 text-xs text-cyan-300">
                  <span className="font-bold">Preparation Advice: </span>
                  Be prepared to explain the exact function and dimension of every component in pictures/diagrams used.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070b12] border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Area 4: Professional Academic Presentation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Core Defense Expectation:</strong> Strict compliance with Times New Roman font, 1.5 line spacing, 14pt body formatting, clean binding, and 32+ page depth.
                </p>
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-300">
                  <span className="font-bold">Preparation Advice: </span>
                  Proofread thoroughly for typographical and grammatical errors prior to final submission.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
