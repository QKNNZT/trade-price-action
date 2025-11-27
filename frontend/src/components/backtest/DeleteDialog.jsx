
import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteDialog({ isOpen, onClose, onConfirm, trade }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Xóa lệnh backtest?</h3>
          <p className="text-gray-400 text-sm mb-6">
            Lệnh <span className="text-blue-400 font-semibold">{trade.symbol}</span> •{" "}
            {trade.timeframe} • {new Date(trade.date).toLocaleDateString("vi-VN")}
            <br />
            Hành động này <span className="text-red-400 font-medium">không thể hoàn tác</span>.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onConfirm(trade.id);
                onClose();
              }}
              className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-lg shadow-red-900/20"
            >
              Xóa lệnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
