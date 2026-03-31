// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import IndexChart from "../components/IndexChart"; // Import your chart component
// import Footer from "../components/Footer";
// export default function IndexDetail() {
//   const { symbol } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Map internal key to NSE index name
//   const INDEX_MAP = {
//     nifty50: "NIFTY 50",
//     sensex: "S&P BSE SENSEX",
//     indiavix: "India VIX",
//     niftynext50: "NIFTY NEXT 50",
//     nifty100: "NIFTY 100",
//     nifty200: "NIFTY 200",
//     nifty500: "NIFTY 500",
//     bse100: "BSE 100",
//     niftysmallcap50: "NIFTY SMALLCAP 50",
//     niftymidcap50: "NIFTY MIDCAP 50",
//     niftymidcap100: "NIFTY MIDCAP 100",
//     niftysmallcap100: "NIFTY SMALLCAP 100",
//     niftysmallcap250: "NIFTY SMALLCAP 250",
//     bsesmallcap: "BSE SMALLCAP",
//     niftybank: "NIFTY BANK",
//     niftyit: "NIFTY IT",
//     niftypharma: "NIFTY PHARMA",
//     niftyauto: "NIFTY AUTO",
//     niftymetal: "NIFTY METAL",
//     niftyenergy: "NIFTY ENERGY",
//     niftyrealty: "NIFTY REALTY",
//     niftypsubank: "NIFTY PSU BANK",
//     niftyprivatebank: "NIFTY PRIVATE BANK",
//     niftyfinancialservices: "NIFTY FINANCIAL SERVICES",
//     finnifty: "NIFTY FINNIFTY",
//     niftyfmcg: "NIFTY FMCG",
//     niftyinfrastructure: "NIFTY INFRASTRUCTURE",
//     niftyservices: "NIFTY SERVICES SECTOR",
//     niftymnc: "NIFTY MNC",
//     niftyconsumption: "NIFTY CONSUMPTION",
//     niftynoncyclical: "NIFTY NON-CYCLICAL CONSUMER",
//     niftygrowth15: "NIFTY GROWTH SECTORS 15",
//     bseipo: "BSE IPO",
//   };

//   // Map internal key to Yahoo Finance symbols
//  const YAHOO_SYMBOL_MAP = {
//   nifty50: "^NSEI",  // mila
//   sensex: "^BSESN",
//   indiavix: "^INDIAVIX",
//   niftybank: "^NSEBANK",      // mila
//   finnifty: "^FINNIFTY",
//   niftyit: "^CNXIT", // might be CNX IT or use Yahoo sector ETF    // mila
//   niftyauto: "^CNXAUTO",
//   niftypharma: "^CNXPHARMA",
//   niftymetal: "^CNXMETAL",
//   niftyenergy: "^CNXENERGY",
//   niftyrealty: "^CNXREALTY",
//   niftypsubank: "^CNXPSUBANK",
//   niftyprivatebank: "^CNXPRIVBANK",
//   niftyfinancialservices: "^CNXFINSERV",
//   niftyfmcg: "^CNXFMCG",
//   niftyinfrastructure: "^CNXINFRA",
//   niftyservices: "^CNXSERVICES",
//   niftymnc: "^CNXMNC",
//   niftyconsumption: "^CNXCONSUMPTION",
//   niftynoncyclical: "^CNXNONCYCLICAL",
//   niftygrowth15: "^CNXGROWTH15",
// };


//   const indexName = INDEX_MAP[symbol.toLowerCase()] || symbol;
//   const yahooSymbol = YAHOO_SYMBOL_MAP[symbol.toLowerCase()] || symbol;

//   // Fetch NSE index data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/${symbol}`);
//         setData(res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch index data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [symbol]);

//   if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
//   if (!data) return <p style={{ textAlign: "center" }}>No data found</p>;

//   return (
//     <div
//       style={{
//         maxWidth: "1000px",
//         margin: "40px auto",
//         padding: "20px",
//         borderRadius: "15px",
//         background: "#f9f9f9",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       }}
//     >
//       <button
//         onClick={() => navigate("/market-overview")}
//         style={{
//           background: "#007bff",
//           color: "white",
//           border: "none",
//           padding: "8px 16px",
//           borderRadius: "8px",
//           marginBottom: "20px",
//           cursor: "pointer",
//         }}
//       >
//         ← Back
//       </button>

