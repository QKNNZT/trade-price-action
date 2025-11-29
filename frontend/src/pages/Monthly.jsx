// src/pages/Monthly.jsx  (Review Weekly / Monthly)
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

export default function ReviewPage() {
  const [periodType, setPeriodType] = useState("month"); // "month" | "week"
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

  // 12 tháng gần nhất
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return {
          value: format(date, "yyyy-MM"), // YYYY-MM
          label: format(date, "MMMM yyyy"),
        };
      }).reverse(),
    []
  );

  // 12 tuần gần nhất
  const weeks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const start = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });
        return {
          value: format(start, "yyyy-MM-dd"), // dùng ngày bắt đầu làm key
          label: `Tuần ${format(start, "dd/MM")} - ${format(end, "dd/MM")}`,
          from: format(start, "yyyy-MM-dd"),
          to: format(end, "yyyy-MM-dd"),
        };
      }).reverse(),
    []
  );

  // đảm bảo tuần được chọn
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
    } else {
      const week =
        weeks.find((w) => w.value === selectedWeekKey) ||
        weeks[weeks.length - 1];
      if (!week) return { from: null, to: null };
      return { from: week.from, to: week.to };
    }
  };

  const periodKey =
    periodType === "month"
      ? selectedMonth
      : selectedWeekKey || (weeks[weeks.length - 1]?.value ?? "");

  const periodLabel =
    periodType === "month"
      ? format(new Date(selectedMonth + "-01"), "MMMM yyyy")
      : (() => {
          const w = weeks.find((w) => w.value === periodKey);
          return w ? w.label : "";
        })();

  // ====== 3.1. Load STATS (current + previous + setup_stats) ======
  useEffect(() => {
    const { from, to } = getCurrentRange();
    if (!from || !to) return;

    const params = new URLSearchParams();
    params.append("from", from);
    params.append("to", to);

    setLoadingStats(true);
    setStatsError(null);

    fetch(`${API_BASE_URL}/api/stats/review?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load review stats");
        return res.json();
      })
      .then((data) => {
        setReviewData(data);
      })
      .catch((err) => {
        console.error("Review stats error:", err);
        setStatsError(err.message);
      })
      .finally(() => setLoadingStats(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType, selectedMonth, selectedWeekKey]);

  // ====== 3.2. Load review notes từ backend ======
  useEffect(() => {
    if (!periodKey) return;

    setNotesLoading(true);
    setNotesError(null);
    setSaveMessage(null);

    const params = new URLSearchParams();
    params.append("period_type", periodType);
    params.append("period_key", periodKey);

    fetch(`${API_BASE_URL}/api/reviews?${params.toString()}`)
      .then((res) => {
        if (res.status === 404) {
          // chưa có note
          setGoodNotes("");
          setImproveNotes("");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load review notes");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setGoodNotes(data.good_points || "");
          setImproveNotes(data.improvement_points || "");
        }
      })
      .catch((err) => {
        console.error("Review notes error:", err);
        setNotesError(err.message);
      })
      .finally(() => setNotesLoading(false));
  }, [periodType, periodKey]);

  const handleSaveNotes = () => {
    const { from, to } = getCurrentRange();
    if (!from || !to) return;

    setSaving(true);
    setSaveMessage(null);

    fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period_type: periodType,
        period_key: periodKey,
        from_date: from,
        to_date: to,
        good_points: goodNotes,
        improvement_points: improveNotes,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save review");
        return res.json();
      })
      .then(() => {
        setSaveMessage("Saved ✅");
      })
      .catch((err) => {
        console.error("Save review error:", err);
        setSaveMessage("Save failed ❌");
      })
      .finally(() => setSaving(false));
  };

  // ====== Derive stats từ reviewData ======
  const current = reviewData?.current || {};
  const overview = current.overview || {};
  const bestTrade = current.best_trade || null;
  const worstTrade = current.worst_trade || null;
  const streak = current.win_streak ?? 0;

  const prevOverview = reviewData?.previous?.overview || null;

  const totalTrades = overview.total_trades ?? 0;
  const totalProfit = Number(overview.net_profit ?? 0);
  const totalPct = Number(overview.net_profit_pct ?? 0);
  const winrate = Number(overview.winrate ?? 0);
  const avgRR = Number(overview.avg_r ?? 0);

  const hasPrev = !!prevOverview;
  const prevProfit = hasPrev ? Number(prevOverview.net_profit ?? 0) : 0;
  const prevWinrate = hasPrev ? Number(prevOverview.winrate ?? 0) : 0;
  const deltaProfit = totalProfit - prevProfit;
  const deltaWinrate = winrate - prevWinrate;

  // Setup performance trong kỳ hiện tại
  const setupMap =
    (reviewData?.setup_stats || []).reduce((acc, item) => {
      const key = item.key || "Unknown";
      const s = item.stats;
      acc[key] = {
        trades: s.total_trades,
        win: s.win_trades,
        rr: s.net_r,
        profit: s.net_profit,
      };
      return acc;
    }, {}) || {};

  if (loadingStats && !reviewData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">
          Đang tải Review...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-4">
              <Calendar className="w-12 h-12 text-yellow-500" />
              Trading Review
            </h1>
            <p className="text-2xl text-gray-300 mt-3 font-medium tracking-wide">
              Đánh giá hiệu suất theo{" "}
              <span className="text-yellow-500 font-bold">
                tuần / tháng – nơi bạn thực sự tiến bộ
              </span>
            </p>
            <p className="text-gray-400 mt-2">
              Giai đoạn:{" "}
              <span className="text-yellow-400 font-semibold">
                {periodLabel}
              </span>{" "}
              •{" "}
              <span className="text-white font-semibold">
                {totalTrades} trades
              </span>
            </p>
            {statsError && (
              <p className="mt-2 text-sm text-red-400">
                Stats error: {statsError}
              </p>
            )}
            {notesError && (
              <p className="mt-1 text-sm text-red-400">
                Notes error: {notesError}
              </p>
            )}
          </div>

          {/* Chọn kiểu & khoảng thời gian */}
          <div className="flex flex-col items-end gap-3">
            <div className="inline-flex bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setPeriodType("month")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  periodType === "month"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300"
                }`}
              >
                Theo tháng
              </button>
              <button
                onClick={() => setPeriodType("week")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  periodType === "week"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300"
                }`}
              >
                Theo tuần
              </button>
            </div>

            {periodType === "month" ? (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-6 py-3 bg-gray-800 rounded-xl text-lg font-semibold border border-gray-700 focus:border-yellow-500 outline-none"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={periodKey}
                onChange={(e) => setSelectedWeekKey(e.target.value)}
                className="px-6 py-3 bg-gray-800 rounded-xl text-lg font-semibold border border-gray-700 focus:border-yellow-500 outline-none"
              >
                {weeks.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* BIG STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">{totalProfit.toFixed(1)}</div>
            <div className="text-green-200 mt-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Net Profit ($)
            </div>
            {hasPrev && (
              <div className="text-xs mt-2 text-emerald-100">
                {deltaProfit >= 0 ? "+" : "-"}
                {Math.abs(deltaProfit).toFixed(1)} vs kỳ trước
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">{totalPct.toFixed(1)}%</div>
            <div className="text-blue-200 mt-2">Return %</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">{winrate.toFixed(1)}%</div>
            <div className="text-purple-200 mt-2">Win Rate</div>
            {hasPrev && (
              <div className="text-xs mt-2 text-purple-100">
                {deltaWinrate >= 0 ? "+" : "-"}
                {Math.abs(deltaWinrate).toFixed(1)}% vs kỳ trước
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">1:{avgRR.toFixed(2)}</div>
            <div className="text-yellow-200 mt-2 flex items-center gap-2">
              <Target className="w-6 h-6" /> Avg R:R
            </div>
          </div>
        </div>

        {/* BEST / WORST / STREAK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Best Trade */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-green-400">Best Trade</h3>
              <Award className="w-8 h-8 text-green-400" />
            </div>
            {bestTrade ? (
              <div>
                <div className="text-3xl font-bold text-green-400">
                  +{bestTrade.profit.toFixed(1)}
                </div>
                <div className="text-gray-400">
                  {bestTrade.symbol} • {bestTrade.setup}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {format(new Date(bestTrade.date), "dd/MM/yyyy")}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Chưa có</p>
            )}
          </div>

          {/* Worst Trade */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-400">Worst Trade</h3>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            {worstTrade ? (
              <div>
                <div className="text-3xl font-bold text-red-400">
                  {worstTrade.profit.toFixed(1)}
                </div>
                <div className="text-gray-400">
                  {worstTrade.symbol} • {worstTrade.setup}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {format(new Date(worstTrade.date), "dd/MM/yyyy")}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Chưa có</p>
            )}
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Win Streak</h3>
              <Flame className="w-10 h-10" />
            </div>
            <div className="text-5xl font-bold">{streak}</div>
            <div className="text-orange-200">lệnh thắng liên tiếp</div>
          </div>
        </div>

        {/* SETUP PERFORMANCE TRONG PERIOD */}
        {Object.keys(setupMap).length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Setup Performance trong giai đoạn này
            </h2>
            <SetupTable statsBySetup={setupMap} />
          </div>
        )}

        {/* NOTES: GOOD / IMPROVE */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Đã làm tốt giai đoạn này
            </h2>
            <p className="text-sm text-emerald-100 mb-3">
              (Viết cụ thể: điều gì giúp bạn thắng? kỷ luật, setup, quản lý
              lệnh...)
            </p>
            <textarea
              value={goodNotes}
              onChange={(e) => setGoodNotes(e.target.value)}
              className="w-full min-h-[140px] bg-black/20 border border-emerald-300/40 rounded-xl p-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="- Tuân thủ plan\n- Không revenge trade\n- ..."
            />
          </div>

          <div className="bg-gradient-to-br from-rose-600 to-purple-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Cần cải thiện giai đoạn sau
            </h2>
            <p className="text-sm text-rose-100 mb-3">
              (Những lỗi lớn nhất, pattern xấu, cảm xúc, v.v.)
            </p>
            <textarea
              value={improveNotes}
              onChange={(e) => setImproveNotes(e.target.value)}
              className="w-full min-h-[140px] bg-black/20 border border-rose-300/40 rounded-xl p-4 text-base focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="- Tránh FOMO cuối phiên NY\n- Không vào lệnh khi mệt\n- ..."
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end mt-4 gap-3">
          {notesLoading && (
            <span className="text-sm text-gray-400">Loading notes...</span>
          )}
          {saveMessage && (
            <span className="text-sm text-gray-300">{saveMessage}</span>
          )}
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold shadow-lg hover:bg-yellow-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Review"}
          </button>
        </div>

        {/* Quote */}
        <div className="mt-12 text-center py-8 bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl">
          <p className="text-3xl font-bold italic">
            “Amateurs practice until they get it right.
          </p>
          <p className="text-3xl font-bold italic mt-4">
            Professionals practice until they can't get it wrong.”
          </p>
          <p className="text-xl text-gray-300 mt-6">— Mark Minervini</p>
        </div>
      </div>
    </div>
  );
}
