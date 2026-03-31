import React, { useState } from "react";
import axios from "axios";

export default function CompanyToSymbol() {
  const [companyName, setCompanyName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);

  const API_BASE = "http://localhost:5000";

  // Convert company name to symbol
  const handleConvert = async () => {
    setLoading(true);
    setError("");
    setSymbol("");
    setDetails(null);
    try {
      // Example: call your backend endpoint to get symbol from company name
      const res = await axios.get(`${API_BASE}/find-symbol?company=${encodeURIComponent(companyName)}`);
      if (res.data && res.data.symbol) {
        setSymbol(res.data.symbol);
      } else {
        setError("Symbol not found for this company name.");
      }
    } catch (err) {
      setError("Error fetching symbol.");
    }
    setLoading(false);
  };

  // Fetch details using symbol (NSE or other API)
  const handleFetchDetails = async () => {
    if (!symbol) return;
    setLoading(true);
    setError("");
    setDetails(null);
    try {
      // Example: call your backend to get details for the symbol
      const res = await axios.get(`${API_BASE}/nse-details?symbol=${symbol}`);
      setDetails(res.data);
      console.log("Fetched NSE Details", res.data);
    } catch (err) {
      setError("Error fetching details for symbol.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h2>Company Name to Symbol</h2>
      <input
        type="text"
        value={companyName}
        onChange={e => setCompanyName(e.target.value)}
        placeholder="Enter company name"
        style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <button onClick={handleConvert} disabled={loading || !companyName} style={{ padding: "8px 18px", borderRadius: 6, background: "#0369a1", color: "white", border: "none", fontWeight: 600 }}>
        {loading ? "Converting..." : "Find Symbol"}
      </button>
      {error && <div style={{ color: "#ef4444", marginTop: 10 }}>{error}</div>}
      {symbol && (
        <div style={{ marginTop: 18 }}>
          <strong>Symbol:</strong> {symbol}
          <button onClick={handleFetchDetails} style={{ marginLeft: 16, padding: "6px 14px", borderRadius: 6, background: "#059669", color: "white", border: "none" }}>
            Get NSE Details
          </button>
        </div>
      )}
      {details && (
        <div style={{ marginTop: 18, background: "#f0f9ff", padding: 12, borderRadius: 8 }}>
          <pre style={{ fontSize: 14 }}>{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
