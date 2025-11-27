// components/tradeform/TradeManagementSection.jsx

export default function TradeManagementSection({ form, updateForm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div>
        <label className="text-xs text-purple-300 font-bold mb-1 block">
          Partial TP
        </label>
        <select
          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3"
          value={form.partial_tp || ""}
          onChange={(e) => updateForm({ partial_tp: e.target.value })}
        >
          <option value="">None</option>
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-purple-300 font-bold mb-1 block">
          BE Trigger
        </label>
        <select
          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3"
          value={form.be_trigger || ""}
          onChange={(e) => updateForm({ be_trigger: e.target.value })}
        >
          <option value="">None</option>
          <option value="1R">After +1R</option>
          <option value="Structure Shift">After structure shift</option>
          <option value="Mitigation">After mitigation</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-purple-300 font-bold mb-1 block">
          Scale Mode
        </label>
        <select
          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3"
          value={form.scale_mode || ""}
          onChange={(e) => updateForm({ scale_mode: e.target.value })}
        >
          <option value="">None</option>
          <option value="Scale In">Scale In</option>
          <option value="Scale Out">Scale Out</option>
        </select>
      </div>
    </div>
  );
}
