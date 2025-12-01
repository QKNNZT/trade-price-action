import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  trade,
  theme = "dark",
}) {
  if (!isOpen || !trade) return null;

  const isDark = theme === "dark";

  const dialogClass = [
    "relative rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border",
    isDark
      ? "bg-gray-900 border-gray-700"
      : "bg-white border-gray-200 text-gray-900",
  ].join(" ");

  const closeBtnClass = [
    "absolute top-4 right-4 p-1 rounded-lg transition",
    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
  ].join(" ");

  const titleClass = `text-xl font-bold mb-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  const textClass = `text-sm mb-6 ${
    isDark ? "text-gray-400" : "text-gray-600"
  }`;

  const symbolClass = isDark
    ? "text-blue-400 font-semibold"
    : "text-blue-600 font-semibold";

  const irreversibleClass = isDark
    ? "text-red-400 font-medium"
    : "text-red-600 font-medium";

  const cancelBtnClass = [
    "flex-1 py-3 rounded-lg font-medium transition",
    isDark
      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
      : "bg-gray-100 hover:bg-gray-200 text-gray-800",
  ].join(" ");

  const confirmBtnClass = [
    "flex-1 py-3 rounded-lg font-medium transition shadow-lg",
    isDark
      ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20"
      : "bg-red-600 hover:bg-red-700 text-white shadow-red-400/30",
  ].join(" ");

  const iconWrapperClass = [
    "w-16 h-16 rounded-full flex items-center justify-center mb-4",
    isDark ? "bg-red-500/20" : "bg-red-100",
  ].join(" ");

  const iconClass = isDark
    ? "w-10 h-10 text-red-400"
    : "w-10 h-10 text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-colors ${
          isDark ? "bg-black/70" : "bg-black/30"
        } backdrop-blur-sm`}
        onClick={onClose}
      />

      {/* Dialog */}
      <div className={dialogClass}>
        <button onClick={onClose} className={closeBtnClass}>
          <X
            className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={iconWrapperClass}>
            <AlertTriangle className={iconClass} />
          </div>

          <h3 className={titleClass}>Xóa lệnh backtest?</h3>

          <p className={textClass}>
            Lệnh <span className={symbolClass}>{trade.symbol}</span> •{" "}
            {trade.timeframe} •{" "}
            {new Date(trade.date).toLocaleDateString("vi-VN")}
            <br />
            Hành động này{" "}
            <span className={irreversibleClass}>không thể hoàn tác</span>.
          </p>

          <div className="flex gap-3 w-full">
            <button onClick={onClose} className={cancelBtnClass}>
              Hủy
            </button>
            <button
              onClick={() => {
                onConfirm(trade.id);
                onClose();
              }}
              className={confirmBtnClass}
            >
              Xóa lệnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
