import { Badge, BadgeId } from "../types/siwes";

export const INITIAL_BADGES: Badge[] = [
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Achieved an examination score of 70% or higher on the CBT Technical Quiz.",
    category: "CBT & Technical",
    iconName: "HelpCircle",
    unlocked: false,
    requirement: "Score ≥ 70% in CBT Examination",
  },
  {
    id: "oral_defense_pro",
    title: "Oral Defense Pro",
    description: "Successfully defended technical work before the academic panel with a grade of 75% or 8/10.",
    category: "Oral Defense",
    iconName: "Mic",
    unlocked: false,
    requirement: "Receive ≥ 75% on oral defense response",
  },
  {
    id: "logbook_scholar",
    title: "Logbook Scholar",
    description: "Audited 24-week industrial logbook entries and identified critical technical defense vulnerabilities.",
    category: "Logbook & Dossier",
    iconName: "BookOpen",
    unlocked: false,
    requirement: "Audit logbook dossier with AI scanner",
  },
  {
    id: "troubleshooter",
    title: "Troubleshooter",
    description: "Submitted and articulated a comprehensive technical resolution to an industrial failure scenario.",
    category: "CBT & Technical",
    iconName: "PenTool",
    unlocked: false,
    requirement: "Score ≥ 75% on short-answer technical scenario",
  },
  {
    id: "trap_buster",
    title: "Trap Buster",
    description: "Flipped and mastered high-stakes defense trap questions and STAR model rebuttals.",
    category: "Academic Rigor",
    iconName: "ShieldAlert",
    unlocked: false,
    requirement: "Review defense ambush flashcards",
  },
  {
    id: "nuc_certified",
    title: "NUC / ITF Certified",
    description: "Completed an official 4-part SIWES rubric grading audit and generated morning cheat sheet.",
    category: "Academic Rigor",
    iconName: "Award",
    unlocked: false,
    requirement: "Generate official readiness rubric audit",
  },
  {
    id: "dossier_commander",
    title: "Dossier Commander",
    description: "Exported an official formatted academic PDF or text defense readiness report for offline revision.",
    category: "Logbook & Dossier",
    iconName: "Download",
    unlocked: false,
    requirement: "Download your defense readiness report",
  },
];

const STORAGE_KEY = "siwes_student_badges";

export function getBadges(studentId: string = "default"): Badge[] {
  if (typeof window === "undefined") return INITIAL_BADGES;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${studentId}`);
    if (!raw) return INITIAL_BADGES;
    const stored: Record<string, { unlocked: boolean; unlockedAt?: string }> = JSON.parse(raw);
    return INITIAL_BADGES.map((b) => ({
      ...b,
      unlocked: stored[b.id]?.unlocked ?? false,
      unlockedAt: stored[b.id]?.unlockedAt,
    }));
  } catch (err) {
    console.error("Failed to load badges from storage:", err);
    return INITIAL_BADGES;
  }
}

export function unlockBadge(
  badgeId: BadgeId,
  studentId: string = "default"
): { newlyUnlocked: boolean; badge: Badge } {
  const currentBadges = getBadges(studentId);
  const targetBadge = currentBadges.find((b) => b.id === badgeId);

  if (!targetBadge) {
    throw new Error(`Unknown badge id: ${badgeId}`);
  }

  if (targetBadge.unlocked) {
    return { newlyUnlocked: false, badge: targetBadge };
  }

  const now = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const updatedBadges = currentBadges.map((b) => {
    if (b.id === badgeId) {
      return { ...b, unlocked: true, unlockedAt: now };
    }
    return b;
  });

  if (typeof window !== "undefined") {
    try {
      const toSave = updatedBadges.reduce((acc, b) => {
        acc[b.id] = { unlocked: b.unlocked, unlockedAt: b.unlockedAt };
        return acc;
      }, {} as Record<string, { unlocked: boolean; unlockedAt?: string }>);
      localStorage.setItem(`${STORAGE_KEY}_${studentId}`, JSON.stringify(toSave));
    } catch (err) {
      console.error("Failed to save badge unlock:", err);
    }
  }

  return {
    newlyUnlocked: true,
    badge: { ...targetBadge, unlocked: true, unlockedAt: now },
  };
}
