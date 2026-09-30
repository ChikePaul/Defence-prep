import React from "react";
import { Award, X, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../types/siwes";

interface BadgeToastProps {
  badge: Badge | null;
  onDismiss: () => void;
}

export const BadgeToast: React.FC<BadgeToastProps> = ({ badge, onDismiss }) => {
  if (!badge) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-fade-in pointer-events-auto">
      <div className="bg-[#0b101c] border-2 border-indigo-500/80 rounded-2xl p-4 shadow-2xl shadow-indigo-500/20 backdrop-blur-md flex items-start gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-md">
          <Award className="w-5 h-5 text-slate-950" />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>Achievement Unlocked</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5 truncate">{badge.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug line-clamp-2">
            {badge.description}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
