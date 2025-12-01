// components/dashboard/WinrateBySetup.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function WinrateBySetup({ statsBySetup, theme = "dark" }) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // XỬ LÝ DỮ LIỆU
  // ──────────────────────────────────────────────────────────────
  const entries = Object.entries(statsBySetup).filter(
    ([, s]) => s.trades > 0
  );
  const labels = entries.map(([key]) => key);
  const winrates = entries.map(([, s]) =>
    s.trades > 0 ? ((s.win / s.trades) * 100).toFixed(1) : 0
  );

  if (!labels.length) {
    return (
      <div className={`h-full flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        No setup data yet.
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME (brand #F0B90B)
  // ──────────────────────────────────────────────────────────────
  const barColor = {
    dark: "rgba(240, 185, 11, 0.88)",   // #F0B90B
    light: "rgba(217, 119, 6, 0.88)",   // amber-700
  };

  // Đậm hơn nếu winrate cao
  const backgroundColors = winrates.map((rate) => {
    const intensity = 0.8 + (rate / 100) * 0.2; // 80% → 100%
    return isDark
      ? `rgba(240, 185, 11, ${intensity})`
      : `rgba(217, 119, 6, ${intensity})`;
  });

  const gridColor = isDark ? "#334155" : "#e5e7eb";     // slate-700 / gray-200
  const tickColor = isDark ? "#94a3b8" : "#64748b";     // slate-400 / slate-500
  const borderColor = isDark ? "#475569" : "#cbd5e1";   // slate-600 / slate-300

  // ──────────────────────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────────────────────
  const chartData = {
    labels,
    datasets: [
      {
        label: "Winrate (%)",
        data: winrates,
        backgroundColor: backgroundColors,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.75,
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
            const setup = ctx.label;
            const stats = statsBySetup[setup];
            return `${setup}: ${value}% (${stats.win}/${stats.trades} wins)`;
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
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: gridColor,
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          color: tickColor,
          callback: (value) => `${value}%`,
          padding: 8,
          stepSize: 20,
        },
        title: {
          display: true,
          text: "Winrate (%)",
          color: tickColor,
          font: { size: 12, weight: "bold" },
          padding: { top: 10 },
        },
      },
    },
    animation: {
      duration: 1100,
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