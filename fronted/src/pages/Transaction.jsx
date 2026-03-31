import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Transaction() {
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
   const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");


  

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





  // Handle responsive breakpoint
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









  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .transaction-card:hover {
        box-shadow: 0 8px 32px rgba(10,141,255,0.13) !important;
        transform: translateY(-2px) scale(1.01);
      }
      .transaction-row:hover .transaction-arrow {
        opacity: 1 !important;
        font-weight: 900 !important;
        font-size: 40px !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;
    const orderPrice = order.tradedPrice || order.avgPrice || 0;
    const avgPrice = order.avgPrice || order.tradedPrice || 0;
    const mktPrice = order.mktPrice || order.marketPrice || order.avgPrice || 0;
    const exchange = order.exchange || 'NSE';
    const duration = order.duration || 'Day';
    const orderValue = order.totalAmount || (order.qty && order.avgPrice ? order.qty * order.avgPrice : undefined);

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
        padding: "16px",
      }}>
        <div style={{ background: "#fff", borderRadius: 14, minWidth: 320, maxWidth: 850, width: "100%", boxShadow: "0 4px 32px rgba(0,0,0,0.10)", border: 'none', padding: 0 }}>
          <div className="p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold mb-0">Order Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="card mb-3" style={{ borderRadius: 12, border: '1px solid #eee', boxShadow: 'none' }}>
              <div className="card-body pb-2 pt-3 px-3 px-md-4">
                <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                  <span style={{ background: order.side === 'BUY' ? '#d1fae5' : '#fee2e2', color: order.side === 'BUY' ? '#059669' : '#dc2626', fontWeight: 700, fontSize: 15, borderRadius: 16, padding: '2px 16px', letterSpacing: 1 }}>{order.side}</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span className="text-muted" style={{ fontWeight: 500, fontSize: 15 }}>Qty</span>
                    <span className="fw-bold" style={{ fontSize: 28 }}>{order.qty}</span>
                  </div>
                </div>
                <div className="fw-bold" style={{ fontSize: 24, marginBottom: 8 }}>{order.companyName || order.symbol}</div>
                <hr style={{ margin: '16px 0 12px 0', borderTop: '1px dashed #ddd' }} />
                <div className="row g-0 mb-2" style={{ fontSize: 16 }}>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Order</div>
                    <div className="fw-bold">{order.priceType}</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Type</div>
                    <div className="fw-bold">Delivery</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Subtype</div>
                    <div className="fw-bold">Regular</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Order Price</div>
                    <div className="fw-bold">₹{Number(orderPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Avg Price</div>
                    <div className="fw-bold">₹{Number(avgPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Mkt Price</div>
                    <div className="fw-bold">₹{Number(mktPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Exchange</div>
                    <div className="fw-bold">{exchange}</div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className="text-muted" style={{ fontSize: 13 }}>Duration</div>
                    <div className="fw-bold">{duration}</div>
                  </div>
                </div>
                <hr style={{ margin: '16px 0 12px 0', borderTop: '1px dashed #ddd' }} />
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ fontSize: 16 }}>
                  <span>{new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="fw-bold">Order Value ₹{orderValue ? Number(orderValue).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!user?._id) return;
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://demo-stock-market-backend.onrender.com/orders/${user._id}`);
        const ordersData = res.data.orders || [];
        const completed = ordersData
          .filter((o) => o.status === "COMPLETED")
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setCompletedOrders(completed);
      } catch (err) {
        console.error("Failed to fetch completed orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedOrders();
  }, [user]);

  const filteredOrders = completedOrders.filter((order) => {
    const matchesSearch = searchTerm.trim() === "" ||
      order.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filterOption === "BUY") matchesFilter = order.side === "BUY";
    else if (filterOption === "SELL") matchesFilter = order.side === "SELL";
    else if (filterOption === "PENDING") matchesFilter = order.status === "PENDING";
    else if (filterOption === "COMPLETED") matchesFilter = order.status === "COMPLETED";
    else if (filterOption === "CANCELLED") matchesFilter = order.status === "CANCELLED";
    const matchesDate =
      (!dateFrom || new Date(order.date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(order.date) <= new Date(dateTo));
    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <div className="d-flex" style={{ backgroundColor: "var(--body-bg)", minHeight: "100vh" }}>
     

      <Sidebar  isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile} />

      <div className="flex-grow-1" style={{ marginLeft: !isMobile && isSidebarVisible ? "250px" : "0", transition: "margin-left 0.3s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className="container py-3 py-md-4 flex-grow-1">
          {/* Horizontal filter bar */}
          <div className="card shadow-sm p-3 mb-4" style={{ borderRadius: 12 }}>
            <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <input className="form-check-input" type="radio" checked readOnly />
                <label className="form-check-label me-2 me-md-3">Equity</label>
                <input className="form-check-input" type="radio" disabled />
                {/* <label className="form-check-label">GTT - Equity</label> */}
              </div>
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: 220, width: '100%' }}
                placeholder="Search for a Stock"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontWeight: 600, fontSize: 14 }}>From</span>
                <input type="date" className="form-control" style={{ maxWidth: 140, width: '100%' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontWeight: 600, fontSize: 14 }}>To</span>
                <input type="date" className="form-control" style={{ maxWidth: 140, width: '100%' }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
              <select className="form-select" style={{ maxWidth: 200, width: '100%' }} value={filterOption} onChange={e => setFilterOption(e.target.value)}>
                <option value="">All Orders</option>
                <option value="BUY">Buy orders</option>
                <option value="SELL">Sell orders</option>
                <option value="PENDING">Orders in progress</option>
                <option value="COMPLETED">Successful orders</option>
                <option value="CANCELLED">Unsuccessful orders</option>
              </select>
              <button className="btn btn-link p-0" style={{ color: "#0a8dff" }} onClick={() => {
                setSearchTerm(""); setFilterOption(""); setDateFrom(""); setDateTo("");
              }}>Clear all</button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="fw-bold text-primary mb-4" style={{ fontSize: '1.5rem' }}>Transaction History</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="alert alert-info text-center">No transactions found.</div>
            ) : (
              <div>
                {(showAllOrders ? filteredOrders : filteredOrders.slice(0, 13)).map((order, idx) => (
                  <div
                    key={order._id}
                    className="d-flex align-items-center justify-content-between p-3 mb-3 bg-white shadow-sm rounded transaction-card transaction-row"
                    style={{
                      cursor: "pointer",
                      borderLeft: order.side === "BUY" ? "4px solid #00c853" : "4px solid #ff5252",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      position: "relative"
                    }}
                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                  >
                    <div className="w-100 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ fontSize: 16 }}>
                      <span style={{ fontWeight: 500, minWidth: 120 }}>{order.companyName || order.symbol}</span>
                      <span style={{ color: "#0a8dff", fontWeight: 700, minWidth: 100 }}>₹{Number(order.avgPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      <span style={{ fontWeight: 700, minWidth: 60 }}>{order.side}</span>
                      <span style={{ fontWeight: 700, minWidth: 60 }}>{order.priceType}</span>
                      <span style={{ color: "#888", fontWeight: 700, minWidth: 100 }}>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <span className="transaction-arrow" style={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 32,
                      color: "#0a8dff",
                      fontWeight: 900,
                      opacity: 0,
                      transition: "opacity 0.2s"
                    }}>&#8594;</span>
                  </div>
                ))}
                {filteredOrders.length > 13 && (
                  <div className="text-center mt-3">
                    {!showAllOrders ? (
                      <button className="btn btn-primary px-4 py-2" style={{ fontSize: 16, fontWeight: 600, borderRadius: 8 }} onClick={() => setShowAllOrders(true)}>Show More</button>
                    ) : (
                      <button className="btn btn-secondary px-4 py-2" style={{ fontSize: 16, fontWeight: 600, borderRadius: 8 }} onClick={() => setShowAllOrders(false)}>Show Less</button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showModal && <OrderModal order={selectedOrder} onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
}
