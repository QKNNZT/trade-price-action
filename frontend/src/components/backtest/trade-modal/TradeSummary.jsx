import React from "react";

export default function TradeSummary({ data, update, theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* R:R */}
      <div
        className={`
          rounded-2xl p-5 text-center border backdrop-blur-md shadow-md
          transition-all duration-200 hover:scale-[1.02]
          ${isDark
            ? "bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-700/50"
            : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300"
          }
        `}
      >
        <p className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? "text-amber-400" : "text-amber-700"}`}>
          R:R
        </p>
        <p className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-amber-300" : "text-amber-800"}`}>
          1:{data.rr}
        </p>
      </div>

      {/* RESULT */}
      <div
        className={`
          rounded-2xl p-5 text-center border backdrop-blur-md shadow-md
          transition-all duration-200 hover:scale-[1.02]
          ${data.result === "win"
            ? isDark
              ? "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-600/50"
              : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300"
            : data.result === "loss"
            ? isDark
              ? "bg-gradient-to-br from-rose-900/30 to-red-900/30 border-rose-600/50"
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
            : isDark
              ? "bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-600/50"
              : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300"
          }
        `}
      >
        <p className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Result
        </p>
        <p
          className={`
            text-2xl sm:text-3xl font-bold
            ${data.result === "win"
              ? isDark ? "text-emerald-300" : "text-emerald-700"
              : data.result === "loss"
              ? isDark ? "text-rose-300" : "text-red-700"
              : isDark ? "text-amber-300" : "text-amber-700"
            }
          `}
        >
          {data.result.toUpperCase()}
        </p>
      </div>

      {/* DIRECTION */}
      <div
        className={`
          rounded-2xl p-5 text-center border backdrop-blur-md shadow-md
          transition-all duration-200 hover:scale-[1.02]
          ${isDark
            ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-700/50"
            : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300"
          }
        `}
      >
        <p className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
          Direction
        </p>
        <p className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-blue-300" : "text-blue-800"}`}>
          {data.direction.toUpperCase()}
        </p>
      </div>

      {/* RATING */}
      <div
        className={`
          rounded-2xl p-5 text-center border backdrop-blur-md shadow-md
          transition-all duration-200 hover:scale-[1.02]
          ${isDark
            ? "bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-700/50"
            : "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300"
          }
        `}
      >
        <p className={`text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-purple-400" : "text-purple-700"}`}>
          Rating
        </p>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => update("rating", s)}
              className={`
                text-2xl sm:text-3xl transition-all duration-200
                hover:scale-125 hover:drop-shadow-lg
                ${s <= data.rating
                  ? isDark ? "text-yellow-400 drop-shadow-md" : "text-yellow-600"
                  : isDark ? "text-slate-600" : "text-slate-400"
                }
              `}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}