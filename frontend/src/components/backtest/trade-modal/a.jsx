import React, { useState, useRef } from "react";
import { Maximize2, ImageOff, Upload, X } from "lucide-react";

export default function TradeScreenshot({ screenshot: initialScreenshot, update, theme = "dark" }) {
  const [screenshot, setScreenshot] = useState(initialScreenshot);
  const fileInputRef = useRef(null);
  const isDark = theme === "dark";

  // XÓA ẢNH
  const handleDelete = () => {
    setScreenshot(null);
    update("screenshot", null);
  };

  // UPLOAD ẢNH
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setScreenshot(dataUrl);
      update("screenshot", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => fileInputRef.current?.click();

  const openFullscreen = () => {
    if (!screenshot) return;
    const byteString = atob(screenshot.split(",")[1]);
    const mimeString = screenshot.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {screenshot ? (
        <div className="relative w-full h-full group">
          {/* ẢNH CHART */}
          <img
            src={screenshot}
            alt="Trade chart"
            className="w-full h-full object-contain select-none rounded-lg border-0 shadow-none cursor-grab active:cursor-grabbing"
            draggable={false}
          />

          {/* NÚT XÓA */}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10"
            title="Xóa ảnh"
          >
            <X className="w-4 h-4" />
          </button>

          {/* NÚT FULLSCREEN */}
          <button
            onClick={openFullscreen}
            className={`
              absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-md
              opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10
              ${isDark ? "bg-white/20 hover:bg-white/30 text-white" : "bg-white/80 hover:bg-white text-slate-700"}
            `}
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* KHU VỰC UPLOAD */
        <div
          className={`
            w-full h-full rounded-lg border-2 border-dashed
            flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${isDark
              ? "bg-slate-800/50 border-slate-600 hover:bg-slate-800/70"
              : "bg-white/70 border-blue-200 hover:bg-blue-50/70"
            }
          `}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleClick}
        >
          <Upload className={`w-10 h-10 mb-3 ${isDark ? "text-slate-400" : "text-blue-500"}`} />
          <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Kéo thả hoặc click để upload
          </p>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            PNG, JPG, GIF
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}