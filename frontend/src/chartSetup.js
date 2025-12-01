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
    Filler
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
    Legend,
    Filler
);

export default Chart;
