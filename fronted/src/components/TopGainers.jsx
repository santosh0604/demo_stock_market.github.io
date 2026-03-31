// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function TopGainers({ cardStyle, compact }) {
//   const [gainers, setGainers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let isMounted = true;
//     const fetchGainers = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/top-gainers");
//         const data = res.data;
//         if (data.legends && data.legends.length > 0) {
//           let allStocks = [];
//           data.legends.forEach(([key]) => {
//             if (Array.isArray(data[key]?.data)) {
//               allStocks = allStocks.concat(data[key].data);
//             }
//           });
//           // Remove duplicates by symbol
//           const uniqueStocks = [];
//           const seen = new Set();
//           for (const stock of allStocks) {
//             if (!seen.has(stock.symbol)) {
//               uniqueStocks.push(stock);
//               seen.add(stock.symbol);
//             }
//           }
//           if (isMounted) setGainers(uniqueStocks);
//         } else {
//           if (isMounted) setGainers(Array.isArray(data) ? data : []);
//         }
//       } catch (error) {
//         console.log("Error fetching gainers:", error);
//       }
//     };
//     fetchGainers();
//     const interval = setInterval(fetchGainers, 1000);
//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <div className="container" style={{ marginTop:0,maxWidth: 450, ...cardStyle }}>
//       <h2 className="text-center mb-3" style={{ fontSize: 22, color: '#1E40AF', fontWeight: 800, letterSpacing: 0.5 }}>Top Gainers</h2>

//       <div className="list-group">
//         {gainers.slice(0, 6).map((stock, index) => (
//           <div
//             key={index}
//             className="list-group-item d-flex justify-content-between align-items-center animate-card"
//             style={{
//               borderRadius: "10px",
//               marginBottom: "8px",
//               background: "rgba(236,245,255,0.85)",
//               boxShadow: "0 1.5px 6px rgba(30,64,175,0.06)",
//               border: '1.2px solid #e3e6f0',
//               padding: compact ? '10px 10px' : '14px 14px',
//               minHeight: compact ? 38 : 48,
//               cursor: 'pointer',
//               transition: 'transform 0.18s',
//             }}
//             onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.025)")}
//             onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
//             onClick={() => navigate(`/stock/${encodeURIComponent(stock.symbol)}`)}
//           >
//             <div>
//               <strong style={{ color: '#1E40AF', fontSize: 15 }}>{stock.symbol}</strong>
//               <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
//                 {stock.ltp || stock.lastPrice} INR
//               </div>
//             </div>

//             <span
//               style={{
//                 padding: "2.5px 8px",
//                 borderRadius: "8px",
//                 background: "#e0f7fa",
//                 color: "#0d9488",
//                 fontSize: "13px",
//                 fontWeight: 700,
//                 boxShadow: '0 1px 4px #1E40AF11',
//               }}
//             >
//               +{stock.perChange ?? stock.pChange}%
//             </span>
//           </div>
//         ))}
//       </div>

//       {gainers.length > 6 && (
//         <button
//           className="btn btn-primary w-100 mt-3"
//           style={{ fontWeight: 700, fontSize: 15, borderRadius: 8, letterSpacing: 0.5 }}
//           onClick={() => setShowModal(true)}
//         >
//           Show More
//         </button>
//       )}

//       {/* Popup Modal */}
//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.4)",
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//           }}
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 14,
//               padding: 24,
//               minWidth: 320,
//               maxWidth: 420,
//               maxHeight: "80vh",
//               overflowY: "auto",
//               boxShadow: "0 4px 24px rgba(30,64,175,0.13)"
//             }}
//             onClick={e => e.stopPropagation()}
//           >
//             <h4 className="mb-3" style={{ color: '#1E40AF', fontWeight: 800, fontSize: 19 }}>All Top Gainers</h4>
//             <div className="list-group mb-3">
//               {gainers.map((stock, index) => (
//                 <div
//                   key={index}
//                   className="list-group-item d-flex justify-content-between align-items-center animate-card"
//                   style={{
//                     borderRadius: "8px",
//                     marginBottom: "8px",
//                     background: "rgba(236,245,255,0.95)",
//                     boxShadow: "0 1.5px 6px rgba(30,64,175,0.06)",
//                     border: '1.2px solid #e3e6f0',
//                     padding: '10px 10px',
//                     minHeight: 38,
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => navigate(`/stock/${encodeURIComponent(stock.symbol)}`)}
//                 >
//                   <div>
//                     <strong style={{ color: '#1E40AF', fontSize: 15 }}>{stock.symbol}</strong>
//                     <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
//                       {stock.ltp || stock.lastPrice} INR
//                     </div>
//                   </div>
//                   <span
//                     style={{
//                       padding: "2.5px 8px",
//                       borderRadius: "8px",
//                       background: "#e0f7fa",
//                       color: "#0d9488",
//                       fontSize: "13px",
//                       fontWeight: 700,
//                       boxShadow: '0 1px 4px #1E40AF11',
//                     }}
//                   >
//                     +{stock.perChange ?? stock.pChange}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <button
//               className="btn btn-secondary w-100"
//               style={{ fontWeight: 700, fontSize: 15, borderRadius: 8 }}
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TopGainers({ cardStyle, compact }) {
  const [gainers, setGainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchGainers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/top-gainers");
        const data = res.data;

        if (data.legends && data.legends.length > 0) {
          let allStocks = [];
          data.legends.forEach(([key]) => {
            if (Array.isArray(data[key]?.data)) {
              allStocks = allStocks.concat(data[key].data);
            }
          });

          const uniqueStocks = [];
          const seen = new Set();

          for (const stock of allStocks) {
            if (!seen.has(stock.symbol)) {
              uniqueStocks.push(stock);
              seen.add(stock.symbol);
            }
          }

          if (isMounted) setGainers(uniqueStocks);
        } else {
          if (isMounted) setGainers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.log("Error fetching gainers:", error);
      }
    };

    fetchGainers();
    const interval = setInterval(fetchGainers, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container-fluid px-2 px-md-3" style={{ marginTop: 0, ...cardStyle }}>
      <h2
        className="text-center mb-3"
        style={{
          fontSize: 22,
          color: "#1E40AF",
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        Top Gainers
      </h2>

      <div className="list-group">
        {gainers.slice(0, 6).map((stock, index) => (
          <div
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center animate-card"
            style={{
              borderRadius: "10px",
              marginBottom: "8px",
              background: "rgba(236,245,255,0.85)",
              boxShadow: "0 1.5px 6px rgba(30,64,175,0.06)",
              border: "1.2px solid #e3e6f0",
              padding: compact ? "10px 10px" : "14px 14px",
              minHeight: compact ? 38 : 48,
              cursor: "pointer",
              transition: "transform 0.18s",
            }}
            onClick={() =>
              navigate(`/stock/${encodeURIComponent(stock.symbol)}`)
            }
          >
            <div>
              <strong style={{ color: "#1E40AF", fontSize: 15 }}>
                {stock.symbol}
              </strong>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {stock.ltp || stock.lastPrice} INR
              </div>
            </div>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: "8px",
                background: "#e0f7fa",
                color: "#0d9488",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              +{stock.perChange ?? stock.pChange}%
            </span>
          </div>
        ))}
      </div>

      <style>
        {`
        @media (max-width: 991px) {
          .list-group-item {
            padding: 10px !important;
          }
        }
      `}
      </style>
    </div>
  );
}
