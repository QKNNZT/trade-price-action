// src/components/dashboard/DrawdownChart.jsx
import { Line} from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function DrawdownChart({ drawdowns, maxDrawdown, theme = "dark" }) {
  const isDark = theme === "dark";

  // Màu sắc theo theme
  const borderColor = isDark ? "#f87171" : "#dc2626"; // red-400 → red-600
  const backgroundColor = isDark 
    ? "rgba(248, 113, 113, 0.15)" 
    : "rgba(239, 68, 68, 0.1)";
  const titleColor = maxDrawdown > 20 
    ? (isDark ? "#f87171" : "#dc2626") 
    : (isDark ? "#34d399" : "#16a34a"); // emerald-400 → green-600

  const data = {
    labels: drawdowns.map((_, i) => i + 1),
    datasets: [{
      label: "Drawdown (%)",
      data: drawdowns,
      borderColor,
      backgroundColor,
      tension: 0.3,
      pointRadius: 0,
      fill: true,
      borderWidth: 2,
    }],
  };

  const options = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Max Drawdown: ${maxDrawdown.toFixed(2)}%`,
        color: titleColor,
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Drawdown: ${ctx.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? "#9ca3af" : "#6b7280" },
      },
      y: {
        beginAtZero: true,
        grid: { color: isDark ? "#374151" : "#e5e7eb" },
        ticks: { 
          color: isDark ? "#9ca3af" : "#6b7280",
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Line data={data} options={options} />
    </div>
  );
}