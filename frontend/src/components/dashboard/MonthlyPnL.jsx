// src/components/dashboard/MonthlyPnL.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function MonthlyPnL({ data }) {
  // SỬA TẠI ĐÂY – map từng phần tử và format lại YYYY-MM → MM/YY
  const labels = data.map((d) => {
    const [year, month] = d.month.split("-");
    return `${month}/${year.slice(2)}`; // ví dụ: "03/25"
  });

  const profits = data.map((d) => d.profit);

  const backgroundColors = profits.map(p => p >= 0 ? "#10b981" : "#ef4444");

  return (
    <Bar
      data={{
        labels, // giờ là mảng ["01/24", "02/24", "03/25", ...]
        datasets: [{
          label: "P&L ($)",
          data: profits,
          backgroundColor: backgroundColors,
          borderRadius: 8,
          borderSkipped: false,
        }],
      }}
      options={{
        ...chartOptions,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `P&L: $${ctx.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            ticks: { color: "#94a3b8" },
            grid: { color: "#1e293b" }
          },
          x: {
            ticks: { color: "#94a3b8" },
            grid: { display: false }
          }
        }
      }}
    />
  );
}