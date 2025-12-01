import React from "react";
import { Maximize2, ImageOff, UploadCloud, Trash2 } from "lucide-react";

export default function TradeScreenshot({
  screenshot,
  theme = "dark",
  setScreenshot,
  update,
}) {
  const isDark = theme === "dark";
  const fileInputRef = React.useRef(null);

  // XOÁ ẢNH
  const handleDelete = () => {
    setScreenshot(null);
    update("screenshot", null);
  };

  // UPLOAD ẢNH
  const handleFile = (file) => {
    if (!file || !file.type?.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      setScreenshot(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => fileInputRef.current?.click();

  const openFullscreen = () => {
    if (!screenshot) return;
    const byteString = atob(screenshot.split(",")[1]);
    const mimeString = screenshot.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div
      className={`
        hidden md:block w-1/2 relative overflow-hidden rounded-3xl
        ${
          isDark
            ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50"
            : "bg-gradient-to-br from-blue-50/70 to-cyan-50/70"
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* INPUT FILE ẨN */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      {/* SCROLL CONTAINER */}
      <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-rounded-full">
        <div className="min-h-full flex items-center justify-center p-6 sm:p-8">
          {screenshot ? (
            <div className="relative group">
              <img
                src={screenshot}
                alt="Trade chart"
                className={`
                  w-full h-full rounded-3xl border-2 shadow-2xl
                  object-cover select-none transition-all duration-300
                  group-hover:scale-[1.02] group-hover:shadow-3xl cursor-grab active:cursor-grabbing
                  ${isDark ? "border-slate-600" : "border-blue-200"}
                `}
                draggable={false}
              />

              {/* TOOLBAR NÚT HÀNH ĐỘNG – LUÔN HIỂN THỊ, CÓ MÀU RÕ RÀNG */}
              <div
                className={`
                  absolute top-4 right-4 flex gap-2
                `}
              >
                {/* Nút upload */}
                <button
                  onClick={handleClick}
                  className={`
                    px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1
                    shadow-md
                    bg-blue-500 hover:bg-blue-600 text-white
                  `}
                  title="Đổi ảnh chart"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </button>

                {/* Nút xoá */}
                <button
                  onClick={handleDelete}
                  className={`
                    px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1
                    shadow-md
                    bg-rose-500 hover:bg-rose-600 text-white
                  `}
                  title="Xoá ảnh chart"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Xoá</span>
                </button>
              </div>

              {/* FULLSCREEN BUTTON */}
              <button
                onClick={openFullscreen}
                className={`
                  absolute bottom-4 right-4 px-3 py-2 rounded-xl
                  shadow-lg flex items-center gap-2
                  font-medium text-sm
                  ${isDark ? "bg-black/60 text-white" : "bg-slate-900 text-white"}
                `}
                title="Mở ảnh fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
          ) : (
            /* NO IMAGE */
            <div className="text-center space-y-4">
              <div
                className={`
                  w-80 h-80 mx-auto rounded-3xl border-4 border-dashed flex flex-col items-center justify-center
                  cursor-pointer select-none
                  ${
                    isDark
                      ? "bg-slate-800/60 border-sky-400/70 text-slate-100"
                      : "bg-white border-sky-400/80 text-slate-700"
                  }
                `}
                onClick={handleClick}
              >
                <ImageOff className="w-16 h-16 mb-3" />
                <p className="text-lg font-semibold mb-1">Không có ảnh chart</p>
                <p className="text-xs sm:text-sm max-w-[14rem] mx-auto mb-3">
                  Kéo/thả ảnh vào đây hoặc bấm nút bên dưới để upload.
                </p>

                <button
                  className="mt-1 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow"
                  type="button"
                >
                  + Upload ảnh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
