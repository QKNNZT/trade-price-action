// components/TradeDetailModal.jsx
import {
  FiX,
  FiImage,
  FiTarget,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
} from "react-icons/fi";
import { openInTradingView } from "../utils/tradingViewLink";
import { API_BASE_URL } from "../config/api";

export default function TradeDetailModal({
  trade,
  isOpen,
  onClose,
  theme = "dark",
}) {
  if (!isOpen || !trade) return null;

  const isDark = theme === "dark";
  const isWin = trade.profit > 0;
  const isLoss = trade.profit < 0;

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const modalClass = [
    "rounded-2xl shadow-2xl max-w-4xl w-full border flex flex-col",
    isDark
      ? "bg-[#020617] border-slate-800 text-slate-100"
      : "bg-white border-slate-200 text-slate-900",
  ].join(" ");

  const headerClass = [
    "flex justify-between items-center px-4 py-3 border-b",
    isDark ? "border-slate-800" : "border-slate-200",
  ].join(" ");

  const headerTitleClass = [
    "text-xl font-bold",
    isDark ? "text-slate-50" : "text-slate-900",
  ].join(" ");

  const sectionLabelMuted = (extra = "") =>
    `text-xs ${isDark ? "text-slate-400" : "text-slate-500"} ${extra}`;

  const sectionLabelStrong = (extra = "") =>
    `text-sm font-semibold ${
      isDark ? "text-slate-100" : "text-slate-800"
    } ${extra}`;

  const panelSoftClass = [
    "p-4 rounded-xl",
    isDark ? "bg-slate-900/60" : "bg-slate-50",
  ].join(" ");

  const smallCardLabelClass = sectionLabelMuted("mb-1");

  const entryTextClass = `text-base font-mono font-bold ${
    isDark ? "text-blue-300" : "text-blue-800"
  }`;
  const slTextClass = `text-base font-mono font-bold ${
    isDark ? "text-red-300" : "text-red-600"
  }`;
  const tpTextClass = `text-base font-mono font-bold ${
    isDark ? "text-emerald-300" : "text-emerald-600"
  }`;
  const exitTextClass = `text-base font-mono font-bold ${
    isDark ? "text-slate-100" : "text-slate-900"
  }`;

  const underlineCard = isDark ? "text-blue-300" : "text-blue-600";
  const rrTextClass = `text-lg font-bold ${
    isDark ? "text-purple-300" : "text-purple-600"
  }`;

  const resultAmountClass = `text-xl font-black ${
    isWin
      ? isDark
        ? "text-emerald-400"
        : "text-emerald-600"
      : isLoss
      ? isDark
        ? "text-red-400"
        : "text-red-600"
      : isDark
      ? "text-amber-300"
      : "text-amber-600"
  }`;

  const gradeStarOn = isDark ? "text-yellow-400" : "text-yellow-500";
  const gradeStarOff = isDark ? "text-slate-600" : "text-slate-300";

  const reviewTextClass = isDark ? "text-slate-100" : "text-slate-800";

  const actionsBarClass = [
    "flex justify-center gap-3 pt-3 mt-2 border-t",
    isDark ? "border-slate-800" : "border-slate-200",
  ].join(" ");

  const primaryBtnClass =
    "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition";
  const openTvBtnClass = [
    primaryBtnClass,
    isDark
      ? "bg-blue-600 text-white hover:bg-blue-500"
      : "bg-blue-600 text-white hover:bg-blue-700",
  ].join(" ");
  const setupBtnClass = [
    primaryBtnClass,
    isDark
      ? "bg-purple-600 text-white hover:bg-purple-500"
      : "bg-purple-600 text-white hover:bg-purple-700",
  ].join(" ");

  const chartTitleClass = sectionLabelStrong("mb-2");

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className={modalClass}>
        {/* Header */}
        <div className={headerClass}>
          <div className="flex items-center gap-2">
            {trade.direction === "Long" && (
              <FiTrendingUp
                size={20}
                className={isDark ? "text-emerald-400" : "text-emerald-600"}
              />
            )}
            {trade.direction === "Short" && (
              <FiTrendingDown
                size={20}
                className={isDark ? "text-red-400" : "text-red-600"}
              />
            )}
            <h2 className={headerTitleClass}>
              {trade.symbol}{" "}
              <span className="text-xs font-medium opacity-70">
                ({trade.direction || "—"})
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className={sectionLabelMuted()}>Date</p>
              <p className="text-base font-semibold">{trade.date}</p>
            </div>
            <div>
              <p className={sectionLabelMuted()}>Setup</p>
              <p className={`text-base font-semibold ${underlineCard}`}>
                {trade.setup || "-"}
              </p>
            </div>
            <div>
              <p className={sectionLabelMuted()}>RR</p>
              <p className={rrTextClass}>
                {trade.rr ? `1:${trade.rr.toFixed(2)}` : "-"}
              </p>
            </div>
            <div>
              <p className={sectionLabelMuted()}>Result</p>
              <div className="flex items-center gap-2">
                {isWin && (
                  <FiTarget
                    className={
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }
                    size={20}
                  />
                )}
                {isLoss && (
                  <FiAlertCircle
                    className={isDark ? "text-red-400" : "text-red-600"}
                    size={20}
                  />
                )}
                <span className={resultAmountClass}>
                  ${Math.abs(trade.profit).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Entry, SL, TP, Exit */}
          <div className={panelSoftClass}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <p className={smallCardLabelClass}>Entry</p>
                <p className={entryTextClass}>{trade.entry}</p>
              </div>
              <div>
                <p className={smallCardLabelClass}>SL</p>
                <p className={slTextClass}>{trade.sl}</p>
              </div>
              <div>
                <p className={smallCardLabelClass}>TP</p>
                <p className={tpTextClass}>{trade.tp || "-"}</p>
              </div>
              <div>
                <p className={smallCardLabelClass}>Exit</p>
                <p className={exitTextClass}>{trade.exit || "Running"}</p>
              </div>
            </div>
          </div>

          {/* Row 3: Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={chartTitleClass}>Chart Before (Setup)</p>
              {trade.chart_before ? (
                <a
                  href={`${API_BASE_URL}/api/uploads/${encodeURIComponent(
                    trade.chart_before
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`${API_BASE_URL}/api/uploads/${encodeURIComponent(
                      trade.chart_before
                    )}`}
                    alt="Before"
                    className="w-full max-h-52 object-contain rounded-lg shadow-md hover:shadow-lg transition"
                  />
                </a>
              ) : (
                <p className={sectionLabelMuted("italic")}>No chart</p>
              )}
            </div>
            <div>
              <p className={chartTitleClass}>Chart After (Close)</p>
              {trade.chart_after ? (
                <a
                  href={`${API_BASE_URL}/api/uploads/${encodeURIComponent(
                    trade.chart_after
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`${API_BASE_URL}/api/uploads/${encodeURIComponent(
                      trade.chart_after
                    )}`}
                    alt="After"
                    className="w-full max-h-52 object-contain rounded-lg shadow-md hover:shadow-lg transition"
                  />
                </a>
              ) : (
                <p className={sectionLabelMuted("italic")}>Not closed yet</p>
              )}
            </div>
          </div>

          {/* Row 4: Review & Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={sectionLabelStrong("mb-1")}>Grade</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={20}
                    className={
                      i < (trade.grade || 0) ? gradeStarOn : gradeStarOff
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className={sectionLabelStrong("mb-1")}>Review</p>
              <p className={`${reviewTextClass} text-sm whitespace-pre-wrap`}>
                {trade.review || "Chưa có review"}
              </p>
            </div>
          </div>

          {/* Row 5: Actions */}
          <div className={actionsBarClass}>
            <button
              onClick={() => openInTradingView(trade.symbol)}
              className={openTvBtnClass}
            >
              <FiImage size={16} />
              Open in TradingView
            </button>
            {trade.setup && (
              <button
                onClick={() =>
                  window.open(
                    `/playbook?setup=${encodeURIComponent(trade.setup)}`,
                    "_blank"
                  )
                }
                className={setupBtnClass}
              >
                View Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
