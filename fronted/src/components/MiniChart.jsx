import React from "react";
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from "recharts";

export default function MiniChart({ data, color = "#0369a1" }) {
  if (!Array.isArray(data) || data.length < 2) return null;
  // Find min price for baseline
  const minPrice = Math.min(...data.map(d => d.price));
  return (
    <div style={{ width: "100%", height: 38, marginTop: 6 }}>
      <ResponsiveContainer width="100%" height={38}>
        <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2.5} dot={false} isAnimationActive={false} strokeLinecap="round" />
          <ReferenceLine y={minPrice} stroke="#d1d5db" strokeDasharray="4 2" strokeWidth={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