//       <h2 style={{ marginBottom: "10px" }}>{data.name}</h2>
//       <h4>Price: {data.data[0].lastPrice}</h4>
//       <h4>Percent Change: {data.data[0].pChange}%</h4>
//       <h4>Amount Change: {data.data[0].change}</h4>
//       <p style={{ marginBottom: "20px" }}>
//         <strong>Last Updated:</strong> {data.timestamp}
//       </p>

//       {/* Price Summary */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
//           gap: "15px",
//           marginBottom: "30px",
//         }}
//       >
//         {data.data?.length > 0 &&
//           data.data.slice(0, 1).map((item) => (
//             <>
//               <div style={cardStyle}><strong>Open</strong><p>{item.open}</p></div>
//               <div style={cardStyle}><strong>Close</strong><p>{item.previousClose}</p></div>
//               <div style={cardStyle}><strong>Today High</strong><p>{item.dayHigh}</p></div>
//               <div style={cardStyle}><strong>Today Low</strong><p>{item.dayLow}</p></div>
//               <div style={cardStyle}><strong>52W High</strong><p>{item.yearHigh}</p></div>
//               <div style={cardStyle}><strong>52W Low</strong><p>{item.yearLow}</p></div>
//             </>
//           ))}
//       </div>

//       {/* Chart */}
//       <IndexChart symbol={yahooSymbol} title={indexName} />

//       {/* Components Table */}
//       <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "10px", overflow: "hidden" }}>
//         <thead style={{ background: "#007bff", color: "#fff" }}>
//           <tr>
//             <th style={{ padding: "10px" }}>Company</th>
//             <th>LTP</th>
//             <th>Change</th>
//             <th>% Change</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.data?.map((item) => (
//             <tr key={item.symbol} style={{ borderBottom: "1px solid #ddd", color: item.pChange >= 0 ? "green" : "red" }}>
//               <td style={{ padding: "10px" }}>{item.symbol}</td>
//               <td>{item.lastPrice}</td>
//               <td>{item.change}</td>
//               <td>{item.pChange}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <Footer/>
//     </div>
//   );
// }

// // Reusable card style
// const cardStyle = {
//   padding: "12px",
//   borderRadius: "10px",
//   background: "white",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   textAlign: "center",
// };



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import IndexChart from "../components/IndexChart";
// import Footer from "../components/Footer";
// import Navbar2 from "./Navbar2";
// import Logo from "../assets/GIDXNIFTY.webp";

// export default function IndexDetail() {
//   const { symbol } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showAll, setShowAll] = useState(false);
//   const navigate = useNavigate();

//   const INDEX_MAP = {
//     nifty50: "NIFTY 50",
//     sensex: "S&P BSE SENSEX",
//     indiavix: "India VIX",
//     niftynext50: "NIFTY NEXT 50",
//     nifty100: "NIFTY 100",
//     nifty200: "NIFTY 200",
//     nifty500: "NIFTY 500",
//     bse100: "BSE 100",
//     niftysmallcap50: "NIFTY SMALLCAP 50",
//     niftymidcap50: "NIFTY MIDCAP 50",
//     bsesmallcap: "BSE SMALLCAP",
//     niftybank: "NIFTY BANK",
//     niftyit: "NIFTY IT",
//     niftypharma: "NIFTY PHARMA",
//     niftyauto: "NIFTY AUTO",
//     niftymetal: "NIFTY METAL",
//     niftyenergy: "NIFTY ENERGY",
//     niftyrealty: "NIFTY REALTY",
//     niftypsubank: "NIFTY PSU BANK",
//     niftyprivatebank: "NIFTY PRIVATE BANK",
//     niftyfinancialservices: "NIFTY FINANCIAL SERVICES",
//     finnifty: "NIFTY FINNIFTY",
//     niftyfmcg: "NIFTY FMCG",
//     niftyinfrastructure: "NIFTY INFRASTRUCTURE",
//     niftyservices: "NIFTY SERVICES SECTOR",
//     niftymnc: "NIFTY MNC",
//     niftyconsumption: "NIFTY CONSUMPTION",
//     niftynoncyclical: "NIFTY NON-CYCLICAL CONSUMER",
//     niftygrowth15: "NIFTY GROWTH SECTORS 15",
//     bseipo: "BSE IPO",
//   };

