import React, { useState } from "react";
import { TrendingUp, TrendingDown, ImageIcon, Trash2 } from "lucide-react";
import { SETUP_TYPES, RESULT_TYPES } from "./constants";
import { format } from "date-fns";
import DeleteDialog from "../backtest/DeleteDialog";

export default function TradeCard({
  trade,
  onSelect,
  onDelete,
  theme = "dark",
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isDark = theme === "dark";

  const Setup = SETUP_TYPES.find((s) => s.value === trade.setup);
  const Result = RESULT_TYPES.find((r) => r.value === trade.result);
  const Icon = trade.direction === "long" ? TrendingUp : TrendingDown;

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const cardBase =
    "relative rounded-xl border overflow-hidden transition cursor-pointer group";
  const cardTheme = isDark
    ? "bg-slate-900 border-slate-700 hover:border-blue-500"
    : "bg-white border-slate-200 hover:border-blue-500/70 shadow-sm";
  const cardClass = `${cardBase} ${cardTheme}`;

  const deleteBtnClass = [
    "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200",
    "p-2.5 rounded-xl border shadow-lg",
    isDark
      ? "bg-red-600/90 hover:bg-red-500 border-red-400/30"
      : "bg-red-500 hover:bg-red-400 border-red-300/60",
  ].join(" ");

  const imgPlaceholderClass = isDark
    ? "bg-slate-800"
    : "bg-slate-100 border-b border-slate-200";

  const imgIconClass = isDark
    ? "w-16 h-16 text-slate-600"
    : "w-16 h-16 text-slate-400";

  const symbolClass = `text-xl font-bold ${
    isDark ? "text-slate-50" : "text-slate-900"
  }`;

  const metaTextClass = `text-sm ${
    isDark ? "text-slate-400" : "text-slate-500"
  }`;

  const bodyTextClass = `text-sm space-y-1 ${
    isDark ? "text-slate-200" : "text-slate-700"
  }`;

  const noteTextClass = `text-xs mt-2 italic ${
    isDark ? "text-slate-400" : "text-slate-500"
  }`;

  return (
    <>
      <div onClick={() => onSelect(trade)} className={cardClass}>
        {/* Nút Xóa */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteOpen(true);
          }}
          className={deleteBtnClass}
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
          <div
            className={`${imgPlaceholderClass} h-48 flex items-center justify-center`}
          >
            <ImageIcon className={imgIconClass} />
          </div>
        )}

        {/* Nội dung */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className={symbolClass}>{trade.symbol}</div>
              <div className={metaTextClass}>
                {trade.timeframe} • {format(trade.date, "dd/MM/yyyy")}
              </div>
            </div>
            <Icon
              className={`w-8 h-8 ${
                trade.direction === "long" ? "text-emerald-400" : "text-red-400"
              }`}
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            {Setup && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${Setup.color}`}
              >
                {Setup.label}
              </span>
            )}
            {Result && <Result.icon className={`w-5 h-5 ${Result.color}`} />}
          </div>

          <div className={bodyTextClass}>
            <div>
              Entry: {trade.entry} | SL: {trade.sl} | TP: {trade.tp}
            </div>
            <div className="font-semibold">R:R = 1:{trade.rr}</div>
            {trade.notes && <p className={noteTextClass}>"{trade.notes}"</p>}
          </div>
        </div>
      </div>

      {/* Dialog xóa */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
        trade={trade}
        theme={theme}
      />
    </>
  );
}
