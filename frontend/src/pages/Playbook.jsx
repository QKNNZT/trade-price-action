// src/pages/Playbook.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { PLAYBOOK_SETUPS } from "../config/playbookSetups";
import { API_BASE_URL } from "../config/api";
import {
  Copy,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const READY_THRESHOLD = 85;
const ALMOST_THRESHOLD = 70;

export default function PlaybookPage({ theme = "dark" }) {
  const isDark = theme === "dark";
  const location = useLocation();

  const [selectedSetupId, setSelectedSetupId] = useState(
    () => PLAYBOOK_SETUPS[0]?.id ?? null
  );
  const [universalChecks, setUniversalChecks] = useState({});
  const [setupChecks, setSetupChecks] = useState({});
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(true);

  // ──────────────────────────────────────────────────────────────
  // THEME COLORS – PRO + BRAND #F0B90B
  // ──────────────────────────────────────────────────────────────
  const colors = {
    bg: isDark
      ? "bg-gradient-to-br from-gray-900 via-[#0a0d14] to-gray-900"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    card: isDark
      ? "bg-gray-800/90 backdrop-blur-md"
      : "bg-white/90 backdrop-blur-md",
    cardBorder: isDark ? "border-gray-700" : "border-gray-200",
    accent: "#F0B90B",
    accentHover: isDark ? "#f59e0b" : "#d97706",
    success: isDark ? "text-emerald-400" : "text-emerald-600",
    warning: isDark ? "text-orange-400" : "text-orange-600",
    danger: isDark ? "text-rose-400" : "text-rose-600",
    badgeBg: isDark ? "bg-gray-800" : "bg-gray-100",
    progressTrack: isDark ? "bg-gray-700/60" : "bg-gray-200",
    dividerBorder: isDark ? "border-gray-700/60" : "border-gray-200",
    checklistHover: isDark ? "hover:bg-white/5" : "hover:bg-gray-100",
  };

  // ──────────────────────────────────────────────────────────────
  // EFFECTS
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setUniversalChecks({});
    setSetupChecks({});
  }, [selectedSetupId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const setupName = params.get("setup");
    if (!setupName) return;
    const found = PLAYBOOK_SETUPS.find(
      (s) => s.name.toLowerCase() === setupName.toLowerCase()
    );
    if (found) setSelectedSetupId(found.id);
  }, [location.search]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoadingTrades(true);
        const res = await fetch(`${API_BASE_URL}/api/trades`);
        const data = await res.json();
        setTrades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching trades:", err);
      } finally {
        setLoadingTrades(false);
      }
    };
    fetchTrades();
  }, []);

  // ──────────────────────────────────────────────────────────────
  // DERIVED DATA
  // ──────────────────────────────────────────────────────────────
  const selectedSetup = useMemo(
    () => PLAYBOOK_SETUPS.find((s) => s.id === selectedSetupId) ?? null,
    [selectedSetupId]
  );

  const uniLines = useMemo(
    () =>
      selectedSetup?.universal_checklist
        ?.split("\n")
        .map((l) => l.trim())
        .filter(Boolean) || [],
    [selectedSetup]
  );
  const setupLines = useMemo(
    () =>
      selectedSetup?.setup_checklist
        ?.split("\n")
        .map((l) => l.trim())
        .filter(Boolean) || [],
    [selectedSetup]
  );

  const uniDone = Object.values(universalChecks).filter(Boolean).length;
  const setupDone = Object.values(setupChecks).filter(Boolean).length;
  const setupPercent =
    setupLines.length > 0
      ? Math.round((setupDone / setupLines.length) * 100)
      : 0;

  const setupTrades = useMemo(() => {
    if (!selectedSetup) return [];
    return trades.filter(
      (t) => (t.setup || "").toLowerCase() === selectedSetup.name.toLowerCase()
    );
  }, [trades, selectedSetup]);

  const setupStats = useMemo(() => {
    const total = setupTrades.length;
    if (total === 0)
      return {
        total: 0,
        wins: 0,
        losses: 0,
        be: 0,
        winrate: 0,
        avgR: 0,
        expectancy: 0,
      };
    const wins = setupTrades.filter((t) => t.profit > 0).length;
    const losses = setupTrades.filter((t) => t.profit < 0).length;
    const be = total - wins - losses;
    const winrate = (wins / total) * 100;
    const avgR = setupTrades.reduce((s, t) => s + (t.rr || 0), 0) / total;
    const expectancy =
      setupTrades.reduce((s, t) => s + (t.profit || 0), 0) / total;
    return { total, wins, losses, be, winrate, avgR, expectancy };
  }, [setupTrades]);

  // ──────────────────────────────────────────────────────────────
  // TOGGLE & COPY
  // ──────────────────────────────────────────────────────────────
  const toggleUniversal = (idx) =>
    setUniversalChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const toggleSetup = (idx) =>
    setSetupChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text.trim());
    alert("Đã copy checklist!");
  };

  if (!selectedSetup) {
    return (
      <div
        className={`min-h-screen ${colors.bg} ${colors.text} flex items-center justify-center`}
      >
        <div className="text-xl animate-pulse">Đang tải Playbook...</div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen ${colors.bg} ${colors.text} font-sans transition-colors duration-300`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <Sparkles
                size={14}
                className={`${isDark ? "text-yellow-400" : "text-amber-600"}`}
              />
              Trading OS · AI Playbook 2025
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Playbook / System
            </h1>
            <p className={`mt-2 text-lg ${colors.textMuted} max-w-2xl`}>
              Mở tab này trước phiên, tick checklist và ra quyết định trong{" "}
              <span className="font-bold text-yellow-500">15 giây</span>.
            </p>
          </div>

          {/* PROGRESS CARD */}
          <div
            className={`rounded-2xl ${
              isDark
                ? "bg-gradient-to-br from-emerald-600/20 to-teal-700/20 border-emerald-500/30"
                : "bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300"
            } border p-5 shadow-xl`}
          >
            <div className=" flex items-center justify-between">
              <span className={`${colors.textMuted} text-sm`}>
                Tiến độ setup
              </span>
              <span className="p-1 text-xs font-medium">{selectedSetup.name}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1">
                <div
                  className={`h-3 ${colors.progressTrack} rounded-full overflow-hidden`}
                >
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      setupPercent >= READY_THRESHOLD
                        ? "bg-emerald-500"
                        : setupPercent >= ALMOST_THRESHOLD
                        ? "bg-orange-500"
                        : "bg-gray-500"
                    }`}
                    style={{ width: `${setupPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-500">
                {setupPercent}%
              </span>
            </div>
            <div className={`py-1 text-xs ${colors.textMuted}`}>
              {setupDone}/{setupLines.length} điều kiện
            </div>
            {renderStatusBadge(setupPercent, colors, isDark)}
          </div>
        </header>

        {/* LAYOUT */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div
              className={`rounded-3xl border ${colors.cardBorder} ${colors.card} shadow-2xl overflow-hidden`}
            >
              <div
                className={`px-5 py-4 ${
                  isDark
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-600"
                }`}
              >
                <h2 className="text-lg font-bold text-black">Setups</h2>
                <p className="text-xs text-black/80">Chọn để load checklist</p>
              </div>
              <ul className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                {PLAYBOOK_SETUPS.map((s) => {
                  const isActive = s.id === selectedSetupId;
                  return (
                    <li
                      key={s.id}
                      onClick={() => setSelectedSetupId(s.id)}
                      className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 hover:shadow-xl ${
                        isActive
                          ? `${
                              isDark
                                ? "border-yellow-500 bg-gradient-to-r from-yellow-500/20 to-amber-500/20"
                                : "border-amber-600 bg-gradient-to-r from-amber-100 to-orange-100"
                            } ring-2 ring-yellow-400/50`
                          : `${colors.cardBorder} ${colors.card} hover:border-gray-500`
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          className={`font-bold ${
                            isActive ? "text-yellow-600" : ""
                          }`}
                        >
                          {s.name}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-bold ${
                            isActive
                              ? "bg-black/20 text-black"
                              : colors.badgeBg + " text-gray-600"
                          }`}
                        >
                          v{s.Version}
                        </span>
                      </div>
                      <div
                        className={`mt-2 flex gap-2 text-xs ${
                          isActive ? "text-yellow-700" : colors.textMuted
                        }`}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full border ${
                            isActive ? "border-black/30" : colors.cardBorder
                          }`}
                        >
                          {s.direction}
                        </span>
                        <span className="truncate">
                          {s.instruments.join(" • ")}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-8 space-y-6">
            {/* CHECKLISTS */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* UNIVERSAL CHECKLIST */}
              <div className="min-w-0">
                <div
                  className={`rounded-3xl border ${
                    isDark ? "border-emerald-500/40" : "border-emerald-400/50"
                  } ${
                    isDark
                      ? "bg-gradient-to-br from-emerald-600/10 to-teal-700/10"
                      : "bg-gradient-to-br from-emerald-50 to-teal-50"
                  } p-6 shadow-xl`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold flex items-center gap-2 flex-wrap">
                        <span className="truncate">Universal Checklist</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                            isDark
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          Bắt buộc
                        </span>
                      </h3>
                      <p className={`text-sm ${colors.textMuted} mt-1`}>
                        Tick hết trước mọi lệnh
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() =>
                          copyToClipboard(selectedSetup.universal_checklist)
                        }
                        className={`p-2 rounded-xl ${
                          isDark
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-gray-100 hover:bg-gray-200"
                        } transition`}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => setUniversalChecks({})}
                        className={`p-2 rounded-xl ${
                          isDark
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-gray-100 hover:bg-gray-200"
                        } transition`}
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {uniLines.map((line, i) => (
                      <label
                        key={i}
                        onClick={() => toggleUniversal(i)}
                        className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl transition min-w-0 ${colors.checklistHover}`}
                      >
                        {universalChecks[i] ? (
                          <CheckSquare size={22} className={colors.success} />
                        ) : (
                          <Square
                            size={22}
                            className={`${colors.textMuted} opacity-60`}
                          />
                        )}
                        <span
                          className={`leading-relaxed text-sm flex-1 min-w-0 ${
                            universalChecks[i] ? "line-through opacity-60" : ""
                          }`}
                        >
                          <span className="block truncate">
                            {stripChecklistPrefix(line)}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className={`mt-4 text-sm ${colors.textMuted}`}>
                    Đã tick:{" "}
                    <strong className={colors.success}>
                      {uniDone}/{uniLines.length}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SETUP CHECKLIST */}
              <div className="min-w-0">
                <div
                  className={`rounded-3xl border ${
                    isDark ? "border-amber-500/40" : "border-amber-400/50"
                  } ${
                    isDark
                      ? "bg-gradient-to-br from-amber-600/10 to-orange-700/10"
                      : "bg-gradient-to-br from-amber-50 to-orange-50"
                  } p-6 shadow-xl`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold flex items-center gap-2 flex-wrap">
                        <span className="truncate">Setup Checklist</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                            isDark
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {selectedSetup.name}
                        </span>
                      </h3>
                      <p
                        className={`text-sm ${colors.textMuted} mt-1 truncate`}
                      >
                        {selectedSetup.direction} •{" "}
                        {selectedSetup.instruments.join(" • ")}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() =>
                          copyToClipboard(selectedSetup.setup_checklist)
                        }
                        className="p-2 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 transition"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => setSetupChecks({})}
                        className={`p-2 rounded-xl ${
                          isDark
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-gray-100 hover:bg-gray-200"
                        } transition`}
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {setupLines.map((line, i) => (
                      <label
                        key={i}
                        onClick={() => toggleSetup(i)}
                        className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl transition min-w-0 ${colors.checklistHover}`}
                      >
                        {setupChecks[i] ? (
                          <CheckSquare size={22} className="text-yellow-500" />
                        ) : (
                          <Square
                            size={22}
                            className={`${colors.textMuted} opacity-60`}
                          />
                        )}
                        <span
                          className={`leading-relaxed text-sm flex-1 min-w-0 ${
                            setupChecks[i] ? "line-through opacity-60" : ""
                          }`}
                        >
                          <span className="block truncate">
                            {stripChecklistPrefix(line)}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className={colors.textMuted}>
                      Đã tick:{" "}
                      <strong className="text-yellow-500">
                        {setupDone}/{setupLines.length}
                      </strong>
                    </span>
                    <div>{renderStatusBadge(setupPercent, colors, isDark)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAIL + STATS */}
            <div
              className={`rounded-3xl border ${colors.cardBorder} ${colors.card} p-6 shadow-2xl`}
            >
              <div
                className={`flex flex-wrap justify-between items-start gap-4 pb-5 border-b ${colors.dividerBorder}`}
              >
                <div>
                  <h2 className="text-2xl font-bold">{selectedSetup.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      v{selectedSetup.Version}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedSetup.direction}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${colors.textMuted}`}
                    >
                      {selectedSetup.instruments.join(" • ")}
                    </span>
                  </div>
                </div>
                {/* 4 STATS */}
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: "Trades", value: setupStats.total },
                    {
                      label: "Winrate",
                      value: `${setupStats.winrate.toFixed(1)}%`,
                      color: colors.success,
                    },
                    {
                      label: "Avg R",
                      value: setupStats.avgR.toFixed(2),
                      color: "text-indigo-400",
                    },
                    {
                      label: "Exp.",
                      value: `${
                        setupStats.expectancy >= 0 ? "+" : ""
                      }${setupStats.expectancy.toFixed(1)}`,
                      color:
                        setupStats.expectancy >= 0
                          ? colors.success
                          : colors.danger,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        isDark ? "bg-gray-800/70" : "bg-gray-100"
                      } border ${colors.cardBorder}`}
                    >
                      <span className={colors.textMuted}>{stat.label}:</span>
                      <span className={`ml-1 font-bold ${stat.color || ""}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {loadingTrades && (
                <div className={`text-xs ${colors.textMuted} mt-3`}>
                  Đang sync trades...
                </div>
              )}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {[
                  {
                    title: "1. Market Context",
                    content: selectedSetup.context,
                  },
                  {
                    title: "2. Entry Rules",
                    content: selectedSetup.entry_rules,
                  },
                  {
                    title: "3. Stop Loss & TP",
                    content: selectedSetup.sl_tp_rules,
                  },
                  {
                    title: "4. Trade Management",
                    content: selectedSetup.management,
                  },
                  {
                    title: "5. Invalidation",
                    content: selectedSetup.invalidation,
                  },
                  {
                    title: "6. Common Mistakes",
                    content: selectedSetup.mistakes,
                  },
                ].map((sec, i) => (
                  <Section
                    key={i}
                    title={sec.title}
                    isDark={isDark}
                    colors={colors}
                  >
                    <Pre>{sec.content}</Pre>
                  </Section>
                ))}
                {selectedSetup.notes && (
                  <Section
                    title="Notes / Changelog"
                    isDark={isDark}
                    colors={colors}
                  >
                    <Pre>{selectedSetup.notes}</Pre>
                  </Section>
                )}
                {setupStats.total > 0 && (
                  <Section
                    title="Recent Trades"
                    isDark={isDark}
                    colors={colors}
                  >
                    <div className="space-y-2">
                      {setupTrades
                        .slice(0, 6)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((t) => (
                          <div
                            key={t.id}
                            className={`flex justify-between items-center p-3 rounded-xl ${
                              isDark ? "bg-gray-900/50" : "bg-gray-100"
                            }`}
                          >
                            <div>
                              <div className="font-medium">
                                {t.symbol} • {t.direction}
                              </div>
                              <div className={`text-xs ${colors.textMuted}`}>
                                {t.date} • RR: {t.rr?.toFixed(2) || "-"}
                              </div>
                            </div>
                            <div
                              className={`font-bold ${
                                t.profit > 0
                                  ? colors.success
                                  : t.profit < 0
                                  ? colors.danger
                                  : "text-amber-400"
                              }`}
                            >
                              {t.profit > 0
                                ? `+$${t.profit.toFixed(1)}`
                                : t.profit < 0
                                ? `$${t.profit.toFixed(1)}`
                                : "BE"}
                            </div>
                          </div>
                        ))}
                    </div>
                  </Section>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */
function Section({ title, children, isDark, colors }) {
  return (
    <section
      className={`rounded-2xl border ${colors.cardBorder} ${
        isDark ? "bg-gray-800/70" : "bg-gray-50"
      } p-4`}
    >
      <h3 className="text-base font-bold mb-3">{title}</h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Pre({ children }) {
  return (
    <pre className="whitespace-pre-wrap break-words text-sm text-inherit">
      {children}
    </pre>
  );
}

function stripChecklistPrefix(line) {
  return line.replace(/^(Check|Uncheck)\s*[-:]?\s*/i, "").trim();
}

function renderStatusBadge(percent, colors, isDark) {
  if (percent >= READY_THRESHOLD) {
    return (
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full ${
          isDark
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        READY TO TRADE
      </span>
    );
  }
  if (percent >= ALMOST_THRESHOLD) {
    return (
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full ${
          isDark
            ? "bg-orange-500/20 text-orange-400"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        Gần đủ
      </span>
    );
  }
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
      }`}
    >
      Chưa đủ
    </span>
  );
}
