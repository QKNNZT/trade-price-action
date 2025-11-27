// components/tradeform/MarketStructureSection.jsx

export default function MarketStructureSection({ form, updateForm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div>
        <label className="text-xs font-bold text-blue-300 mb-1 block">
          HTF Bias
        </label>
        <select
          className="w-full h-12 bg-[#161b22] border border-gray-700 rounded-lg px-4 text-white"
          value={form.htf_bias || ""}
          onChange={(e) => updateForm({ htf_bias: e.target.value })}
        >
          <option value="">—</option>
          <option value="Bullish">Bullish</option>
          <option value="Bearish">Bearish</option>
          <option value="Range">Range</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-blue-300 mb-1 block">
          Trend Direction
        </label>
        <select
          className="w-full h-12 bg-[#161b22] border border-gray-700 rounded-lg px-4 text-white"
          value={form.trend_direction || ""}
          onChange={(e) => updateForm({ trend_direction: e.target.value })}
        >
          <option value="">—</option>
          <option value="Uptrend">Uptrend</option>
          <option value="Downtrend">Downtrend</option>
          <option value="Range">Range</option>
          <option value="Transition">Transition</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-blue-300 mb-1 block">
          Structure Event
        </label>
        <select
          className="w-full h-12 bg-[#161b22] border border-gray-700 rounded-lg px-4 text-white"
          value={form.structure_event || ""}
          onChange={(e) => updateForm({ structure_event: e.target.value })}
        >
          <option value="">—</option>
          <option value="BOS">BOS</option>
          <option value="CHoCH">CHoCH</option>
          <option value="MSS">MSS</option>
          <option value="Reversal">Reversal</option>
          <option value="Continuation">Continuation</option>
          <option value="Sweep">Liquidity Sweep</option>
        </select>
      </div>
    </div>
  );
}
