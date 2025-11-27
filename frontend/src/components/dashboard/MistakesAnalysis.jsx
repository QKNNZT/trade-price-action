// components/dashboard/MistakesAnalysis.jsx
import { Doughnut } from "react-chartjs-2";

export default function MistakesAnalysis({ data }) {
  return (
    

      <div className="h-96 flex items-center justify-center">
        <Doughnut
          data={{
            labels: Object.keys(data),
            datasets: [
              {
                data: Object.values(data),
                backgroundColor: ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"],
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                position: "right",
                labels: { color: "#e2e8f0" },
              },
            },
          }}
        />
    </div>
  );
}
