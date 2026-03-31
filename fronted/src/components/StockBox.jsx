import React from "react";
import { useNavigate } from "react-router-dom";
import MiniChart from "./MiniChart";

function generateRandomChartData(base, points = 12) {
  let arr = [];
  let val = Number(base) || 100;
  for (let i = 0; i < points; i++) {
    // Random walk: up/down by -2% to +2%
    val += val * (Math.random() * 0.04 - 0.02);
    arr.push({ price: Math.round(val * 100) / 100 });
  }
  return arr;
}

export default function StockBox({ item }) {
  const navigate = useNavigate();
  console.log("StockBox received item:", item.company);
  
  const symbol = item?.meta?.symbol || item?.ticker || item?.SYMBOL || item?.symbol || "-";
  // Safely get company name from multiple possible fields
  const company = item?.meta?.companyName || item?.companyName || item?.COMPANY || item?.COMPANY_NAME || item?.name || symbol;
  console.log("Rendering StockBox for", symbol, company, item);
  const price = item.lastPrice || item.last_price || item.LTP || item.last || item.price || item.lastTradedPrice || item.closePrice || 0;
  const percentRaw = item.pChange || item.percent_change || item.pchange || item.CHANGE || item.PERCENT || item.change_percent || 0;
  const percent = parseFloat(percentRaw) || 0;
  const volume = item.totalTradedVolume || item.totalTradedValue || item.tradedVolume || item.tradedQuantity || item.volume || item.VOLUME || item.VOL || "-";
  let changeAbs = item.change || item.CHANGE_ABS || item.price_change || item.CHG || item.netChange || item.basePriceChange || undefined;
  if (changeAbs === undefined || changeAbs === null) {
    const p = parseFloat(price) || 0;
    changeAbs = ((percent / 100) * p).toFixed(2);
  }
  // Use item.chartData if available, else fallback to sample
  const chartData = item.chartData || generateRandomChartData(price);

  return (
    <div
      onClick={() => navigate(`/stock/${item.symbol}`)}
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
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(2,6,23,0.12)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(2,6,23,0.06)" }}
    >
      <div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{item.company}</div>
        <div style={{ fontSize: "13px", color: "#475569", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{symbol}</div>
        <MiniChart data={chartData} color={percent >= 0 ? "#22c55e" : "#ef4444"} />
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>₹{price}</div>
        <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: "13px", color: percent >= 0 ? "#166534" : "#991b1b", fontWeight: 700 }}>
            {Number(changeAbs) >= 0 ? `+₹${Number(changeAbs)}` : `-₹${Math.abs(Number(changeAbs))}`}
          </div>
          <div style={{ fontSize: "13px", color: percent >= 0 ? "#166534" : "#991b1b", background: percent >= 0 ? "#bbf7d0" : "#fecaca", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
            {percent}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8, fontSize: "12px", color: "#64748b" }}>Vol: {volume}</div>
    </div>
  );
}
