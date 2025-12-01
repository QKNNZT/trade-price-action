// components/tradeform/ChartUploadSection.jsx
import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";

export default function ChartUploadSection({ form, updateForm, theme = "dark" }) {
  const [preview, setPreview] = useState(null);
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // SYNC PREVIEW VỚI form.chart_before
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (form.chart_before) {
      const url = URL.createObjectURL(form.chart_before);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [form.chart_before]);

  // Cleanup URL cũ khi preview thay đổi
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleBeforeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateForm({ chart_before: file });
      // preview sẽ tự cập nhật qua useEffect
    }
  };

  const removeBeforeImage = (e) => {
    e.stopPropagation(); // ngăn click vào label
    updateForm({ chart_before: null });
    // reset file input
    const input = document.querySelector('input[name="chart_before"]');
    if (input) input.value = "";
  };

  // ──────────────────────────────────────────────────────────────
  // CLASSES THEO THEME
  // ──────────────────────────────────────────────────────────────
  const labelBase = "text-xs font-bold block mb-3";
  const labelColor = isDark ? "text-gray-300" : "text-gray-700";
  const labelClass = `${labelBase} ${labelColor}`;

  const uploadBoxBase =
    "block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition min-h-64 flex flex-col justify-center";
  const uploadBoxTheme = isDark
    ? "border-gray-600 bg-[#161b22] hover:border-[#F0B90B]"
    : "border-gray-300 bg-white hover:border-[#F0B90B] shadow-sm";
  const uploadBoxClass = `${uploadBoxBase} ${uploadBoxTheme}`;

  const uploadIconClass = isDark ? "text-gray-500" : "text-gray-400";

  const uploadMainTextClass = isDark ? "text-gray-400" : "text-gray-600";
  const uploadSubTextClass = isDark ? "text-gray-500" : "text-gray-400";

  const textareaBase =
    "w-full border rounded-xl px-5 py-4 resize-none focus:outline-none focus:ring-1 transition";
  const textareaTheme = isDark
    ? "bg-[#161b22] border-gray-700 text-white focus:border-[#F0B90B] focus:ring-[#F0B90B]/40"
    : "bg-white border-gray-200 text-gray-900 focus:border-[#F0B90B] focus:ring-[#F0B90B]/20 shadow-sm";
  const textareaClass = `${textareaBase} ${textareaTheme}`;

  const helperTextClass = `text-xs mt-2 ${
    isDark ? "text-gray-500" : "text-gray-500"
  }`;

  const closeButtonClass = isDark
    ? "bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg"
    : "bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md";

  const previewImgClass = `w-full max-h-80 object-contain rounded-xl mx-auto ${
    isDark ? "bg-black/20" : "bg-gray-50"
  }`;

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* CHART BEFORE */}
      <div className="flex flex-col">
        <label className={labelClass}>Chart Before (Setup)</label>
        <label
          className={uploadBoxClass}
          onClick={(e) => preview && e.preventDefault()} // ngăn mở file nếu đã có ảnh
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className={previewImgClass}
              />
              <button
                type="button"
                onClick={removeBeforeImage}
                className={closeButtonClass}
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <>
              <FiUpload
                size={48}
                className={`mx-auto mb-4 ${uploadIconClass}`}
              />
              <p className={uploadMainTextClass}>
                Click để upload chart BEFORE
              </p>
              <p className={`${uploadSubTextClass} text-xs mt-2`}>
                PNG, JPG, tối đa 10MB
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            name="chart_before"
            className="hidden"
            onChange={handleBeforeImageChange}
          />
        </label>
      </div>

      {/* ENTRY REASON */}
      <div className="flex flex-col">
        <label className={labelClass}>Entry Reason</label>
        <textarea
          rows={6}
          className={textareaClass}
          placeholder={
            "• BOS + FVG confluence tại H4\n• Liquidity Grab + London killzone\n• Order Block + MIT..."
          }
          value={form.entry_reason || ""}
          onChange={(e) => updateForm({ entry_reason: e.target.value })}
        />
        <p className={helperTextClass}>
          Mô tả lý do vào lệnh (confluence, session, cấu trúc...)
        </p>
      </div>
    </div>
  );
}