//   const YAHOO_SYMBOL_MAP = {
//     nifty50: "^NSEI",
//     sensex: "^BSESN",
//     nifty100:"^CNX100",
//      nifty200: "^CNX200",
//     nifty500: "^CRSLDX",
//     niftysmallcap50: "^CNXSC",
//     niftymidcap50: "^NSEMDCP50",
//      niftynext50: "^NSMIDCP",
//       niftyprivatebank: "NIFTYPVTBANK.NS",

//     indiavix: "^INDIAVIX",
//     niftybank: "^NSEBANK",
//     finnifty: "^FINNIFTY",
//     niftyit: "^CNXIT",
//     niftyauto: "^CNXAUTO",
//     niftypharma: "^CNXPHARMA",
//     niftymetal: "^CNXMETAL",
//     niftyenergy: "^CNXENERGY",
//     niftyrealty: "^CNXREALTY",
//     niftypsubank: "^CNXPSUBANK",
//     // niftyprivatebank: "^CNXPRIVBANK",
//     niftyfinancialservices: "^CNXFINSERV",
//     niftyfmcg: "^CNXFMCG",
//     niftyinfrastructure: "^CNXINFRA",
//     niftyservices: "^CNXSERVICES",
//     niftymnc: "^CNXMNC",
//     niftyconsumption: "NIFTYCONSUMPTION.NS",
//     niftynoncyclical: "^CNXNONCYCLICAL",
//     niftygrowth15: "^CNXGROWTH15",
//   };

//   const indexName = INDEX_MAP[symbol.toLowerCase()] || symbol;
//   const yahooSymbol = YAHOO_SYMBOL_MAP[symbol.toLowerCase()] || symbol;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/${symbol}`);
//         setData(res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch index data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [symbol]);

//   if (loading)
//     return (
//       <h2 style={{ textAlign: "center", marginTop: "50px", color: "#007bff" }}>
//         Loading...
//       </h2>
//     );

//   if (!data)
//     return <p style={{ textAlign: "center", marginTop: "40px" }}>No data found</p>;

//   const item = data.data[0];
//   const dayPercent = ((item.lastPrice - item.dayLow) / (item.dayHigh - item.dayLow)) * 100;
//   const weekPercent = ((item.lastPrice - item.yearLow) / (item.yearHigh - item.yearLow)) * 100;
//   const dayMin = item.dayLow;
//   const dayMax = item.dayHigh;
//   const weekMin = item.yearLow;
//   const weekMax = item.yearHigh;

//   const formatNum = (num) =>
//     num.toLocaleString("en-IN", { maximumFractionDigits: 2 });

//   const PriceMarker = ({ percent }) => (
//     <div
//       className="position-absolute top-50 translate-middle-y"
//       style={{
//         left: `${percent}%`,
//         transform: "translate(-50%, -50%)",
//         width: 0,
//         height: 0,
//         borderLeft: "8px solid transparent",
//         borderRight: "8px solid transparent",
//         borderBottom: "12px solid #ff5722",
//       }}
//     ></div>
//   );

//   return (
//     <div style={{ width: "100%", margin: "0px auto" }}>
//       <Navbar2 />

//       <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 10px" }}>
//         {/* Header Section */}
//         <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
//           <div>
//           <img src={Logo} alt="Logo" width={120} />
//           <h2 className="text-primary fw-bold">{data.name}</h2>
// </div>
//           <button
//             onClick={() => navigate("/user/market-overview")}
//             className="btn"
//             style={{
//               background: "#ff5722",
//               color: "white",
//               borderRadius: "10px",
//               padding: "10px 20px",
//               fontWeight: 600,
//               boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
//             }}
//           >
//             ← Back
//           </button>
//         </div>

