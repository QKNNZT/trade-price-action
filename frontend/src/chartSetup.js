import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeSeriesScale,
    Tooltip,
    Legend,
} from "chart.js";

// Register ALL required components
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeSeriesScale,
    Tooltip,
    Legend
);

export default Chart;
