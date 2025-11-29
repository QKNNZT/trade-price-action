// components/TradeRow.jsx
import { memo, useCallback } from "react";
import clsx from "clsx";
import { openInTradingView } from "../utils/tradingViewLink";
import {
  ResultCellMemo as ResultCell,
  GradeStarsMemo as GradeStars,
  ChartCellMemo as ChartCell,
  CloseCellMemo as CloseCell,
  ActionButtonsMemo as ActionButtons,
} from "./TradeCells";

function TradeRow({
  trade: t,
  navigate,
  updateExit,
  manualId,
  manualValue,
  setManualId,
  setManualValue,
  onOpenReview,
  onOpenDetail,
  confirmDelete,
  uploadingAfterId,
  onUploadAfter,
  onDeleteAfter,
}) {
  const isWin = t.profit > 0;
  const isLoss = t.profit < 0;

  const rowClass = clsx(
    "border-t-2 transition-all hover:bg-gray-50",
    isWin && "bg-green-50",
    isLoss && "bg-red-50",
    !isWin && !isLoss && "bg-amber-50"
  );

  const handleManualSubmit = useCallback(() => {
    updateExit(t.id, parseFloat(manualValue));
    setManualId(null);
    setManualValue("");
  }, [t.id, manualValue, updateExit, setManualId, setManualValue]);

  return (
    <tr className={rowClass}>
      <td className="p-5 font-medium text-gray-800">{t.date}</td>

      <td className="p-5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-700 text-lg">{t.symbol}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openInTradingView(t.symbol);
            }}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-blue-300 hover:bg-slate-700"
            title="Mở trên TradingView"
          >
            TV
          </button>
        </div>
      </td>

      <td className="p-5">
        {t.setup ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/playbook?setup=${encodeURIComponent(t.setup)}`);
            }}
            className="px-3 py-1 rounded-full bg-slate-800 text-yellow-300 hover:bg-slate-700 text-xs font-semibold"
          >
            {t.setup}
          </button>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>

      <td className="p-5">
        <span
          className={clsx(
            "px-4 py-2 rounded-full text-xs font-bold text-white",
            t.direction === "Long" ? "bg-green-600" : "bg-red-600"
          )}
        >
          {t.direction}
        </span>
      </td>

      <td className="p-5 font-mono text-lg">
        <span className="font-bold text-blue-800">{t.entry}</span>
        <span className="mx-2 text-gray-500">→</span>
        {t.exit ? (
          <span className="font-bold text-gray-900">{t.exit}</span>
        ) : (
          <span className="italic text-gray-400">Running...</span>
        )}
      </td>

      <td className="p-5">
        <div className="font-bold text-purple-700 text-xl">
          {t.rr ? `1:${t.rr.toFixed(2)}` : "-"}
        </div>
      </td>

      <td className="p-5">
        <ResultCell profit={t.profit} />
      </td>

      <td className="p-5">
        <GradeStars grade={t.grade} />
      </td>

      <td className="p-5">
        {t.exit ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReview(t);
            }}
            className="px-3 py-1 bg-slate-800 text-white rounded-xl text-sm hover:bg-slate-700"
          >
            Review
          </button>
        ) : (
          <span className="text-gray-400 text-sm italic">Close trước</span>
        )}
      </td>

      <td className="p-5 text-center">
        <ChartCell
          trade={t}
          uploadingAfterId={uploadingAfterId}
          onUploadAfter={onUploadAfter}
          onDeleteAfter={onDeleteAfter}
        />
      </td>

      <td className="p-5">
        <CloseCell
          trade={t}
          updateExit={updateExit}
          manualId={manualId}
          manualValue={manualValue}
          setManualId={setManualId}
          setManualValue={setManualValue}
          onManualSubmit={handleManualSubmit}
        />
      </td>

      <td className="p-5 text-center">
        <ActionButtons
          trade={t}
          onOpenDetail={onOpenDetail}
          onDelete={confirmDelete}
        />
      </td>
    </tr>
  );
}

export default memo(TradeRow);
