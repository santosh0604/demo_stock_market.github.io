import React, { useEffect, useState } from "react";
import axios from "axios";
import Sparkline from "../Sparkline";

export default function ETFsPage() {
  const [etfs, setEtfs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedETF, setSelectedETF] = useState(null);

  useEffect(() => {
    fetchETFs();
  }, []);

  const fetchETFs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/etfs/sant");
      const mixed = mixPosNeg(res.data.etfs); // MIXED POS+NEG
      setEtfs(res.data.etfs);
      setFiltered(mixed);
    } catch (err) {
      console.error(err);
    }
  };

  // MIX POSITIVE & NEGATIVE ALTERNATELY
  const mixPosNeg = (list) => {
    const pos = list.filter((x) => x.per >= 0);
    const neg = list.filter((x) => x.per < 0);
    const mixed = [];
    let i = 0;
    while (i < pos.length || i < neg.length) {
      if (i < pos.length) mixed.push(pos[i]);
      if (i < neg.length) mixed.push(neg[i]);
      i++;
    }
    return mixed;
  };

  // RANDOM SPARKLINE UNTIL REAL BACKEND AVAILABLE
  const makeSparkline = (base = 0) => {
    let arr = [];
    let v = base / 10;
    for (let i = 0; i < 30; i++) {
      v += (Math.random() - 0.5) * 0.2;
      arr.push(v);
    }
    return arr;
  };

  // Search & suggestions
  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setFiltered(mixPosNeg(etfs));
      return;
    }

    const sug = etfs
      .filter(
        (item) =>
          item.meta.companyName.toLowerCase().includes(value.toLowerCase()) ||
          item.symbol.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 8);

    setSuggestions(sug);

    const matched = etfs.filter(
      (item) =>
        item.meta.companyName.toLowerCase().includes(value.toLowerCase()) ||
        item.symbol.toLowerCase().includes(value.toLowerCase())
    );
    const unmatched = etfs.filter(
      (item) =>
        !item.meta.companyName.toLowerCase().includes(value.toLowerCase()) &&
        !item.symbol.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(mixPosNeg([...matched, ...unmatched]));
  };

  const selectSuggestion = (value) => {
    setSearch(value);
    setSuggestions([]);
    const matched = etfs.filter(
      (item) =>
        item.meta.companyName.toLowerCase().includes(value.toLowerCase()) ||
        item.symbol.toLowerCase().includes(value.toLowerCase())
    );
    const unmatched = etfs.filter(
      (item) =>
        !item.meta.companyName.toLowerCase().includes(value.toLowerCase()) &&
        !item.symbol.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(mixPosNeg([...matched, ...unmatched]));
  };

  // ================= Modal Component =================
 const DetailModal = ({ data, onClose }) => {
  if (!data) return null;

  // Transaction-style modal
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(37, 39, 38, 0.93)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1050,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 14,
        minWidth: 420,
        maxWidth: 850,
        width: "100%",
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
        border: 'none',
        padding: 0
      }}>
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">ETF Details</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="card mb-3" style={{ borderRadius: 12, border: '1px solid #eee', boxShadow: 'none' }}>
            <div className="card-body pb-2 pt-3 px-4">
              <div className="fw-bold" style={{ fontSize: 30, marginBottom: 8 }}>{data.meta.companyName}</div>
              <hr style={{ margin: '16px 0 12px 0', borderTop: '1px dashed #ddd' }} />
              <div className="row g-0 mb-2" style={{ fontSize: 20}}>
                <div className="col-6 mb-2"><b>Symbol:</b> {data.symbol}</div>
                <div className="col-6 mb-2"><b>Assets:</b> {data.assets}</div>
                <div className="col-6 mb-2"><b>Last Price:</b> {data.ltP}</div>
                <div className="col-6 mb-2"><b>Change:</b> <span style={{ color: data.per >= 0 ? "#00C853" : "#D50000" }}>{data.chn} ({data.per}%)</span></div>
                <div className="col-6 mb-2"><b>Open:</b> {data.open}</div>
                <div className="col-6 mb-2"><b>High:</b> {data.high}</div>
                <div className="col-6 mb-2"><b>Low:</b> {data.low}</div>
                <div className="col-6 mb-2"><b>Qty:</b> {data.qty}</div>
                <div className="col-6 mb-2"><b>Trade Value:</b> ₹{data.trdVal}</div>
                <div className="col-6 mb-2"><b>52W High:</b> {data.wkhi}</div>
                <div className="col-6 mb-2"><b>52W Low:</b> {data.wklo}</div>
                <div className="col-6 mb-2"><b>1 Month:</b> {data.perChange30d}%</div>
                <div className="col-6 mb-2"><b>1 Year:</b> {data.perChange365d}%</div>
                <div className="col-6 mb-2"><b>ISIN:</b> {data.meta.isin}</div>
                <div className="col-6 mb-2"><b>Listing Date:</b> {data.meta.listingDate}</div>
                <div className="col-6 mb-2"><b>Industry:</b> {data.meta.industry}</div>
              </div>
              <hr style={{ margin: '16px 0 12px 0', borderTop: '1px dashed #ddd' }} />
              {/* <div style={{ margin: '20px 0' }}>
                <h5 className="fw-semibold mb-2">Price Trend</h5>
                <Sparkline data={makeSparkline(data.per)} color={data.per >= 0 ? "#00C853" : "#D50000"} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable styles */
const sectionBox = {
  padding: "18px",
  border: "1px solid #ececec",
  borderRadius: 10,
  background: "#fafafa",
};

const boxTitle = {
  marginBottom: 10,
  fontWeight: 600,
  fontSize: 16,
};


  return (
    <div style={{ padding: "20px", background: "#f7f7f8", minHeight: "100vh" }}>
      <h2>All Indian and foreign company ETF'S</h2>

      {/* ================= SEARCH BAR ================= */}
      <div style={{ position: "relative", maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Search ETF..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        {suggestions.length > 0 && (
          <div style={{ position: "absolute", background: "#fff", border: "1px solid #ccc", marginTop: 4, width: "100%", borderRadius: 8, zIndex: 50 }}>
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => selectSuggestion(s.meta.companyName)}
                style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}
              >
                {s.meta.companyName} ({s.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= ETF CARDS ================= */}
      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
        {filtered.slice(0, visibleCount).map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedETF(item)}
            style={{
              background: "white",
              padding: 20,
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 14,
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <h3 style={{ fontSize: 18 }}>{item.meta.companyName}</h3>
              <p style={{ margin: "6px 0", color: item.per >= 0 ? "#00C853" : "#D50000" }}>
                <b>{item.chn}</b> ({item.per}%)
              </p>
            </div>
            <div style={{ height: 53, width: 84 }}>
              <Sparkline data={makeSparkline(item.per)} color={item.per >= 0 ? "#00C853" : "#D50000"} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div style={{ marginTop: 25, textAlign: "center" }}>
        {visibleCount < filtered.length && (
          <button onClick={() => setVisibleCount(visibleCount + 20)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#007bff", color: "#fff" }}>Show More</button>
        )}
        {visibleCount > 20 && (
          <button onClick={() => setVisibleCount(20)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", marginLeft: 10, background: "#6c757d", color: "#fff" }}>Show Less</button>
        )}
      </div>

      {/* ================= POPUP MODAL ================= */}
      {selectedETF && <DetailModal data={selectedETF} onClose={() => setSelectedETF(null)} />}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sparkline from "../Sparkline";

// export default function ETFsPage() {
//   const [etfs, setEtfs] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(20);
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [selectedETF, setSelectedETF] = useState(null);

//   useEffect(() => {
//     fetchETFs();
//   }, []);

//   const fetchETFs = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/etfs/sant");

//       const mixed = mixPosNeg(res.data.etfs); // MIXED POS+NEG

//       setEtfs(res.data.etfs);
//       setFiltered(mixed);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // MIX POSITIVE & NEGATIVE ALTERNATELY
//   const mixPosNeg = (list) => {
//     const pos = list.filter((x) => x.per >= 0);
//     const neg = list.filter((x) => x.per < 0);

//     const mixed = [];
//     let i = 0;

//     while (i < pos.length || i < neg.length) {
//       if (i < pos.length) mixed.push(pos[i]);
//       if (i < neg.length) mixed.push(neg[i]);
//       i++;
//     }

//     return mixed;
//   };

//   // RANDOM SPARKLINE UNTIL REAL BACKEND AVAILABLE
//   const makeSparkline = (base = 0) => {
//     let arr = [];
//     let v = base / 10;
//     for (let i = 0; i < 30; i++) {
//       v += (Math.random() - 0.5) * 0.2;
//       arr.push(v);
//     }
//     return arr;
//   };

//   const handleSearch = (value) => {
//     setSearch(value);

//     if (value.trim() === "") {
//       setSuggestions([]);
//       setFiltered(mixPosNeg(etfs)); // KEEP MIXED
//       return;
//     }

//     const sug = etfs
//       .filter(
//         (item) =>
//           item.meta.companyName.toLowerCase().includes(value.toLowerCase()) ||
//           item.symbol.toLowerCase().includes(value.toLowerCase())
//       )
//       .slice(0, 8);

//     setSuggestions(sug);

//     const matched = etfs.filter(
//       (item) =>
//         item.meta.companyName.toLowerCase().includes(value.toLowerCase()) ||
//         item.symbol.toLowerCase().includes(value.toLowerCase())
//     );

//     const unmatched = etfs.filter(
//       (item) =>
//         !item.meta.companyName.toLowerCase().includes(value.toLowerCase()) &&
//         !item.symbol.toLowerCase().includes(value.toLowerCase())
//     );

//     const combined = [...matched, ...unmatched];

//     setFiltered(mixPosNeg(combined)); // ALWAYS MIX
//   };

//   const selectSuggestion = (value) => {
//     setSearch(value);
//     setSuggestions([]);

//     const matched = etfs.filter(
//       (item) =>
//         item.meta.companyName.toLowerCase().includes(value.toLowerCase()) ||
//         item.symbol.toLowerCase().includes(value.toLowerCase())
//     );

//     const unmatched = etfs.filter(
//       (item) =>
//         !item.meta.companyName.toLowerCase().includes(value.toLowerCase()) &&
//         !item.symbol.toLowerCase().includes(value.toLowerCase())
//     );

//     setFiltered(mixPosNeg([...matched, ...unmatched]));
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f7f7f8", minHeight: "100vh" }}>
//       <h2>All Indian and foreign company ETF'S</h2>

//       {/* ================= SEARCH BAR ================= */}
//       <div style={{ position: "relative", maxWidth: 400 }}>
//         <input
//           type="text"
//           placeholder="Search ETF..."
//           value={search}
//           onChange={(e) => handleSearch(e.target.value)}
//           style={{
//             width: "100%",
//             padding: "10px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//           }}
//         />

//         {suggestions.length > 0 && (
//           <div
//             style={{
//               position: "absolute",
//               background: "#fff",
//               border: "1px solid #ccc",
//               marginTop: 4,
//               width: "100%",
//               borderRadius: 8,
//               zIndex: 50,
//             }}
//           >
//             {suggestions.map((s, i) => (
//               <div
//                 key={i}
//                 onClick={() => selectSuggestion(s.meta.companyName)}
//                 style={{
//                   padding: 10,
//                   cursor: "pointer",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 {s.meta.companyName} ({s.symbol})
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ================= ETF CARDS ================= */}
//       <div
//         style={{
//           marginTop: 20,
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//           gap: "18px",
//         }}
//       >
//         {filtered.slice(0, visibleCount).map((item, index) => (
//           <div
//             key={index}
//             onClick={() => setSelectedETF(item)}
//             style={{
//               background: "white",
//               padding: 20,
//               display: "flex",
//               justifyContent: "space-between",
//               borderRadius: 14,
//               cursor: "pointer",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//             }}
//           >
//             <div>
//               <h3 style={{ fontSize: 18 }}>{item.meta.companyName}</h3>
//               <p
//                 style={{
//                   margin: "6px 0",
//                   color: item.per >= 0 ? "#00C853" : "#D50000",
//                 }}
//               >
//                 <b>{item.chn}</b> ({item.per}%)
//               </p>
//             </div>

//             <div style={{ height: 53, width: 84 }}>
//               <Sparkline
//                 data={makeSparkline(item.per)}
//                 color={item.per >= 0 ? "#00C853" : "#D50000"}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= PAGINATION ================= */}
//       <div style={{ marginTop: 25, textAlign: "center" }}>
//         {visibleCount < filtered.length && (
//           <button
//             onClick={() => setVisibleCount(visibleCount + 20)}
//             style={{
//               padding: "10px 20px",
//               borderRadius: 8,
//               border: "none",
//               background: "#007bff",
//               color: "#fff",
//             }}
//           >
//             Show More
//           </button>
//         )}

//         {visibleCount > 20 && (
//           <button
//             onClick={() => setVisibleCount(20)}
//             style={{
//               padding: "10px 20px",
//               borderRadius: 8,
//               border: "none",
//               marginLeft: 10,
//               background: "#6c757d",
//               color: "#fff",
//             }}
//           >
//             Show Less
//           </button>
//         )}
//       </div>

//       {/* ================= POPUP MODAL ================= */}
//       {selectedETF && (
//         <div
//           onClick={() => setSelectedETF(null)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.6)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 200,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "90%",
//               maxWidth: 600,
//               background: "#fff",
//               padding: 25,
//               borderRadius: 12,
//               maxHeight: "90vh",
//               overflowY: "auto",
//             }}
//           >
//             <h2>{selectedETF.meta.companyName}</h2>

//             <p>
//               <b>Symbol:</b> {selectedETF.symbol}
//             </p>
//             <p>
//               <b>Assets:</b> {selectedETF.assets}
//             </p>
//             <p>
//               <b>Last Price:</b> {selectedETF.ltP}
//             </p>

//             <p>
//               <b>Change:</b>{" "}
//               <span style={{ color: selectedETF.per >= 0 ? "#00C853" : "#D50000" }}>
//                 {selectedETF.chn} ({selectedETF.per}%)
//               </span>
//             </p>

//             <h3 style={{ marginTop: 20 }}>Chart</h3>
//             <Sparkline
//               data={makeSparkline(selectedETF.per)}
//               color={selectedETF.per >= 0 ? "#00C853" : "#D50000"}
//             />

//             <h3 style={{ marginTop: 20 }}>Trading Info</h3>
//             <p>Open: {selectedETF.open}</p>
//             <p>High: {selectedETF.high}</p>
//             <p>Low: {selectedETF.low}</p>
//             <p>Qty: {selectedETF.qty}</p>
//             <p>Trade Value: ₹{selectedETF.trdVal}</p>

//             <h3 style={{ marginTop: 20 }}>52 Week</h3>
//             <p>High: {selectedETF.wkhi}</p>
//             <p>Low: {selectedETF.wklo}</p>

//             <h3 style={{ marginTop: 20 }}>Performance</h3>
//             <p>1 Month: {selectedETF.perChange30d}%</p>
//             <p>1 Year: {selectedETF.perChange365d}%</p>

//             <h3 style={{ marginTop: 20 }}>Meta</h3>
//             <p>ISIN: {selectedETF.meta.isin}</p>
//             <p>Listing Date: {selectedETF.meta.listingDate}</p>
//             <p>Industry: {selectedETF.meta.industry}</p>

//             <button
//               onClick={() => setSelectedETF(null)}
//               style={{
//                 marginTop: 20,
//                 padding: "10px 20px",
//                 background: "#dc3545",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
