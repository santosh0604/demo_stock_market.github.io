// // Screener.jsx
// import React, { useState } from "react";
// import axios from "axios";

// export default function DynamicScreener() {
//   const [filters, setFilters] = useState({
//     sector: "",
//     peMax: "",
//     marketCapMin: ""
//   });

//   const [stocks, setStocks] = useState([]);

//   const handleChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const runScreener = async () => {
//     const res = await axios.post(
//       "http://localhost:5000/screen/mmm",
//       filters
//     );
//     setStocks(res.data);
//   };

//   return (
//     <div>
//       <h2>Indian Stock Screener</h2>

//       <select name="sector" onChange={handleChange}>
//         <option value="">Select Sector</option>
//         <option value="IT">IT</option>
//         <option value="BANK">Banking</option>
//         <option value="PHARMA">Pharma</option>
//       </select>

//       <input
//         name="peMax"
//         placeholder="Max PE"
//         onChange={handleChange}
//       />

//       <input
//         name="marketCapMin"
//         placeholder="Min Market Cap"
//         onChange={handleChange}
//       />

//       <button onClick={runScreener}>Search</button>

//       <hr />

//      {Array.isArray(stocks) && stocks.map((s, i) => (
//   <div key={i}>
//     <h4>{s.symbol}</h4>
//     <p>PE: {s.pe}</p>
//   </div>
// ))}

//     </div>
//   );
// }




























import React, { useState } from "react";
import axios from "axios";

export default function DynamicScreener() {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const runAIScreener = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/ai-screener/mmm",
        { query }
      );
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      setStocks([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>AI Stock Screener (India)</h2>

      <input
        placeholder="e.g. banking stocks up 5% today"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "400px" }}
      />

      <button onClick={runAIScreener}>Scan</button>

      {loading && <p>Scanning market...</p>}

      {stocks.map((s, i) => (
        <div key={i}>
          <b>{s.symbol}</b> | ₹{s.price} | {s.changePercent}%
        </div>
      ))}
    </div>
  );
}
