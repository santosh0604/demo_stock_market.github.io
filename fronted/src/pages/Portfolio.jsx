import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Portfolio() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 992); // Closed on mobile by default, open on desktop
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
 const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
   const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  // const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  // const closeSidebar = () => setIsSidebarVisible(false);

  // Handle responsive breakpoint
  // useEffect(() => {
  //   const handleResize = () => {
  //     const mobile = window.innerWidth < 992;
  //     setIsMobile(mobile);
  //     if (!mobile) {
  //       setIsSidebarVisible(true);
  //     }
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      // On desktop, always show sidebar; on mobile, keep current state
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };




  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modifyQty, setModifyQty] = useState("");
  const [modifyPrice, setModifyPrice] = useState("");
  const [modifyPriceType, setModifyPriceType] = useState("limit");
  const [modifyMarketPrice, setModifyMarketPrice] = useState("");
  const [modifyLoading, setModifyLoading] = useState(false);
  const [modifyOrderMessage, setModifyOrderMessage] = useState("");

  const location = useLocation();
  let activeTab = "holdings";
  if (location.pathname.includes("orders")) activeTab = "orders";

  const fetchOrders = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`https://demo-stock-market-backend.onrender.com/orders/${user._id}`);
      const ordersData = res.data.orders || [];
      setOrders(ordersData);
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
      await fetchLivePrices(finalHoldings);
      setHoldings(finalHoldings);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (activeTab !== "orders" || !user?._id) return;
    const interval = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(interval);
  }, [activeTab, user]);

  const fetchLivePrices = async (holdingsData) => {
    try {
      const symbols = holdingsData.map(h => h.symbol);
      if (symbols.length === 0) return;
      const res = await axios.post(`https://demo-stock-market-backend.onrender.com/live-prices`, { symbols });
      const prices = res.data.prices || {};
      const changes = res.data.changes || {};
      const yesterdayCloses = res.data.yesterdayCloses || {};
      holdingsData.forEach((h) => {
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
      setHoldings([...holdingsData]);
    } catch (err) {
      setHoldings([...holdingsData]);
    }
  };

  useEffect(() => {
    if (holdings.length === 0) return;
    const interval = setInterval(async () => {
      await fetchLivePrices(holdings);
    }, 5000);
    return () => clearInterval(interval);
  }, [holdings.length]);

  const goToStock = (symbol) => navigate(`/stock/${symbol}`);
  const pendingOrders = Array.isArray(orders) ? orders.filter((o) => o.status === "PENDING") : [];

  const openModifyModal = async (order) => {
    setSelectedOrder(order);
    setModifyQty(order.qty.toString());
    setModifyPrice(order.limitPrice.toString());
    setModifyPriceType("limit");
    setShowModifyModal(true);
    try {
      const pricesRes = await axios.post("https://demo-stock-market-backend.onrender.com/live-prices", { symbols: [order.symbol] });
      if (pricesRes.data.success && pricesRes.data.prices && pricesRes.data.prices[order.symbol]) {
        setModifyMarketPrice(pricesRes.data.prices[order.symbol].toString());
      }
    } catch (err) {
      console.error("Failed to fetch market price:", err);
    }
  };

  const handleModifyOrder = async () => {
    if (!selectedOrder || !modifyQty) {
      setModifyOrderMessage("Please fill in all fields");
      setTimeout(() => setModifyOrderMessage(""), 2000);
      return;
    }
    const priceToUse = modifyPriceType === "limit" ? modifyPrice : modifyMarketPrice;
    if (!priceToUse || Number(priceToUse) === 0) {
      setModifyOrderMessage("Please enter valid price");
      setTimeout(() => setModifyOrderMessage(""), 2000);
      return;
    }
    setModifyLoading(true);
    try {
      const res = await axios.put(`https://demo-stock-market-backend.onrender.com/modify-order/${selectedOrder._id}`, {
        userId: user._id,
        newQty: Number(modifyQty),
        newLimitPrice: Number(priceToUse),
        priceType: modifyPriceType,
      });
      setModifyOrderMessage("Order modified successfully!");
      setTimeout(() => setModifyOrderMessage(""), 2000);
      const ordersRes = await axios.get(`https://demo-stock-market-backend.onrender.com/orders/${user._id}`);
      setOrders(ordersRes.data.orders);
      if (res.data && res.data.balance !== undefined) {
        setUser({ ...user, balance: res.data.balance });
      }
      setShowModifyModal(false);
      setSelectedOrder(null);
    } catch (err) {
      setModifyOrderMessage(err.response?.data?.error || "Failed to modify order");
      setTimeout(() => setModifyOrderMessage(""), 2000);
    } finally {
      setModifyLoading(false);
    }
  };

  return (
    <>
      {modifyOrderMessage && (
        <div className="alert alert-success position-fixed top-50 start-50 translate-middle" style={{ zIndex: 9999, minWidth: 240, textAlign: 'center', fontSize: 18, fontWeight: 500, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', color: '#059669', background: '#fff', border: '1.5px solid #059669' }}>
          {modifyOrderMessage}
        </div>
      )}
      
      <div className="d-flex" style={{ backgroundColor: "var(--body-bg)", minHeight: "100vh" }}>
       

        <Sidebar     isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile} />

        <div className="flex-grow-1" style={{ marginLeft: !isMobile && isSidebarVisible ? "250px" : "0", transition: "margin-left 0.3s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar toggleSidebar={toggleSidebar} />

          <div className="container py-3 py-md-4 flex-grow-1" style={{ overflowX: 'hidden' }}>
            {/* DESKTOP VIEW - Original Design */}
            {!isMobile ? (
              <div className="card shadow-sm border-0 p-4">
                <div className="d-flex mb-4 gap-3">
                  <button className={`btn ${activeTab === "holdings" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => navigate("/user/portfolio/holdings")}>Holdings</button>
                  <button className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => navigate("/user/portfolio/orders")}>Orders</button>
                </div>

                {activeTab === "holdings" && (
                  <div>
                    {holdings.length > 0 && (
                      <div className="card mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-3">
                              <small className="text-muted">Current Value</small>
                              {(() => {
                                const currentVal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
                                const investedVal = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
                                const isLoss = currentVal < investedVal;
                                return (<h5 className={`fw-bold ${isLoss ? 'text-danger' : 'text-success'}`}>₹{currentVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h5>);
                              })()}
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted">Invested Value</small>
                              <h5 className="fw-bold text-dark">₹{holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h5>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted">Total Holdings</small>
                              <h5 className="fw-bold text-dark">{holdings.reduce((sum, h) => sum + h.qty, 0)} shares</h5>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted">Total P&L</small>
                              {(() => {
                                const currentVal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
                                const investedVal = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
                                const pnl = currentVal - investedVal;
                                const pnlPercent = investedVal > 0 ? ((pnl / investedVal) * 100).toFixed(2) : 0;
                                return (<h5 className={`fw-bold ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({pnlPercent}%)</h5>);
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                          <tr>
                            <th>Company</th>
                            <th>Price (1D%)</th>
                            <th>1D Return</th>
                            <th>Returns (%)</th>
                            <th className="text-end">Current (Invested)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdings.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-4">No holdings yet.</td></tr>
                          ) : (
                            holdings.map((h) => {
                              const investedPerShare = Number(h.avgPrice);
                              const investedTotal = h.investedValue || (investedPerShare * h.qty);
                              const currentPrice = h.currentPrice || investedPerShare;
                              const currentTotal = h.currentValue || (currentPrice * h.qty);
                              const pnl = currentTotal - investedTotal;
                              const pnlPercent = investedTotal > 0 ? ((pnl / investedTotal) * 100).toFixed(2) : 0;
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const firstBuyDate = h.lastDate ? new Date(h.lastDate) : null;
                              const boughtToday = firstBuyDate && firstBuyDate >= today;
                              let oneDayReturn, oneDayReturnPercent;
                              if (boughtToday) {
                                oneDayReturn = pnl;
                                oneDayReturnPercent = pnlPercent;
                              } else {
                                const yesterdayClose = h.yesterdayClosePrice || currentPrice;
                                oneDayReturn = (currentPrice - yesterdayClose) * h.qty;
                                oneDayReturnPercent = investedPerShare > 0 ? (((currentPrice - yesterdayClose) / investedPerShare) * 100).toFixed(2) : 0;
                              }
                              return (
                                <tr key={h.symbol} style={{ borderBottom: "1px solid #eee" }}>
                                  <td>
                                    <strong onClick={() => goToStock(h.symbol)} style={{ cursor: "pointer", color: "#007bff" }}>{h.symbol}</strong>
                                    <br /><small className="text-muted">{h.qty} shares • Avg. ₹{investedPerShare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</small>
                                  </td>
                                  <td>
                                    <div>₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                    <small className={(h.dailyChangePercent || 0) >= 0 ? 'text-success' : 'text-danger'}>{(h.dailyChangePercent || 0) >= 0 ? '+' : ''}{(h.dailyChangePercent || 0).toFixed(2)}%</small>
                                  </td>
                                  <td>
                                    <span className={oneDayReturn >= 0 ? 'text-success' : 'text-danger'}>₹{oneDayReturn.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({oneDayReturnPercent}%)</span>
                                  </td>
                                  <td>
                                    <span className={pnl >= 0 ? 'text-success' : 'text-danger'}>₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({pnlPercent}%)</span>
                                  </td>
                                  <td className="text-end">
                                    <strong>₹{currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                                    <br /><small className="text-muted">₹{investedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</small>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-secondary">
                        <tr>
                          <th>Symbol</th>
                          <th>Side</th>
                          <th>Type</th>
                          <th>Qty</th>
                          <th>Limit Price</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingOrders.length === 0 ? (
                          <tr><td colSpan="7" className="text-center">No pending orders.</td></tr>
                        ) : (
                          pendingOrders.map((o) => (
                            <tr key={o._id}>
                              <td>{o.symbol}</td>
                              <td><span className={`badge ${o.side === 'BUY' ? 'bg-success' : 'bg-danger'}`}>{o.side}</span></td>
                              <td><span className="badge bg-info">{o.priceType}</span></td>
                              <td>{o.qty}</td>
                              <td>₹{o.limitPrice}</td>
                              <td>₹{(o.qty * o.limitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-sm btn-warning" onClick={() => openModifyModal(o)}>Modify</button>
                                  <button className="btn btn-sm btn-danger" onClick={async () => {
                                    if (!window.confirm('Cancel this order?')) return;
                                    try {
                                      const res = await axios.delete(`https://demo-stock-market-backend.onrender.com/cancel-order/${o._id}`, { data: { userId: user._id } });
                                      alert(res.data.message || 'Order cancelled');
                                      const ordersRes = await axios.get(`http://localhost:5000/orders/${user._id}`);
                                      setOrders(ordersRes.data.orders);
                                      if (res.data && res.data.balance !== undefined) setUser({ ...user, balance: res.data.balance });
                                    } catch (err) {
                                      alert(err.response?.data?.error || 'Failed to cancel');
                                    }
                                  }}>Cancel</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* MOBILE VIEW - Redesigned */
              <div>
                {/* Tabs */}
                <div className="d-flex gap-2 mb-3">
                  <button className={`btn flex-grow-1 ${activeTab === "holdings" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => navigate("/user/portfolio/holdings")}>Holdings</button>
                  <button className={`btn flex-grow-1 ${activeTab === "orders" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => navigate("/user/portfolio/orders")}>Orders</button>
                </div>

                {activeTab === "holdings" && (
                  <div>
                    {/* Summary Cards */}
                    {holdings.length > 0 && (
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="card p-2" style={{ borderRadius: "10px" }}>
                            <small className="text-muted" style={{ fontSize: "0.7rem" }}>Current Value</small>
                            {(() => {
                              const currentVal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
                              const investedVal = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
                              const isLoss = currentVal < investedVal;
                              return (<div className={`fw-bold ${isLoss ? 'text-danger' : 'text-success'}`} style={{ fontSize: "0.9rem" }}>₹{currentVal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>);
                            })()}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="card p-2" style={{ borderRadius: "10px" }}>
                            <small className="text-muted" style={{ fontSize: "0.7rem" }}>Invested</small>
                            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>₹{holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="card p-2" style={{ borderRadius: "10px" }}>
                            <small className="text-muted" style={{ fontSize: "0.7rem" }}>Total P&L</small>
                            {(() => {
                              const currentVal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
                              const investedVal = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
                              const pnl = currentVal - investedVal;
                              const pnlPercent = investedVal > 0 ? ((pnl / investedVal) * 100).toFixed(2) : 0;
                              return (<div className={`fw-bold ${pnl >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: "0.9rem" }}>{pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>);
                            })()}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="card p-2" style={{ borderRadius: "10px" }}>
                            <small className="text-muted" style={{ fontSize: "0.7rem" }}>Shares</small>
                            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{holdings.reduce((sum, h) => sum + h.qty, 0)}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Holdings List */}
                    {holdings.length === 0 ? (
                      <div className="card p-4 text-center" style={{ borderRadius: "12px" }}>
                        <p className="text-muted mb-0">No holdings yet.</p>
                      </div>
                    ) : (
                      holdings.map((h) => {
                        const investedPerShare = Number(h.avgPrice);
                        const investedTotal = h.investedValue || (investedPerShare * h.qty);
                        const currentPrice = h.currentPrice || investedPerShare;
                        const currentTotal = h.currentValue || (currentPrice * h.qty);
                        const pnl = currentTotal - investedTotal;
                        const pnlPercent = investedTotal > 0 ? ((pnl / investedTotal) * 100).toFixed(2) : 0;
                        return (
                          <div key={h.symbol} className="card mb-2" style={{ borderRadius: "12px", cursor: "pointer" }} onClick={() => goToStock(h.symbol)}>
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <div className="fw-bold" style={{ fontSize: "1rem" }}>{h.symbol}</div>
                                  <small className="text-muted">{h.qty} shares @ ₹{investedPerShare}</small>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold" style={{ fontSize: "1rem" }}>₹{currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>
                                  <small className="text-muted">₹{investedTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</small>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <small className="text-muted">Price: </small>
                                  <span className="fw-semibold">₹{currentPrice}</span>
                                  <span className={`ms-2 badge ${((h.dailyChangePercent || 0) >= 0) ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: "0.65rem" }}>
                                    {((h.dailyChangePercent || 0) >= 0) ? '+' : ''}{(h.dailyChangePercent || 0).toFixed(2)}%
                                  </span>
                                </div>
                                <span className={`fw-bold ${pnl >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: "0.9rem" }}>
                                  {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(0)} ({pnlPercent}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === "orders" && (
                  <div>
                    {pendingOrders.length === 0 ? (
                      <div className="card p-4 text-center" style={{ borderRadius: "12px" }}>
                        <p className="text-muted mb-0">No pending orders.</p>
                      </div>
                    ) : (
                      pendingOrders.map((o) => (
                        <div key={o._id} className="card mb-2" style={{ borderRadius: "12px" }}>
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="fw-bold" style={{ fontSize: "1rem" }}>{o.symbol}</div>
                              <span className={`badge ${o.side === 'BUY' ? 'bg-success' : 'bg-danger'}`}>{o.side}</span>
                            </div>
                            <div className="row g-2 mb-2" style={{ fontSize: "0.8rem" }}>
                              <div className="col-6">
                                <small className="text-muted">Qty: </small><strong>{o.qty}</strong>
                              </div>
                              <div className="col-6 text-end">
                                <small className="text-muted">Price: </small><strong>₹{o.limitPrice}</strong>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Type: </small><span className="badge bg-info">{o.priceType}</span>
                              </div>
                              <div className="col-6 text-end">
                                <small className="text-muted">Amount: </small><strong>₹{(o.qty * o.limitPrice).toLocaleString('en-IN', { minimumFractionDigits: 0 })}</strong>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-warning flex-grow-1" onClick={() => openModifyModal(o)}>Modify</button>
                              <button className="btn btn-sm btn-danger flex-grow-1" onClick={async () => {
                                if (!window.confirm('Cancel this order?')) return;
                                try {
                                  const res = await axios.delete(`https://demo-stock-market-backend.onrender.com/cancel-order/${o._id}`, { data: { userId: user._id } });
                                  alert(res.data.message || 'Order cancelled');
                                  const ordersRes = await axios.get(`https://demo-stock-market-backend.onrender.com/orders/${user._id}`);
                                  setOrders(ordersRes.data.orders);
                                  if (res.data && res.data.balance !== undefined) setUser({ ...user, balance: res.data.balance });
                                } catch (err) {
                                  alert(err.response?.data?.error || 'Failed to cancel');
                                }
                              }}>Cancel</button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModifyModal && selectedOrder && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1000 }}>
          <div className="modal-dialog" style={{ marginTop: "10%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modify Order - {selectedOrder.symbol}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModifyModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-control" value={modifyQty} onChange={(e) => setModifyQty(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price Type</label>
                  <div className="btn-group w-100">
                    <input type="radio" className="btn-check" name="priceType" id="limitOption" value="limit" checked={modifyPriceType === "limit"} onChange={(e) => setModifyPriceType(e.target.value)} />
                    <label className="btn btn-outline-primary" htmlFor="limitOption">Limit</label>
                    <input type="radio" className="btn-check" name="priceType" id="marketOption" value="market" checked={modifyPriceType === "market"} onChange={(e) => setModifyPriceType(e.target.value)} />
                    <label className="btn btn-outline-primary" htmlFor="marketOption">Market</label>
                  </div>
                </div>
                {modifyPriceType === "limit" && (
                  <div className="mb-3">
                    <label className="form-label">Limit Price (₹)</label>
                    <input type="number" className="form-control" value={modifyPrice} onChange={(e) => setModifyPrice(e.target.value)} step="0.01" />
                  </div>
                )}
                {modifyPriceType === "market" && (
                  <div className="mb-3">
                    <label className="form-label">Market Price (₹)</label>
                    <input type="number" className="form-control" value={modifyMarketPrice} readOnly step="0.01" />
                  </div>
                )}
                <div className="alert alert-info"><small>Current: {selectedOrder.qty} @ ₹{selectedOrder.limitPrice}</small></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModifyModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleModifyOrder} disabled={modifyLoading}>{modifyLoading ? "Updating..." : "Update"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
