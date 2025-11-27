// components/tradeform/EntryModelSection.jsx
import CreatableSelect from "react-select/creatable";
import { darkSelect } from "./SelectStyles";

const ENTRY_MODEL_OPTIONS = [
  { label: "FVG Entry", value: "FVG Entry" },
  { label: "Liquidity Grab", value: "Liquidity Grab" },
  { label: "BOS Retest", value: "BOS Retest" },
  { label: "Breaker", value: "Breaker" },
  { label: "Mitigation Block", value: "Mitigation Block" },
  { label: "Rejection Candle", value: "Rejection Candle" },
];

export default function EntryModelSection({ form, handleMultiChange }) {
  return (
    <div className="mb-8">
      <label className="block text-xs text-yellow-400 font-bold mb-2">
        Entry Model
      </label>
      <CreatableSelect
        isMulti
        styles={darkSelect}
        options={ENTRY_MODEL_OPTIONS}
        value={form.entry_model || []}
        onChange={handleMultiChange("entry_model")}
        placeholder="FVG Entry + Liquidity Grab..."
      />
    </div>
  );
}
