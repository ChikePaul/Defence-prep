import React, { useState } from "react";
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { StudentProfile } from "../types/siwes";

interface SearchGroundingSectionProps {
  profile: StudentProfile;
}

export const SearchGroundingSection: React.FC<SearchGroundingSectionProps> = ({ profile }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleQueries = [
    "Latest NUC & ITF SIWES logbook and grading directives for Nigerian universities",
    "Best practices for defending a Docker & Kubernetes microservices architecture",
    "Common trap questions on database indexing and SQL query optimization",
    "Current industry standards for JWT token expiration and refresh token rotation",
    "How to explain CI/CD pipelines to academic examiners who only teach C++",
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q || loading) return;

    setLoading(true);
    setErrorMsg(null);
    if (searchQuery) setQuery(searchQuery);

    try {
      const res = await fetch("/api/search-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          department: profile.department,
          context: `Company: ${profile.companyName}, Unit: ${profile.unitAttached}, Tech: ${profile.technologies.join(", ")}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResultText(data.text);
        setGroundingMetadata(data.groundingMetadata);
      } else {
        throw new Error(data.error || "Search grounding failed");
      }
    } catch (err: any) {
      console.error("Grounding error:", err);
      setErrorMsg(err.message || "Failed to retrieve search grounded data");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="rounded-xl border border-[#2E3447] bg-[#1A1D2B] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-[#06B6D4] flex items-center gap-2 tracking-wide uppercase">
            <Globe className="w-4 h-4 text-[#06B6D4]" />
            <span>Live Technical & SIWES Research Grounding</span>
            <span aria-hidden="true" className="text-[#2E3447]">·</span>
            <span className="text-[#3B82F6]">gemini-3.5-flash with googleSearch</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Google Search-Grounded Defense Intelligence
          </h2>

          <p className="text-[#D1D5DB] text-sm leading-relaxed">
            Verify modern industry documentation, tool release versions, Nigerian university SIWES benchmarks, and ITF regulatory policies backed directly by real-time web citations.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] text-center shrink-0">
          <div className="text-xs font-bold text-[#10B981]">Live Web Grounding</div>
          <div className="text-[11px] text-[#6B7280] mt-1">Citations & Queries Included</div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-[#1A1D2B] border border-[#2E3447] rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search current industry benchmarks, ITF rules, or technical documentation..."
              className="w-full bg-[#0F1118] border border-[#2E3447] rounded-md pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="w-full sm:w-auto !px-6 !py-3 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Searching Web..." : "Run Grounded Search"}</span>
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(sq)}
              disabled={loading}
              className="!px-3 !py-1 !rounded-md !bg-[#0F1118] hover:!bg-[#24293D] border border-[#2E3447] !text-[#D1D5DB] hover:!text-white text-[11px] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Results Section */}
      {resultText && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Answer (8 cols) */}
          <div className="lg:col-span-8 bg-[#1A1D2B] border border-[#2E3447] rounded-xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2E3447] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-bold text-white">Grounded Technical Analysis</h3>
              </div>

              <button
                onClick={handleCopy}
                className="!px-2.5 !py-1 !rounded-md !bg-[#0F1118] hover:!bg-[#24293D] border border-[#2E3447] text-xs text-[#D1D5DB] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">
              {resultText}
            </div>
          </div>

          {/* Web Sources & Grounding Metadata (4 cols) */}
          <div className="lg:col-span-4 bg-[#1A1D2B] border border-[#2E3447] rounded-xl p-6 sm:p-8 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#06B6D4]" />
              <span>Verified Search Citations</span>
            </h3>

            {groundingMetadata?.webSearchQueries && (
              <div className="space-y-2">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold block">
                  Search Queries Executed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {groundingMetadata.webSearchQueries.map((q: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#0F1118] border border-[#2E3447] text-[11px] text-[#06B6D4] font-mono"
                    >
                      "{q}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0 ? (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold block">
                  Web Sources & References:
                </span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                    const web = chunk.web;
                    if (!web) return null;
                    return (
                      <a
                        key={i}
                        href={web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-[#0F1118] border border-[#2E3447] hover:border-[#3B82F6] block space-y-1 transition-all group"
                      >
                        <div className="text-xs font-semibold text-[#D1D5DB] group-hover:text-white flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{web.title || "Web Reference"}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#3B82F6] shrink-0" />
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono block truncate">
                          {web.uri}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#6B7280]">
                Grounded directly using Google Search indexes for up-to-date real world accuracy.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
