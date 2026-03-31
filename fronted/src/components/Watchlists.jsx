




import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";

export default function Watchlists({ user }) {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [symbolInput, setSymbolInput] = useState("");
  const [priceAnim, setPriceAnim] = useState({}); // { SYMBOL: 'up'|'down' }
  const [addSuccess, setAddSuccess] = useState(false);
  const prevPercentRef = useRef({});
  // prevPricesRef removed (no sparkline)
  const navigate = useNavigate();

  // Fetch all watchlists
  const fetchWatchlists = async () => {
    try {
      if (!user?._id) return;
      const res = await axios.get(`http://localhost:5000/api/watchlists?userId=${user._id}`);
      setWatchlists(res.data);
      if (!selectedWatchlist && res.data.length > 0) {
        const first = res.data[0];
        setSelectedWatchlist(first);
        (first.stocks || []).forEach((s) => {
          prevPercentRef.current[s.symbol] = Number(s.percentChange || 0);
        });
      } else if (selectedWatchlist) {
        const updated = res.data.find((wl) => wl._id === selectedWatchlist._id);
        setSelectedWatchlist(updated);
      }
    } catch (err) {
      console.error("Error fetching watchlists:", err);
    }
  };

  useEffect(() => {
    fetchWatchlists();
  }, []);

  // Poll for price updates, trigger animations and build price history for sparklines
  useEffect(() => {
    let interval = null;
    const refresh = async () => {
      try {
        if (selectedWatchlist && Array.isArray(selectedWatchlist.stocks) && selectedWatchlist.stocks.length > 0) {
          // Get symbols from selected watchlist
          const symbols = selectedWatchlist.stocks.map(s => s.symbol);
          // Fetch live prices from backend (not rapid API)
          const res = await axios.post("http://localhost:5000/live-prices", { symbols });
          const prices = res.data.prices || {};
          const changes = res.data.changes || {};
          const yesterdayCloses = res.data.yesterdayCloses || {};
          // Update only price, change, percentChange fields
          setSelectedWatchlist(prev => {
            if (!prev) return prev;
            const updatedStocks = prev.stocks.map(s => {
              const livePrice = prices[s.symbol];
              const prevClose = yesterdayCloses[s.symbol];
              let change = null;
              let percentChange = null;
              if (livePrice != null && prevClose != null) {
                change = Number(livePrice) - Number(prevClose);
                percentChange = prevClose !== 0 ? ((change / Number(prevClose)) * 100) : 0;
              }
              return {
                ...s,
                price: livePrice != null ? livePrice : s.price,
                change: change != null ? change : s.change,
                percentChange: percentChange != null ? percentChange : s.percentChange,
                previousClose: prevClose != null ? prevClose : s.previousClose,
              };
            });
            return { ...prev, stocks: updatedStocks };
          });
        }
      } catch (err) {
        // ignore polling errors
      }
    };
    interval = setInterval(refresh, 1000); // every second
    return () => clearInterval(interval);
  }, [selectedWatchlist]);

  // sparkline helper removed

  // Create watchlist
  const createWatchlist = async () => {
    if (!newWatchlistName.trim()) return alert("Enter a name for the watchlist!");
    try {
      await axios.post("http://localhost:5000/api/watchlists", {
        name: newWatchlistName,
        userId: user._id,
      });
      setNewWatchlistName("");
      fetchWatchlists();
    } catch (err) {
      console.error("Error creating watchlist:", err);
    }
  };

  // Delete watchlist
  const deleteWatchlist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this watchlist?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/watchlists/${id}`);
      setSelectedWatchlist((prev) => (prev && prev._id === id ? null : prev));
      fetchWatchlists();
    } catch (err) {
      console.error("Error deleting watchlist:", err);
    }
  };

  // Add stock
  const addStockToWatchlist = async () => {
    if (!symbolInput.trim() || !selectedWatchlist) return;
    try {
      await axios.post(`http://localhost:5000/api/watchlists/${selectedWatchlist._id}/stocks`, {
        symbol: symbolInput,
      });
      setSymbolInput("");
      // Fetch the updated watchlist from backend (single watchlist)
      const res = await axios.get(`http://localhost:5000/api/watchlists/${selectedWatchlist._id}`);
      const updatedWatchlist = res.data;
      setSelectedWatchlist(updatedWatchlist);
      setWatchlists(prev => prev.map(wl => wl._id === updatedWatchlist._id ? updatedWatchlist : wl));
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch (err) {
      console.error("Error adding stock:", err);
    }
  };

  // Delete stock
  const deleteStock = async (symbol) => {
    if (!selectedWatchlist) return;
    if (!window.confirm(`Delete ${symbol} from this watchlist?`)) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/watchlists/${selectedWatchlist._id}/stocks/${symbol}`
      );
      fetchWatchlists();
    } catch (err) {
      console.error("Error deleting stock:", err);
    }
  };

  return (
    <div className="watchlist-container">
      

      <h2 className="page-title"><FaStar />My Watchlists</h2>

      {/* Create Watchlist */}
      <div className="create-bar">
        <input
          type="text"
          className="form-control me-2"
          placeholder="New Watchlist Name"
          value={newWatchlistName}
          onChange={(e) => setNewWatchlistName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createWatchlist}>
          Create
        </button>
      </div>

      {/* Watchlist Navbar (Left aligned) */}
      <div className="watchlist-navbar">
        {watchlists.map((wl) => (
          <div
            key={wl._id}
            className={`watchlist-tab ${selectedWatchlist?._id === wl._id ? "active" : ""}`}
            onClick={() => setSelectedWatchlist(wl)}
          >
            {wl.name}
            <span
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteWatchlist(wl._id);
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* Selected Watchlist Content */}
      {selectedWatchlist ? (
        <>
          {/* Success Message */}
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

          {/* Add Stock Input */}
          <div className="add-stock-bar">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter stock symbol (e.g. RELIANCE)"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
            />
            <button className="btn btn-success" onClick={addStockToWatchlist}>
              Add
            </button>
          </div>

          {/* Stock Cards */}
          {Array.isArray(selectedWatchlist.stocks) &&
          selectedWatchlist.stocks.length > 0 ? (
            selectedWatchlist.stocks.map((s) => {
              // Prefer changesPercentage if available, fallback to percentChange
              const percentChange =
                s.changesPercentage !== undefined && s.changesPercentage !== null
                  ? Number(s.changesPercentage)
                  : Number(s.percentChange);
              // Calculate change if not present, fallback to s.change
              let change = s.change;
              if (change === undefined && s.price !== undefined && s.previousClose !== undefined) {
                change = Number(s.price) - Number(s.previousClose);
              }
              change = Number(change);
              // Remove .NS from symbol for NSE India
              const nseSymbol = s.symbol?.replace(/\.NS$/, "");
              return (
                <div
                  key={s.symbol}
                  className={`stock-card ${priceAnim[s.symbol] || ""}`}
                  style={{ marginTop: 14, cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/stock/${nseSymbol}`);
                    // Optionally, send nseSymbol to backend here
                  }}
                >
                  <div className="stock-left">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="stock-img"
                        style={{
                          width: 48,
                          height: 48,
                          marginTop: 14,
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          marginRight: 16,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                        }}
                        onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div
                        className="stock-placeholder"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "#d1d5db",
                          color: "#374151",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                          fontSize: 22,
                          marginRight: 16,
                          border: "1px solid #e5e7eb"
                        }}
                      >
                        {s.symbol?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="stock-info">
                      <strong>{s.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <small style={{ fontFamily: 'monospace', minWidth: 120, display: 'inline-block' }}>
                          ₹{Number(s.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {" "}
                          <span
                            className={`price-change ${priceAnim[s.symbol] || ""}`}
                            style={{
                              color: percentChange >= 0 ? "#059669" : "#ef4444",
                              minWidth: 80,
                              display: 'inline-block',
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums',
                              fontFamily: 'monospace',
                            }}
                          >
                            ({change >= 0 ? "+" : ""}
                            {change.toFixed(2)}) {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
                          </span>
                        </small>

                        {/* sparkline removed */}
                      </div>
                    </div>
                  </div>
                  <button
                    className="delete-stock-btn"
                    onClick={e => {
                      e.stopPropagation();
                      deleteStock(s.symbol);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-muted">No stocks added yet</p>
          )}
        </>
      ) : (
        <p className="text-muted">Select a watchlist to view stocks</p>
      )}
      <style>
        {`
        :root{
  --primary: #0d6efd;
  --card-bg: #ffffff;
  --body-bg: #f8fafc;
  --sidebar-text: #111827;
}
.watchlist-container{
  background: var(--body-bg);
  min-height:100vh;
  padding: 2rem;
  transition:background 200ms ease;
}
@media (max-width: 991.98px) {
  .watchlist-container {
    padding: 1rem;
  }
}
@media (max-width: 575.98px) {
  .watchlist-container {
    padding: 0.5rem;
  }
}
.page-title{display:flex;align-items:center;justify-content:center;gap:12px;text-align:center;font-weight:800;font-size:1.8rem;color:var(--primary);margin-bottom:1.5rem;background:linear-gradient(135deg,var(--primary),rgba(13,110,253,0.7));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
@media (max-width: 575.98px) {
  .page-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
}
.page-title svg{width:32px;height:32px;color:var(--primary);filter:drop-shadow(0 2px 4px rgba(13,110,253,0.2));animation:float 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
.create-bar{display:flex;max-width:500px;margin-bottom:1.5rem;gap:8px;flex-wrap: wrap;}
@media (max-width: 575.98px) {
  .create-bar {
    flex-direction: column;
    gap: 8px;
  }
  .create-bar input, .create-bar button {
    width: 100%;
  }
}
.create-bar input{border-radius:10px;border:1px solid rgba(13,110,253,0.1);background:var(--card-bg);color:var(--sidebar-text)}
.create-bar button{border-radius:10px;font-weight:600;box-shadow:0 4px 12px rgba(13,110,253,0.2)}
.watchlist-navbar{display:flex;justify-content:flex-start;align-items:center;gap:1rem;border-bottom:3px solid rgba(13,110,253,0.1);padding-bottom:0.75rem;margin-bottom:1.5rem;overflow-x:auto;flex-wrap: wrap;}
@media (max-width: 575.98px) {
  .watchlist-navbar {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
}
.watchlist-tab{position:relative;color:rgba(0,0,0,0.6);font-weight:600;font-size:0.95rem;cursor:pointer;padding:0.6rem 0.8rem;transition:all .25s ease;white-space:nowrap}
.watchlist-tab:hover{color:var(--primary)}
.watchlist-tab.active{color:var(--primary);font-weight:700}
.watchlist-tab.active::after{content:"";position:absolute;bottom:-1rem;left:0;width:100%;height:4px;background:linear-gradient(90deg,var(--primary),rgba(13,110,253,0.5));border-radius:3px}
.delete-btn{color:#dc3545;font-weight:bold;margin-left:10px;cursor:pointer;opacity:.7;transition:opacity .2s}
.delete-btn:hover{opacity:1}
.add-stock-bar{display:flex;max-width:550px;margin-bottom:1.5rem;gap:8px;flex-wrap: wrap;}
@media (max-width: 575.98px) {
  .add-stock-bar {
    flex-direction: column;
    gap: 8px;
  }
  .add-stock-bar input, .add-stock-bar button {
    width: 100%;
  }
}
.add-stock-bar input{border-radius:10px;border:1px solid rgba(13,110,253,0.1);background:var(--card-bg);color:var(--sidebar-text)}
.add-stock-bar button{border-radius:10px;font-weight:600;box-shadow:0 4px 12px rgba(16,185,129,0.2)}
.stock-card{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,var(--card-bg),rgba(255,255,255,0.8));border-radius:12px;padding:1rem 1.2rem;border:1px solid rgba(13,110,253,0.04);box-shadow:0 8px 24px rgba(16,24,40,0.04);margin-bottom:1rem;transition:all .28s cubic-bezier(.2,.9,.3,1);opacity:0;transform:translateY(8px);animation:cardIn 420ms ease forwards;flex-wrap: wrap;}
@media (max-width: 575.98px) {
  .stock-card {
    padding: 0.8rem 1rem;
    margin-bottom: 0.75rem;
  }
}
.stock-card:hover{transform:translateY(-6px);box-shadow:0 14px 40px rgba(13,110,253,0.12);border-color:rgba(13,110,253,0.12)}
.stock-left{display:flex;align-items:center;gap:1rem;flex:1;min-width: 0;}
.stock-img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid rgba(13,110,253,0.08)}
.stock-placeholder{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--primary),rgba(13,110,253,0.7));color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;box-shadow:0 4px 12px rgba(13,110,253,0.12);min-width: 48px;}
@media (max-width: 575.98px) {
  .stock-left {
    gap: 0.75rem;
  }
  .stock-img, .stock-placeholder {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
  }
}
.stock-info{display:flex;flex-direction:column;gap:4px;min-width: 0;flex: 1;overflow: hidden;}
.stock-info strong{font-size:0.95rem;font-weight:700;color:var(--sidebar-text);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
.stock-info small{color:rgba(0,0,0,0.65);font-size:0.8rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
@media (max-width: 575.98px) {
  .stock-info strong {
    font-size: 0.85rem;
  }
  .stock-info small {
    font-size: 0.7rem;
  }
}
.price-change{font-weight:700;font-size:0.92rem;padding:2px 6px;border-radius:6px}
.delete-stock-btn{background:transparent;border:none;color:#dc3545;font-size:1.5rem;cursor:pointer;opacity:.7;transition:all .18s ease;padding:.4rem .8rem}
.delete-stock-btn:hover{opacity:1;transform:scale(1.1)}
.text-muted{color:rgba(0,0,0,0.6) !important}

/* Price change flash animations */
.price-up{animation:priceUp 950ms ease-in-out;box-shadow:0 6px 18px rgba(16,185,129,0.12)}
.price-down{animation:priceDown 950ms ease-in-out;box-shadow:0 6px 18px rgba(239,68,68,0.08)}
@keyframes priceUp{0%{transform:translateY(0);background-color:rgba(16,185,129,0.02)}50%{transform:translateY(-4px) scale(1.02);background-color:rgba(16,185,129,0.06)}100%{transform:translateY(0);background-color:transparent}}
@keyframes priceDown{0%{transform:translateY(0);background-color:rgba(239,68,68,0.02)}50%{transform:translateY(-4px) scale(1.02);background-color:rgba(239,68,68,0.06)}100%{transform:translateY(0);background-color:transparent}}

@keyframes cardIn{to{opacity:1;transform:translateY(0)}}

/* Sparkline */
.sparkline{display:inline-block;vertical-align:middle}
.sparkline path{stroke-width:2;fill:none;stroke:var(--primary);opacity:.95}
.sparkline-bg{stroke:none;fill:rgba(13,110,253,0.06)}
`}
      </style>
    </div>
  );
}

