export default function TradeActions({ clone, save, index, trades }) {
    return (
        <div className="flex justify-between items-center pt-6 border-t border-gray-700 sticky bottom-0 
            bg-gradient-to-t from-[#1a1b20] to-transparent pb-6 -mb-6">

            <div className="flex gap-3">
                <button
                    onClick={clone}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                    hover:from-green-700 hover:to-emerald-700 rounded-xl font-medium shadow-lg transition"
                >
                    Clone Trade
                </button>

                <button
                    onClick={save}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 
                    hover:from-amber-700 hover:to-orange-700 rounded-xl font-medium shadow-lg transition"
                >
                    Save Changes
                </button>
            </div>

            <span className="text-gray-500 text-sm">
                Trade {index + 1} / {trades.length}
            </span>
        </div>
    );
}
