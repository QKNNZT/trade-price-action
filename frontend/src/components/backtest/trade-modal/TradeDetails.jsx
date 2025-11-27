export default function TradeDetails({ data }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-8">

            {/* Entry, TP, SL */}
            <div className="grid grid-cols-1 gap-5">

                <div className="bg-gray-800/60 backdrop-blur border border-gray-700 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm mb-2">Entry Price</p>
                    <p className="text-2xl font-bold text-cyan-400">{data.entry || "-"}</p>
                </div>

                <div className="bg-gray-800/60 backdrop-blur border border-green-700/50 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm mb-2">Take Profit (TP)</p>
                    <p className="text-2xl font-bold text-green-400">{data.tp || "-"}</p>
                </div>

                <div className="bg-gray-800/60 backdrop-blur border border-red-700/50 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm mb-2">Stop Loss (SL)</p>
                    <p className="text-2xl font-bold text-red-400">{data.sl || "-"}</p>
                </div>
            </div>

            {/* Confluence */}
            <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Confluence</h3>

                <div className="flex flex-wrap gap-2">
                    {data.confluence.length > 0 ? (
                        data.confluence.map(tag => (
                            <span key={tag} className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 text-blue-300 rounded-full text-sm">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 italic">Không có confluence</span>
                    )}
                </div>
            </div>

            {/* Mistakes */}
            {data.mistakes.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Mistakes Made</h3>

                    <div className="flex flex-wrap gap-2">
                        {data.mistakes.map(m => (
                            <span key={m} className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-300 rounded-full text-sm">
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes */}
            {data.notes && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Lesson Learned</h3>

                    <p className="text-gray-200 bg-gray-800/50 border border-gray-700 rounded-2xl p-5 italic leading-relaxed">
                        "{data.notes}"
                    </p>
                </div>
            )}
        </div>
    );
}
