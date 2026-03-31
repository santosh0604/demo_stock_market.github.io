// import React from "react";
// import { Card } from "react-bootstrap";

// const SimilarStock = ({ data }) => {
//   // ✅ Safely extract peer companies
//   const peers = Array.isArray(data?.companyProfile?.peerCompanyList)
//     ? data.companyProfile.peerCompanyList
//     : [];

//   return (
//     <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
//       <h5 className="fw-semibold text-primary mb-3">Peer Companies</h5>

//       {peers.length > 0 ? (
//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               textAlign: "left",
//               minWidth: "800px",
//             }}
//           >
//             <thead>
//               <tr style={{ backgroundColor: "#e6f0ff" }}>
//                 <th style={{ padding: "10px" }}>Company Name</th>
//                 <th style={{ padding: "10px" }}>Market Cap (₹ Cr)</th>
//                 <th style={{ padding: "10px" }}>P/E Ratio</th>
//                 <th style={{ padding: "10px" }}>P/B Ratio</th>
//               </tr>
//             </thead>
//             <tbody>
//               {peers.map((company, index) => (
//                 <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
//                   <td style={{ padding: "10px" }}>
//                     {company.companyName || "N/A"}
//                   </td>
//                   <td style={{ padding: "10px" }}>
//                     {company.marketCap
//                       ? company.marketCap.toLocaleString("en-IN", {
//                           maximumFractionDigits: 2,
//                         })
//                       : "N/A"}
//                   </td>
//                   <td style={{ padding: "10px" }}>
//                     {company.priceToEarningsValueRatio
//                       ? company.priceToEarningsValueRatio.toFixed(2)
//                       : "N/A"}
//                   </td>
//                   <td style={{ padding: "10px" }}>
//                     {company.priceToBookValueRatio
//                       ? company.priceToBookValueRatio.toFixed(2)
//                       : "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-muted">No peer company data available</p>
//       )}
//     </Card>
//   );
// };

// export default SimilarStock;






import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const SimilarStock = ({ data, name, nseData }) => {
  const peers = Array.isArray(data?.companyProfile?.peerCompanyList)
    ? data.companyProfile.peerCompanyList
    : [];

  const filteredPeers = peers.filter(
    (company) => company.companyName?.toLowerCase() !== name?.toLowerCase()
  );

  if (!filteredPeers.length)
    return <p className="text-muted text-center mt-4">No peer company data available</p>;

  return (
    <div className="container py-4">
      <h4 className="fw-semibold text-primary mb-4 text-center">
        Similar Stocks / Peer Companies
      </h4>

      <div className="row g-4">
        {filteredPeers.map((company, index) => {
          const isGain = Number(company.change || company.percentChange || 0) >= 0;

          return (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div
                className={`card stock-card mb-3 border-0 rounded-4 h-100 ${
                  isGain ? "gain-card" : "loss-card"
                }`}
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm"
                        style={{
                          width: "45px",
                          height: "45px",
                          overflow: "hidden",
                        }}
                      >
                        {company.imageUrl ? (
                          <img
                            src={company.imageUrl}
                            alt={company.companyName}
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <span className="fw-bold text-primary">
                            {company.companyName?.substring(0, 2) || "NA"}
                          </span>
                        )}
                      </div>

                      <div>
                        <h6 className="mb-1 fw-semibold text-dark">
                          {company.companyName || "N/A"}
                        </h6>
                        <small className="text-muted">
                          Market Cap:{" "}
                          {company.marketCap
                            ? `${company.marketCap.toLocaleString("en-IN")} Cr`
                            : "N/A"}
                        </small>
                      </div>
                    </div>

                    {/* Change Percent */}
                    {company.changePercent != null && !isNaN(company.changePercent) && (
                      <span
                        className={`badge rounded-pill px-3 py-2 fs-6 shadow-sm ${
                          isGain ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {isGain && "+"}
                        {Number(company.changePercent).toFixed(2)}%
                      </span>
                    )}
                  </div>

                  {/* Price & Change Section */}
                  <div className="mt-3">
                    {company.price != null && !isNaN(company.price) && (
                      <>
                        <h5
                          className={`fw-semibold mb-2 ${
                            isGain ? "text-success" : "text-danger"
                          }`}
                        >
                          ₹{Number(company.price).toFixed(2)}
                        </h5>

                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className={`small d-flex align-items-center gap-1 ${
                              isGain ? "text-success" : "text-danger"
                            }`}
                          >
                            {isGain ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                            {isGain && "+"}₹
                            {Number(Math.abs(company.netChange || 0)).toFixed(2)}
                          </div>

                          <div
                            className={`small d-flex align-items-center gap-1 ${
                              isGain ? "text-success" : "text-danger"
                            }`}
                          >
                            {isGain ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                            {isGain && "+"}
                            {Number(Math.abs(company.percentChange || 0)).toFixed(2)}%
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Styling */}
      <style>{`
        .stock-card {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        /* Static shadows based on movement */
        .gain-card {
          box-shadow: 0 4px 15px rgba(25, 135, 84, 0.25);
        }

        .loss-card {
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.25);
        }

        /* Hover glow */
        .gain-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 6px 20px rgba(25, 135, 84, 0.5);
          background: #ffffff;
        }

        .loss-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.5);
          background: #ffffff;
        }

        .stock-card h6 {
          font-size: 1rem;
        }

        .stock-card .badge {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default SimilarStock;
