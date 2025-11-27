// components/ReviewModal.jsx
import { useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import { FiX, FiStar } from "react-icons/fi";
import { darkSelect } from "./tradeform/SelectStyles";
import { mistakeOptions, psychOptions } from "./tradeform/tradeOptions"; // Thêm psychOptions
import { API_BASE_URL } from "../config/api"; // Dùng API_BASE_URL

// Helper: Chuyển DB string → array → select values
function parseToSelectValues(data) {
  if (Array.isArray(data)) {
    return data.map((v) => ({ value: v, label: v }));
  }
  if (typeof data === "string" && data.trim()) {
    try {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        return arr.map((v) => ({ value: v, label: v }));
      }
    } catch {
      return data
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => ({ value: v, label: v }));
    }
  }
  return [];
}

export default function ReviewModal({ isOpen, onClose, trade, onUpdated }) {
  const [grade, setGrade] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [psychTags, setPsychTags] = useState([]);
  const [exitReason, setExitReason] = useState("");
  const [note, setNote] = useState("");
  const [lessons, setLessons] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form khi mở modal
  const resetForm = useCallback(() => {
    if (!trade) return;
    setGrade(trade.grade || 0);
    setMistakes(parseToSelectValues(trade.mistakes));
    setPsychTags(parseToSelectValues(trade.psychological_tags));
    setExitReason(trade.exit_reason || "");
    setNote(trade.note || "");
    setLessons(trade.lessons || "");
    setError("");
  }, [trade]);

  useEffect(() => {
    if (isOpen && trade) {
      resetForm();
    }
  }, [isOpen, trade, resetForm]);

  if (!isOpen || !trade) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      grade,
      mistakes: mistakes.map((m) => m.value),
      psychological_tags: psychTags.map((t) => t.value),
      exit_reason: exitReason,
      note,
      lessons,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/trades/${trade.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || "Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#0d1117] text-white p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-400">
            Review Lệnh #{trade.id} – {trade.symbol}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grade */}
          <div>
            <label className="text-sm font-bold text-yellow-400 block mb-2">
              Đánh giá (Grade)
            </label>
            <div className="flex justify-center gap-4 bg-[#161b22] p-5 rounded-2xl border border-gray-700">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setGrade(n)}
                  className="transform transition hover:scale-125"
                  disabled={loading}
                >
                  <FiStar
                    size={36}
                    className={grade >= n ? "text-yellow-400" : "text-gray-600"}
                    fill={grade >= n ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Mistakes */}
          <div>
            <label className="text-sm font-bold text-red-400 block mb-2">
              Sai lầm (Mistakes)
            </label>
            <CreatableSelect
              isMulti
              styles={darkSelect}
              options={mistakeOptions}
              value={mistakes}
              onChange={setMistakes}
              placeholder="FOMO, Revenge, Late Entry..."
              isDisabled={loading}
            />
          </div>

          {/* Psychological Tags */}
          <div>
            <label className="text-sm font-bold text-purple-400 block mb-2">
              Tâm lý (Psychological Tags)
            </label>
            <CreatableSelect
              isMulti
              styles={darkSelect}
              options={psychOptions}
              value={psychTags}
              onChange={setPsychTags}
              placeholder="Hesitation, Overconfidence..."
              isDisabled={loading}
            />
          </div>

          {/* Exit Reason */}
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">
              Lý do thoát lệnh
            </label>
            <textarea
              rows={3}
              className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 transition"
              placeholder="Trail stop bị quét, fear, đạt TP..."
              value={exitReason}
              onChange={(e) => setExitReason(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Lessons Learned */}
          <div>
            <label className="text-sm font-bold text-green-400 block mb-2">
              Bài học rút ra (Lessons)
            </label>
            <textarea
              rows={4}
              className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 transition"
              placeholder="Lần sau phải đợi confirmation rõ hơn, không FOMO..."
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">
              Ghi chú thêm
            </label>
            <textarea
              rows={3}
              className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 transition"
              placeholder="Ghi chú bất kỳ..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 disabled:opacity-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 disabled:opacity-50 transition flex items-center gap-2"
            >
              {loading ? (
                <>Đang lưu...</>
              ) : (
                <>Lưu Review</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}