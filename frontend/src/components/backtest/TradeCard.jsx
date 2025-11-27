import React, { useState } from "react";
import { TrendingUp, TrendingDown, ImageIcon, Trash2 } from "lucide-react";
import { SETUP_TYPES, RESULT_TYPES } from "./constants";
import { format } from "date-fns";

// Import dialog (nếu để riêng file thì import ở đây)
import DeleteDialog from "../backtest/DeleteDialog"; // hoặc để cùng file cũng được

export default function TradeCard({ trade, onSelect, onDelete }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const Setup = SETUP_TYPES.find((s) => s.value === trade.setup);
  const Result = RESULT_TYPES.find((r) => r.value === trade.result);
  const Icon = trade.direction === "long" ? TrendingUp : TrendingDown;

  return (
    <>
      <div
        onClick={() => onSelect(trade)}
        className="relative bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition cursor-pointer group"
      >
        {/* Nút Xóa - hiện khi hover, icon thùng rác cho dễ nhận biết */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteOpen(true);
          }}
          className="absolute top-3 right-3 z-[999] opacity-0 group-hover:opacity-100 transition-all duration-200 
                     p-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 backdrop-blur-sm
                     border border-red-400/30 shadow-lg"
          title="Xóa lệnh"
        >
          <Trash2 className="w-5 h-5 text-white" />
        </button>

        {/* Ảnh */}
        {trade.screenshot ? (
          <img
            src={trade.screenshot}
            alt="chart"
            className="w-full h-48 object-cover brightness-90 group-hover:brightness-75 transition"
          />
        ) : (
          <div className="bg-gray-700 h-48 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {/* Nội dung */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-xl font-bold">{trade.symbol}</div>
              <div className="text-sm text-gray-400">
                {trade.timeframe} • {format(trade.date, "dd/MM/yyyy")}
              </div>
            </div>
            <Icon
              className={`w-8 h-8 ${
                trade.direction === "long" ? "text-green-400" : "text-red-400"
              }`}
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${Setup.color}`}
            >
              {Setup.label}
            </span>
            <Result.icon className={`w-5 h-5 ${Result.color}`} />
          </div>

          <div className="text-sm space-y-1 text-gray-300">
            <div>
              Entry: {trade.entry} | SL: {trade.sl} | TP: {trade.tp}
            </div>
            <div className="font-semibold">R:R = 1:{trade.rr}</div>
            {trade.notes && (
              <p className="text-xs text-gray-400 mt-2 italic">
                "{trade.notes}"
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Dialog xóa đẹp */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete} // ← đổi tên thành onDeleteConfirm
        trade={trade}
      />
    </>
  );
}
