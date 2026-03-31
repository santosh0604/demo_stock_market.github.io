// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import StockBox from "./StockBox";

// export default function IndustryStocks() {
//   const [sector, setSector] = useState("IT"); // Default sector is now IT
//   const [stocks, setStocks] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const API_BASE = "http://localhost:5000";

//   const sectors = [
//     "AUTO",
//     "IT",
//     "PHARMA",
//     "FINANCIAL SERVICES",
//     "FMCG",
//     "REALTY",
//     "METAL",
//     "ENERGY",
//     "MEDIA",
//     "BANK",
//     "DEFENCE"
//   ];

//   useEffect(() => {
//     let isMounted = true;
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/industry/mmm/${sector}`);
//         if (isMounted) setStocks(res.data || []);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//     const interval = setInterval(fetchData, 1000);
//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//     };
//   }, [sector]);

//   const initialData = stocks.slice(1, 5); // First 4 cards only

//   return (
//     <div
//       style={{
//         maxWidth: "1100px",
//         margin: "40px auto",
//         padding: "20px",
//         textAlign: "center",
//       }}
//     >
//       {/* Heading */}
//       <h1
//         style={{
//           fontSize: "32px",
//           fontWeight: "bold",
//           textAlign: "left",
//           marginBottom: "25px",
//         }}
//       >
//         Industry Wise Stocks
//       </h1>

//       {/* Sector Select */}
//       <div
//         style={{
//           marginBottom: "30px",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <select
//           value={sector}
//           onChange={(e) => setSector(e.target.value)}
//           style={{
//             padding: "12px 24px",
//             borderRadius: "12px",
//             border: "2px solid #0369a1",
//             outline: "none",
//             cursor: "pointer",
//             minWidth: "280px",
//             fontWeight: "700",
//             background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
//             color: "#0f172a",
//             fontSize: "15px",
//             boxShadow: "0 4px 12px rgba(3, 105, 161, 0.15)",
//             transition: "all 0.3s ease",
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.boxShadow = "0 8px 20px rgba(3, 105, 161, 0.25)";
//             e.target.style.transform = "translateY(-2px)";
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.boxShadow = "0 4px 12px rgba(3, 105, 161, 0.15)";
//             e.target.style.transform = "translateY(0)";
//           }}
//         >
//           {sectors.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Main Cards */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px" }}>
//         {initialData.map((item, idx) => (
//           // console.log("items:",item),
//           <StockBox key={idx} item={item} />
//         ))}

//         {/* Show More Button (5th card) */}
//         {stocks.length > 4 && (
//           <div
//             onClick={() => setShowModal(true)}
//             style={{
//               padding: "15px",
//               borderRadius: "14px",
//               background: "#ff6b6b",
//               color: "white",
//               cursor: "pointer",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               transition: "0.3s",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "scale(1.05)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "scale(1)")
//             }
//           >
//             <h4 style={{ margin: 0 }}>+ Show More</h4>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div
//           onClick={() => setShowModal(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.6)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 2000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: "#fff",
//               padding: "25px",
//               borderRadius: "15px",
//               width: "90%",
//               maxHeight: "80vh",
//               overflowY: "auto",
//             }}
//           >
//             <h3 style={{ marginBottom: "20px" }}>
//               All {sector} Stocks
//             </h3>

//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
//               {stocks.slice(1).map((item, idx) => (
//                 <StockBox key={idx} item={item} />
//               ))}
//             </div>

//             <button
//               onClick={() => setShowModal(false)}
//               style={{
//                 marginTop: "20px",
//                 padding: "10px 20px",
//                 background: "#2575fc",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: "pointer",
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












import React, { useEffect, useState } from "react";
import axios from "axios";
import StockBox from "./StockBox";

export default function IndustryStocks() {
  const [sector, setSector] = useState("IT");
  const [stocks, setStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = "http://localhost:5000";

  const sectors = [
    "AUTO",
    "IT",
    "PHARMA",
    "FINANCIAL SERVICES",
    "FMCG",
    "REALTY",
    "METAL",
    "ENERGY",
    "MEDIA",
    "BANK",
  
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/industry/mmm/${sector}`);
        if (isMounted) setStocks(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sector]);

  const initialData = stocks.slice(1, 5);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: "25px",
        }}
      >
        Industry Wise Stocks
      </h1>

      {/* Sector Select */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: "2px solid #0369a1",
            outline: "none",
            cursor: "pointer",
            minWidth: "280px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            color: "#0f172a",
            fontSize: "15px",
            boxShadow: "0 4px 12px rgba(3, 105, 161, 0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = "0 8px 20px rgba(3, 105, 161, 0.25)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = "0 4px 12px rgba(3, 105, 161, 0.15)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Responsive Main Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
        }}
      >
        {initialData.map((item, idx) => (
          <StockBox key={idx} item={item} />
        ))}

        {/* Show More Button */}
        {stocks.length > 4 && (
          <div
            onClick={() => setShowModal(true)}
            style={{
              padding: "15px",
              borderRadius: "14px",
              background: "#ff6b6b",
              color: "white",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h4 style={{ margin: 0 }}>+ Show More</h4>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
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
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "15px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>
              All {sector} Stocks
            </h3>

            {/* Responsive Modal Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
              }}
            >
              {stocks.slice(1).map((item, idx) => (
                <StockBox key={idx} item={item} />
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
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
