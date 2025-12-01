// components/dashboard/MistakesAnalysis.jsx
import { Doughnut } from "react-chartjs-2";

export default function MistakesAnalysis({ data, theme = "dark" }) {
  const isDark = theme === "dark";

  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#facc15", // yellow
    "#22c55e", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
  ];

  // Viền: dark = trắng, light = đen đậm
  const borderColor = isDark ? "#ffffff" : "#000000";

  return (
    <div className="h-full flex items-center justify-center">
      <Doughnut
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              backgroundColor: colors,
              borderColor,
              borderWidth: 3, // cho viền rõ hơn
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: isDark ? "#e2e8f0" : "#111827", // chữ legend
                font: {
                  size: 12,
                  weight: "500",
                },
              },
            },
          },
          cutout: "60%",
        }}
      />
    </div>
  );
}
