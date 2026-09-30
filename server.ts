import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for calling Gemini with structured JSON fallback
async function callGeminiJson<T>(prompt: string, systemInstruction?: string): Promise<T> {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are an expert Nigerian University & Polytechnic SIWES (Students Industrial Work Experience Scheme) 400-Level Defense Chief Examiner and Technical Panelist. Always output valid JSON only.",
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    // If markdown backticks were returned inside json string
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned) as T;
  }
}

// 1. Analyze Logbook & Report
app.post("/api/analyze-report", async (req: Request, res: Response) => {
  try {
    const { studentName, department, institution, companyName, unitAttached, logbookContent, reportContent, technologies } = req.body;

    const prompt = `
Analyze the following 400-Level SIWES internship details for student defense preparation:
Student: ${studentName || "Candidate"}
Department: ${department}
Institution: ${institution}
Company: ${companyName}
Unit Attached: ${unitAttached}
Technologies/Tools Listed: ${technologies?.join(", ") || "General IT & Engineering"}

Logbook Summary / Weekly Highlights:
"""
${(logbookContent || "").slice(0, 15000)}
"""

Technical Report Content / Highlights:
"""
${(reportContent || "").slice(0, 20000)}
"""

Evaluate the student's materials according to standard Nigerian SIWES / ITF (Industrial Training Fund) 400-level defense standards.
Return a structured JSON with:
{
  "summary": "Brief 2-3 sentence overview of their internship scope",
  "technicalDepthRating": "Basic" | "Intermediate" | "Advanced" | "Exceptional",
  "topCompetencies": ["list of 4-6 solid skills documented in their work"],
  "highRiskAreas": [
    {
      "area": "Topic or claimed technology that examiners will aggressively grill",
      "reason": "Why examiners will target this (e.g. superficial logbook detail, complex architecture claim, common plagiarism red flag)",
      "recommendedPrep": "Specific defense preparation advice"
    }
  ],
  "organogramCheck": "Comment on expected knowledge of company structure, industry supervisor, and reporting line",
  "itfComplianceScore": 85, // number 0-100
  "keyDefenseKeywords": ["list of 8-10 technical terms/standards they must be able to define accurately"]
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error analyzing report:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to analyze report" });
  }
});

// 2. Generate Automated Quizzes (Both MCQ and Short-Answer) based on Logbook & Report
app.post("/api/generate-quiz", async (req: Request, res: Response) => {
  try {
    const { department, companyName, unitAttached, logbookContent, reportContent, technologies } = req.body;

    const prompt = `
You are the Chief SIWES Examiner evaluating a 400-Level IT/Engineering internship student.
Based on the student's SIWES logbook and report provided below, generate a comprehensive two-part assessment:
Part A: 8 Multiple-Choice Questions (MCQ)
Part B: 5 Short-Answer / Conceptual Scenario Questions

The questions MUST specifically cover:
1. Specific tasks performed by the student as documented in their weekly logbook
2. Real technical challenges and bottlenecks faced during the internship
3. Solutions, debugging techniques, and architectures implemented to overcome those challenges

Student Profile:
Department: ${department}
Company: ${companyName}
Unit Attached: ${unitAttached}
Technologies: ${technologies?.join(", ") || "IT/Engineering Tools"}

Logbook Entries:
"""
${(logbookContent || "").slice(0, 15000)}
"""

Technical Report Highlights:
"""
${(reportContent || "").slice(0, 15000)}
"""

Requirements:
- Multiple-Choice Questions (MCQs) must have 4 clear options (A, B, C, D), exactly one correct index (0-3), detailed rationale, and logbook reference.
- Short-Answer Questions must challenge the student to explain a specific procedure, justify why a solution was chosen over alternatives, or diagnose a problem documented in their logbook. Include a grading guide/rubric and expected key points for each.

Return JSON in this format:
{
  "mcqQuestions": [
    {
      "id": "mcq_1",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "category": "task_performed" | "challenge_faced" | "solution_implemented",
      "derivedFrom": "Logbook Week 6 / Report Chapter 3.2",
      "explanation": "Why this is correct...",
      "defenseTip": "Oral defense advice..."
    }
  ],
  "shortAnswerQuestions": [
    {
      "id": "sa_1",
      "question": "Explain how you resolved the recurring webhook duplicate delivery issue documented in Week 7. What specific mechanism ensured idempotency?",
      "category": "challenge_faced" | "solution_implemented" | "task_performed",
      "derivedFrom": "Logbook Week 7",
      "expectedKeyPoints": [
        "Mention of unique idempotency key from payload header",
        "Storage in Redis with TTL expiration",
        "Handling concurrent duplicate requests with atomic locks"
      ],
      "modelAnswer": "In Week 7, we encountered duplicated transactions due to network timeouts. We introduced idempotency keys...",
      "suggestedReviewTopic": "Distributed Systems Idempotency & In-Memory Caching"
    }
  ]
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate quiz" });
  }
});

// Evaluate Student's Short-Answer Quiz Submission
app.post("/api/evaluate-short-answer", async (req: Request, res: Response) => {
  try {
    const { question, studentAnswer, expectedKeyPoints, modelAnswer, logbookContext } = req.body;

    const prompt = `
Evaluate the student's short answer to this SIWES 400L technical quiz question:

Question: "${question}"
Student's Submitted Answer:
"${studentAnswer || "[No answer provided]"}"

Expected Key Points:
${JSON.stringify(expectedKeyPoints || [])}

Model / Benchmark Answer:
"${modelAnswer}"

Relevant Logbook Context:
"""
${(logbookContext || "").slice(0, 4000)}
"""

Provide an honest, constructive academic evaluation:
1. Score out of 100.
2. Strengths: What specific facts, terminologies, or logical steps did the student get right?
3. Missing or Weak Points: What crucial technical points, safety considerations, or explanations were omitted or inaccurate?
4. Constructive Suggestions for Further Review: Actionable topics and concepts the student should revise before defense.
5. Overall Verdict: "Mastered" | "Proficient" | "Needs Review" | "Unsatisfactory".

Return JSON format:
{
  "score": 85,
  "verdict": "Proficient",
  "strengths": [
    "Correctly identified Redis as the fast lookup storage",
    "Understood the role of TTL to prevent infinite storage growth"
  ],
  "missingPoints": [
    "Did not mention race condition handling if duplicate requests arrive simultaneously",
    "Omitted how failure HTTP status codes were returned to the webhook client"
  ],
  "suggestedReviewTopics": [
    "Atomic locking mechanisms (e.g., Redlock or SETNX in Redis)",
    "HTTP 409 Conflict vs 200 OK idempotent contract"
  ],
  "feedbackSummary": "Good grasp of the high-level architecture, but make sure to explain the atomic locking to the panel if asked."
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error evaluating short answer:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to evaluate short answer" });
  }
});

// 2b. Generate SIWES Defense Mock Interview Questions (Technical, Problem Solving, Contributions, Lessons, Behavioral)
app.post("/api/generate-interview-questions", async (req: Request, res: Response) => {
  try {
    const { department, companyName, unitAttached, logbookContent, reportContent, technologies } = req.body;

    const prompt = `
Generate a comprehensive set of 12 realistic 400-Level SIWES defense mock interview questions for an IT/Engineering student based on their internship dossier.

Student Dossier:
Department: ${department}
Company: ${companyName}
Unit: ${unitAttached}
Tools: ${technologies?.join(", ") || "IT Stack"}

Logbook & Report:
"""
${(logbookContent || "").slice(0, 10000)}
${(reportContent || "").slice(0, 10000)}
"""

Categorize the questions across these 5 required SIWES defense pillars:
1. "Technical Skills & Architecture" (3 questions: deep probing into tools, protocols, frameworks, syntax, and theories documented)
2. "Problem-Solving & Troubleshooting" (3 questions: handling system crashes, debugging complex errors, edge cases, and unexpected failures)
3. "Project Contributions & Impact" (2 questions: distinguishing the student's individual contribution from their senior colleagues, quantifiable results)
4. "Lessons Learned & Curriculum Tie-In" (2 questions: connecting real industrial tools to 300L/400L university coursework, what they would do differently)
5. "Behavioral, HSE & Workplace Ethics" (2 questions: workplace safety protocols, dealing with senior team conflicts, ethical data handling, code of conduct)

For each question provide:
- The question text
- Category
- Target Examiner persona ("Prof. Adebayo (Strict Academic)" | "Engr. Danladi (Industry Expert)" | "Dr. Nwosu (SIWES Coordinator)")
- Why examiners ask this
- Key evaluation criteria
- Sample high-scoring answer guideline

Return JSON format:
{
  "interviewQuestions": [
    {
      "id": "int_1",
      "category": "Technical Skills & Architecture" | "Problem-Solving & Troubleshooting" | "Project Contributions & Impact" | "Lessons Learned & Curriculum Tie-In" | "Behavioral, HSE & Workplace Ethics",
      "examinerPersona": "Prof. Adebayo (Academic Chair)" | "Engr. Danladi (Industry Practical)" | "Dr. Nwosu (SIWES Coordinator)",
      "question": "Question text...",
      "whyExaminersAskThis": "Explanation of the defense panel's goal...",
      "evaluationCriteria": [
        "Candidate demonstrates clear distinction between...",
        "Accurate citation of commands or configurations"
      ],
      "modelAnswerGuideline": "To score high, start by stating the problem, mention the specific technology used, and quantify the result..."
    }
  ]
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate interview questions" });
  }
});

// Evaluate Student's Mock Interview Answer
app.post("/api/evaluate-interview-answer", async (req: Request, res: Response) => {
  try {
    const { question, category, examinerPersona, studentAnswer, evaluationCriteria, logbookContext } = req.body;

    const prompt = `
You are the SIWES Defense Panel Examiner: ${examinerPersona || "Departmental SIWES Examiner"}.
Evaluate the 400L student's oral response to this defense interview question:

Category: ${category}
Interview Question:
"${question}"

Student's Submitted Answer:
"${studentAnswer || "[Candidate stammered or gave no clear answer]"}"

Evaluation Criteria:
${JSON.stringify(evaluationCriteria || [])}

Internship Context:
"""
${(logbookContext || "").slice(0, 5000)}
"""

Evaluate the student's response like a real Nigerian university SIWES panelist:
1. Score out of 100.
2. Examiner Reaction: "Impressed" | "Satisfied" | "Needs Technical Clarity" | "Caught Bluffing" | "Skeptical".
3. Spoken Examiner Reaction: What the examiner literally says to the student in the defense hall.
4. Areas of Strength: Specific highlights where the candidate demonstrated solid competence.
5. Critical Deficiencies: What was weak, vague, unconvincing, or technically inaccurate.
6. Actionable Topics for Further Review: 2-3 specific topics to brush up on.
7. Model High-Scoring Answer: How a 1st Class student would deliver this answer using STAR technique.

Return JSON format:
{
  "score": 78,
  "reaction": "Satisfied",
  "spokenFeedback": "Fair answer, candidate. You mentioned the logging library, but you didn't explain how you isolated the faulty network packets.",
  "strengths": [
    "Clear articulation of the troubleshooting sequence",
    "Good mention of team communication with the senior dev"
  ],
  "areasToImprove": [
    "Too brief on the exact error message received in the terminal",
    "Avoid using filler words like 'we just did some stuff'"
  ],
  "suggestedReviewTopics": [
    "Linux systemctl and journalctl log inspection",
    "STAR response framework for behavioral and incident questions"
  ],
  "modelAnswer": "When the payment webhook worker encountered an uncaught exception in Week 7, I immediately isolated the container logs using 'docker logs --tail 100'...",
  "defenseProTip": "Look the examiner in the eye and name the exact command or tool before explaining the outcome."
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error evaluating interview answer:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to evaluate interview answer" });
  }
});

// 3. Initialize Defense Session with 3 Unique Panelists
app.post("/api/init-defense-session", async (req: Request, res: Response) => {
  try {
    const { studentName, department, institution, companyName, unitAttached, logbookContent, reportContent, technologies } = req.body;

    const prompt = `
Set up an authentic 400-Level SIWES Oral Defense Panel for candidate: ${studentName || "Candidate"}.
Institution: ${institution}
Department: ${department}
Company: ${companyName}
Unit: ${unitAttached}
Tools: ${technologies?.join(", ") || "General"}

Logbook & Report Highlights:
"""
${(logbookContent || "").slice(0, 10000)}
${(reportContent || "").slice(0, 10000)}
"""

Create the defense panel of 3 distinct academic personalities:
1. Panelist 1: Theoretical & Academic Examiner (e.g. "Prof. Adebayo" or "Prof. Okeke" - Departmental Professor, stern, tests fundamental computer science/engineering theories, mathematical models, definitions, and curriculum tie-in).
2. Panelist 2: Industry Practical & Technical Specialist (e.g. "Dr. (Engr.) Danladi" or "Engr. Folorunsho" - experienced engineer, asks for exact CLI commands, code logic, wiring, network topologies, error debugging, and architecture decisions).
3. Panelist 3: SIWES Coordinator & ITF Representative (e.g. "Dr. Mrs. Nwosu" or "Mr. Alabi" - scrutinizes logbook entries, daily signatures, company organogram, safety HSE rules, and actual student contributions vs senior staff work).

Generate:
1. A welcome address by the Panel Chair setting the stage.
2. Initial questions: Generate 2 initial questions from each examiner (total 6 starter defense questions), tailored precisely to specific items in the student's report and logbook.

Return JSON in this format:
{
  "panelChairIntro": "Opening statement by the panel chair...",
  "examiners": [
    {
      "id": "prof_academic",
      "name": "Prof. I. A. Adebayo",
      "title": "Lead Academic Examiner & Departmental Chair",
      "avatarRole": "academic",
      "personality": "Strict, values theoretical depth, hates superficial buzzwords without scientific grounding.",
      "focusArea": "Theoretical principles, algorithms, and curriculum relevance"
    },
    {
      "id": "engr_practical",
      "name": "Engr. Babatunde Danladi, FNSE",
      "title": "Industry Technical Examiner",
      "avatarRole": "engineer",
      "personality": "Pragmatic, sharp-eyed, catches students who copy projects or had senior colleagues do the work.",
      "focusArea": "Implementation details, live troubleshooting, tools, and code/circuit logic"
    },
    {
      "id": "coord_itf",
      "name": "Dr. (Mrs.) Chinyere Nwosu",
      "title": "SIWES Departmental Coordinator & ITF Liaison",
      "avatarRole": "coordinator",
      "personality": "Meticulous about logbook weekly progression, organogram, safety protocols, and attendance authenticity.",
      "focusArea": "Logbook verification, company structure, safety precautions, and student personal impact"
    }
  ],
  "initialQuestions": [
    {
      "id": "q1",
      "examinerId": "prof_academic",
      "question": "Question text...",
      "context": "Based on Section 2.1 / Week 3...",
      "intent": "Testing if the candidate understands the fundamental theory behind..."
    },
    {
      "id": "q2",
      "examinerId": "engr_practical",
      "question": "Question text...",
      "context": "You wrote that you implemented...",
      "intent": "Checking if candidate wrote the actual commands/code or watched someone else"
    },
    {
      "id": "q3",
      "examinerId": "coord_itf",
      "question": "Question text...",
      "context": "Regarding your logbook entry in Week 8...",
      "intent": "Verifying daily consistency and company reporting hierarchy"
    }
  ]
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error initializing defense:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to initialize defense" });
  }
});

// 4. Evaluate Student's Defense Answer and Generate Panel Grilling/Follow-Up
app.post("/api/evaluate-defense-answer", async (req: Request, res: Response) => {
  try {
    const { examiner, question, studentAnswer, reportContext, conversationHistory } = req.body;

    const prompt = `
You are roleplaying as the SIWES Defense Panelist: ${examiner?.name || "The Examiner"} (${examiner?.title || "Lead Examiner"}).
Personality: ${examiner?.personality || "Strict academic panelist"}.
Target Focus: ${examiner?.focusArea || "Technical defense"}.

The Examiner asked the student:
"${question}"

The 400L Student answered:
"${studentAnswer || "[Candidate stammered or gave no clear answer]"}"

Student's Report/Logbook Background:
"""
${(reportContext || "").slice(0, 6000)}
"""

Conversation History so far:
${JSON.stringify(conversationHistory || [])}

Perform an authentic academic SIWES defense evaluation:
1. Rate the answer quality from 1 to 10.
2. Determine the panel's emotional reaction: "impressed" | "skeptical" | "caught_bluffing" | "needs_clarity" | "satisfied".
3. Formulate the examiner's verbal response:
   - If the answer is vague, buzzword-heavy, or sounds memorized, aggressively drill them on the specifics ("You're just mentioning buzzwords. What port does that service listen on? What was the exact command?").
   - If the answer is strong, acknowledge it concisely and either raise the bar with a challenging counter-question or hand over to a colleague.
4. "modelRebuttal": Provide the gold-standard answer the student SHOULD have given to get 10/10 marks from a strict professor.
5. "defenseTip": Tactical advice for the oral presentation (posture, eye contact, how to handle things you don't know without sounding clueless).
6. Next question: Provide a sharp follow-up question (either from this examiner or another panelist).

Return JSON in this format:
{
  "score": 7, // 1 - 10
  "reaction": "skeptical", // "impressed" | "skeptical" | "caught_bluffing" | "needs_clarity" | "satisfied"
  "examinerFeedback": "Prof. Adebayo's spoken response to the student in defense room...",
  "critique": {
    "strengths": ["What was good in the answer"],
    "weaknesses": ["What was missing or flawed"]
  },
  "modelRebuttal": "How an 'A' grade 400L student should articulate this answer...",
  "defenseTip": "Crucial tip for answering this category of question at SIWES defense",
  "followUp": {
    "nextExaminer": "Engr. Babatunde Danladi" or "Prof. Adebayo",
    "question": "The next cross-examination question..."
  }
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error evaluating answer:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to evaluate answer" });
  }
});

// 5. Generate SIWES Defense Trap Questions ("Hot Seat" Flashcards)
app.post("/api/generate-trap-cards", async (req: Request, res: Response) => {
  try {
    const { department, companyName, unitAttached, logbookContent, reportContent, technologies } = req.body;

    const prompt = `
Generate 12 of the most dangerous and notorious 400-Level SIWES Defense "Trap Questions" specifically tailored to this candidate's logbook and report.

Department: ${department}
Company: ${companyName}
Unit: ${unitAttached}
Tech: ${technologies?.join(", ") || "Engineering / IT"}

Student Material Context:
"""
${(logbookContent || "").slice(0, 8000)}
${(reportContent || "").slice(0, 10000)}
"""

These must include classic Nigerian university / polytechnic SIWES defense traps:
1. The Plagiarism / "Did You Really Do It?" Trap (e.g. "Who wrote this code/configured this equipment? What happens if I ask you to reproduce it on the whiteboard right now?")
2. The Organogram & Supervisor Trap (e.g. "Who was your industry supervisor? What is the hierarchy between IT unit and Operations? What does your company actually do for revenue?")
3. The Logbook Consistency Trap (e.g. "In Week 7 you wrote 'Installed OS', in Week 8 'Learned React'. Why was there no progressive milestone?")
4. The ITF & Safety (HSE) Trap (e.g. "What does ITF stand for, what year was SIWES established, and what specific PPE or safety precautions did you take?")
5. The Theoretical Foundation Trap (e.g. "You used Redis cache. Explain the underlying data structure and time complexity of cache lookups.")
6. The "What Did You Contribute?" Trap (e.g. "All you did was assist. What single feature or value did you independently deliver to the company?")

Return JSON:
{
  "trapCards": [
    {
      "id": "trap_1",
      "category": "Plagiarism Trap" | "Technical Depth" | "Logbook Discrepancy" | "HSE & Company Knowledge" | "Curriculum Tie-In",
      "trapQuestion": "The exact menacing question the examiner will ask...",
      "whyExaminersAskThis": "The hidden trap behind this question (what they are listening for)",
      "rookieMistake": "The fatal answer that causes students to fail or get marked down to a 'C'",
      "masterDefenseAnswer": "The bulletproof STAR (Situation, Task, Action, Result) model response to win over the panel",
      "whiteboardChallenge": "If the professor hands you a whiteboard marker, what diagram or pseudocode you must draw immediately"
    }
  ]
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating trap cards:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate trap cards" });
  }
});

// 6. Generate Official SIWES Defense Readiness Rubric Audit & Morning Cheat Sheet
app.post("/api/generate-readiness-audit", async (req: Request, res: Response) => {
  try {
    const { studentName, department, institution, companyName, unitAttached, logbookContent, reportContent, quizScore, defenseSessionStats } = req.body;

    const prompt = `
Generate a comprehensive official SIWES Defense Readiness Audit & Morning Defense Cheat Sheet for:
Student: ${studentName || "Candidate"}
Department: ${department}
Institution: ${institution}
Company: ${companyName}
Quiz Score Performance: ${JSON.stringify(quizScore || {})}
Oral Defense Simulation Stats: ${JSON.stringify(defenseSessionStats || {})}

Report & Logbook:
"""
${(logbookContent || "").slice(0, 6000)}
${(reportContent || "").slice(0, 8000)}
"""

Grade the candidate strictly using standard NUC / NBTE SIWES defense scoring breakdown:
- Logbook Authenticity & Completeness (Max 15 marks)
- Technical Report Quality & Formatting (Max 25 marks)
- Practical Competence & Domain Mastery (Max 30 marks)
- Oral Presentation, Confidence & Defense Q&A (Max 30 marks)
Total = 100 marks.

Generate:
1. Category-by-category score, grade (A, B, C, Referral), and verdict.
2. 5 high-priority areas to review tonight before stepping into the defense hall.
3. "MorningOfDefenseCheatSheet":
   - 3-sentence company elevator pitch
   - 5 crucial technical definitions/equations
   - 3 major projects bulleted with exact metrics
   - Emergency recovery phrases when an examiner asks something completely unknown.

Return JSON in this format:
{
  "totalScore": 82,
  "grade": "A",
  "verdict": "Distinction - Highly Prepared for Panel",
  "rubricBreakdown": [
    { "category": "Logbook Authenticity & Daily Entries", "score": 13, "maxScore": 15, "comment": "..." },
    { "category": "Technical Report Quality & Structure", "score": 21, "maxScore": 25, "comment": "..." },
    { "category": "Practical Competence & Troubleshooting", "score": 25, "maxScore": 30, "comment": "..." },
    { "category": "Oral Presentation & Q&A Defense", "score": 23, "maxScore": 30, "comment": "..." }
  ],
  "radarMetrics": {
    "theoreticalKnowledge": 80,
    "practicalTroubleshooting": 85,
    "logbookConsistency": 75,
    "companyOrganogram": 90,
    "presentationPoise": 82
  },
  "urgentActionItems": [
    "Review how...",
    "Memorize the full name of..."
  ],
  "morningCheatSheet": {
    "elevatorPitch": "When asked 'Summarize your 6 months in 1 minute', say: ...",
    "mustKnowDefinitions": [
      { "term": "Term 1", "oneLineDefinition": "..." }
    ],
    "projectMetrics": [
      "Project X: Achieved Y using Z"
    ],
    "emergencyRecoveryScript": "What to say if an examiner corners you on something out of scope without losing marks"
  }
}
`;

    const data = await callGeminiJson(prompt);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating readiness audit:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate audit" });
  }
});

// Vite middleware or static serving
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`SIWES Defense Prep Server running at http://0.0.0.0:${port}`);
});
