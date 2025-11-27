// components/dashboard/TimeframeStats.jsx
import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function TimeframeStats({ data }) {
  return (
    

      <div className="h-80">
        <Bar
          data={{
            labels: Object.keys(data),
            datasets: [
              {
                label: "Winrate %",
                data: Object.values(data).map(s => (s.win / s.total * 100).toFixed(1)),
                backgroundColor: "#a855f7",
              },
            ],
          }}
          options={chartOptions}
        />
    </div>
  );
}
