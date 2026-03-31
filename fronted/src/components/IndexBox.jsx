import React from "react";
import MiniChart from "./MiniChart";

function generateRandomChartData(base, points = 12) {
  let arr = [];
  let val = Number(base) || 100;
  for (let i = 0; i < points; i++) {
    val += val * (Math.random() * 0.04 - 0.02);
    arr.push({ price: Math.round(val * 100) / 100 });
  }
  return arr;
}

export default function IndexBox({ item, onClick }) {
  // Use real index fields if available
  const value = item.lastPrice || item.price || Math.round(10000 + Math.random() * 5000);
  const percent = item.pChange !== undefined ? item.pChange : (item.percent !== undefined ? item.percent : (Math.random() * 4 - 2).toFixed(2));
  const change = item.change !== undefined ? item.change : Math.round(value * Number(percent) / 100);
  const open = item.open;
  const previousClose = item.previousClose;
  const dayHigh = item.dayHigh;
  const dayLow = item.dayLow;
  const yearHigh = item.yearHigh;
  const yearLow = item.yearLow;
  const chartData = item.chartData || generateRandomChartData(value);
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "12px",
        borderRadius: "12px",
        background: "linear-gradient(180deg,#ffffff,#f8fafc)",
        minHeight: "110px",
        cursor: "pointer",
        // Stronger and always visible shadow
        boxShadow: percent >= 0
          ? "0 0 0 4px #bbf7d0, 0 8px 32px 0 rgba(34,197,94,0.25)"
          : "0 0 0 4px #fecaca, 0 8px 32px 0 rgba(239,68,68,0.25)",
        transition: "transform 0.15s, box-shadow 0.15s",
        textAlign: "left",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        const shadowColor = percent >= 0 ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)";
        e.currentTarget.style.boxShadow = `0 10px 30px ${shadowColor}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        const shadowColor = percent >= 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)";
        e.currentTarget.style.boxShadow = `0 6px 18px ${shadowColor}`;
      }}
    >
      <div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{item.label || item.name || item.symbol}</div>
        <MiniChart data={chartData} color={percent >= 0 ? "#22c55e" : "#ef4444"} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>₹{value}</div>
        <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: "13px", color: percent >= 0 ? "#166534" : "#991b1b", fontWeight: 700 }}>
            {Number(percent) >= 0 ? `+₹${change}` : `-₹${Math.abs(change)}`}
          </div>
          <div style={{ fontSize: "13px", color: percent >= 0 ? "#166534" : "#991b1b", background: percent >= 0 ? "#bbf7d0" : "#fecaca", padding: "2px 8px", borderRadius: 6, fontWeight: 700, display: "inline-block" }}>
            {percent}%
          </div>
        </div>
        {/* Extra details for modal or expanded view */}
        {open !== undefined && (
          <div style={{ fontSize: "12px", color: "#334155", marginTop: 4 }}>
            Open: {open} | Close: {previousClose} | High: {dayHigh} | Low: {dayLow}
          </div>
        )}
      </div>
    </div>
  );
}