//         {/* Price Section */}
//         <div
//           className="mb-4 d-flex align-items-center gap-3"
//           style={{ fontSize: "1.6rem" }}
//         >
//           <span className="fw-bold text-dark">₹{formatNum(item.lastPrice)}</span>
//           <span
//             style={{
//               color: item.change >= 0 ? "green" : "red",
//               fontWeight: 500,
//               fontSize: "1.1rem",
//             }}
//           >
//             ₹{formatNum(item.change)} ({formatNum(item.pChange)}%)
//           </span>
//         </div>

//         {/* Chart Card */}
//         <div
//           className="mb-5"
//           style={{
//             boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
//             borderRadius: "14px",
//             overflow: "hidden",
//             background: "white",
//             padding: "10px",
//           }}
//         >
//           <IndexChart symbol={yahooSymbol} title={indexName} />
//         </div>

//         {/* Performance Section */}
//         <div className="d-flex flex-column gap-4 mb-5">
//           {[
//             { title: "🌤️ Day Performance", percent: dayPercent, min: dayMin, max: dayMax },
//             { title: "📅 52-Week Performance", percent: weekPercent, min: weekMin, max: weekMax },
//           ].map((perf) => (
//             <div
//               key={perf.title}
//               className="shadow-sm p-4 rounded-4 bg-white"
//               style={{ border: "1px solid #eee" }}
//             >
//               <h5 className="fw-semibold text-secondary mb-3">{perf.title}</h5>

//               <div className="position-relative mb-3" style={{ height: "12px" }}>
//                 <div
//                   className="bg-light position-absolute top-50 start-0 translate-middle-y rounded-pill"
//                   style={{ width: "100%", height: "6px" }}
//                 ></div>
//                 <PriceMarker percent={perf.percent} />
//               </div>

//               <div className="d-flex justify-content-between small text-muted">
//                 <span>₹{formatNum(perf.min)}</span>
//                 <span>₹{formatNum(perf.max)}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Components Table */}
//         <div
//           style={{
//             overflowX: "auto",
//             borderRadius: "16px",
//             background: "white",
//             boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//             padding: "0px",
//           }}
//         >
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead
//               style={{
//                 background: "linear-gradient(to right, #005bea, #00c6fb)",
//                 color: "#fff",
//                 fontWeight: "700",
//               }}
//             >
//               <tr>
//                 <th style={{ padding: "12px", textAlign: "left" }}>#</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Company</th>
//                 <th>LTP</th>
//                 <th>Change</th>
//                 <th>% Change</th>
//               </tr>
//             </thead>

//             <tbody>
//               {(showAll ? data.data : data.data.slice(0, 10)).map(
//                 (item, index) => (
//                   <tr
//                     key={item.symbol}
//                     style={{
//                       borderBottom: "1px solid #e0e0e0",
//                       transition: "0.25s",
//                       cursor: "pointer",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = "#eef4ff";
//                       e.currentTarget.style.transform = "scale(1.01)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "white";
//                       e.currentTarget.style.transform = "scale(1)";
//                     }}
//                   >
//                     {/* Start from index 1 */}
//                     <td style={{ padding: "12px", fontWeight: 600, color: "#555" }}>
//                       {index + 1}
//                     </td>

//                     <td style={{ padding: "12px", fontWeight: 600 }}>
//                       {item.symbol}
//                     </td>

//                     <td style={{ fontWeight: 500 }}>
//                       ₹{formatNum(item.lastPrice)}
//                     </td>

//                     <td
//                       style={{
//                         fontWeight: 500,
//                         color: item.change >= 0 ? "green" : "red",
//                       }}
//                     >
//                       ₹{formatNum(item.change)}
//                     </td>

//                     <td
//                       style={{
//                         fontWeight: 500,
//                         color: item.pChange >= 0 ? "green" : "red",
//                       }}
//                     >
//                       {formatNum(item.pChange)}%
//                     </td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Show More button */}
//         <div className="text-center mt-4 mb-5">
//           <button
//             className="btn btn-outline-primary"
//             onClick={() => setShowAll(!showAll)}
//           >
//             {showAll ? "Show Less" : "Show More"}
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </div>
// }










