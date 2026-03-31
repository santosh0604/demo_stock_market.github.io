import React, { useEffect, useState } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  FaBell,
  FaSearch,
  FaHome,
  FaChartBar,
  FaWallet,
  FaExchangeAlt,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaEye,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";

const MainContent = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isChartMaximized, setIsChartMaximized] = useState(false);
  // --- Portfolio State ---
  const [holdings, setHoldings] = useState([]);
  // --- Market Indices State ---
  const [indexData, setIndexData] = useState({});
  // --- Watchlist State (dynamic) ---
  const [watchlist, setWatchlist] = useState([]);
  const [allWatchlists, setAllWatchlists] = useState([]); // All watchlists for user
  const [showWatchlistMenu, setShowWatchlistMenu] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);

  // --- Fetch Holdings and Live Prices ---
  useEffect(() => {
    let interval;
    const fetchPortfolio = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/orders/${user._id}`);
        const ordersData = res.data.orders || [];
        // Calculate holdings from completed orders
        const map = {};
        ordersData.filter((o) => o.status === "COMPLETED").forEach((o) => {
          if (!map[o.symbol]) {
            map[o.symbol] = {
              symbol: o.symbol,
              companyName: o.companyName,
              qty: 0,
              avgPrice: 0,
              investedValue: 0,
              currentPrice: 0,
              currentValue: 0,
              lastDate: o.date,
              buyCount: 0,
              firstBuyPrice: null,
            };
          }
          if (o.side === "BUY") {
            map[o.symbol].qty += o.qty;
            map[o.symbol].investedValue += o.qty * o.tradedPrice;
            map[o.symbol].buyCount += 1;
            if (map[o.symbol].firstBuyPrice === null) {
              map[o.symbol].firstBuyPrice = o.tradedPrice;
            }
          } else {
            map[o.symbol].qty -= o.qty;
            map[o.symbol].investedValue -= o.qty * o.tradedPrice;
          }
          map[o.symbol].lastDate = o.date;
        });
        const finalHoldings = Object.values(map).filter((h) => h.qty > 0);
        finalHoldings.forEach((h) => {
          if (h.buyCount === 1) {
            h.avgPrice = Number(h.firstBuyPrice).toFixed(4);
          } else {
            h.avgPrice = (h.investedValue / h.qty).toFixed(4);
          }
        });
        // Fetch live prices
        if (finalHoldings.length > 0) {
          const symbols = finalHoldings.map((h) => h.symbol);
          const res2 = await axios.post(`http://localhost:5000/live-prices`, { symbols });
          const prices = res2.data.prices || {};
          const changes = res2.data.changes || {};
          const yesterdayCloses = res2.data.yesterdayCloses || {};
          finalHoldings.forEach((h) => {
            const livePrice = prices[h.symbol];
            const dailyChange = changes[h.symbol];
            const yesterdayClose = yesterdayCloses[h.symbol];
            if (livePrice) {
              h.currentPrice = livePrice;
              h.currentValue = Number((h.qty * livePrice).toFixed(2));
              h.dailyChangePercent = dailyChange || 0;
              h.yesterdayClosePrice = yesterdayClose || livePrice;
            } else {
              h.currentPrice = Number(h.avgPrice);
              h.currentValue = Number((h.qty * h.currentPrice).toFixed(2));
              h.dailyChangePercent = dailyChange || 0;
              h.yesterdayClosePrice = yesterdayClose || h.currentPrice;
            }
          });
        }
        setHoldings(finalHoldings);
        setLoading(false);
      } catch (err) {
        setHoldings([]);
        setLoading(false);
      }
    };
    fetchPortfolio();
    interval = setInterval(fetchPortfolio, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // --- Fetch Market Indices ---
  useEffect(() => {
    const indices = ["nifty50", "sensex", "niftynext50", "niftybank"];
    let isMounted = true;
    const fetchAll = async () => {
      const results = {};
      for (const key of indices) {
        try {
          let res;
          if (key === "sensex") {
            res = await axios.get("http://localhost:5000/bse/sensex");
            results[key] = res.data?.data?.[0] || null;
          } else if (key === "nifty50") {
            res = await axios.get(`http://localhost:5000/${key}`);
            results[key] = res.data?.data || [];
          } else {
            res = await axios.get(`http://localhost:5000/${key}`);
            results[key] = res.data?.data?.[0] || null;
          }
        } catch (err) {
          results[key] = key === "nifty50" ? [] : null;
        }
      }
      if (isMounted) setIndexData(results);
    };
    fetchAll();
    const interval = setInterval(fetchAll, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // --- Fetch User Watchlists ---
  useEffect(() => {
    if (!user?._id) return;
    const fetchWatchlists = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/watchlists?userId=${user._id}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAllWatchlists(res.data);
          // Show only the first watchlist's stocks by default
          setWatchlist(res.data[0].stocks || []);
          setSelectedWatchlistId(res.data[0]._id);
        } else if (res.data && Array.isArray(res.data.stocks)) {
          setAllWatchlists([res.data]);
          setWatchlist(res.data.stocks);
          setSelectedWatchlistId(res.data._id);
        } else {
          setAllWatchlists([]);
          setWatchlist([]);
          setSelectedWatchlistId(null);
        }
      } catch (err) {
        setAllWatchlists([]);
        setWatchlist([]);
        setSelectedWatchlistId(null);
      }
    };
    fetchWatchlists();
  }, [user]);

  // --- Live price polling for dashboard watchlist ---
  useEffect(() => {
    let interval = null;
    const pollLivePrices = async () => {
      if (Array.isArray(allWatchlists) && allWatchlists.length > 0 && selectedWatchlistId) {
        const wl = allWatchlists.find(w => w._id === selectedWatchlistId);
        if (wl && Array.isArray(wl.stocks) && wl.stocks.length > 0) {
          const symbols = wl.stocks.map(s => s.symbol);
          try {
            const res = await axios.post("http://localhost:5000/live-prices", { symbols });
            const prices = res.data.prices || {};
            const changes = res.data.changes || {};
            const yesterdayCloses = res.data.yesterdayCloses || {};
            setWatchlist(prev => prev.map(s => {
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
            }));
          } catch (err) {
            // ignore polling errors
          }
        }
      }
    };
    interval = setInterval(pollLivePrices, 1000); // every second
    return () => clearInterval(interval);
  }, [allWatchlists, selectedWatchlistId]);

  // --- Portfolio Stats ---
  const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
  const investedValue = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
  // --- Today's Balance (Profit/Loss based on avg buy price) ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysGain = holdings.reduce((sum, h) => {
    const investedPerShare = Number(h.avgPrice);
    const currentPrice = h.currentPrice || investedPerShare;
    const currentTotal = h.currentValue || (currentPrice * h.qty);
    const investedTotal = h.investedValue || (investedPerShare * h.qty);
    const pnl = currentTotal - investedTotal;
    const firstBuyDate = h.lastDate ? new Date(h.lastDate) : null;
    const boughtToday = firstBuyDate && firstBuyDate >= today;
    if (boughtToday) {
      return sum + pnl;
    } else {
      const yesterdayClose = h.yesterdayClosePrice || currentPrice;
      return sum + (currentPrice - yesterdayClose) * h.qty;
    }
  }, 0);
  // --- Today's P&L Percent ---
  const todaysBase = holdings.reduce((sum, h) => {
    const investedPerShare = Number(h.avgPrice);
    const currentPrice = h.currentPrice || investedPerShare;
    const investedTotal = h.investedValue || (investedPerShare * h.qty);
    const firstBuyDate = h.lastDate ? new Date(h.lastDate) : null;
    const boughtToday = firstBuyDate && firstBuyDate >= today;
    if (boughtToday) {
      return sum + investedTotal;
    } else {
      return sum + (investedPerShare > 0 ? investedPerShare * h.qty : 0);
    }
  }, 0);
  const todaysGainPercent = todaysBase > 0 ? ((todaysGain / todaysBase) * 100).toFixed(2) : "0";

  // --- Top Performer from NIFTY 50 ---
  let niftyTopPerformer = null;
  if (indexData.nifty50 && Array.isArray(indexData.nifty50)) {
    niftyTopPerformer = indexData.nifty50.reduce((best, stock) => {
      if (!best || (stock.pChange || 0) > (best.pChange || 0)) return stock;
      return best;
    }, null);
  }

  // Helper for formatting
  const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // --- Loading State ---
  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (!user) return <h3 className="text-center mt-5">Please log in to view your dashboard.</h3>;

  return (
    <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      <div className="container-fluid py-3 px-2 px-md-4">
        {/* Welcome Section */}
        <div className="card border-0 shadow-sm mb-3 mb-md-4">
          <div className="card-body p-3 p-md-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
                Welcome back <span className="text-primary">{user?.username}</span>
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>Track and manage your investments efficiently</p>
            </div>
          </div>
        </div>

        {/* Stats
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {/* Responsive stats grid - 1 col on mobile, 2 on tablet, 4 on desktop */}
          {[
            {
              title: "Total Portfolio Value",
              value: `₹${totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              change: investedValue > 0 ? `${((totalPortfolioValue - investedValue) / investedValue * 100).toFixed(2)}%` : "0%",
              icon: <FaWallet />, color: "primary"
            },
            {
              title: "Available Cash",
              value: `₹${user?.balance ? Number(user.balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`,
              change: "",
              icon: <FaWallet />, color: "success"
            },
           {
  title: "Today's P&L",
  value: `₹${todaysGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  change: `${todaysGainPercent}%`,
  icon: <FaChartBar />, color: "warning"
},

            {
              title: "Top Performer (NIFTY 50)",
              value: niftyTopPerformer ? (
                <Link to={`/stock/${niftyTopPerformer.symbol}`} className="text-decoration-none text-danger fw-bold">
                  {niftyTopPerformer.symbol}
                </Link>
              ) : "-",
              change: niftyTopPerformer ? `${niftyTopPerformer.pChange >= 0 ? '+' : ''}${niftyTopPerformer.pChange?.toFixed(2)}% today` : "-",
              icon: <FaChartLine />, color: "danger"
            }
          ].map((item, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3">
              <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-secondary small mb-1">{item.title}</p>
                    <h4 className="fw-bold text-dark mb-1">{item.value}</h4>
                    <p className="text-success small mb-0">{item.change}</p>
                  </div>
                  <div className={`bg-${item.color}-subtle p-3 rounded-4`}>
                    <span className={`text-${item.color}`}>{item.icon}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Market Overview & Watchlist */}
        <div className="row g-4">
          {/* Market Overview */}
          <div className="col-lg-7">
            <div className="bg-white rounded-4 shadow-sm p-4 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Market Overview</h5>
                <button
                  className="btn btn-outline-secondary btn-sm ms-2"
                  style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
                  onClick={() => setIsChartMaximized(true)}
                  aria-label="Maximize Chart"
                >
                  <span style={{ fontSize: 18 }}>&#x26F6;</span> {/* Unicode for maximize */}
                </button>
              </div>

              {/* TradingViewWidget for SENSEX with light theme */}
              <div className="mb-4">
                <TradingViewWidget symbol="BSE:SENSEX" theme="light" height={400} />
              </div>

              <div className="mt-4 row g-3">
                {/* Indian Indices: NIFTY 50, SENSEX, India VIX, NIFTY BANK */}
                { [
                  { key: "nifty50", label: "NIFTY 50" },
                  { key: "sensex", label: "S&P BSE SENSEX" },
                  { key: "niftynext50", label: "NIFTY NEXT 50" },
                  { key: "niftybank", label: "NIFTY BANK" },
                ].map((idx, i) => {
                  let data;
                  if (idx.key === "nifty50" && Array.isArray(indexData.nifty50)) {
                    data = indexData.nifty50[0];
                  } else {
                    data = indexData[idx.key];
                  }
                  const handleIndexClick = () => {
                    navigate(`/user/market-overview/index/${idx.key}`);
                  };
                  if (!data) {
                    return (
                      <div key={i} className="col-6">
                        <div className="bg-light p-3 rounded-3" style={{ cursor: 'pointer' }} onClick={handleIndexClick}>
                          <p className="text-muted small mb-1">{idx.label}</p>
                          <span className="fw-semibold text-danger">No data</span>
                        </div>
                      </div>
                    );
                  }
                  const value =
                    data.lastPrice !== undefined && !isNaN(data.lastPrice)
                      ? Number(data.lastPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "-";
                  const percent =
                    data.pChange !== undefined && !isNaN(data.pChange)
                      ? Number(data.pChange).toFixed(2)
                      : "-";
                  const change =
                    data.change !== undefined && !isNaN(data.change)
                      ? Number(data.change).toFixed(2)
                      : "-";
                  const isPositive = Number(percent) >= 0;
                  return (
                    <div key={i} className="col-6">
                      <div className="bg-light p-3 rounded-3" style={{ cursor: 'pointer' }} onClick={handleIndexClick}>
                        <p className="text-muted small mb-1">{idx.label}</p>
                        <div className="d-flex justify-content-between" style={{ minHeight: "40px", flexDirection: "column" }}>
                          <span className="fw-semibold">₹{value}</span>
                          <span
                            className={`small fw-semibold ${isPositive ? "text-success" : "text-danger"}`}
                          >
                            {change !== "-" ? `${isPositive ? "+" : "-"}₹${Math.abs(change)} (${percent}%)` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Watchlist */}
          <div className="col-lg-5">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Your Watchlist</h5>
                <button
                  className="btn btn-link text-primary text-decoration-none p-0"
                  onClick={() => setShowWatchlistMenu((v) => !v)}
                >
                  Manage
                </button>
              </div>

              {/* Watchlist Names Dropdown */}
              {showWatchlistMenu && (
                <div className="mb-3">
                  {allWatchlists.length > 0 ? (
                    allWatchlists.map((wl) => (
                      <button
                        key={wl._id}
                        className={`btn btn-sm me-2 mb-2 ${selectedWatchlistId === wl._id ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => {
                          setSelectedWatchlistId(wl._id);
                          setWatchlist(wl.stocks || []);
                          setShowWatchlistMenu(false);
                        }}
                      >
                        {wl.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-muted">No watchlists found</span>
                  )}
                </div>
              )}

              {/* Watchlist Card List (matches Watchlists.jsx style) */}
              {Array.isArray(watchlist) && watchlist.length > 0 ? (
                <div>
                  {watchlist.map((s) => {
                    const isPositive = Number(s.percentChange) >= 0;
                    return (
                      <div
                        key={s.symbol}
                        className="d-flex align-items-center mb-3 watchlist-stock-card position-relative"
                        style={{
                          cursor: 'pointer',
                          background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
                          borderRadius: '1.5rem',
                          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
                          padding: '1rem 1.2rem',
                          transition: 'transform 0.12s, box-shadow 0.12s',
                        }}
                        onClick={() => navigate(`/stock/${s.symbol}`)}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.025)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'
                        }
                      >
                        {s.image ? (
                          <img src={s.image} alt={s.name} width="48" height="48" className="me-3 rounded-circle border border-2 border-primary-subtle" style={{ objectFit: 'cover', background: '#fff' }} />
                        ) : (
                          <div className="me-3 bg-primary text-white rounded-circle d-flex justify-content-center align-items-center border border-2 border-primary-subtle" style={{ width: 48, height: 48, fontWeight: 700, fontSize: 22, background: '#6366f1' }}>
                            {s.symbol?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="flex-grow-1">
                          <div className="fw-bold text-dark" style={{ fontSize: 18 }}>{s.symbol}
                            <span className="ms-2 badge" style={{ background: isPositive ? '#bbf7d0' : '#fecaca', color: isPositive ? '#059669' : '#ef4444', fontWeight: 600, fontSize: 13 }}>
                              {isPositive ? '+' : ''}{Number(s.percentChange).toFixed(2)}%
                            </span>
                          </div>
                          <div className="text-muted small" style={{ fontWeight: 500 }}>{s.name}</div>
                        </div>
                        <div className="text-end ms-3">
                          <div className="fw-semibold" style={{ fontSize: 17, color: '#0f172a' }}>₹{Number(s.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="small" style={{ color: isPositive ? '#059669' : '#ef4444', fontWeight: 600 }}>
                            {isPositive ? '+' : ''}{Number(s.change).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No stocks added yet</p>
              )}

              {/* More Button to Watchlist Page */}
              <button
                className="btn btn-outline-primary w-100 mt-3 border-dashed rounded-pill"
                onClick={() => navigate('/user/watchlist')}
              >
                More
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Chart Overlay */}
        {isChartMaximized && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100%',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: '90vw', height: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.2)' }}>
              <button
                className="btn btn-danger btn-sm"
                style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
                onClick={() => setIsChartMaximized(false)}
                aria-label="Minimize Chart"
              >
                <span style={{ fontSize: 18 }}>&#x2715;</span> {/* Unicode for close */}
              </button>
              <div style={{ width: '100%', height: '100%' }}>
                <TradingViewWidget symbol="BSE:SENSEX" theme="light" height={'100%'} width={'100%'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;











