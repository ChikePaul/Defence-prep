export interface StudentProfile {
  studentName: string;
  matricNo: string;
  institution: string;
  faculty: string;
  department: string;
  level: string; // e.g. "400 Level"
  companyName: string;
  companyAddress: string;
  unitAttached: string;
  duration: string; // e.g. "6 Months (24 Weeks)"
  industrySupervisor: string;
  technologies: string[];
  logbookSummary: string;
  reportSummary: string;
}

export interface ReportAnalysis {
  summary: string;
  technicalDepthRating: "Basic" | "Intermediate" | "Advanced" | "Exceptional";
  topCompetencies: string[];
  highRiskAreas: {
    area: string;
    reason: string;
    recommendedPrep: string;
  }[];
  organogramCheck: string;
  itfComplianceScore: number;
  keyDefenseKeywords: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category?: "task_performed" | "challenge_faced" | "solution_implemented";
  derivedFrom: string;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  explanation: string;
  defenseTip: string;
}

export interface ShortAnswerQuestion {
  id: string;
  question: string;
  category: "task_performed" | "challenge_faced" | "solution_implemented";
  derivedFrom: string;
  expectedKeyPoints: string[];
  modelAnswer: string;
  suggestedReviewTopic: string;
}

export interface ShortAnswerEvaluation {
  score: number;
  verdict: "Mastered" | "Proficient" | "Needs Review" | "Unsatisfactory";
  strengths: string[];
  missingPoints: string[];
  suggestedReviewTopics: string[];
  feedbackSummary: string;
}

export interface InterviewQuestion {
  id: string;
  category:
    | "Technical Skills & Architecture"
    | "Problem-Solving & Troubleshooting"
    | "Project Contributions & Impact"
    | "Lessons Learned & Curriculum Tie-In"
    | "Behavioral, HSE & Workplace Ethics";
  examinerPersona: string;
  question: string;
  whyExaminersAskThis: string;
  evaluationCriteria: string[];
  modelAnswerGuideline: string;
}

export interface InterviewAnswerEvaluation {
  score: number;
  reaction: "Impressed" | "Satisfied" | "Needs Technical Clarity" | "Caught Bluffing" | "Skeptical";
  spokenFeedback: string;
  strengths: string[];
  areasToImprove: string[];
  suggestedReviewTopics: string[];
  modelAnswer: string;
  defenseProTip: string;
}

export interface DefenseExaminer {
  id: string;
  name: string;
  title: string;
  avatarRole: "academic" | "engineer" | "coordinator";
  personality: string;
  focusArea: string;
}

export interface DefenseMessage {
  id: string;
  sender: "examiner" | "student" | "system";
  examinerId?: string;
  examinerName?: string;
  text: string;
  timestamp: number;
  context?: string;
  score?: number; // 1-10
  reaction?: "impressed" | "skeptical" | "caught_bluffing" | "needs_clarity" | "satisfied";
  critique?: {
    strengths: string[];
    weaknesses: string[];
  };
  modelRebuttal?: string;
  defenseTip?: string;
}

export interface TrapCard {
  id: string;
  category: string;
  trapQuestion: string;
  whyExaminersAskThis: string;
  rookieMistake: string;
  masterDefenseAnswer: string;
  whiteboardChallenge?: string;
}

export interface RubricCategory {
  category: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface ReadinessAudit {
  totalScore: number;
  grade: string;
  verdict: string;
  rubricBreakdown: RubricCategory[];
  radarMetrics: {
    theoreticalKnowledge: number;
    practicalTroubleshooting: number;
    logbookConsistency: number;
    companyOrganogram: number;
    presentationPoise: number;
  };
  urgentActionItems: string[];
  morningCheatSheet: {
    elevatorPitch: string;
    mustKnowDefinitions: { term: string; oneLineDefinition: string }[];
    projectMetrics: string[];
    emergencyRecoveryScript: string;
  };
}

export type BadgeId =
  | "quiz_master"
  | "oral_defense_pro"
  | "logbook_scholar"
  | "troubleshooter"
  | "trap_buster"
  | "nuc_certified"
  | "dossier_commander";

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
  category: "CBT & Technical" | "Oral Defense" | "Logbook & Dossier" | "Academic Rigor";
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}
