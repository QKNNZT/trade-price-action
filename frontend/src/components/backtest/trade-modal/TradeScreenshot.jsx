export default function TradeScreenshot({ screenshot }) {
    return (
        <div className="hidden md:block w-1/2 bg-black/40 overflow-hidden relative group">
            <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
                <div className="min-w-full h-full flex items-center justify-center p-8">
                    {screenshot ? (
                        <img
                            src={screenshot}
                            alt="Trade chart"
                            className="max-w-none h-auto max-h-full rounded-2xl border border-gray-700 shadow-2xl 
                            object-contain select-none transition-all duration-300 group-hover:scale-[1.02] 
                            hover:shadow-3xl cursor-grab active:cursor-grabbing"
                            draggable={false}
                        />
                    ) : (
                        <div className="text-center text-gray-500">
                            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl w-96 h-96 mx-auto mb-4" />
                            <p className="text-lg">Không có ảnh chart</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => {
                    if (!screenshot) return;

                    const byteString = atob(screenshot.split(",")[1]);
                    const mimeString = screenshot.split(",")[0].split(":")[1].split(";")[0];

                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

                    const blob = new Blob([ab], { type: mimeString });
                    const url = URL.createObjectURL(blob);

                    window.open(url, "_blank");
                }}
                className="absolute bottom-5 right-5 bg-black/70 hover:bg-black/90 text-white p-3 rounded-xl 
                backdrop-blur border border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                title="Mở ảnh fullscreen"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            </button>
        </div>
    );
}
