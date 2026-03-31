// components/IndexChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function IndexChart({ symbol, title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchChartData() {
    setLoading(true);
    setData([]); // 🔹 Reset old chart data
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chart?symbol=${encodeURIComponent(symbol)}`
      );
      const chartData = res.data?.chart?.result?.[0];
      if (!chartData) throw new Error("Invalid chart data");

      const timestamps = chartData.timestamp;
      const closes = chartData.indicators.quote[0].close;

      const points = timestamps.map((t, i) => ({
        date: new Date(t * 1000).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        value: closes[i],
      }));

      setData(points.filter((p) => p.value !== null));
    } catch (err) {
      console.error("Error parsing chart data:", err);
      setData([]); // 🔹 Ensure data is empty on error
    } finally {
      setLoading(false);
    }
  }

  if (symbol) fetchChartData();
}, [symbol]);


  if (loading) return <p className="text-center mt-5">Loading chart...</p>;

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        {title} 
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
