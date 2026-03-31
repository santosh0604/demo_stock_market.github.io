










import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function IndexList() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [indexData, setIndexData] = useState({});

  const indices = [
    { key: "nifty50", label: "NIFTY 50" },
    { key: "sensex", label: "S&P BSE SENSEX" },
    // { key: "indiavix", label: "India VIX" },
     { key: "niftybank", label: "NIFTY BANK" },
    { key: "niftynext50", label: "NIFTY NEXT 50" },
    { key: "nifty100", label: "NIFTY 100" },
    { key: "nifty200", label: "NIFTY 200" },
    { key: "nifty500", label: "NIFTY 500" },
   
    { key: "niftysmallcap50", label: "NIFTY SMALLCAP 50" },
    { key: "niftymidcap50", label: "NIFTY MIDCAP 50" },
 
   
    { key: "niftyit", label: "NIFTY IT" },
    { key: "niftypharma", label: "NIFTY PHARMA" },
    { key: "niftyauto", label: "NIFTY AUTO" },
    { key: "niftymetal", label: "NIFTY METAL" },
    { key: "niftyenergy", label: "NIFTY ENERGY" },
    { key: "niftyrealty", label: "NIFTY REALTY" },
    { key: "niftypsubank", label: "NIFTY PSU BANK" },
    { key: "niftyprivatebank", label: "NIFTY PRIVATE BANK" },
    { key: "niftyfinancialservices", label: "NIFTY FINANCIAL SERVICES" },
   
    { key: "niftyfmcg", label: "NIFTY FMCG" },
    { key: "niftyinfrastructure", label: "NIFTY INFRASTRUCTURE" },
    { key: "niftyservices", label: "NIFTY SERVICES SECTOR" },
    { key: "niftymnc", label: "NIFTY MNC" },
    { key: "niftyconsumption", label: "NIFTY CONSUMPTION" },
    { key: "niftynoncyclical", label: "NIFTY NON-CYCLICAL CONSUMER" },
    { key: "niftygrowth15", label: "NIFTY GROWTH SECTORS 15" },
  
  ];

  const initialIndices = indices.slice(0, 4);
  const hiddenIndices = indices.slice(4);

  // Format Number
  const formatNum = (num) =>
    num?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "-";

  useEffect(() => {
    const fetchAll = async () => {
      const results = {};

      for (const idx of indices) {
        try {
          const res = await axios.get(`http://localhost:5000/${idx.key}`);
          results[idx.key] = res.data?.data?.[0] || null;
        } catch (err) {
          console.log("Failed:", idx.key);
          results[idx.key] = null;
        }
      }

      setIndexData(results);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 1000);
    return () => clearInterval(interval);
  }, []);

  // Index Card Component
  const IndexCard = ({ item }) => {
    const data = indexData[item.key];
    const percent = data?.pChange || 0;
    return (
      <div
        onClick={() => navigate(`/user/market-overview/index/${item.key}`)}
        style={{
          padding: "18px",
          borderRadius: "14px",
          background: "linear-gradient(180deg,#ffffff,#f8fafc)",
          cursor: "pointer",
          boxShadow:
            percent >= 0
              ? "0 0 0 4px #bbf7d0, 0 8px 32px 0 rgba(34,197,94,0.18)"
              : "0 0 0 4px #fecaca, 0 8px 32px 0 rgba(239,68,68,0.18)",
          transition: "transform 0.18s, box-shadow 0.18s",
          textAlign: "left",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.07) translateY(-4px)";
          e.currentTarget.style.boxShadow = percent >= 0
            ? "0 0 0 6px #bbf7d0, 0 12px 36px 0 rgba(34,197,94,0.25)"
            : "0 0 0 6px #fecaca, 0 12px 36px 0 rgba(239,68,68,0.25)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = percent >= 0
            ? "0 0 0 4px #bbf7d0, 0 8px 32px 0 rgba(34,197,94,0.18)"
            : "0 0 0 4px #fecaca, 0 8px 32px 0 rgba(239,68,68,0.18)";
        }}
      >
        <h4 style={{ margin: 0, marginBottom: "6px", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
          {item.label}
        </h4>
        {!data ? (
          <p style={{ color: "#999" }}>Loading...</p>
        ) : (
          <>
            <p style={{ margin: "4px 0", fontSize: "20px", fontWeight: 700, color: "#0369a1" }}>
              ₹{formatNum(data.lastPrice)}
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: percent >= 0 ? "#166534" : "#991b1b" }}>
                {data.change >= 0 ? "+" : "-"}₹{formatNum(Math.abs(data.change))}
              </span>
              <span style={{ fontSize: "15px", fontWeight: 700, color: percent >= 0 ? "#166534" : "#991b1b", background: percent >= 0 ? "#bbf7d0" : "#fecaca", padding: "2px 8px", borderRadius: 6, display: "inline-block" }}>
                {percent}%
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "18px",
          fontSize: "26px",
          fontWeight: 700,
          color: "#0f172a",
          textAlign: "left",
        }}
      >
        Market Index
      </h2>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
        }}
      >
        {initialIndices.map((item) => (
          <IndexCard key={item.key} item={item} />
        ))}

        {/* Show More Button */}
        {hiddenIndices.length > 0 && (
          <div
            onClick={() => setShowModal(true)}
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#ff6b6b",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "18px" }}>+ Show More</h4>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#f9f9f9",
              padding: "25px",
              borderRadius: "15px",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "70%",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: 700 }}>
              All Indices
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
              }}
            >
              {hiddenIndices.map((item) => (
                <IndexCard key={item.key} item={item} />
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "20px",
                padding: "10px 18px",
                background: "#2575fc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
