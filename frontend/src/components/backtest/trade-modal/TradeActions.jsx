import React from "react";

export default function TradeActions({
  clone,
  save,
  index,
  trades,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`
        flex justify-between items-center
        pt-3 pb-4 px-3
        border-t sticky bottom-0 z-10
        backdrop-blur-xl transition-all duration-300
        shadow-sm
        rounded-2xl
        overflow-hidden
        ${
          isDark
            ? "border-slate-700 bg-slate-900/95"
            : "border-blue-200 bg-white/90"
        }
      `}
    >
      {/* LEFT: BUTTONS */}
      <div className="flex gap-2.5">
        {/* CLONE */}
        <button
          onClick={clone}
          className={`
            px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider
            shadow-lg transition-all duration-200 hover:scale-105
            flex items-center gap-1.5
            ${
              isDark
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
            }
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Clone
        </button>

        {/* SAVE */}
        <button
          onClick={save}
          className={`
            px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider
            shadow-lg transition-all duration-200 hover:scale-105
            flex items-center gap-1.5
            ${
              isDark
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            }
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save
        </button>
      </div>

      {/* RIGHT: COUNTER */}
      <div className="flex items-center">
        <span
          className={`
            text-xs font-bold uppercase tracking-wider
            ${isDark ? "text-slate-400" : "text-slate-500"}
          `}
        >
          Trade
        </span>
        <span
          className={`
            mx-1.5 text-sm font-extrabold
            ${isDark ? "text-white" : "text-slate-800"}
          `}
        >
          {index + 1}
        </span>
        <span
          className={`
            text-xs font-bold uppercase tracking-wider
            ${isDark ? "text-slate-400" : "text-slate-500"}
          `}
        >
          / {trades.length}
        </span>
      </div>
    </div>
  );
}
