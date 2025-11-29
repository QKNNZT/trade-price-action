// components/TradeCells.jsx
import { memo } from "react";
import clsx from "clsx";
import {
  FiTarget,
  FiAlertCircle,
  FiStar,
  FiImage,
  FiPlus,
  FiX,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import { API_BASE_URL } from "../config/api";

/* ============ RESULT CELL ============ */

function ResultCell({ profit }) {
  const isWin = profit > 0;
  const isLoss = profit < 0;
  const isBE = profit === 0;

  if (isWin) {
    return (
      <div className="flex items-center gap-2">
        <FiTarget className="text-green-600" size={26} />
        <div className="text-green-600 font-black text-xl">
          +${profit.toFixed(1)}
        </div>
      </div>
    );
  }

  if (isLoss) {
    return (
      <div className="flex items-center gap-2">
        <FiAlertCircle className="text-red-600" size={26} />
        <div className="text-red-600 font-black text-xl">
          ${profit.toFixed(1)}
        </div>
      </div>
    );
  }

  if (isBE) {
    return <div className="text-amber-600 font-bold text-lg">BE</div>;
  }

  return <div className="text-gray-500 italic">Pending</div>;
}

export const ResultCellMemo = memo(ResultCell);

/* ============ GRADE STARS ============ */

function GradeStars({ grade }) {
  if (!grade) return <span className="text-gray-400">—</span>;

  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={22}
          className={i < grade ? "text-yellow-500" : "text-gray-300"}
        />
      ))}
    </>
  );
}

export const GradeStarsMemo = memo(GradeStars);

/* ============ CHART CELL ============ */

function ChartCell({ trade, uploadingAfterId, onUploadAfter, onDeleteAfter }) {
  const handleFileChange = (e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      onUploadAfter(trade.id, file);
    }
  };

  const beforeUrl = trade.chart_before
    ? `${API_BASE_URL}/api/uploads/${encodeURIComponent(trade.chart_before)}`
    : null;
  const afterUrl = trade.chart_after
    ? `${API_BASE_URL}/api/uploads/${encodeURIComponent(trade.chart_after)}`
    : null;

  const isUploading = uploadingAfterId === trade.id;

  return (
    <div className="flex items-center justify-center gap-4">
      {/* BEFORE */}
      <div className="flex flex-col items-center gap-1">
        {beforeUrl ? (
          <a
            href={beforeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block"
            title="Chart BEFORE"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition">
              <FiImage className="text-blue-700" size={20} />
            </div>
          </a>
        ) : (
          <div className="text-xs text-gray-400 italic">No before</div>
        )}
      </div>

      {/* AFTER */}
      <div className="flex flex-col items-center gap-1">
        {afterUrl ? (
          <div className="relative group">
            <a
              href={afterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block"
              title="Chart AFTER"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition">
                <FiImage className="text-green-700" size={20} />
              </div>
            </a>

            {/* Upload thêm AFTER */}
            <label className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700">
                <FiPlus className="text-white" size={12} />
              </div>
            </label>

            {/* Xóa AFTER */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAfter(trade.id);
              }}
              className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Xóa chart after"
            >
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700">
                <FiX className="text-white" size={12} />
              </div>
            </button>

            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 rounded-lg flex items-center justify-center">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition">
              <FiPlus className="text-gray-700" size={20} />
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

export const ChartCellMemo = memo(ChartCell);

/* ============ CLOSE CELL ============ */

function CloseCell({
  trade,
  updateExit,
  manualId,
  manualValue,
  setManualId,
  setManualValue,
  onManualSubmit,
}) {
  if (trade.exit) {
    return <span className="text-green-700 font-bold">Closed</span>;
  }

  const quickCloseButtons = [
    {
      label: "Hit TP",
      value: trade.tp,
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      label: "Hit SL",
      value: trade.sl,
      className: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      label: "BE",
      value: trade.entry,
      className: "bg-yellow-500 hover:bg-yellow-600 text-black",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {quickCloseButtons.map((btn) => (
        <button
          key={btn.label}
          onClick={(e) => {
            e.stopPropagation();
            updateExit(trade.id, btn.value);
          }}
          className={clsx("px-3 py-1 rounded-xl text-sm", btn.className)}
        >
          {btn.label}
        </button>
      ))}

      {manualId === trade.id ? (
        <div className="flex gap-2">
          <input
            type="number"
            className="border rounded-lg px-2 py-1 w-20"
            placeholder="Exit"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManualSubmit();
            }}
            className="bg-blue-600 text-white px-3 rounded-lg"
          >
            OK
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setManualId(trade.id);
          }}
          className="px-3 py-1 bg-gray-700 text-white rounded-xl text-sm hover:bg-gray-800"
        >
          Manual
        </button>
      )}
    </div>
  );
}

export const CloseCellMemo = memo(CloseCell);

/* ============ ACTION BUTTONS ============ */

function ActionButtons({ trade, onOpenDetail, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetail(trade);
        }}
        className="p-3 bg-emerald-100 rounded-full hover:bg-emerald-200 transition"
        title="Xem chi tiết"
      >
        <FiEye className="text-emerald-600" size={22} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(trade.id);
        }}
        className="p-3 bg-red-100 rounded-full hover:bg-red-200"
      >
        <FiTrash2 className="text-red-600" size={22} />
      </button>
    </div>
  );
}

export const ActionButtonsMemo = memo(ActionButtons);
