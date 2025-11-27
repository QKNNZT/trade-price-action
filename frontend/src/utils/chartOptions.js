export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (context) {
          return `Equity: $${context.raw.toLocaleString()}`;
        }
      },
      backgroundColor: "rgba(0,0,0,0.8)",
      titleColor: "#fff",
      bodyColor: "#F0B90B",
      borderColor: "#F0B90B",
      borderWidth: 1,
      padding: 10
    },
    legend: {
      labels: {
        color: "#fff"
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "#aaa" },
      grid: { color: "rgba(255,255,255,0.1)" },
    },
    y: {
      ticks: { color: "#aaa" },
      grid: { color: "rgba(255,255,255,0.1)" },
    },
  }
};
