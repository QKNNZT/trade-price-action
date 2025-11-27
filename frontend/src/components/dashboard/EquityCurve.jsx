// components/dashboard/EquityCurve.jsx
import { Line } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function EquityCurve({ data }) {
    return (


        <div className="h-96">
            <Line
                data={{
                    labels: data.map((_, i) => i + 1),
                    datasets: [
                        {
                            label: "Equity ($)",
                            data,
                            borderColor: "#F0B90B",
                            tension: 0.3,
                            pointRadius: 0,
                        },
                    ],
                }}
                options={chartOptions}
            />
        </div>

    );
}
