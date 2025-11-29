// components/TradeDetailModal.jsx
import { FiX, FiImage, FiTarget, FiAlertCircle, FiTrendingUp, FiTrendingDown, FiStar } from "react-icons/fi";
import { openInTradingView } from "../utils/tradingViewLink";
import { API_BASE_URL } from "../config/api";

export default function TradeDetailModal({ trade, isOpen, onClose }) {
  if (!isOpen || !trade) return null;

  const isWin = trade.profit > 0;
  const isLoss = trade.profit < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Trade Detail: {trade.symbol} - {trade.direction}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-semibold">{trade.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Setup</p>
              <p className="text-lg font-semibold text-blue-600">{trade.setup || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">RR</p>
              <p className="text-xl font-bold text-purple-600">
                {trade.rr ? `1:${trade.rr.toFixed(2)}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Result</p>
              <div className="flex items-center gap-2">
                {isWin && <FiTarget className="text-green-600" size={28} />}
                {isLoss && <FiAlertCircle className="text-red-600" size={28} />}
                <span className={`text-2xl font-black ${isWin ? "text-green-600" : isLoss ? "text-red-600" : "text-amber-600"}`}>
                  ${Math.abs(trade.profit).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Entry, SL, TP, Exit */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Entry</p>
                <p className="text-xl font-mono font-bold text-blue-800">{trade.entry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">SL</p>
                <p className="text-xl font-mono font-bold text-red-600">{trade.sl}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">TP</p>
                <p className="text-xl font-mono font-bold text-green-600">{trade.tp || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Exit</p>
                <p className="text-xl font-mono font-bold text-gray-900">{trade.exit || "Running"}</p>
              </div>
            </div>
          </div>

          {/* Row 3: Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Chart Before (Setup)</p>
              {trade.chart_before ? (
                <a
                  href={`${API_BASE_URL}/api/uploads/${encodeURIComponent(trade.chart_before)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`${API_BASE_URL}/api/uploads/${encodeURIComponent(trade.chart_before)}`}
                    alt="Before"
                    className="w-full rounded-lg shadow-md hover:shadow-xl transition"
                  />
                </a>
              ) : (
                <p className="text-gray-400 italic">No chart</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Chart After (Close)</p>
              {trade.chart_after ? (
                <a
                  href={`${API_BASE_URL}/api/uploads/${encodeURIComponent(trade.chart_after)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`${API_BASE_URL}/api/uploads/${encodeURIComponent(trade.chart_after)}`}
                    alt="After"
                    className="w-full rounded-lg shadow-md hover:shadow-xl transition"
                  />
                </a>
              ) : (
                <p className="text-gray-400 italic">Not closed yet</p>
              )}
            </div>
          </div>

          {/* Row 4: Review & Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Grade</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={28}
                    className={i < (trade.grade || 0) ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Review</p>
              <p className="text-gray-800 whitespace-pre-wrap">
                {trade.review || "Chưa có review"}
              </p>
            </div>
          </div>

          {/* Row 5: Actions */}
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => openInTradingView(trade.symbol)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              Open in TradingView
            </button>
            {trade.setup && (
              <button
                onClick={() => window.open(`/playbook?setup=${encodeURIComponent(trade.setup)}`, "_blank")}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
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