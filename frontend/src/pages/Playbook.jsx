// src/pages/Playbook.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { PLAYBOOK_SETUPS } from "../config/playbookSetups";
import { API_BASE_URL } from "../config/api";
import { Copy, CheckSquare, Square, RotateCcw, Sparkles } from "lucide-react";

const READY_THRESHOLD = 85;
const ALMOST_THRESHOLD = 70;

export default function PlaybookPage() {
  const location = useLocation();

  // === SETUP SELECTION ===
  const [selectedSetupId, setSelectedSetupId] = useState(
    () => PLAYBOOK_SETUPS[0]?.id ?? null
  );

  // === CHECKLIST STATES ===
  const [universalChecks, setUniversalChecks] = useState({});
  const [setupChecks, setSetupChecks] = useState({});

  // === TRADES (lấy từ backend) ===
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(true);

  // Khi đổi setup → reset checklist
  useEffect(() => {
    setUniversalChecks({});
    setSetupChecks({});
  }, [selectedSetupId]);

  // Đọc query ?setup=... để chọn đúng setup khi nhảy từ TradeLog
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const setupName = params.get("setup");

    if (!setupName) return;

    const found = PLAYBOOK_SETUPS.find(
      (s) => s.name.toLowerCase() === setupName.toLowerCase()
    );
    if (found) {
      setSelectedSetupId(found.id);
    }
  }, [location.search]);

  // Fetch trades từ Flask
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoadingTrades(true);
        const res = await fetch(`${API_BASE_URL}/api/trades`);
        const data = await res.json();
        setTrades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching trades for Playbook:", err);
      } finally {
        setLoadingTrades(false);
      }
    };

    fetchTrades();
  }, []);

  // === DERIVED DATA ===
  const selectedSetup = useMemo(
    () => PLAYBOOK_SETUPS.find((s) => s.id === selectedSetupId) ?? null,
    [selectedSetupId]
  );

  const uniLines = useMemo(
    () =>
      selectedSetup?.universal_checklist
        ? selectedSetup.universal_checklist
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        : [],
    [selectedSetup]
  );

  const setupLines = useMemo(
    () =>
      selectedSetup?.setup_checklist
        ? selectedSetup.setup_checklist
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        : [],
    [selectedSetup]
  );

  const uniDone = useMemo(
    () => Object.values(universalChecks).filter(Boolean).length,
    [universalChecks]
  );

  const setupDone = useMemo(
    () => Object.values(setupChecks).filter(Boolean).length,
    [setupChecks]
  );

  const setupPercent = useMemo(
    () =>
      setupLines.length > 0
        ? Math.round((setupDone / setupLines.length) * 100)
        : 0,
    [setupDone, setupLines.length]
  );

  // 👉 Trades thuộc setup đang chọn
  const setupTrades = useMemo(() => {
    if (!selectedSetup) return [];
    return trades.filter(
      (t) => (t.setup || "").toLowerCase() === selectedSetup.name.toLowerCase()
    );
  }, [trades, selectedSetup]);

  const setupStats = useMemo(() => {
    const total = setupTrades.length;
    if (total === 0) {
      return {
        total: 0,
        wins: 0,
        losses: 0,
        be: 0,
        winrate: 0,
        avgR: 0,
        expectancy: 0,
      };
    }

    const wins = setupTrades.filter((t) => t.profit > 0).length;
    const losses = setupTrades.filter((t) => t.profit < 0).length;
    const be = setupTrades.filter((t) => t.profit === 0).length;

    const winrate = (wins / total) * 100;
    const avgR =
      setupTrades.reduce((s, t) => s + (t.rr || 0), 0) / total;
    const expectancy =
      setupTrades.reduce((s, t) => s + (t.profit || 0), 0) / total;

    return { total, wins, losses, be, winrate, avgR, expectancy };
  }, [setupTrades]);

  // Toggle functions
  const toggleUniversal = (idx) => {
    setUniversalChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSetup = (idx) => {
    setSetupChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text.trim());
    alert("Đã copy checklist vào clipboard!");
  };

  if (!selectedSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-400 text-lg">
          Đang tải Playbook...
        </div>
      </div>
    );
  }

  return (
    <div
      className="page playbook-page min-h-screen bg-slate-950 text-slate-50 font-mono"
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontFeatureSettings: '"tnum", "liga"',
      }}
    >
      <div className="max-w-8xl mx-auto px-4 py-6 lg:py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300">
              <Sparkles size={14} className="text-yellow-400" />
              <span>Trading OS · AI Playbook 2025</span>
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight text-slate-50">
              Playbook / System
            </h1>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              Mở tab này trước phiên, tick checklist và ra quyết định trong dưới{" "}
              <span className="font-semibold text-slate-100">15 giây</span>.
            </p>
          </div>

          {/* Quick status */}
          <div className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-900/90 px-4 py-3 text-sm flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Tiến độ setup hiện tại</span>
              <span className="text-xs text-slate-400">
                {selectedSetup.name}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-yellow-400">
                  {setupPercent}%
                </span>
                <span className="text-xs text-slate-400">
                  ({setupDone}/{setupLines.length} điều kiện)
                </span>
              </div>
              {renderStatusBadge(setupPercent)}
            </div>
          </div>
        </header>

        {/* LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="relative rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_60px_rgba(15,23,42,0.8)] overflow-hidden">
              <div className="border-b border-slate-800/80 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-5 py-4">
                <h2 className="text-lg font-bold text-black">Setups</h2>
                <p className="mt-1 text-xs font-medium text-black/70">
                  Chọn setup để load checklist & rule chi tiết.
                </p>
              </div>
              <ul className="p-4 space-y-3 max-h-[72vh] overflow-y-auto">
                {PLAYBOOK_SETUPS.map((s) => {
                  const isActive = s.id === selectedSetupId;
                  return (
                    <li
                      key={s.id}
                      onClick={() => setSelectedSetupId(s.id)}
                      className={[
                        "group cursor-pointer rounded-2xl border px-4 py-3 text-sm transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow-lg",
                        isActive
                          ? "border-yellow-400/80 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-black shadow-lg ring-2 ring-yellow-300"
                          : "border-slate-700 bg-slate-900/70 hover:border-slate-500",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold truncate text-base">
                          {s.name}
                        </div>
                        <span
                          className={`text-[15px] px-2 py-0.5 rounded-full font-semibold ${
                            isActive
                              ? "bg-black/10 text-black"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          v{s.Version}
                        </span>
                      </div>
                      <div className="mt-1 text-sm flex items-center gap-2 text-slate-400">
                        <span
                          className={`px-2 py-0.5 rounded-full border ${
                            isActive
                              ? "border-black/40 text-black/80"
                              : "border-slate-700 text-slate-300"
                          }`}
                        >
                          {s.direction}
                        </span>
                        <span className="truncate text-white/90">
                          {s.instruments.join(" • ")}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-8 space-y-6">
            {/* CHECKLISTS */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* UNIVERSAL CHECKLIST */}
              <div className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-slate-950 to-slate-950 shadow-[0_0_45px_rgba(34,197,94,0.25)] p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Universal Checklist
                      <span className="text-xs font-normal text-emerald-200/90 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                        Bắt buộc trước mọi lệnh
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-emerald-100/80">
                      Tick hết để đảm bảo trạng thái & điều kiện thị trường OK.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedSetup.universal_checklist || ""
                        )
                      }
                      className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 transition"
                    >
                      <Copy size={15} /> Copy
                    </button>
                    <button
                      onClick={() => setUniversalChecks({})}
                      className="flex items-center gap-1 rounded-xl bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition text-emerald-100/90"
                    >
                      <RotateCcw size={15} /> Reset
                    </button>
                  </div>
                </div>

                <div className="mt-2 space-y-2 text-base flex-1 max-h-[40vh] overflow-y-auto pr-1">
                  {uniLines.map((line, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-3 cursor-pointer rounded-2xl px-3 py-2.5 hover:bg-white/5 transition"
                      onClick={() => toggleUniversal(i)}
                    >
                      <div className="mt-0.5">
                        {universalChecks[i] ? (
                          <CheckSquare
                            size={22}
                            className="text-emerald-300"
                          />
                        ) : (
                          <Square
                            size={22}
                            className="text-emerald-100/60"
                          />
                        )}
                      </div>
                      <span
                        className={`leading-relaxed ${
                          universalChecks[i] ? "line-through opacity-70" : ""
                        }`}
                      >
                        {stripChecklistPrefix(line)}
                      </span>
                    </label>
                  ))}
                  {uniLines.length === 0 && (
                    <div className="text-sm text-emerald-100/70 italic">
                      Chưa cấu hình universal checklist cho setup này.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-emerald-100/90">
                  <span>
                    Đã tick:{" "}
                    <strong className="text-emerald-300">
                      {uniDone}/{uniLines.length}
                    </strong>
                  </span>
                </div>
              </div>

              {/* SETUP CHECKLIST */}
              <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 shadow-[0_0_45px_rgba(15,23,42,0.85)] p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Setup Checklist</h3>
                    <p className="mt-1 text-sm text-slate-300">
                      {selectedSetup.name} · {selectedSetup.direction}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() =>
                        copyToClipboard(selectedSetup.setup_checklist || "")
                      }
                      className="flex items-center gap-1 rounded-xl bg-yellow-400 text-black px-3 py-1.5 text-sm font-semibold hover:bg-yellow-300 transition"
                    >
                      <Copy size={15} /> Copy
                    </button>
                    <button
                      onClick={() => setSetupChecks({})}
                      className="flex items-center justify-center rounded-xl bg-white/5 px-3 py-1.5 hover:bg-white/10 transition"
                    >
                      <RotateCcw size={16} className="text-slate-200" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 space-y-2 text-base flex-1 max-h-[40vh] overflow-y-auto pr-1">
                  {setupLines.map((line, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-3 cursor-pointer rounded-2xl px-3 py-2.5 hover:bg-white/5 transition"
                      onClick={() => toggleSetup(i)}
                    >
                      <div className="mt-0.5">
                        {setupChecks[i] ? (
                          <CheckSquare
                            size={22}
                            className="text-yellow-400"
                          />
                        ) : (
                          <Square size={22} className="text-slate-400" />
                        )}
                      </div>
                      <span
                        className={`leading-relaxed ${
                          setupChecks[i] ? "line-through opacity-70" : ""
                        }`}
                      >
                        {stripChecklistPrefix(line)}
                      </span>
                    </label>
                  ))}
                  {setupLines.length === 0 && (
                    <div className="text-sm text-slate-400 italic">
                      Setup này chưa có checklist chi tiết.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <div className="flex items-baseline gap-1">
                    <span>
                      {setupDone}/{setupLines.length} điều kiện
                    </span>
                    <span className="text-slate-500">· {setupPercent}%</span>
                  </div>
                  {setupPercent >= READY_THRESHOLD ? (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                      READY TO TRADE
                    </span>
                  ) : setupPercent >= ALMOST_THRESHOLD ? (
                    <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">
                      Gần đủ điều kiện
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Tiếp tục rà lại các điều kiện.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CHI TIẾT SETUP + PERFORMANCE */}
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/90 shadow-[0_0_55px_rgba(15,23,42,0.9)] p-6 space-y-6">
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/70 pb-5">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedSetup.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
                      v{selectedSetup.Version}
                    </span>
                    <span className="bg-blue-500/80 px-3 py-1 rounded-full text-white">
                      {selectedSetup.direction}
                    </span>
                    <span className="bg-purple-500/80 px-3 py-1 rounded-full text-white">
                      {selectedSetup.instruments.join(" • ")}
                    </span>
                  </div>
                </div>

                {/* Mini performance dashboard */}
                <div className="grid grid-cols-2 gap-2 text-xs min-w-[220px]">
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2">
                    <div className="text-slate-400">Total Trades</div>
                    <div className="text-lg font-semibold text-slate-50">
                      {setupStats.total}
                    </div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2">
                    <div className="text-slate-400">Winrate</div>
                    <div className="text-lg font-semibold text-emerald-400">
                      {setupStats.winrate.toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {setupStats.wins}W / {setupStats.losses}L / {setupStats.be}
                      BE
                    </div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2">
                    <div className="text-slate-400">Avg R</div>
                    <div className="text-lg font-semibold text-indigo-400">
                      {setupStats.avgR.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2">
                    <div className="text-slate-400">Expectancy</div>
                    <div
                      className={
                        "text-lg font-semibold " +
                        (setupStats.expectancy >= 0
                          ? "text-emerald-400"
                          : "text-rose-400")
                      }
                    >
                      {setupStats.expectancy.toFixed(1)}$/trade
                    </div>
                  </div>
                </div>
              </header>

              {/* Nếu đang loading trades, báo nhỏ nhỏ ở đây */}
              {loadingTrades && (
                <div className="text-xs text-slate-500">
                  Đang sync dữ liệu từ Trade Log...
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <Section title="1. Market Context (Bối cảnh)" defaultOpen>
                  <Pre>{selectedSetup.context}</Pre>
                </Section>

                <Section title="2. Entry Rules (Quy tắc vào lệnh)" defaultOpen>
                  <Pre>{selectedSetup.entry_rules}</Pre>
                </Section>

                <Section title="3. Stop Loss & Take Profit">
                  <Pre>{selectedSetup.sl_tp_rules}</Pre>
                </Section>

                <Section title="4. Trade Management (Quản lý lệnh)">
                  <Pre>{selectedSetup.management}</Pre>
                </Section>

                <Section title="5. Invalidation (Khi nào bỏ setup)">
                  <Pre>{selectedSetup.invalidation}</Pre>
                </Section>

                <Section title="6. Common Mistakes (Lỗi hay gặp)">
                  <Pre>{selectedSetup.mistakes}</Pre>
                </Section>

                {selectedSetup.notes && (
                  <Section title="Notes / Changelog">
                    <Pre>{selectedSetup.notes}</Pre>
                  </Section>
                )}

                {/* Recent trades của setup này */}
                {setupStats.total > 0 && (
                  <Section title="Recent trades dùng setup này">
                    <div className="space-y-2 text-xs">
                      {setupTrades
                        .slice()
                        .sort(
                          (a, b) => new Date(b.date) - new Date(a.date)
                        )
                        .slice(0, 6)
                        .map((t) => (
                          <div
                            key={t.id}
                            className="flex justify-between items-center bg-slate-900/80 rounded-lg px-3 py-2"
                          >
                            <div>
                              <div className="font-semibold text-slate-100">
                                {t.symbol} • {t.direction}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {t.date} • RR:{" "}
                                {t.rr ? t.rr.toFixed(2) : "-"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-sm font-semibold " +
                                (t.profit > 0
                                  ? "text-emerald-400"
                                  : t.profit < 0
                                  ? "text-rose-400"
                                  : "text-amber-300")
                              }
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

/* Helper components */

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="px-5 py-4 max-h-64 overflow-y-auto">{children}</div>
    </section>
  );
}

function Pre({ children }) {
  return (
    <pre className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed text-slate-100">
      {children}
    </pre>
  );
}

/* Utils */

function stripChecklistPrefix(line) {
  // Bỏ prefix kiểu "Check ...", "Uncheck ...", "Check -", "Uncheck:"
  return line.replace(/^(Check|Uncheck)\s*[-:]?\s*/i, "").trim();
}

function renderStatusBadge(percent) {
  if (percent >= READY_THRESHOLD) {
    return (
      <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
        READY TO TRADE
      </span>
    );
  }
  if (percent >= ALMOST_THRESHOLD) {
    return (
      <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">
        Gần đủ điều kiện
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold text-slate-400 bg-slate-700/60 px-2 py-1 rounded-full">
      Chưa đủ điều kiện
    </span>
  );
}
