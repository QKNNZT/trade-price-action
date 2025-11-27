// components/tradeform/ChartUploadSection.jsx
import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";

export default function ChartUploadSection({ form, updateForm }) {
  const [preview, setPreview] = useState(null);

  const handleBeforeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateForm({ chart_before: file });
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const removeBeforeImage = () => {
    updateForm({ chart_before: null });
    setPreview(null);
  };

  // cleanup URL để tránh memory leak
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* CHART BEFORE */}
      <div className="flex flex-col">
        <label className="text-xs font-bold block mb-3 text-gray-300">
          Chart Before (Setup)
        </label>
        <label className="block border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center cursor-pointer bg-[#161b22] hover:border-blue-400 transition min-h-64 flex flex-col justify-center">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-80 object-contain rounded-xl mx-auto"
              />
              <button
                type="button"
                onClick={removeBeforeImage}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <>
              <FiUpload size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Click để upload chart BEFORE</p>
              <p className="text-xs text-gray-500 mt-2">
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
        <label className="text-xs font-bold text-gray-300 mb-3">
          Entry Reason
        </label>
        <textarea
          rows={6}
          className="w-full border border-gray-700 rounded-xl px-5 py-4 bg-[#161b22] text-white resize-none focus:border-blue-500 transition"
          placeholder="• BOS + FVG confluence tại H4\n• Liquidity Grab + London killzone\n• Order Block + MIT..."
          value={form.entry_reason || ""}
          onChange={(e) => updateForm({ entry_reason: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-2">
          Mô tả lý do vào lệnh (confluence, session, cấu trúc...)
        </p>
      </div>
    </div>
  );
}
