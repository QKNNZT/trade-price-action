// hooks/usePositionSize.js
import { useMemo } from "react";
import { getSymbolMeta } from "../../../config/riskConfig";

export default function usePositionSize(form, riskPct) {
  return useMemo(() => {
    const entry = parseFloat(form.entry) || 0;
    const sl = parseFloat(form.sl) || 0;
    const tp = parseFloat(form.tp) || 0;
    const capital = parseFloat(form.capital) || 50000;

    if (!entry || !sl || entry === sl) {
      return {
        lotSize: "0.00",
        riskAmount: 0,
        actualRR: 0,
        stopTicks: 0,
        lotNote: "",
        unitLabel: "pips",
        isValid: false,
      };
    }

    const meta = getSymbolMeta(form.symbol) ?? {};
    const {
      tickSize = 0.0001,
      tickValue = 10,
      minLot = 0.01,
      lotStep = 0.01,
      unitLabel = "pips",
    } = meta;

    const priceDistance = Math.abs(entry - sl);
    const stopTicks = Math.round(priceDistance / tickSize);
    const riskAmount = capital * (riskPct / 100);
    const exactLot = riskAmount / (stopTicks * tickValue);

    let lotSize = "0.00";
    let lotNote = "";

    if (exactLot > 0 && exactLot < minLot) {
      lotNote = `Dưới min lot ${minLot}`;
    } else if (exactLot >= minLot) {
      const flooredLot = Math.floor(exactLot / lotStep) * lotStep;
      lotSize = flooredLot.toFixed(2);

      const actualRisk = flooredLot * stopTicks * tickValue;
      if (actualRisk > riskAmount + 0.01) {
        lotNote = "Đã tự động giảm lot (không vượt risk)";
      }
    }

    const actualRR = tp ? Math.abs((tp - entry) / priceDistance) : 0;

    return {
      lotSize,
      riskAmount: Math.round(riskAmount),
      actualRR,
      stopTicks: Number(stopTicks.toFixed(1)),
      lotNote,
      unitLabel,
      isValid: true,
    };
  }, [form.symbol, form.entry, form.sl, form.tp, form.capital, riskPct]);
}
