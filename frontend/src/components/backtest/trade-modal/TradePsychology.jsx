export default function TradePsychology({ data, update, getPsychEmoji }) {
    return (
        <div className="flex items-center justify-between bg-gray-800/60 backdrop-blur border border-gray-700 rounded-2xl p-5">
            <span className="text-gray-400 font-medium">Psychology State</span>

            <div className="relative">
                <select
                    value={data.psych}
                    onChange={e => update("psych", e.target.value)}
                    className="appearance-none bg-gray-900/80 border border-gray-600 rounded-xl px-5 py-3 pr-12 text-white font-medium outline-none cursor-pointer hover:border-gray-500 transition focus:border-blue-500"
                >
                    <option value="fear">Fear (cảnh giác)</option>
                    <option value="greed">Greed (tham lam)</option>
                    <option value="calm">Calm (bình tĩnh)</option>
                    <option value="focused">Focused (tập trung)</option>
                    <option value="neutral">Neutral (trung lập)</option>
                </select>

                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-2xl mr-1">{getPsychEmoji(data.psych)}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
