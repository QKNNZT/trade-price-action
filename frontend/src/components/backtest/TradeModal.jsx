// Refactored TradeModal.jsx – Clean, Modern 2025 Version
// Notes:
// - Reduced repetitive logic
// - Centralized constants
// - Cleaner handlers
// - Improved readability
// - Theme-aware (dark / light)

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { XCircle, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import TradeSummary from "../backtest/trade-modal/TradeSummary";
import TradePsychology from "../backtest/trade-modal/TradePsychology";
import TradeDetails from "../backtest/trade-modal/TradeDetails";
import TradeActions from "../backtest/trade-modal/TradeActions";
import TradeScreenshot from "../backtest/trade-modal/TradeScreenshot";

const DEFAULT_VALUES = {
  rating: 0,
  psych: "neutral",
  confluence: [],
  mistakes: [],
  timeline: [],
  notes: "",
};

const PSYCH_EMOJI = {
  fear: "😨",
  greed: "😈",
  calm: "😌",
  focused: "🎯",
  neutral: "😐",
};

export default function TradeModal({
  trade,
  onClose,
  trades,
  setTrades,
  index,
  onSelect,
  theme = "dark",
}) {
  const [data, setData] = useState({ ...DEFAULT_VALUES, ...trade });
  const [showDetails, setShowDetails] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    setData({ ...DEFAULT_VALUES, ...trade });
    setShowDetails(false);
  }, [trade]);

  const update = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const save = () => {
    setTrades(trades.map((t) => (t.id === data.id ? data : t)));
    onClose();
  };

  const clone = () => setTrades([{ ...data, id: Date.now() }, ...trades]);

  const go = (direction) => {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < trades.length) {
      onSelect(trades[newIndex]);
    }
  };

  const getPsychEmoji = (key) => PSYCH_EMOJI[key] || "😐";

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const navBtnBase =
    "absolute top-1/2 -translate-y-1/2 p-4 rounded-full transition border z-50";
  const navBtnLeftClass = [
    navBtnBase,
    "left-4",
    isDark
      ? "bg-white/10 hover:bg-white/20 border-gray-600 text-white disabled:opacity-30"
      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 disabled:opacity-30",
  ].join(" ");

  const navBtnRightClass = [
    navBtnBase,
    "right-4",
    isDark
      ? "bg-white/10 hover:bg-white/20 border-gray-600 text-white disabled:opacity-30"
      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 disabled:opacity-30",
  ].join(" ");

  const modalClass = [
    "relative w-full",
    "max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl",
    "max-h-[92vh] rounded-3xl overflow-hidden",
    "shadow-2xl border flex flex-col",
    isDark
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700"
      : "bg-gradient-to-br from-blue-50 via-white to-blue-50 border-blue-200",
  ].join(" ");

  const headerClass = [
    "flex justify-between items-start p-6 pb-4 flex-shrink-0 border-b",
    isDark ? "border-gray-800" : "border-slate-200",
  ].join(" ");

  const titleSymbolClass = [
    "text-4xl font-bold flex items-center gap-3",
    isDark ? "text-white" : "text-slate-900",
  ].join(" ");

  const titleTfClass = `text-xl font-normal ${
    isDark ? "text-gray-400" : "text-slate-500"
  }`;

  const dateClass = `mt-1 text-lg ${
    isDark ? "text-gray-400" : "text-slate-500"
  }`;

  const detailsBtnClass = [
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition",
    isDark
      ? "bg-gray-800/70 hover:bg-gray-700 text-slate-100"
      : "bg-slate-100 hover:bg-slate-200 text-slate-800",
  ].join(" ");

  const closeBtnClass = [
    "transition",
    isDark
      ? "text-gray-400 hover:text-white"
      : "text-slate-400 hover:text-slate-700",
  ].join(" ");

  const leftPaneClass =
    "w-full md:w-1/2 overflow-y-auto p-5 sm:p-6 space-y-6 bg-gradient-to-b from-transparent to-slate-800/20 dark:to-slate-900/30";

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      {/* Nav Buttons */}
      <button
        onClick={() => go(-1)}
        disabled={index === 0}
        className={navBtnLeftClass}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={() => go(1)}
        disabled={index === trades.length - 1}
        className={navBtnRightClass}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Modal */}
      <div className={modalClass}>
        {/* Header */}
        <div className={headerClass}>
          <div>
            <h2 className={titleSymbolClass}>
              {data.symbol}
              <span className={titleTfClass}>{data.timeframe}</span>
            </h2>
            <p className={dateClass}>{format(data.date, "dd MMMM yyyy")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails((s) => !s)}
              className={detailsBtnClass}
            >
              {showDetails ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showDetails ? "Hide" : "Details"}
            </button>

            <button onClick={save} className={closeBtnClass}>
              <XCircle className="w-9 h-9" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left column */}
          <div className={leftPaneClass}>
            <TradeSummary data={data} update={update} theme={theme} />
            <TradePsychology
              data={data}
              update={update}
              getPsychEmoji={getPsychEmoji}
              theme={theme}
            />
            {showDetails && <TradeDetails data={data} theme={theme} />}
            <TradeActions
              clone={clone}
              save={save}
              index={index}
              trades={trades}
              theme={theme}
            />
          </div>

          {/* Right: Screenshot */}
          <TradeScreenshot
            screenshot={data.screenshot}
            setScreenshot={(value) => update("screenshot", value)}
            update={update} // hàm update bạn đang dùng cho form
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
}
