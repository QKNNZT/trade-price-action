import { Bar } from "react-chartjs-2";
import { chartOptions } from "../../utils/chartOptions";

export default function WinrateBySetup({ statsBySetup }) {
    const labels = Object.keys(statsBySetup);

    const data = labels.map(key => {
        const s = statsBySetup[key];
        return s.trades > 0 ? ((s.win / s.trades) * 100).toFixed(1) : 0
    });

    return (
        <div className="h-80">
            <Bar
                data={{
                    labels,
                    datasets: [
                        {
                            label: "Winrate %",
                            data,
                            backgroundColor: "#F0B90B",
                        },
                    ],
                }}
                options={chartOptions}
            />
        </div>
    );
}
