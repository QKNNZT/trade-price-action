// src/pages/Monthly.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import {
  TrendingUp,
  Calendar,
  Target,
  AlertTriangle,
  Award,
  Flame,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import SetupTable from "../components/dashboard/SetupTable";

export default function ReviewPage({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [periodType, setPeriodType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [selectedWeekKey, setSelectedWeekKey] = useState(null);

  const [reviewData, setReviewData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const [goodNotes, setGoodNotes] = useState("");
  const [improveNotes, setImproveNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // ──────────────────────────────────────────────────────────────
  // THEME COLORS – ĐÃ SỬA WINSTREAK BUG
  // ──────────────────────────────────────────────────────────────
  const colors = {
    bg: isDark
      ? "bg-gradient-to-br from-gray-900 via-[#0f1117] to-gray-900"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    textSecondary: isDark ? "text-gray-300" : "text-gray-700",
    border: isDark ? "border-gray-700" : "border-gray-200",
    card: isDark
      ? "bg-gray-800/90 backdrop-blur-sm"
      : "bg-white/90 backdrop-blur-sm",
    cardBorder: isDark ? "border-gray-700" : "border-gray-200",
    accent: "#F0B90B",
    accentHover: isDark ? "#f59e0b" : "#d97706",
    // SỬA WINSTREAK: DÙNG MÀU RIÊNG CHO LIGHT MODE
    winStreakBg: isDark
      ? "bg-gradient-to-br from-orange-600 to-red-600"
      : "bg-gradient-to-br from-orange-400 to-red-500",
    winStreakText: isDark ? "text-white" : "text-white", // luôn trắng để nổi
  };

  // ──────────────────────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────────────────────
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return {
          value: format(date, "yyyy-MM"),
          label: format(date, "MMMM yyyy"),
        };
      }).reverse(),
    []
  );

  const weeks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const start = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });
        return {
          value: format(start, "yyyy-MM-dd"),
          label: `Tuần ${format(start, "dd/MM")} - ${format(end, "dd/MM")}`,
          from: format(start, "yyyy-MM-dd"),
          to: format(end, "yyyy-MM-dd"),
        };
      }).reverse(),
    []
  );

  useEffect(() => {
    if (periodType === "week" && !selectedWeekKey && weeks.length > 0) {
      setSelectedWeekKey(weeks[weeks.length - 1].value);
    }
  }, [periodType, selectedWeekKey, weeks]);

  const getCurrentRange = () => {
    if (periodType === "month") {
      const date = new Date(selectedMonth + "-01");
      return {
        from: format(startOfMonth(date), "yyyy-MM-dd"),
        to: format(endOfMonth(date), "yyyy-MM-dd"),
      };
    }
    const week =
      weeks.find((w) => w.value === selectedWeekKey) || weeks[weeks.length - 1];
    return week ? { from: week.from, to: week.to } : { from: null, to: null };
  };

  const periodKey =
    periodType === "month"
      ? selectedMonth
      : selectedWeekKey || weeks[weeks.length - 1]?.value || "";
  const periodLabel =
    periodType === "month"
      ? format(new Date(selectedMonth + "-01"), "MMMM yyyy")
      : weeks.find((w) => w.value === periodKey)?.label || "";

  // ──────────────────────────────────────────────────────────────
  // API
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const { from, to } = getCurrentRange();
    if (!from || !to) return;

    const params = new URLSearchParams({ from, to });
    setLoadingStats(true);
    setStatsError(null);

    fetch(`${API_BASE_URL}/api/stats/review?${params}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed")))
      .then(setReviewData)
      .catch((err) => setStatsError(err.message || "Error"))
      .finally(() => setLoadingStats(false));
  }, [periodType, selectedMonth, selectedWeekKey]);

  useEffect(() => {
    if (!periodKey) return;

    const params = new URLSearchParams({
      period_type: periodType,
      period_key: periodKey,
    });

    setNotesLoading(true);
    setSaveMessage(null);
    setNotesError(null); // reset lỗi cũ

    fetch(`${API_BASE_URL}/api/reviews?${params}`)
      .then((res) =>
        res.status === 404 ? null : res.ok ? res.json() : Promise.reject()
      )
      .then((data) => {
        if (data) {
          setGoodNotes(data.good_points || "");
          setImproveNotes(data.improvement_points || "");
        } else {
          setGoodNotes("");
          setImproveNotes("");
        }
      })
      .catch(() => setNotesError("Failed to load notes"))
      .finally(() => setNotesLoading(false));
  }, [periodType, periodKey]);

  const handleSaveNotes = () => {
    const { from, to } = getCurrentRange();
    if (!from || !to) return;

    setSaving(true);
    fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period_type: periodType,
        period_key: periodKey,
        from_date: from,
        to_date: to,
        good_points: goodNotes,
        improvement_points: improveNotes,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setSaveMessage("Saved"))
      .catch(() => setSaveMessage("Save failed"))
      .finally(() => setSaving(false));
  };

  // ──────────────────────────────────────────────────────────────
  // STATS
  // ──────────────────────────────────────────────────────────────
  const current = reviewData?.current || {};
  const overview = current.overview || {};
  const bestTrade = current.best_trade;
  const worstTrade = current.worst_trade;
  const streak = current.win_streak ?? 0;

  const prevOverview = reviewData?.previous?.overview;
  const hasPrev = !!prevOverview;

  const totalTrades = overview.total_trades ?? 0;
  const totalProfit = Number(overview.net_profit ?? 0);
  const totalPct = Number(overview.net_profit_pct ?? 0);
  const winrate = Number(overview.winrate ?? 0);
  const avgRR = Number(overview.avg_r ?? 0);

  const prevProfit = hasPrev ? Number(prevOverview.net_profit ?? 0) : null;
  const prevWinrate = hasPrev ? Number(prevOverview.winrate ?? 0) : null;
  const deltaProfit = prevProfit !== null ? totalProfit - prevProfit : null;
  const deltaWinrate = prevWinrate !== null ? winrate - prevWinrate : null;

  const formatDelta = (val) =>
    val === null ? "—" : val >= 0 ? `+${val.toFixed(1)}` : `${val.toFixed(1)}`;

  const setupMap = (reviewData?.setup_stats || []).reduce((acc, item) => {
    const key = item.key || "Unknown";
    const s = item.stats;
    acc[key] = {
      trades: s.total_trades,
      win: s.win_trades,
      rr: s.net_r,
      profit: s.net_profit,
    };
    return acc;
  }, {});

  if (loadingStats && !reviewData) {
    return (
      <div
        className={`min-h-screen ${colors.bg} ${colors.text} flex items-center justify-center`}
      >
        <div className="text-2xl animate-pulse">Đang tải Review...</div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen ${colors.bg} ${colors.text} p-6 transition-colors duration-300`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Calendar
                className={`w-11 h-11 ${
                  isDark ? "text-yellow-500" : "text-amber-600"
                }`}
              />
              Trading Review
            </h1>
            <p className={`${colors.textMuted} text-xl mt-2`}>
              Đánh giá hiệu suất theo{" "}
              <span
                className={`font-bold ${
                  isDark ? "text-yellow-500" : "text-amber-600"
                }`}
              >
                tuần / tháng
              </span>
            </p>
            <p className={`${colors.textMuted} mt-1`}>
              <span
                className={`font-semibold ${
                  isDark ? "text-yellow-400" : "text-amber-600"
                }`}
              >
                {periodLabel}
              </span>{" "}
              • {totalTrades} trades
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div
              className={`inline-flex ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              } rounded-xl p-1`}
            >
              {["month", "week"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPeriodType(type)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    periodType === type
                      ? "bg-yellow-500 text-black shadow-md"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  Theo {type === "month" ? "tháng" : "tuần"}
                </button>
              ))}
            </div>

            <select
              value={periodType === "month" ? selectedMonth : periodKey}
              onChange={(e) =>
                periodType === "month"
                  ? setSelectedMonth(e.target.value)
                  : setSelectedWeekKey(e.target.value)
              }
              className={`px-5 py-3 ${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-xl text-base font-medium border ${colors.border} ${
                isDark ? "focus:border-yellow-500" : "focus:border-amber-600"
              } outline-none transition-all`}
            >
              {(periodType === "month" ? months : weeks).map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* BIG STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            {
              value:
                totalProfit >= 0
                  ? `+$${totalProfit.toFixed(1)}`
                  : `-$${Math.abs(totalProfit).toFixed(1)}`,
              label: "Net Profit",
              icon: TrendingUp,
              gradient:
                totalProfit >= 0
                  ? "from-emerald-500 to-emerald-700"
                  : "from-red-500 to-rose-600",
              delta: deltaProfit,
            },
            {
              value: `${totalPct >= 0 ? "+" : ""}${totalPct.toFixed(1)}%`,
              label: "Return %",
              gradient: "from-blue-500 to-cyan-600",
            },
            {
              value: `${winrate.toFixed(1)}%`,
              label: "Win Rate",
              gradient: "from-purple-500 to-indigo-600",
              delta: deltaWinrate,
            },
            {
              value: `1:${avgRR.toFixed(2)}`,
              label: "Avg R:R",
              icon: Target,
              gradient: isDark
                ? "from-amber-500 to-orange-600"
                : "from-amber-600 to-orange-700",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-xl border ${colors.cardBorder} transform transition-all hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div className="text-4xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2 text-white/90">
                {stat.icon && <stat.icon className="w-5 h-5" />}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              {stat.delta !== undefined && (
                <div
                  className={`text-xs mt-1 ${
                    stat.delta >= 0 ? "text-emerald-200" : "text-red-200"
                  }`}
                >
                  {formatDelta(stat.delta)} vs kỳ trước
                </div>
              )}
            </div>
          ))}
        </div>
        {/* BEST / WORST / WINSTREAK – ĐÃ SỬA BUG */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* BEST */}
          <div
            className={`${colors.card} rounded-2xl p-6 border ${colors.cardBorder} shadow-lg transition-all hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-emerald-400">Best Trade</h3>
              <Award className="w-7 h-7 text-emerald-400" />
            </div>
            {bestTrade ? (
              <>
                <div className="text-3xl font-bold text-emerald-400">
                  {bestTrade.profit > 0 ? "+" : ""}
                  {bestTrade.profit.toFixed(1)}
                </div>
                <div className={colors.textMuted}>
                  {bestTrade.symbol} • {bestTrade.setup}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {format(new Date(bestTrade.date), "dd/MM/yyyy")}
                </div>
              </>
            ) : (
              <p className={colors.textMuted}>Chưa có</p>
            )}
          </div>

          {/* WORST */}
          <div
            className={`${colors.card} rounded-2xl p-6 border ${colors.cardBorder} shadow-lg transition-all hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-red-400">Worst Trade</h3>
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            {worstTrade ? (
              <>
                <div className="text-3xl font-bold text-red-400">
                  {worstTrade.profit.toFixed(1)}
                </div>
                <div className={colors.textMuted}>
                  {worstTrade.symbol} • {worstTrade.setup}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {format(new Date(worstTrade.date), "dd/MM/yyyy")}
                </div>
              </>
            ) : (
              <p className={colors.textMuted}>Chưa có</p>
            )}
          </div>

          {/* WINSTREAK – ĐÃ SỬA MÀU LIGHT MODE */}
          <div
            className={`${colors.winStreakBg} rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-bold ${colors.winStreakText}`}>
                Win Streak
              </h3>
              <Flame className={`w-8 h-8 ${colors.winStreakText}`} />
            </div>
            <div className={`text-5xl font-bold ${colors.winStreakText}`}>
              {streak}
            </div>
            <div className={`text-sm ${colors.winStreakText} opacity-90`}>
              lệnh thắng liên tiếp
            </div>
          </div>
        </div>
        {/* SETUP TABLE */}
        {Object.keys(setupMap).length > 0 && (
          <div
            className={`${colors.card} rounded-2xl p-6 border ${colors.cardBorder} shadow-lg mb-10`}
          >
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-yellow-400" : "text-amber-600"
              } mb-4`}
            >
              Setup Performance
            </h2>
            <SetupTable statsBySetup={setupMap} theme={theme} />
          </div>
        )}
        {/* NOTES */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-3 text-white">Đã làm tốt</h2>
            <textarea
              value={goodNotes}
              onChange={(e) => setGoodNotes(e.target.value)}
              className="w-full h-32 bg-white/10 border border-emerald-400/30 rounded-xl p-4 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-400 outline-none"
              placeholder="• Tuân thủ plan\n• Không FOMO..."
            />
          </div>
          <div className="bg-gradient-to-br from-rose-600 to-purple-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-3 text-white">Cần cải thiện</h2>
            <textarea
              value={improveNotes}
              onChange={(e) => setImproveNotes(e.target.value)}
              className="w-full h-32 bg-white/10 border border-rose-400/30 rounded-xl p-4 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-rose-400 outline-none"
              placeholder="• Tránh revenge\n• Không trade khi mệt..."
            />
          </div>
        </div>
        {/* SAVE */}
        <div className="flex justify-end gap-3">
          {saveMessage && (
            <span
              className={`text-sm ${
                saveMessage.includes("Saved")
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-400 disabled:opacity-60 transition-all"
          >
            {saving ? "Saving..." : "Save Review"}
          </button>
        </div>
        {/* QUOTE */}
        {/* QUOTE – PRO + LIGHT/DARK FIXED */}
        <div
          className={`mt-12 p-8 text-center rounded-3xl shadow-xl transition-all duration-300
  ${
    isDark
      ? "bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-sm border border-purple-700/50"
      : "bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200"
  }`}
        >
          <blockquote className="relative">
            <p
              className={`text-2xl md:text-3xl font-bold italic leading-relaxed
      ${
        isDark
          ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          : "text-gray-800"
      }`}
              style={{
                textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
              }}
            >
              “Amateurs practice until they get it right.
              <br />
              Professionals practice until they can’t get it wrong.”
            </p>
            <footer
              className={`mt-4 text-lg font-medium
      ${isDark ? "text-yellow-400" : "text-indigo-700"}`}
            >
              — Mark Minervini
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