import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import IndexChart from "../components/IndexChart";
import Footer from "../components/Footer";
import Navbar2 from "./Navbar2";
import Logo from "../assets/GIDXNIFTY.webp";

export default function IndexDetail() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const INDEX_MAP = {
    nifty50: "NIFTY 50",
    sensex: "S&P BSE SENSEX",
    indiavix: "India VIX",
    niftynext50: "NIFTY NEXT 50",
    nifty100: "NIFTY 100",
    nifty200: "NIFTY 200",
    nifty500: "NIFTY 500",
    bse100: "BSE 100",
    niftysmallcap50: "NIFTY SMALLCAP 50",
    niftymidcap50: "NIFTY MIDCAP 50",
    bsesmallcap: "BSE SMALLCAP",
    niftybank: "NIFTY BANK",
    niftyit: "NIFTY IT",
    niftypharma: "NIFTY PHARMA",
    niftyauto: "NIFTY AUTO",
    niftymetal: "NIFTY METAL",
    niftyenergy: "NIFTY ENERGY",
    niftyrealty: "NIFTY REALTY",
    niftypsubank: "NIFTY PSU BANK",
    niftyprivatebank: "NIFTY PRIVATE BANK",
    niftyfinancialservices: "NIFTY FINANCIAL SERVICES",
    finnifty: "NIFTY FINNIFTY",
    niftyfmcg: "NIFTY FMCG",
    niftyinfrastructure: "NIFTY INFRASTRUCTURE",
    niftyservices: "NIFTY SERVICES SECTOR",
    niftymnc: "NIFTY MNC",
    niftyconsumption: "NIFTY CONSUMPTION",
    niftynoncyclical: "NIFTY NON-CYCLICAL CONSUMER",
    niftygrowth15: "NIFTY GROWTH SECTORS 15",
    bseipo: "BSE IPO",
  };

  const YAHOO_SYMBOL_MAP = {
    nifty50: "^NSEI",
    sensex: "^BSESN",
    nifty100:"^CNX100",
    nifty200: "^CNX200",
    nifty500: "^CRSLDX",
    niftysmallcap50: "^CNXSC",
    niftymidcap50: "^NSEMDCP50",
    niftynext50: "^NSMIDCP",
    niftyprivatebank: "NIFTYPVTBANK.NS",
    indiavix: "^INDIAVIX",
    niftybank: "^NSEBANK",
    finnifty: "^FINNIFTY",
    niftyit: "^CNXIT",
    niftyauto: "^CNXAUTO",
    niftypharma: "^CNXPHARMA",
    niftymetal: "^CNXMETAL",
    niftyenergy: "^CNXENERGY",
    niftyrealty: "^CNXREALTY",
    niftypsubank: "^CNXPSUBANK",
    niftyfinancialservices: "^CNXFINSERV",
    niftyfmcg: "^CNXFMCG",
    niftyinfrastructure: "^CNXINFRA",
    niftyservices: "^CNXSERVICES",
    niftymnc: "^CNXMNC",
    niftyconsumption: "NIFTYCONSUMPTION.NS",
    niftynoncyclical: "^CNXNONCYCLICAL",
    niftygrowth15: "^CNXGROWTH15",
  };

  const indexName = INDEX_MAP[symbol.toLowerCase()] || symbol;
  const yahooSymbol = YAHOO_SYMBOL_MAP[symbol.toLowerCase()] || symbol;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://demo-stock-market-backend.onrender.com/${symbol}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch index data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#007bff" }}>
        Loading...
      </h2>
    );

  if (!data || !data.data || data.data.length === 0)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>No data found</p>;

  const item = data.data[0];

  const dayPercent = ((item.lastPrice - item.dayLow) / (item.dayHigh - item.dayLow)) * 100;
  const weekPercent = ((item.lastPrice - item.yearLow) / (item.yearHigh - item.yearLow)) * 100;
  const dayMin = item.dayLow;
  const dayMax = item.dayHigh;
  const weekMin = item.yearLow;
  const weekMax = item.yearHigh;

  const formatNum = (num) =>
    num?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "-";

  const PriceMarker = ({ percent }) => (
    <div
      className="position-absolute top-50 translate-middle-y"
      style={{
        left: `${percent}%`,
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderBottom: "12px solid #ff5722",
      }}
    ></div>
  );

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Navbar2 />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 12px" }}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <div style={{ flex: 1 }}>
            <img src={Logo} alt="Logo" width={80} className="d-none d-sm-block" />
            <img src={Logo} alt="Logo" width={60} className="d-block d-sm-none" />
            <h2 className="text-primary fw-bold" style={{ fontSize: '1.25rem' }}>{data.name || indexName}</h2>
          </div>
          <button
            onClick={() => navigate("/user/market-overview")}
            className="btn flex-shrink-0 ms-2"
            style={{
              background: "#ff5722",
              color: "white",
              borderRadius: "8px",
              padding: "8px 14px",
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            ← Back
          </button>
        </div>

        {/* Price Section */}
        <div className="mb-3 d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: "1.25rem" }}>
          <span className="fw-bold text-dark">₹{formatNum(item.lastPrice)}</span>
          <span
            style={{
              color: item.change >= 0 ? "green" : "red",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            ₹{formatNum(item.change)} ({formatNum(item.pChange)}%)
          </span>
        </div>

        {/* Chart Card */}
        <div
          className="mb-4"
          style={{
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            background: "white",
            padding: "8px",
          }}
        >
          <IndexChart symbol={yahooSymbol} title={indexName} />
        </div>

        {/* Performance Section */}
        <div className="d-flex flex-column gap-3 mb-4">
          {[
            { title: "🌤️ Day Performance", percent: dayPercent, min: dayMin, max: dayMax },
            { title: "📅 52-Week Performance", percent: weekPercent, min: weekMin, max: weekMax },
          ].map((perf) => (
            <div
              key={perf.title}
              className="shadow-sm p-3 rounded-4 bg-white"
              style={{ border: "1px solid #eee" }}
            >
              <h5 className="fw-semibold text-secondary mb-3" style={{ fontSize: '0.95rem' }}>{perf.title}</h5>

              <div className="position-relative mb-2" style={{ height: "10px" }}>
                <div
                  className="bg-light position-absolute top-50 start-0 translate-middle-y rounded-pill"
                  style={{ width: "100%", height: "4px" }}
                ></div>
                <PriceMarker percent={perf.percent} />
              </div>

              <div className="d-flex justify-content-between small text-muted" style={{ fontSize: '0.75rem' }}>
                <span>₹{formatNum(perf.min)}</span>
                <span>₹{formatNum(perf.max)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Components Table */}
        <div
          style={{
            overflowX: "auto",
            borderRadius: "12px",
            background: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            padding: "0",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead
              style={{
                background: "linear-gradient(to right, #005bea, #00c6fb)",
                color: "#fff",
                fontWeight: "700",
              }}
            >
              <tr>
                <th style={{ padding: "10px", textAlign: "left", fontSize: '0.8rem' }}>#</th>
                <th style={{ padding: "10px", textAlign: "left", fontSize: '0.8rem' }}>Company</th>
                <th style={{ padding: "10px", fontSize: '0.8rem' }}>LTP</th>
                <th style={{ padding: "10px", fontSize: '0.8rem' }}>Change</th>
                <th style={{ padding: "10px", fontSize: '0.8rem' }}>% Change</th>
              </tr>
            </thead>

            <tbody>
              {(showAll ? data.data : data.data.slice(0, 10)).map((item, index) => (
                <tr
                  key={item.symbol}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                    transition: "0.25s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#eef4ff";
                    e.currentTarget.style.transform = "scale(1.01)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <td style={{ padding: "10px", fontWeight: 600, color: "#555", fontSize: '0.85rem' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px", fontWeight: 600, fontSize: '0.85rem' }}>{item.symbol}</td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>₹{formatNum(item.lastPrice)}</td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem', color: item.change >= 0 ? "green" : "red" }}>
                    ₹{formatNum(item.change)}
                  </td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem', color: item.pChange >= 0 ? "green" : "red" }}>
                    {formatNum(item.pChange)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More button */}
        <div className="text-center mt-3 mb-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowAll(!showAll)}
            style={{ fontSize: '0.85rem', padding: '8px 20px' }}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
