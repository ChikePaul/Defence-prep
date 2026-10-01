import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Cpu,
  Shield,
  Briefcase,
} from "lucide-react";
import { StudentProfile } from "../types/siwes";
import { useAuth } from "../context/AuthContext";

interface ChatMessage {
  id: string;
  sender: "student" | "model";
  text: string;
  timestamp: number;
  modelUsed?: string;
}

interface GeminiChatbotSectionProps {
  profile: StudentProfile;
}

export const GeminiChatbotSection: React.FC<GeminiChatbotSectionProps> = ({ profile }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<"chief_examiner" | "industry_mentor" | "rebuttal_coach">("chief_examiner");
  const [modelName, setModelName] = useState<"gemini-3.5-flash" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-lite">("gemini-3.5-flash");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial_msg",
      sender: "model",
      text: `Welcome, candidate ${profile.studentName || ""}. I am Prof. Adebayo, Chief SIWES Defense Panel Chairman. I have reviewed your industrial attachment at ${profile.companyName || "your IT employer"} in the ${profile.unitAttached || "IT"} unit. What specific engineering architecture or technical contribution did you independently implement during your 6-month placement?`,
      timestamp: Date.now(),
      modelUsed: "gemini-3.5-flash",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "student",
      text: messageText,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
          role,
          modelName,
          profileContext: `
Student Name: ${profile.studentName}
Matric No: ${profile.matricNo}
Institution: ${profile.institution}
Department: ${profile.department}
Company: ${profile.companyName}
Unit: ${profile.unitAttached}
Technologies: ${profile.technologies.join(", ")}
Logbook Summary: ${profile.logbookSummary}
Report Summary: ${profile.reportSummary}
          `.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: "model",
          text: data.reply,
          timestamp: Date.now(),
          modelUsed: data.modelUsed || modelName,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "No reply from coach");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "model",
        text: `Examiner Note: I encountered an interruption (${err.message || "Network Error"}). Please re-state your technical point.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `reset_${Date.now()}`,
        sender: "model",
        text: "The chamber has been reset. State your technical topic or select a defense drill prompt below to begin.",
        timestamp: Date.now(),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const drillPrompts = [
    "Drill me on my system architecture diagram and data flow.",
    "Trap Question: 'Did you actually write this backend code or copy it from GitHub?'",
    "Simulate a production outage scenario and test how I responded.",
    "Help me formulate a crisp 60-second elevator pitch for my defense opening.",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-[#2E3447] bg-[#1A1D2B] p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#06B6D4] flex items-center gap-2 tracking-wide uppercase">
            <Bot className="w-4 h-4 text-[#06B6D4]" />
            <span>Multi-Turn Gemini Defense Coach</span>
            <span aria-hidden="true" className="text-[#2E3447]">·</span>
            <span className="text-[#3B82F6]">Context-Aware AI Examiner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interactive Defense Drill Chatbot
          </h2>
          <p className="text-[#D1D5DB] text-xs sm:text-sm max-w-2xl leading-relaxed">
            Rehearse difficult oral cross-examinations before facing your department's panel. Toggle between the Chief Academic Examiner, Industry Supervisor, and Rebuttal Coach with configurable Gemini reasoning models.
          </p>
        </div>

        {/* Action Controls: Role & Model Pickers */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Persona Picker */}
          <div className="bg-[#0F1118] border border-[#2E3447] p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setRole("chief_examiner")}
              className={`!px-3 !py-1.5 !rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                role === "chief_examiner"
                  ? "!bg-[#3B82F6] !text-white shadow-sm"
                  : "!bg-transparent !text-[#D1D5DB] hover:!text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Chief Examiner</span>
            </button>
            <button
              onClick={() => setRole("industry_mentor")}
              className={`!px-3 !py-1.5 !rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                role === "industry_mentor"
                  ? "!bg-[#3B82F6] !text-white shadow-sm"
                  : "!bg-transparent !text-[#D1D5DB] hover:!text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Industry Mentor</span>
            </button>
            <button
              onClick={() => setRole("rebuttal_coach")}
              className={`!px-3 !py-1.5 !rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                role === "rebuttal_coach"
                  ? "!bg-[#3B82F6] !text-white shadow-sm"
                  : "!bg-transparent !text-[#D1D5DB] hover:!text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rebuttal Coach</span>
            </button>
          </div>

          {/* Model Selector */}
          <div className="bg-[#0F1118] border border-[#2E3447] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
            <select
              value={modelName}
              onChange={(e: any) => setModelName(e.target.value)}
              className="bg-transparent text-white font-mono text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash" className="bg-[#1A1D2B] text-white">
                gemini-3.5-flash (Balanced)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-[#1A1D2B] text-white">
                gemini-3.1-pro-preview (Deep Reasoning)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-[#1A1D2B] text-white">
                gemini-3.1-flash-lite (Fast Speed)
              </option>
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="!p-2.5 !rounded-lg !bg-[#0F1118] border border-[#2E3447] !text-[#6B7280] hover:!text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Thread Box */}
      <div className="bg-[#1A1D2B] border border-[#2E3447] rounded-xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Chat Thread Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isStudent = msg.sender === "student";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isStudent ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                    isStudent
                      ? "bg-[#3B82F6] text-white font-bold"
                      : "bg-[#0F1118] border border-[#2E3447] text-[#06B6D4]"
                  }`}
                >
                  {isStudent ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-[#06B6D4]" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative p-4 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                    isStudent
                      ? "bg-[#0F1118] border-[#3B82F6]/60 text-white rounded-tr-none shadow-md"
                      : "bg-[#0F1118] border-[#2E3447] text-[#D1D5DB] rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-[#6B7280] font-mono">
                    <span className="font-semibold text-[#06B6D4]">
                      {isStudent
                        ? profile.studentName || "Candidate"
                        : role === "chief_examiner"
                        ? "Prof. Adebayo (Chief Panelist)"
                        : role === "industry_mentor"
                        ? "Engr. Danladi (DevOps Lead)"
                        : "Dr. Nwosu (Rebuttal Coach)"}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.modelUsed && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1A1D2B] text-[#3B82F6] border border-[#2E3447]">
                          {msg.modelUsed}
                        </span>
                      )}
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="!absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 !p-1 !rounded-md !bg-[#1A1D2B] !text-[#6B7280] hover:!text-white transition-opacity cursor-pointer text-[10px] flex items-center gap-1"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-[#10B981]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-3xl mr-auto">
              <div className="w-9 h-9 rounded-lg bg-[#0F1118] border border-[#2E3447] flex items-center justify-center text-[#06B6D4] shrink-0">
                <Bot className="w-4 h-4 animate-spin text-[#06B6D4]" />
              </div>
              <div className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] text-xs text-[#6B7280] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#06B6D4] animate-pulse" />
                <span>Examiner is formulating cross-examination response with {modelName}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Drill Chips */}
        <div className="px-4 py-2 bg-[#0F1118] border-t border-[#2E3447] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-[#6B7280] font-semibold shrink-0 uppercase tracking-wider text-[10px]">
            Fast Drills:
          </span>
          {drillPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="!px-2.5 !py-1 !rounded-md !bg-[#1A1D2B] hover:!bg-[#24293D] border border-[#2E3447] !text-[#D1D5DB] hover:!text-white whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#1A1D2B] border-t border-[#2E3447] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Present your defense statement to ${
              role === "chief_examiner" ? "Prof. Adebayo" : role === "industry_mentor" ? "Engr. Danladi" : "Dr. Nwosu"
            }...`}
            className="flex-1 bg-[#0F1118] border border-[#2E3447] rounded-md px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="!px-5 !py-2.5 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md disabled:opacity-40 transition-all cursor-pointer shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
