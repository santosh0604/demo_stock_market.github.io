import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";

export default function Landing() {
  const navigate = useNavigate();

  // Ensure Bootstrap is loaded for consistent styling
  useEffect(() => {
    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapCSS);
    return () => document.head.removeChild(bootstrapCSS);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(120deg, #e0f7fa 0%, #f7fafd 100%)", // updated to match login bg
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Navbar */}
      <nav style={{
        width: "100%",
        background: "linear-gradient(90deg, #fff 60%, #e0f7fa 100%)", // updated to match login card bg
        boxShadow: "0 4px 24px 0 rgba(30,64,175,0.10)",
        padding: "0.7rem 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        minHeight: 68,
        borderRadius: "0 0 22px 22px",
        marginBottom: 8,
        transition: 'box-shadow 0.18s',
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 32, cursor: 'pointer', transition: 'transform 0.18s' }}
        >
          <FaChartLine style={{ color: "#1E40AF", fontSize: 34, filter: 'drop-shadow(0 2px 8px #1e40af22)' }} />
          <span style={{ fontWeight: 900, fontSize: 27, color: "#1E40AF", letterSpacing: 1, textShadow: '0 2px 8px #1e40af22' }}>StockMarket</span>
          <span style={{ fontWeight: 900, fontSize: 27, color: "#22223b", letterSpacing: 1, textShadow: '0 2px 8px #22223b11' }}>Pro</span>
        </div>
        <div style={{ display: "flex", gap: 16, marginRight: 32 }}>
          <button
            className="btn btn-success"
            style={{ fontWeight: 700, fontSize: 17, borderRadius: 24, minWidth: 100, boxShadow: '0 2px 8px #1e40af22', background: 'linear-gradient(135deg, #1de9b6 0%, #1dc8e9 100%)', color: '#fff', border: 'none' }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="btn btn-outline-primary"
            style={{ fontWeight: 700, fontSize: 17, borderRadius: 24, minWidth: 100, borderWidth: 2, color: '#1E40AF', background: '#fff' }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </nav>
      {/* Hero Section */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px 0 16px",
      }}>
        <div style={{
          background: "#fff", // updated to pure white card like login
          borderRadius: 32,
          boxShadow: "0 8px 32px rgba(30,64,175,0.10)",
          padding: "48px 32px 32px 32px",
          maxWidth: 700,
          width: "100%",
          textAlign: "center",
        }}>
          <h1 style={{
            color: "#1E40AF",
            fontWeight: 900,
            fontSize: 54,
            marginBottom: 18,
            letterSpacing: 1.2,
            lineHeight: 1.13,
            textShadow: '0 2px 12px #1e40af22',
          }}>
            Grow Your Knowledge
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: 28,
            marginBottom: 0,
            fontWeight: 600,
            letterSpacing: 0.5,
            lineHeight: 1.3,
          }}>
            Invest, trade, and learn with the most user-friendly Demo stock market platform.
          </p>
        </div>
      </div>
      {/* Features Section */}
      <div style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 16px 48px 16px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 32,
      }}>
        <FeatureCard
          icon="📈"
          accent="#1E40AF"
          title="Live Stock Tracking"
          desc="Monitor real-time prices, top gainers/losers, and market trends."
        />
        <FeatureCard
          icon="📰"
          accent="#0ea5e9"
          title="Market News"
          desc="Stay updated with the latest financial and economic news."
        />
        <FeatureCard
          icon="💡"
          accent="#43e97b"
          title="Demo Trading"
          desc="Practice trading with virtual money and learn risk-free."
        />
        <FeatureCard
          icon="💰"
          accent="#1de9b6"
          title="Mutual Funds"
          desc="Explore top mutual funds with ease."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, accent = "#1E40AF" }) {
  return (
    <div
      style={{
        background: "#fff", // white card like login
        borderRadius: 18,
        boxShadow: `0 2px 12px ${accent}22` ,
        padding: "28px 22px 22px 22px",
        minWidth: 220,
        maxWidth: 260,
        flex: "1 1 220px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        border: `2.5px solid ${accent}22`,
        transition: 'transform 0.18s, box-shadow 0.18s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-7px) scale(1.045)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${accent}33`;
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = `0 2px 12px ${accent}22`;
        e.currentTarget.style.borderColor = `${accent}22`;
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 10, color: accent }}>{icon}</div>
      <div style={{ fontWeight: 800, color: accent, fontSize: 19, marginBottom: 6 }}>{title}</div>
      <div style={{ color: "#64748b", fontSize: 15 }}>{desc}</div>
    </div>
  );
}
