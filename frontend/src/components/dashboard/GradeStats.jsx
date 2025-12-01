// src/components/dashboard/GradeStats.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

/**
 * data: {
 *   [grade]: { winrate, trades, avgR }
 * }
 */
export default function GradeStats({ data, theme = "dark" }) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // XỬ LÝ DỮ LIỆU
  // ──────────────────────────────────────────────────────────────
  const labels = Object.keys(data).filter((g) => data[g].trades > 0);
  if (!labels.length) {
    return (
      <div className={`text-center py-8 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        No grade data yet.
      </div>
    );
  }

  const winrates = labels.map((g) => Number(data[g].winrate || 0).toFixed(1));
  const trades = labels.map((g) => data[g].trades || 0);
  const avgRs = labels.map((g) => Number(data[g].avgR || 0).toFixed(2));

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME (Tailwind + RGBA)
  // ──────────────────────────────────────────────────────────────
  const colors = {
    winrate: {
      dark: "rgba(34, 197, 94, 0.85)",    // green-500
      light: "rgba(21, 128, 61, 0.85)",   // green-700
    },
    trades: {
      dark: "rgba(14, 165, 233, 0.85)",   // sky-500
      light: "rgba(3, 105, 161, 0.85)",   // sky-700
    },
    avgR: {
      dark: "rgba(240, 185, 11, 0.85)",   // #F0B90B
      light: "rgba(217, 119, 6, 0.85)",  // amber-700
    },
  };

  const gridColor = isDark ? "#374151" : "#e5e7eb";     // gray-700 / gray-200
  const textColor = isDark ? "#e2e8f0" : "#1f2937";     // slate-200 / gray-800
  const tickColor = isDark ? "#9ca3af" : "#6b7280";     // gray-400 / gray-500

  // ──────────────────────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────────────────────
  const chartData = {
    labels,
    datasets: [
      {
        label: "Winrate (%)",
        data: winrates,
        backgroundColor: colors.winrate[isDark ? "dark" : "light"],
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Trades",
        data: trades,
        backgroundColor: colors.trades[isDark ? "dark" : "light"],
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Avg R",
        data: avgRs,
        backgroundColor: colors.avgR[isDark ? "dark" : "light"],
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: "y1",
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
      legend: {
        position: "top",
        labels: {
          color: textColor,
          usePointStyle: true,
          padding: 20,
          font: { size: 13 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label;
            const value = ctx.parsed.y;
            if (label === "Winrate (%)") return `${label}: ${value}%`;
            if (label === "Avg R") return `${label}: ${value} R`;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor, font: { weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          callback: (value) => `${value}%`,
        },
        title: {
          display: true,
          text: "Winrate & Trades",
          color: tickColor,
          font: { size: 12, weight: "bold" },
        },
      },
      y1: {
        position: "right",
        beginAtZero: false,
        grid: { display: false },
        ticks: {
          color: tickColor,
          callback: (value) => `${value} R`,
        },
        title: {
          display: true,
          text: "Avg R",
          color: tickColor,
          font: { size: 12, weight: "bold" },
        },
      },
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