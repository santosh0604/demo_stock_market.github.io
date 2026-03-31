import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";
import SimilarStock from "../components/SimilarStock";
import ShareholdingPattern from "../components/ShareholdingPattern";
import { useAuth } from "../context/AuthContext";

const Stock = ({ setStockForOrderBox }) => {
  const { name } = useParams();
  const [stock, setStock] = useState(null);
  const [nseData, setNseData] = useState(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [userWatchlists, setUserWatchlists] = useState([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState("");
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [showOrderBox, setShowOrderBox] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const [rapidRes, nseRes] = await Promise.allSettled([
          axios.get(`https://demo-stock-market-backend.onrender.com/stock/${name}`),
          axios.get(`https://demo-stock-market-backend.onrender.com/nse/${name}`),
        ]);
        if (rapidRes.status === "fulfilled") setStock(rapidRes.value.data);
        if (nseRes.status === "fulfilled") setNseData(nseRes.value.data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    };
    fetchData();
    // intervalId = setInterval(fetchData); // Poll every 1 second
    // return () => clearInterval(intervalId);
  }, [name]);

  useEffect(() => {
    if (stock || nseData) {
      const safeMarketPrice =
        nseData?.priceInfo?.lastPrice ??
        stock?.currentPrice?.BSE ??
        stock?.currentPrice?.NSE ??
        stock?.ltp ??
        0;

      setStockForOrderBox({
        symbol: name.toUpperCase(),
        companyName:
          stock?.companyName || nseData?.info?.companyName || name.toUpperCase(),
        exchange: nseData ? "NSE" : "BSE",
        marketPrice: safeMarketPrice,
        change: nseData?.priceInfo?.pChange || 0,
        balance: 10000,
        approxReq: safeMarketPrice,
      });
    }
  }, [stock, nseData]);

  useEffect(() => {
    if (showWatchlistModal && user?._id) {
      axios
        .get(`http://localhost:5000/api/watchlists?userId=${user._id}`)
        .then((res) => setUserWatchlists(res.data))
        .catch(() => setUserWatchlists([]));
    }
  }, [showWatchlistModal, user]);

  console.log("Stock Data:", stock);
  console.log("NSE Data:", nseData);

  if (!stock && !nseData)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary mb-3"></div>
        <h6>Loading stock information...</h6>
      </div>
    );

  const data = stock || {};
  const profile = data.companyProfile || {};
  const peer = profile?.peerCompanyList?.[0];
  console.log(peer); // ✅ Safe access to peer data
  const sname = data.companyName;

  const current = parseFloat(
    nseData.priceInfo?.lastPrice
  );
  const weekMin = parseFloat(data.yearLow || nseData?.priceInfo?.low52 || 0);
  const weekMax = parseFloat(data.yearHigh || nseData?.priceInfo?.high52 || 0);
  const weekPercent = ((current - weekMin) / (weekMax - weekMin)) * 100;

  const dayMin = nseData?.priceInfo?.intraDayHighLow?.min || 0;
  const dayMax = nseData?.priceInfo?.intraDayHighLow?.max || 0;
  const dayPercent = ((current - dayMin) / (dayMax - dayMin)) * 100;

  const formatNum = (num) =>
    num !== undefined && !isNaN(num) ? parseFloat(num).toFixed(2) : "N/A";

  const PriceMarker = ({ percent, value }) => {
    // Clamp percent between 0 and 100 to keep marker visible
    const clampedPercent = Math.max(0, Math.min(100, percent));
    return (
      <div
        className="position-absolute text-center"
        style={{
          left: `${clampedPercent}%`,
          transform: "translate(-50%, -100%)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "8px solid #0d6efd",
            marginBottom: "4px",
          }}
        ></div>
        <small
          className="bg-white border rounded px-2 py-1 shadow-sm"
          style={{ fontSize: "12px", whiteSpace: "nowrap" }}
        >
          ₹{formatNum(value)}
        </small>
      </div>
    );
  };

  // Performance bar - simple line with marker
  const PerformanceBar = ({ percent, min, max, current }) => {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    return (
      <div className="position-relative mb-3" style={{ height: "40px" }}>
        {/* Simple line track */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y"
          style={{ width: "100%", height: "4px", backgroundColor: "#e5e7eb", borderRadius: "2px" }}
        ></div>
        
        {/* Current price marker */}
        <div
          className="position-absolute top-50"
          style={{
            left: `${clampedPercent}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#0d6efd",
              border: "3px solid #fff",
              boxShadow: "0 0 0 2px #0d6efd, 0 2px 4px rgba(0,0,0,0.2)",
            }}
          ></div>
        </div>
        
        {/* Labels */}
        <div className="d-flex justify-content-between small text-muted mt-2">
          <span>₹{formatNum(min)}</span>
          <span className="fw-semibold text-primary">₹{formatNum(current)}</span>
          <span>₹{formatNum(max)}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="container py-5"
        style={{
          background: "linear-gradient(180deg, #f5f8ff 0%, #eef3ff 100%)",
          minHeight: "100vh",
          borderRadius: "20px",
        }}
      >
        {/* ===== HEADER ===== */}
        <div className="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
          <div>
            <h2 className="fw-bold text-primary mb-1">
              {data.companyName ||
                nseData?.info?.companyName ||
                name.toUpperCase()}
            </h2>
            <p className="text-muted mb-1">
              {data.industry || nseData?.info?.industry || "N/A"}
            </p>
            <p className="text-secondary small mb-0">
              ISIN: {profile.isInId || nseData?.info?.isin || "N/A"}
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            <button
              onClick={() => setShowWatchlistModal(true)}
              className="btn btn-outline-primary rounded-pill px-4 fw-semibold shadow-sm hover-scale"
            >
              + Watchlist
            </button>
          
          </div>
        </div>

        {/* ===== LIVE PRICE ===== */}
        <Card className="shadow-lg border-0 mb-4 p-4 bg-white rounded-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: "#e0e7ef",
                  color: "#2d3a4a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 28,
                  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                }}
              >
                {(data.companyName || name || "").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3
                  className={`fw-bold mb-0 ${Number(nseData?.priceInfo?.pChange) >= 0
                      ? "text-success"
                      : "text-danger"
                    }`}
                >
                  ₹{formatNum(nseData?.priceInfo?.lastPrice)}
                </h3>
                <small
                  className={`fw-semibold ${Number(nseData?.priceInfo?.pChange) >= 0
                      ? "text-success"
                      : "text-danger"
                    }`}
                >
                  {nseData?.priceInfo?.change > 0 ? "+" : ""}
                  {formatNum(nseData?.priceInfo?.change)} (
                  {formatNum(nseData?.priceInfo?.pChange)}%)
                </small>
              </div>
            </div>
          </div>
        </Card>

        {/* ===== PRICE CHART ===== */}
        <Card className="shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
          <div className="p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold text-primary mb-0">📈 Price Chart</h5>
              <div className="small text-muted">1D · 1W · 1M</div>
            </div>
            <iframe
              title="TradingView"
              src={`https://s.tradingview.com/widgetembed/?symbol=BSE:${data.symbol || name.toUpperCase()
                }&interval=1D&theme=light&style=1`}
              style={{
                width: "100%",
                height: "420px",
                border: "none",
                borderRadius: "12px",
              }}
            ></iframe>
          </div>
        </Card>

        {/* ===== DAY PERFORMANCE ===== */}
        <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
          <h5 className="fw-semibold text-primary mb-3">🌤️ Day Performance</h5>
          <PerformanceBar 
            percent={dayPercent} 
            min={dayMin} 
            max={dayMax} 
            current={current}
          />
        </Card>

        {/* ===== 52-WEEK PERFORMANCE ===== */}
        <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
          <h5 className="fw-semibold text-primary mb-3">
            📅 52-Week Performance
          </h5>
          <PerformanceBar 
            percent={weekPercent} 
            min={weekMin} 
            max={weekMax} 
            current={current}
          />
        </Card>

        {/* ===== FUNDAMENTALS ===== */}
        {profile?.peerCompanyList?.length > 0 ? (
          <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
            <h5 className="fw-semibold text-primary mb-3">🏦 Fundamentals</h5>
            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Market Cap:</strong> ₹{data.stockDetailsReusableData
                  .marketCap} Cr
              </div>
              <div className="col-md-6 mb-2">
                <strong>PE Ratio:</strong> ₹{formatNum(
                  nseData?.metadata?.pdSectorPe
                )}
              </div>
              <div className="col-md-6 mb-2">
                <strong>PB Ratio:</strong> ₹{formatNum(
                  peer?.priceToBookValueRatio
                )}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Industry PE:</strong> ₹{formatNum(
                  peer?.priceToEarningsValueRatio
                )}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Debt To Equity:</strong> ₹{data.
                  stockDetailsReusableData
                  .totalDebtPerTotalEquityMostRecentQuarter}
              </div>
              <div className="col-md-6 mb-2">
                <strong>ROE:</strong> {formatNum(
                  peer?.returnOnAverageEquity5YearAverage
                )}%
              </div>
              <div className="col-md-6 mb-2">
                <strong>EPS:</strong> ₹{
                  (() => {
                    const price = parseFloat(nseData?.priceInfo?.lastPrice || current);
                    const pe = parseFloat(nseData?.metadata?.pdSectorPe || peer?.priceToEarningsValueRatio);
                    if (pe && !isNaN(price) && !isNaN(pe) && pe !== 0) {
                      return (price / pe).toFixed(2);
                    }
                    return "N/A";
                  })()
                }
              </div>
              <div className="col-md-6 mb-2">
                <strong>Dividend Yield:</strong> {formatNum(
                  peer?.dividendYieldIndicatedAnnualDividend
                )}%
              </div>
              <div className="col-md-6 mb-2">
                <strong>Book Value:</strong> ₹{formatNum(
                  nseData?.securityInfo?.faceValue
                )}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Face Value:</strong> ₹{formatNum(
                  profile.faceValue || nseData?.securityInfo?.faceValue
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4 text-center text-muted">
            ⚠️ Fundamentals data not available for this stock.
          </Card>
        )}

        {/* ===== SHAREHOLDING ===== */}
        <ShareholdingPattern data={data} />

        {/* ===== ABOUT SECTION ===== */}
        <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
          <h5 className="fw-semibold text-primary mb-3">
            ℹ️ About {data.companyName}
          </h5>
          <p className="text-secondary">
            {profile?.companyDescription || "No description available."}
          </p>
        </Card>

        {/* ===== SIMILAR STOCKS ===== */}
        <Card className="shadow-sm border-0 p-4 bg-white rounded-4">
          <SimilarStock data={data} name={sname} nseData={nseData} />
        </Card>
      </div>

    {/* ===== WATCHLIST MODAL ===== */}
{showWatchlistModal && (
  <div
    className="modal show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-4">
        <div className="modal-header">
          <h5 className="modal-title fw-bold">Add to Watchlist</h5>
          <button
            className="btn-close"
            onClick={() => setShowWatchlistModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          {userWatchlists.length === 0 ? (
            <p className="text-muted">No watchlists found</p>
          ) : (
            <ul className="list-group">
              {userWatchlists.map((wl) => (
                <li
                  key={wl._id}
                  className="list-group-item d-flex align-items-center"
                >
                  <input
                    type="radio"
                    name="watchlist"
                    className="form-check-input me-2"
                    checked={selectedWatchlistId === wl._id}
                    onChange={() => setSelectedWatchlistId(wl._id)}
                  />
                  <span>{wl.name}</span>
                </li>
              ))}
            </ul>
          )}

          {errorMsg && (
            <div className="text-danger mt-2 small">{errorMsg}</div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowWatchlistModal(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            disabled={!selectedWatchlistId || adding}
            onClick={async () => {
              try {
                setAdding(true);
                setErrorMsg("");

                await axios.post(
                  `http://localhost:5000/api/watchlists/${selectedWatchlistId}/stocks`,
                  {
                    symbol: name.toUpperCase(),
                  }
                );

                setShowWatchlistModal(false);
                setSelectedWatchlistId("");
                setAddSuccess(true);
                setTimeout(() => setAddSuccess(false), 2000);
              } catch (err) {
                console.error(err);
                setErrorMsg("Failed to add stock to watchlist");
              } finally {
                setAdding(false);
              }
            }}
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    {/* ===== SUCCESS MESSAGE ===== */}
    {addSuccess && (
      <div className="alert alert-success" style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        minWidth: 240,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 500,
        boxShadow: '0 2px 16px rgba(0,0,0,0.12)'
      }}>
        Stock added successfully!
      </div>
    )}
    </>
  );
};

export default Stock;


















