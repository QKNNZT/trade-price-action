// src/components/dashboard/DrawdownChart.jsx
import { Line } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function DrawdownChart({ drawdowns, maxDrawdown }) {
  return (
    <Line
      data={{
        labels: drawdowns.map((_, i) => i + 1),
        datasets: [{
          label: "Drawdown (%)",
          data: drawdowns,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.2)",
          tension: 0.3,
          pointRadius: 0,
          fill: true,
        }],
      }}
      options={{
        ...chartOptions,
        plugins: {
          title: {
            display: true,
            text: `Max Drawdown: ${maxDrawdown}%`,
            color: maxDrawdown > 20 ? "#ef4444" : "#10b981",
            font: { size: 16, weight: "bold" }
          },
          legend: { display: false },
        },
      }}
    />
  );
}