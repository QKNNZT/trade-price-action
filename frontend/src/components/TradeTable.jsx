// components/TradeTable.jsx
import {
  FiTrash2,
  FiImage,
  FiStar,
  FiTarget,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiEye,
} from "react-icons/fi";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { openInTradingView } from "../utils/tradingViewLink";
import ReviewModal from "./ReviewModal";
import TradeDetailModal from "./TradeDetailModal";
import { API_BASE_URL } from "../config/api";
import { FiPlus } from "react-icons/fi";

export default function TradeTable({
  trades,
  confirmDelete,
  updateExit,
  totalProfit,
  onTradeUpdated,
}) {
  const [uploadingAfterId, setUploadingAfterId] = useState(null);
  const [manualId, setManualId] = useState(null);
  const [manualValue, setManualValue] = useState("");
  const [reviewTrade, setReviewTrade] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 5;
  const [sortDateOrder, setSortDateOrder] = useState("desc");
  const [directionFilter, setDirectionFilter] = useState("All");

  const processedTrades = useMemo(() => {
    let filtered = trades;
    if (directionFilter !== "All") {
      filtered = trades.filter((t) => t.direction === directionFilter);
    }
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDateOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [trades, directionFilter, sortDateOrder]);

  const totalTrades = processedTrades.length;
  const totalPages = Math.ceil(totalTrades / tradesPerPage);
  const paginatedTrades = processedTrades.slice(
    (currentPage - 1) * tradesPerPage,
    currentPage * tradesPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAfterUpload = async (tradeId, file) => {
    const formData = new FormData();
    formData.append("chart_after", file);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/trades/${tradeId}/chart-after`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        const updated = await res.json();
        onTradeUpdated(updated);
        setUploadingAfterId(null);
      }
    } catch (err) {
      alert("Upload failed!");
    }
  };

  const deleteChartAfter = async (tradeId) => {
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
        onTradeUpdated(updated);
      }
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
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
          onChange={(e) => {
            setDirectionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-cyan-500"
        >
          <option value="All">All Directions</option>
          <option value="Long">Long Only</option>
          <option value="Short">Short Only</option>
        </select>
      </div>

      {/* BẢNG */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-gradient-to-r from-gray-900 to-black text-white">
            <tr>
              <th
                className="p-5 text-left font-bold cursor-pointer hover:bg-gray-800 transition"
                onClick={() =>
                  setSortDateOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
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

          <tbody>
            {paginatedTrades.length === 0 ? (
              <tr>
                <td
                  colSpan="12"
                  className="p-10 text-center text-gray-500 text-lg"
                >
                  Không có lệnh nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              paginatedTrades.map((t) => {
                const isWin = t.profit > 0;
                const isLoss = t.profit < 0;
                const isBE = t.profit === 0;

                return (
                  <tr
                    key={t.id}
                    className={`border-t-2 transition-all hover:bg-gray-50 ${
                      isWin
                        ? "bg-green-50"
                        : isLoss
                        ? "bg-red-50"
                        : "bg-amber-50"
                    }`}
                  >
                    {/* TẤT CẢ <td> GỌN TRONG 1 DÒNG, KHÔNG CÓ DÒNG TRỐNG */}
                    <td className="p-5 font-medium text-gray-800">{t.date}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 text-lg">
                          {t.symbol}
                        </span>
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
                            navigate(
                              `/playbook?setup=${encodeURIComponent(t.setup)}`
                            );
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
                        className={`px-4 py-2 rounded-full text-xs font-bold text-white ${
                          t.direction === "Long" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {t.direction}
                      </span>
                    </td>
                    <td className="p-5 font-mono text-lg">
                      <span className="font-bold text-blue-800">{t.entry}</span>
                      <span className="mx-2 text-gray-500">→</span>
                      {t.exit ? (
                        <span className="font-bold text-gray-900">
                          {t.exit}
                        </span>
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
                      {isWin ? (
                        <div className="flex items-center gap-2">
                          <FiTarget className="text-green-600" size={26} />
                          <div className="text-green-600 font-black text-xl">
                            +${t.profit.toFixed(1)}
                          </div>
                        </div>
                      ) : isLoss ? (
                        <div className="flex items-center gap-2">
                          <FiAlertCircle className="text-red-600" size={26} />
                          <div className="text-red-600 font-black text-xl">
                            ${t.profit.toFixed(1)}
                          </div>
                        </div>
                      ) : isBE ? (
                        <div className="text-amber-600 font-bold text-lg">
                          BE
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">Pending</div>
                      )}
                    </td>
                    <td className="p-5">
                      {t.grade ? (
                        [...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={22}
                            className={
                              i < t.grade ? "text-yellow-500" : "text-gray-300"
                            }
                          />
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-5">
                      {t.exit ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewTrade(t);
                            setIsReviewOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-800 text-white rounded-xl text-sm hover:bg-slate-700"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          Close trước
                        </span>
                      )}
                    </td>

                    {/* CHART */}
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          {t.chart_before ? (
                            <a
                              href={`${API_BASE_URL}/api/uploads/${encodeURIComponent(
                                t.chart_before
                              )}`}
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
                            <div className="text-xs text-gray-400 italic">
                              No before
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {t.chart_after ? (
                            <div className="relative group">
                              <a
                                href={`${API_BASE_URL}/api/uploads/${encodeURIComponent(
                                  t.chart_after
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="block"
                                title="Chart AFTER"
                              >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition">
                                  <FiImage
                                    className="text-green-700"
                                    size={20}
                                  />
                                </div>
                              </a>
                              <label className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const file = e.target.files[0];
                                    if (file) {
                                      setUploadingAfterId(t.id);
                                      handleAfterUpload(t.id, file);
                                    }
                                  }}
                                />
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700">
                                  <FiPlus className="text-white" size={12} />
                                </div>
                              </label>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChartAfter(t.id);
                                }}
                                className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Xóa chart after"
                              >
                                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700">
                                  <FiX className="text-white" size={12} />
                                </div>
                              </button>
                              {uploadingAfterId === t.id && (
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
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const file = e.target.files[0];
                                  if (file) {
                                    setUploadingAfterId(t.id);
                                    handleAfterUpload(t.id, file);
                                  }
                                }}
                              />
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition">
                                <FiPlus className="text-gray-700" size={20} />
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CLOSE */}
                    <td className="p-5">
                      {!t.exit ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExit(t.id, t.tp);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700"
                          >
                            Hit TP
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExit(t.id, t.sl);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700"
                          >
                            Hit SL
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExit(t.id, t.entry);
                            }}
                            className="px-3 py-1 bg-yellow-500 text-black rounded-xl text-sm hover:bg-yellow-600"
                          >
                            BE
                          </button>
                          {manualId === t.id ? (
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
                                  updateExit(t.id, parseFloat(manualValue));
                                  setManualId(null);
                                  setManualValue("");
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
                                setManualId(t.id);
                              }}
                              className="px-3 py-1 bg-gray-700 text-white rounded-xl text-sm hover:bg-gray-800"
                            >
                              Manual
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-green-700 font-bold">Closed</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrade(t);
                            setIsDetailOpen(true);
                          }}
                          className="p-3 bg-emerald-100 rounded-full hover:bg-emerald-200 transition"
                          title="Xem chi tiết"
                        >
                          <FiEye className="text-emerald-600" size={22} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(t.id);
                          }}
                          className="p-3 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          <FiTrash2 className="text-red-600" size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * tradesPerPage + 1} -{" "}
              {Math.min(currentPage * tradesPerPage, totalTrades)} /{" "}
              {totalTrades} lệnh
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <FiChevronLeft size={20} />
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {reviewTrade && (
        <ReviewModal
          isOpen={isReviewOpen}
          trade={reviewTrade}
          onClose={() => setIsReviewOpen(false)}
          onUpdated={(updated) => {
            if (onTradeUpdated) onTradeUpdated(updated);
            setIsReviewOpen(false);
            setReviewTrade(null);
          }}
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
