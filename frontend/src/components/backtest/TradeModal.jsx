// Refactored TradeModal.jsx – Clean, Modern 2025 Version
// Notes:
// - Reduced repetitive logic
// - Centralized constants
// - Cleaner handlers
// - Improved readability
// - UI unchanged

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

export default function TradeModal({ trade, onClose, trades, setTrades, index, onSelect }) {
  const [data, setData] = useState({ ...DEFAULT_VALUES, ...trade });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setData({ ...DEFAULT_VALUES, ...trade });
    setShowDetails(false);
  }, [trade]);

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const save = () => {
    setTrades(trades.map((t) => (t.id === data.id ? data : t)));
    onClose();
  };

  const clone = () => setTrades([{ ...data, id: Date.now() }, ...trades]);

  const go = (direction) => {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < trades.length) onSelect(trades[newIndex]);
  };

  const getPsychEmoji = (key) => PSYCH_EMOJI[key] || "😐";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      {/* Nav Buttons */}
      <button
        onClick={() => go(-1)}
        disabled={index === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 border border-gray-600 text-white transition disabled:opacity-30 z-50"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={() => go(1)}
        disabled={index === trades.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 border border-gray-600 text-white transition disabled:opacity-30 z-50"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Modal */}
      <div className="bg-gradient-to-br from-[#1a1b20] to-[#1f2128] w-full max-w-7xl lg:max-w-[92vw] xl:max-w-[94vw] 2xl:max-w-[90vw] max-h-[92vh] rounded-3xl shadow-2xl border border12 border-gray-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 flex-shrink-0 border-b border-gray-800">
          <div>
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              {data.symbol}
              <span className="text-xl font-normal text-gray-400">{data.timeframe}</span>
            </h2>
            <p className="text-gray-400 mt-1 text-lg">{format(data.date, "dd MMMM yyyy")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/70 hover:bg-gray-700 rounded-xl text-sm transition"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? "Hide" : "Details"}
            </button>

            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XCircle className="w-9 h-9" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left */}
          <div className="w-full md:w-1/2 overflow-y-auto p-6 space-y-8">
            <TradeSummary data={data} update={update} />
            <TradePsychology data={data} update={update} getPsychEmoji={getPsychEmoji} />
            {showDetails && <TradeDetails data={data} />}
            <TradeActions clone={clone} save={save} index={index} trades={trades} />
          </div>

          {/* Right: Screenshot */}
          <TradeScreenshot screenshot={data.screenshot} />
        </div>
      </div>
    </div>
  );
}
