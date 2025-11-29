// src/components/dashboard/GradeStats.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

/**
 * data: {
 *   [grade]: { winrate, trades, avgR }
 * }
 */
export default function GradeStats({ data }) {
  const labels = Object.keys(data);
  if (!labels.length) {
    return <div className="text-gray-500 text-sm">No grade data yet.</div>;
  }

  const winrates = labels.map((g) => Number(data[g].winrate || 0).toFixed(1));
  const trades = labels.map((g) => data[g].trades || 0);

  return (
    <div className="h-80">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Winrate %",
              data: winrates,
              backgroundColor: "#22c55e",
            },
            {
              label: "Trades",
              data: trades,
              backgroundColor: "#0ea5e9",
            },
          ],
        }}
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            legend: {
              labels: { color: "#e2e8f0" },
            },
          },
        }}
      />
    </div>
  );
}
