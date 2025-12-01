import React from "react";
import { AlertCircle, CheckCircle2, Target, TrendingUp } from "lucide-react";

export default function TradeDetails({ data, theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-8">
      {/* === ENTRY, TP, SL === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ENTRY */}
        <div
          className={`
            rounded-2xl p-5 border backdrop-blur-md shadow-md transition-all
            ${isDark 
              ? "bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-700/50" 
              : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300"
            }
          `}
        >
          <p className={`text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
            Entry Price
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${isDark ? "text-cyan-300" : "text-blue-700"}`}>
            {data.entry || "-"}
          </p>
        </div>

        {/* TP */}
        <div
          className={`
            rounded-2xl p-5 border backdrop-blur-md shadow-md transition-all
            ${isDark 
              ? "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-700/50" 
              : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
            }
          `}
        >
          <p className={`text-xs sm:text-sm font-medium mb-2 flex items-center gap-1 ${isDark ? "text-emerald-400" : "text-green-600"}`}>
            <Target className="w-3 h-3" /> Take Profit
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${isDark ? "text-emerald-300" : "text-green-700"}`}>
            {data.tp || "-"}
          </p>
        </div>

        {/* SL */}
        <div
          className={`
            rounded-2xl p-5 border backdrop-blur-md shadow-md transition-all
            ${isDark 
              ? "bg-gradient-to-br from-rose-900/30 to-red-900/30 border-rose-700/50" 
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
            }
          `}
        >
          <p className={`text-xs sm:text-sm font-medium mb-2 flex items-center gap-1 ${isDark ? "text-rose-400" : "text-red-600"}`}>
            <AlertCircle className="w-3 h-3" /> Stop Loss
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${isDark ? "text-rose-300" : "text-red-700"}`}>
            {data.sl || "-"}
          </p>
        </div>
      </div>

      {/* === CONFLUENCE === */}
      <div>
        <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
          <TrendingUp className="w-5 h-5" /> Confluence
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.confluence.length > 0 ? (
            data.confluence.map((tag, i) => (
              <span
                key={i}
                className={`
                  px-4 py-2 rounded-full text-xs font-medium border backdrop-blur-sm
                  transition-all hover:scale-105
                  ${isDark
                    ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/50 text-cyan-300"
                    : "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 text-blue-700"
                  }
                `}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className={`text-sm italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Không có confluence
            </span>
          )}
        </div>
      </div>

      {/* === MISTAKES === */}
      {data.mistakes.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-rose-300" : "text-red-700"}`}>
            <AlertCircle className="w-5 h-5" /> Mistakes Made
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.mistakes.map((m, i) => (
              <span
                key={i}
                className={`
                  px-4 py-2 rounded-full text-xs font-medium border backdrop-blur-sm
                  transition-all hover:scale-105
                  ${isDark
                    ? "bg-gradient-to-r from-rose-600/20 to-red-600/20 border-rose-500/50 text-rose-300"
                    : "bg-gradient-to-r from-red-100 to-rose-100 border-red-300 text-red-700"
                  }
                `}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* === NOTES === */}
      {data.notes && (
        <div>
          <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
            <CheckCircle2 className="w-5 h-5" /> Lesson Learned
          </h3>
          <div
            className={`
              rounded-2xl p-5 border backdrop-blur-md shadow-md italic leading-relaxed
              ${isDark
                ? "bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-700/40 text-amber-200"
                : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-800"
              }
            `}
          >
            "{data.notes}"
          </div>
        </div>
      )}
    </div>
  );
}