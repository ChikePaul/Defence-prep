import { jsPDF } from "jspdf";
import { StudentProfile, ReadinessAudit } from "../types/siwes";

/**
 * Generates an ASCII/Markdown formatted text report of the student's SIWES readiness
 */
export function generateFormattedText(profile: StudentProfile, audit: ReadinessAudit): string {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const divider = "================================================================================";
  const subDivider = "--------------------------------------------------------------------------------";

  return `
${divider}
  STUDENTS INDUSTRIAL WORK EXPERIENCE SCHEME (SIWES) - 400 LEVEL
  OFFICIAL DEFENSE READINESS AUDIT & EVALUATION SUMMARY REPORT
${divider}
Generated: ${dateStr}
Compliance Standard: NUC / NBTE / ITF SIWES Directorate

1. CANDIDATE & PLACEMENT DOSSIER
${subDivider}
  Candidate Name:       ${profile.studentName || "N/A"}
  Matriculation No:     ${profile.matricNo || "N/A"}
  Level / Year:         ${profile.level || "400 Level"}
  Department:           ${profile.department || "N/A"}
  Faculty / School:     ${profile.faculty || "N/A"}
  Institution:          ${profile.institution || "N/A"}
  
  Host Organization:    ${profile.companyName || "N/A"}
  Host Address:         ${profile.companyAddress || "N/A"}
  Unit / Dept Attached: ${profile.unitAttached || "N/A"}
  Internship Duration:  ${profile.duration || "6 Months (24 Weeks)"}
  Industry Supervisor:  ${profile.industrySupervisor || "N/A"}
  Technologies Used:    ${profile.technologies.join(", ") || "N/A"}

2. DEFENSE READINESS ASSESSMENT OVERVIEW
${subDivider}
  Overall Projected Score:  ${audit.totalScore} / 100
  Letter Grade:             ${audit.grade}
  Panel Verdict:            ${audit.verdict}

  Core Competency Radar Metrics:
    - Practical Troubleshooting:    ${audit.radarMetrics.practicalTroubleshooting}%
    - Logbook Consistency:          ${audit.radarMetrics.logbookConsistency}%
    - Theoretical Knowledge:        ${audit.radarMetrics.theoreticalKnowledge}%
    - Company Organogram & Safety:  ${audit.radarMetrics.companyOrganogram}%
    - Presentation Poise & Q&A:     ${audit.radarMetrics.presentationPoise}%

3. OFFICIAL 4-PART RUBRIC MARKING BREAKDOWN
${subDivider}
${audit.rubricBreakdown
  .map(
    (item, idx) =>
      `  [${idx + 1}] ${item.category.toUpperCase()}
      Mark: ${item.score} / ${item.maxScore}
      Panel Feedback: ${item.comment}`
  )
  .join("\n\n")}

4. URGENT CHECKLIST FOR DEFENSE EVE
${subDivider}
${audit.urgentActionItems.map((item, idx) => `  [ ] ${idx + 1}. ${item}`).join("\n")}

5. MORNING-OF-DEFENSE QUICK-REFERENCE CHEAT SHEET
${subDivider}
  A. 60-SECOND OPENING ELEVATOR PITCH:
     "${audit.morningCheatSheet.elevatorPitch}"

  B. ESSENTIAL TECHNICAL DEFINITIONS:
${audit.morningCheatSheet.mustKnowDefinitions
  .map((def) => `     * ${def.term}: ${def.oneLineDefinition}`)
  .join("\n")}

  C. QUANTIFIED TECHNICAL ACHIEVEMENTS:
${audit.morningCheatSheet.projectMetrics.map((met) => `     * ${met}`).join("\n")}

  D. EMERGENCY RECOVERY SCRIPT (WHEN QUESTIONED ON OUT-OF-SCOPE TOPICS):
     "${audit.morningCheatSheet.emergencyRecoveryScript}"

${divider}
  End of SIWES Defense Readiness Summary Report
  Confidential - Prepared for ${profile.studentName || "Candidate"}
${divider}
`.trim();
}

/**
 * Downloads the text report as a .txt file
 */
