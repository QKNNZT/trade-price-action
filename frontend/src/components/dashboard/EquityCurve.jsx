// components/dashboard/EquityCurve.jsx
import { Line } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function EquityCurve({ data, theme = "dark" }) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME (đồng bộ với brand #F0B90B)
  // ──────────────────────────────────────────────────────────────
  const lineColor = "#F0B90B";                     // giữ nguyên accent vàng
  const fillColor = isDark
    ? "rgba(240, 185, 11, 0.12)"   // vàng nhạt, trong suốt
    : "rgba(251, 191, 36, 0.08)"; // amber-400, trong suốt nhẹ

  const gridColor = isDark ? "#374151" : "#e5e7eb";   // gray-700 / gray-200
  const tickColor = isDark ? "#9ca3af" : "#6b7280";   // gray-400 / gray-500

  // ──────────────────────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────────────────────
  const chartData = {
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        label: "Equity (R)",
        data,
        borderColor: lineColor,
        backgroundColor: fillColor,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2.5,
        fill: true,
      },
    ],
  };

  // ──────────────────────────────────────────────────────────────
  // OPTIONS
  // ──────────────────────────────────────────────────────────────
  const options = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Equity: ${ctx.parsed.y.toFixed(2)} R`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor },
      },
      y: {
        beginAtZero: false,
        grid: { color: gridColor, lineWidth: 1 },
        ticks: {
          color: tickColor,
          callback: (value) => `${value.toFixed(1)} R`,
        },
      },
    },
  };

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}