// components/dashboard/SessionStats.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function SessionStats({ data, theme = "dark" }) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // XỬ LÝ DỮ LIỆU
  // ──────────────────────────────────────────────────────────────
  const labels = Object.keys(data).filter((session) => data[session].total > 0);
  const winrates = labels.map((session) => {
    const { win, total } = data[session];
    return total > 0 ? ((win / total) * 100).toFixed(1) : 0;
  });

  if (!labels.length) {
    return (
      <div className={`h-full flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        No session data yet.
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME
  // ──────────────────────────────────────────────────────────────
  const barColor = {
    dark: "rgba(6, 182, 212, 0.88)",    // cyan-500
    light: "rgba(14, 116, 144, 0.88)",  // cyan-700
  };

  const gridColor = isDark ? "#334155" : "#e5e7eb";     // slate-700 / gray-200
  const tickColor = isDark ? "#94a3b8" : "#64748b";     // slate-400 / slate-500
  const borderColor = isDark ? "#475569" : "#cbd5e1";   // slate-600 / slate-300

  // Tạo gradient cho từng cột (tăng độ chuyên nghiệp)
  const backgroundColors = winrates.map((rate) => {
    const opacity = 0.85 + (rate / 100) * 0.1; // winrate cao → đậm hơn
    return isDark
      ? `rgba(6, 182, 212, ${opacity})`
      : `rgba(14, 116, 144, ${opacity})`;
  });

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
    indexAxis: "x",
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
            const session = ctx.label;
            const stats = data[session];
            return `${session}: ${value}% (${stats.win}/${stats.total} wins)`;
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