export function downloadTextReport(profile: StudentProfile, audit: ReadinessAudit) {
  const content = generateFormattedText(profile, audit);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const safeName = (profile.studentName || "Candidate").replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `SIWES_Readiness_Report_${safeName}.txt`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a clean, multi-page formatted PDF report using jsPDF
 */
export function downloadPdfReport(profile: StudentProfile, audit: ReadinessAudit) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      // Add subtle header on continuation pages
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(130, 140, 155);
      doc.text(
        `SIWES Defense Readiness Report - ${profile.studentName || "Candidate"} (${profile.matricNo || "400L"})`,
        margin,
        y
      );
      y += 6;
      doc.setDrawColor(220, 225, 230);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("SIWES 400L DEFENSE READINESS SUMMARY", margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text("OFFICIAL ACADEMIC AUDIT & DEFENSE PREPARATION REPORT", margin + 6, y + 16);

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  doc.text(`Generated: ${dateStr}  |  NUC / NBTE / ITF Criteria`, margin + 6, y + 23);

  // Score Badge in Header (Right side)
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.roundedRect(pageWidth - margin - 32, y + 4, 26, 20, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(52, 211, 153);
  doc.text(`${audit.totalScore}/100`, pageWidth - margin - 19, y + 13, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(`Grade: ${audit.grade}`, pageWidth - margin - 19, y + 20, { align: "center" });

  y += 34;

  // 1. Candidate & Placement Dossier
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, y, pageWidth - margin * 2, 6, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("1. CANDIDATE & PLACEMENT DOSSIER", margin + 3, y + 4.2);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const col1 = margin + 2;
  const col2 = margin + 95;

  doc.text(`Candidate Name: ${profile.studentName || "N/A"}`, col1, y);
  doc.text(`Host Company: ${profile.companyName || "N/A"}`, col2, y);
  y += 5;

  doc.text(`Matric No: ${profile.matricNo || "N/A"}`, col1, y);
  doc.text(`Unit Attached: ${profile.unitAttached || "N/A"}`, col2, y);
  y += 5;

  doc.text(`Institution: ${profile.institution || "N/A"}`, col1, y);
  doc.text(`Supervisor: ${profile.industrySupervisor || "N/A"}`, col2, y);
  y += 5;

  doc.text(`Department: ${profile.department || "N/A"}`, col1, y);
  doc.text(`Duration: ${profile.duration || "6 Months"}`, col2, y);
  y += 5;

  const techLine = `Tools & Stack: ${profile.technologies.slice(0, 8).join(", ") || "General IT"}`;
  doc.text(techLine, col1, y);
  y += 9;

  // 2. Assessment Summary & Competency Radar
  checkPageBreak(35);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 6, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("2. READINESS VERDICT & COMPETENCY RADAR", margin + 3, y + 4.2);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129);
  doc.text(`Overall Panel Verdict: ${audit.verdict} (Projected Score: ${audit.totalScore}/100, Grade ${audit.grade})`, margin + 2, y);
  y += 6;

  // Radar metrics bar table
  const metrics = [
    { label: "Practical Troubleshooting", val: audit.radarMetrics.practicalTroubleshooting },
    { label: "Logbook Consistency", val: audit.radarMetrics.logbookConsistency },
    { label: "Theoretical Knowledge", val: audit.radarMetrics.theoreticalKnowledge },
    { label: "Organogram & Safety", val: audit.radarMetrics.companyOrganogram },
    { label: "Defense Poise & Q&A", val: audit.radarMetrics.presentationPoise },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  metrics.forEach((m) => {
    checkPageBreak(6);
    doc.text(m.label, margin + 2, y + 3);
    // Draw background progress bar
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin + 55, y, 70, 4, 1, 1, "F");
    // Draw filled bar
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin + 55, y, (70 * m.val) / 100, 4, 1, 1, "F");
    doc.text(`${m.val}%`, margin + 130, y + 3);
    y += 5.5;
  });

  y += 4;

  // 3. Rubric Breakdown
  checkPageBreak(50);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 6, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("3. NUC / NBTE 4-PART RUBRIC MARKING BREAKDOWN", margin + 3, y + 4.2);
  y += 9;

  audit.rubricBreakdown.forEach((item) => {
    checkPageBreak(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.category}`, margin + 2, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text(`${item.score} / ${item.maxScore} marks`, pageWidth - margin - 2, y, { align: "right" });
    y += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const commentLines = doc.splitTextToSize(item.comment, pageWidth - margin * 2 - 4);
    doc.text(commentLines, margin + 2, y);
    y += commentLines.length * 3.8 + 3.5;
  });

  y += 3;

  // 4. Urgent Action Items
  checkPageBreak(35);
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(margin, y, pageWidth - margin * 2, 6, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text("4. URGENT CHECKLIST (REVIEW BEFORE DEFENSE ROOM)", margin + 3, y + 4.2);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  audit.urgentActionItems.forEach((action, i) => {
    checkPageBreak(9);
    doc.text(`[ ]  ${i + 1}.`, margin + 2, y);
    const lines = doc.splitTextToSize(action, pageWidth - margin * 2 - 12);
    doc.text(lines, margin + 11, y);
    y += lines.length * 4 + 1.5;
  });

  y += 4;

  // 5. Morning Cheat Sheet
  checkPageBreak(45);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 6, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("5. MORNING-OF-DEFENSE QUICK CHEAT SHEET", margin + 3, y + 4.2);
  y += 9;

  // Elevator pitch
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("A. 60-Second Defense Opening Statement:", margin + 2, y);
  y += 4.5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const pitchLines = doc.splitTextToSize(`"${audit.morningCheatSheet.elevatorPitch}"`, pageWidth - margin * 2 - 4);
  doc.text(pitchLines, margin + 2, y);
  y += pitchLines.length * 3.8 + 4;

  // Key Definitions
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("B. Must-Know Technical Definitions:", margin + 2, y);
  y += 4.5;

  audit.morningCheatSheet.mustKnowDefinitions.forEach((def) => {
    checkPageBreak(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text(`* ${def.term}: `, margin + 2, y);
    const defWidth = doc.getTextWidth(`* ${def.term}: `);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const textLines = doc.splitTextToSize(def.oneLineDefinition, pageWidth - margin * 2 - defWidth - 2);
    doc.text(textLines, margin + 2 + defWidth, y);
    y += textLines.length * 3.8 + 1.5;
  });

  y += 2;

  // Emergency Recovery Script
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text("C. Emergency Recovery Script (When Cornered by Panel):", margin + 2, y);
  y += 4.5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const emergLines = doc.splitTextToSize(
    `"${audit.morningCheatSheet.emergencyRecoveryScript}"`,
    pageWidth - margin * 2 - 4
  );
  doc.text(emergLines, margin + 2, y);
  y += emergLines.length * 3.8 + 6;

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Confidential Academic Document - Page ${p} of ${totalPages} - SIWES Defense Prep Engine`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  // Trigger Download
  const safeName = (profile.studentName || "Candidate").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`SIWES_Defense_Readiness_Report_${safeName}.pdf`);
}
