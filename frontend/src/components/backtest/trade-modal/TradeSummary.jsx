export default function TradeSummary({ data, update }) {
    return (
        <div className="grid grid-cols-2 gap-4">

            {/* R:R */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-5 text-center">
                <p className="text-gray-400 text-sm">R:R</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">1:{data.rr}</p>
            </div>

            {/* Result */}
            <div className={`rounded-2xl p-5 text-center border ${
                data.result === "win"
                    ? "bg-green-500/10 border-green-500/30"
                    : data.result === "loss"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-yellow-500/10 border-yellow-500/30"
            }`}>
                <p className="text-gray-400 text-sm">Result</p>
                <p className={`text-3xl font-bold mt-1 ${
                    data.result === "win"
                        ? "text-green-400"
                        : data.result === "loss"
                        ? "text-red-400"
                        : "text-yellow-400"
                }`}>
                    {data.result.toUpperCase()}
                </p>
            </div>

            {/* Direction */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-5 text-center">
                <p className="text-gray-400 text-sm">Direction</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                    {data.direction.toUpperCase()}
                </p>
            </div>

            {/* Rating */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-5 text-center">
                <p className="text-gray-400 text-sm">Rating</p>
                <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(s => (
                        <span
                            key={s}
                            onClick={() => update("rating", s)}
                            className={`text-3xl cursor-pointer transition hover:scale-110 ${
                                s <= data.rating ? "text-yellow-400" : "text-gray-600"
                            }`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}
