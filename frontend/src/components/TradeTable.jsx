// components/TradeTable.jsx
import {
  FiArrowUp,
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import ReviewModal from "./ReviewModal";
import TradeDetailModal from "./TradeDetailModal";
import TradeRow from "./TradeRow";
import { API_BASE_URL } from "../config/api";

const TRADES_PER_PAGE = 5;

export default function TradeTable({
  trades,
  confirmDelete,
  updateExit,
  totalProfit,
  onTradeUpdated,
  theme = "dark",
}) {
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [uploadingAfterId, setUploadingAfterId] = useState(null);
  const [manualId, setManualId] = useState(null);
  const [manualValue, setManualValue] = useState("");
  const [reviewTrade, setReviewTrade] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortDateOrder, setSortDateOrder] = useState("desc");
  const [directionFilter, setDirectionFilter] = useState("All");

  const processedTrades = useMemo(() => {
    const filtered =
      directionFilter === "All"
        ? trades
        : trades.filter((t) => t.direction === directionFilter);

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDateOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [trades, directionFilter, sortDateOrder]);

  const totalTrades = processedTrades.length;
  const totalPages = Math.ceil(totalTrades / TRADES_PER_PAGE);

  const paginatedTrades = useMemo(
    () =>
      processedTrades.slice(
        (currentPage - 1) * TRADES_PER_PAGE,
        currentPage * TRADES_PER_PAGE
      ),
    [processedTrades, currentPage]
  );

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages]
  );

  const handleAfterUpload = useCallback(
    async (tradeId, file) => {
      const formData = new FormData();
      formData.append("chart_after", file);
      try {
        setUploadingAfterId(tradeId);
        const res = await fetch(
          `${API_BASE_URL}/api/trades/${tradeId}/chart-after`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (res.ok) {
          const updated = await res.json();
          onTradeUpdated?.(updated);
        } else {
          alert("Upload failed!");
        }
      } catch (err) {
        alert("Upload failed!");
      } finally {
        setUploadingAfterId(null);
      }
    },
    [onTradeUpdated]
  );

  const deleteChartAfter = useCallback(
    async (tradeId) => {
      if (!confirm("Xóa chart after?")) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/trades/${tradeId}/chart-after`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          const updated = await res.json();
          onTradeUpdated?.(updated);
        } else {
          alert("Xóa thất bại!");
        }
      } catch (err) {
        alert("Xóa thất bại!");
      }
    },
    [onTradeUpdated]
  );

  const handleOpenReview = useCallback((trade) => {
    setReviewTrade(trade);
    setIsReviewOpen(true);
  }, []);

  const handleReviewUpdated = useCallback(
    (updated) => {
      onTradeUpdated?.(updated);
      setIsReviewOpen(false);
      setReviewTrade(null);
    },
    [onTradeUpdated]
  );

  const handleOpenDetail = useCallback((trade) => {
    setSelectedTrade(trade);
    setIsDetailOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <HeaderSummaryMemo
        totalProfit={totalProfit}
        totalTrades={totalTrades}
        directionFilter={directionFilter}
        onChangeFilter={(value) => {
          setDirectionFilter(value);
          setCurrentPage(1);
        }}
        isDark={isDark}
      />

      <div
        className={`rounded-2xl shadow-2xl border max-w-full ${
          isDark
            ? "bg-gray-800/90 backdrop-blur-md border-gray-700"
            : "bg-white/90 backdrop-blur-md border-gray-200"
        }`}
      >
        <table className="w-full table-auto text-xs md:text-sm">
          <TableHeaderMemo
            sortDateOrder={sortDateOrder}
            onToggleSort={() =>
              setSortDateOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            isDark={isDark}
          />

          <tbody>
            {paginatedTrades.length === 0 ? (
              <NoDataRow isDark={isDark} />
            ) : (
              paginatedTrades.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  navigate={navigate}
                  updateExit={updateExit}
                  manualId={manualId}
                  manualValue={manualValue}
                  setManualId={setManualId}
                  setManualValue={setManualValue}
                  onOpenReview={handleOpenReview}
                  onOpenDetail={handleOpenDetail}
                  confirmDelete={confirmDelete}
                  uploadingAfterId={uploadingAfterId}
                  onUploadAfter={handleAfterUpload}
                  onDeleteAfter={deleteChartAfter}
                />
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <PaginationMemo
            currentPage={currentPage}
            totalPages={totalPages}
            totalTrades={totalTrades}
            tradesPerPage={TRADES_PER_PAGE}
            onPageChange={goToPage}
            isDark={isDark}
          />
        )}
      </div>

      {reviewTrade && (
        <ReviewModal
          isOpen={isReviewOpen}
          trade={reviewTrade}
          onClose={() => setIsReviewOpen(false)}
          onUpdated={handleReviewUpdated}
        />
      )}

      <TradeDetailModal
        trade={selectedTrade}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        theme={theme} // "dark" | "light"
      />
    </div>
  );
}

/* ============ SUB COMPONENTS (memo) ============ */

function HeaderSummary({
  totalProfit,
  totalTrades,
  directionFilter,
  onChangeFilter,
  isDark,
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl shadow-xl ${
        isDark
          ? "bg-gradient-to-r from-gray-900 to-black text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-8 text-lg font-bold">
        <div>
          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
            Total Profit:
          </span>{" "}
          <span
            className={totalProfit >= 0 ? "text-green-400" : "text-red-400"}
          >
            ${totalProfit.toFixed(1)}
          </span>
        </div>
        <div>
          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
            Total Trades:
          </span>{" "}
          <span className="text-cyan-400">{totalTrades}</span>
        </div>
      </div>
      <select
        value={directionFilter}
        onChange={(e) => onChangeFilter(e.target.value)}
        className={`px-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-500 ${
          isDark
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        }`}
      >
        <option value="All">All Directions</option>
        <option value="Long">Long Only</option>
        <option value="Short">Short Only</option>
      </select>
    </div>
  );
}

const HeaderSummaryMemo = memo(HeaderSummary);

function TableHeader({ sortDateOrder, onToggleSort, isDark }) {
  return (
    <thead
      className={
        isDark
          ? "bg-gradient-to-r from-gray-900 to-black text-white"
          : "bg-gradient-to-r from-gray-100 to-white text-gray-900 border-b border-gray-200"
      }
    >
      <tr>
        <th
          className={`px-3 py-2 text-left font-semibold cursor-pointer transition ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
          onClick={onToggleSort}
        >
          <div className="flex items-center gap-1">
            <span className="text-xs md:text-sm">Date</span>
            {sortDateOrder === "desc" ? (
              <FiArrowDown size={14} />
            ) : (
              <FiArrowUp size={14} />
            )}
          </div>
        </th>

        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Symbol
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Setup
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Dir
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Entry → Exit
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          RR
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Result
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Grade
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Review
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Chart
        </th>
        <th className="px-3 py-2 text-left font-semibold text-xs md:text-sm">
          Close
        </th>
        <th className="px-3 py-2 text-center font-semibold text-xs md:text-sm">
          Actions
        </th>
      </tr>
    </thead>
  );
}

const TableHeaderMemo = memo(TableHeader);

function NoDataRow({ isDark }) {
  return (
    <tr>
      <td
        colSpan="12"
        className={`p-10 text-center text-lg ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        Không có lệnh nào phù hợp với bộ lọc.
      </td>
    </tr>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalTrades,
  tradesPerPage,
  onPageChange,
  isDark,
}) {
  const start = (currentPage - 1) * tradesPerPage + 1;
  const end = Math.min(currentPage * tradesPerPage, totalTrades);

  return (
    <div
      className={`flex items-center justify-between px-5 py-3 text-sm ${
        isDark
          ? "bg-gray-800/50 border-t border-gray-700 text-gray-400"
          : "bg-gray-50 border-t border-gray-200 text-gray-600"
      }`}
    >
      <div>
        Hiển thị {start} - {end} / {totalTrades} lệnh
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            "p-1.5 rounded-lg transition",
            currentPage === 1
              ? isDark
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-700"
          )}
        >
          <FiChevronLeft size={20} />
        </button>
        <span
          className={`px-4 py-1.5 rounded-lg font-medium ${
            isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            "p-1.5 rounded-lg transition",
            currentPage === totalPages
              ? isDark
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-700"
          )}
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

const PaginationMemo = memo(Pagination);
