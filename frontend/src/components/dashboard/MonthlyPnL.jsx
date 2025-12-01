// src/components/dashboard/MonthlyPnL.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function MonthlyPnL({ data, theme = "dark" }) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // XỬ LÝ DỮ LIỆU: format YYYY-MM → MM/YY
  // ──────────────────────────────────────────────────────────────
  const labels = data.map((d) => {
    const [year, month] = d.month.split("-");
    return `${month}/${year.slice(2)}`; // "03/25"
  });

  const profits = data.map((d) => d.profit);

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME (Tailwind + độ trong suốt)
  // ──────────────────────────────────────────────────────────────
  const colors = {
    profit: {
      dark: "rgba(16, 185, 129, 0.85)",   // emerald-500
      light: "rgba(6, 148, 95, 0.85)",    // emerald-700
    },
    loss: {
      dark: "rgba(239, 68, 68, 0.85)",    // red-500
      light: "rgba(220, 38, 38, 0.85)",   // red-600
    },
  };

  const backgroundColors = profits.map((p) =>
    p >= 0 ? colors.profit[isDark ? "dark" : "light"] : colors.loss[isDark ? "dark" : "light"]
  );

  const gridColor = isDark ? "#334155" : "#e5e7eb";     // slate-700 / gray-200
  const tickColor = isDark ? "#94a3b8" : "#64748b";     // slate-400 / slate-500
  const borderColor = isDark ? "#475569" : "#d1d5db";   // slate-600 / gray-300

  // ──────────────────────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────────────────────
  const chartData = {
    labels,
    datasets: [
      {
        label: "P&L ($)",
        data: profits,
        backgroundColor: backgroundColors,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
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
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: tickColor,
        bodyColor: tickColor,
        borderColor: borderColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;
            const abs = Math.abs(value).toFixed(2);
            const sign = value >= 0 ? "+" : "-";
            return `P&L: ${sign}$${abs}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: tickColor,
          font: { weight: "600", size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          color: tickColor,
          callback: (value) => {
            if (value === 0) return "$0";
            const abs = Math.abs(value);
            return value >= 0 ? `+$${abs}` : `-$${abs}`;
          },
          padding: 8,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}