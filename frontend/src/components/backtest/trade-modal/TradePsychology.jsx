import React from "react";
import { ChevronDown } from "lucide-react";

const PSYCH_COLORS = {
  fear: { dark: "text-red-400", light: "text-red-600" },
  greed: { dark: "text-yellow-400", light: "text-yellow-600" },
  calm: { dark: "text-emerald-400", light: "text-emerald-600" },
  focused: { dark: "text-blue-400", light: "text-blue-600" },
  neutral: { dark: "text-gray-400", light: "text-gray-600" },
};

export default function TradePsychology({ data, update, getPsychEmoji, theme = "dark" }) {
  const isDark = theme === "dark";
  const currentColor = PSYCH_COLORS[data.psych]?.[isDark ? "dark" : "light"] || "text-gray-400";

  return (
    <div
      className={`
        flex items-center justify-between rounded-2xl p-5 border backdrop-blur-md
        transition-all duration-200 shadow-sm
        ${isDark
          ? "bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-slate-700"
          : "bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-200"
        }
      `}
    >
      <span className={`font-semibold text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        Psychology State
      </span>

      <div className="relative px-3">
        <select
          value={data.psych}
          onChange={(e) => update("psych", e.target.value)}
          className={`
            appearance-none rounded-xl pl-4 pr-12 py-3 text-sm font-medium
            outline-none cursor-pointer transition-all duration-200
            focus:ring-4 focus:ring-blue-500/30
            ${isDark
              ? "bg-slate-800/90 border border-slate-600 text-white hover:border-slate-500"
              : "bg-white/90 border border-blue-300 text-slate-800 hover:border-blue-400"
            }
          `}
        >
          <option value="fear">Fear (cảnh giác)</option>
          <option value="greed">Greed (tham lam)</option>
          <option value="calm">Calm (bình tĩnh)</option>
          <option value="focused">Focused (tập trung)</option>
          <option value="neutral">Neutral (trung lập)</option>
        </select>

        {/* ICON + EMOJI */}
        <div className="absolute inset-y-0 right-3 flex items-center gap-1 pointer-events-none">
          <span className={`text-xl ${currentColor} font-bold`}>
            {getPsychEmoji(data.psych)}
          </span>
          <ChevronDown className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
        </div>
      </div>
    </div>
  );
}