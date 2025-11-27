// components/dashboard/SetupTable.jsx
import { Link } from "react-router-dom";

export default function SetupTable({ statsBySetup }) {
    return (


        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-gray-700">
                    <tr>
                        <th className="py-3 px-4">Setup</th>
                        <th className="py-3 px-4">Trades</th>
                        <th className="py-3 px-4">Winrate</th>
                        <th className="py-3 px-4">Avg R</th>
                        <th className="py-3 px-4">Profit</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(statsBySetup)
                        .sort((a, b) => b[1].win / b[1].trades - a[1].win / a[1].trades)
                        .map(([setup, data]) => (
                            <tr key={setup} className="border-b border-gray-800 hover:bg-[#2A2F36]/30 transition">
                                <td className="py-4 px-4 font-semibold">
                                    <Link
                                        to={`/journal?setup=${encodeURIComponent(setup)}`}
                                        className="text-[#F0B90B] hover:underline hover:text-yellow-400 transition"
                                    >
                                        {setup}
                                    </Link>
                                </td>
                                <td className="py-4 px-4">{data.trades}</td>
                                <td className="py-4 px-4 font-bold text-green-400">
                                    {(data.win / data.trades * 100).toFixed(1)}%
                                </td>
                                <td className="py-4 px-4 text-cyan-400">
                                    {(data.rr / data.trades).toFixed(2)}
                                </td>
                                <td className={`py-4 px-4 font-bold ${data.profit > 0 ? "text-green-500" : "text-red-500"}`}>
                                    ${data.profit.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
