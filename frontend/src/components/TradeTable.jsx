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

const TRADES_PER_PAGE = 5;

export default function TradeTable({
  trades,
  confirmDelete,
  updateExit,
  totalProfit,
  onTradeUpdated,
}) {
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
      />

      <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
        <table className="w-full table-auto">
          <TableHeaderMemo
            sortDateOrder={sortDateOrder}
            onToggleSort={() =>
              setSortDateOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
          />

          <tbody>
            {paginatedTrades.length === 0 ? (
              <NoDataRow />
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
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-gray-900 to-black text-white p-5 rounded-2xl shadow-xl">
      <div className="flex items-center gap-8 text-lg font-bold">
        <div>
          <span className="text-gray-300">Total Profit:</span>{" "}
          <span
            className={totalProfit >= 0 ? "text-green-400" : "text-red-400"}
          >
            ${totalProfit.toFixed(1)}
          </span>
        </div>
        <div>
          <span className="text-gray-300">Total Trades:</span>{" "}
          <span className="text-cyan-400">{totalTrades}</span>
        </div>
      </div>
      <select
        value={directionFilter}
        onChange={(e) => onChangeFilter(e.target.value)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-cyan-500"
      >
        <option value="All">All Directions</option>
        <option value="Long">Long Only</option>
        <option value="Short">Short Only</option>
      </select>
    </div>
  );
}

const HeaderSummaryMemo = memo(HeaderSummary);

function TableHeader({ sortDateOrder, onToggleSort }) {
  return (
    <thead className="bg-gradient-to-r from-gray-900 to-black text-white">
      <tr>
        <th
          className="p-5 text-left font-bold cursor-pointer hover:bg-gray-800 transition"
          onClick={onToggleSort}
        >
          <div className="flex items-center gap-2">
            Date
            {sortDateOrder === "desc" ? <FiArrowDown /> : <FiArrowUp />}
          </div>
        </th>
        <th className="p-5 text-left font-bold">Symbol</th>
        <th className="p-5 text-left font-bold">Setup</th>
        <th className="p-5 text-left font-bold">Dir</th>
        <th className="p-5 text-left font-bold">Entry → Exit</th>
        <th className="p-5 text-left font-bold">RR</th>
        <th className="p-5 text-left font-bold">Result</th>
        <th className="p-5 text-left font-bold">Grade</th>
        <th className="p-5 text-left font-bold">Review</th>
        <th className="p-5 text-left font-bold">Chart</th>
        <th className="p-5 text-left font-bold">Close</th>
        <th className="p-5 text-center font-bold">Actions</th>
      </tr>
    </thead>
  );
}

const TableHeaderMemo = memo(TableHeader);

function NoDataRow() {
  return (
    <tr>
      <td colSpan="12" className="p-10 text-center text-gray-500 text-lg">
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
}) {
  const start = (currentPage - 1) * tradesPerPage + 1;
  const end = Math.min(currentPage * tradesPerPage, totalTrades);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Hiển thị {start} - {end} / {totalTrades} lệnh
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            "p-2 rounded-lg",
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          )}
        >
          <FiChevronLeft size={20} />
        </button>
        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            "p-2 rounded-lg",
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          )}
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

const PaginationMemo = memo(Pagination);

// Đừng quên import API_BASE_URL ở trên cùng
import { API_BASE_URL } from "../config/api";
