import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [overallPL, setOverallPL] = useState(0);
  const [symbolPL, setSymbolPL] = useState({});
  const [stockSummary, setStockSummary] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Handle responsive breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:5000/orders/${user._id}`)
      .then(res => setOrders(res.data.orders || []));
  }, [user]);

  useEffect(() => {
    if (!fromDate || !toDate) {
      setFilteredOrders([]);
      setOverallPL(0);
      setSymbolPL({});
      setStockSummary([]);
      return;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const trades = orders.filter(o => {
      const d = new Date(o.date);
      return d >= from && d <= to && o.status === "COMPLETED";
    });
    setFilteredOrders(trades);

    // FIFO realized P&L calculation per sell trade
    const buyQueues = {};
    let totalPL = 0;
    const symbolPLMap = {};
    const sorted = [...orders].filter(o => o.status === "COMPLETED").sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(o => {
      if (!buyQueues[o.symbol]) buyQueues[o.symbol] = [];
      if (o.side === "BUY") {
        buyQueues[o.symbol].push({ qty: o.qty, price: o.tradedPrice });
      } else if (o.side === "SELL") {
        let qtyToSell = o.qty;
        let realized = 0;
        while (qtyToSell > 0 && buyQueues[o.symbol].length > 0) {
          const lot = buyQueues[o.symbol][0];
          const usedQty = Math.min(lot.qty, qtyToSell);
          realized += usedQty * (o.tradedPrice - lot.price);
          lot.qty -= usedQty;
          qtyToSell -= usedQty;
          if (lot.qty === 0) buyQueues[o.symbol].shift();
        }
        const d = new Date(o.date);
        if (d >= from && d <= to) {
          totalPL += realized;
          symbolPLMap[o.symbol] = (symbolPLMap[o.symbol] || 0) + realized;
        }
      }
    });
    setOverallPL(totalPL);
    setSymbolPL(symbolPLMap);

    // Build stock summary (unique stocks with their latest price and total P&L)
    const summary = {};
    filteredOrders.forEach(o => {
      if (!summary[o.symbol]) {
        summary[o.symbol] = {
          symbol: o.symbol,
          companyName: o.companyName,
          latestPrice: o.tradedPrice,
          totalQty: 0,
          buyCount: 0,
          sellCount: 0,
          totalBuyValue: 0,
          totalSellValue: 0,
        };
      }
      summary[o.symbol].latestPrice = o.tradedPrice;
      if (o.side === "BUY") {
        summary[o.symbol].totalQty += o.qty;
        summary[o.symbol].buyCount += 1;
        summary[o.symbol].totalBuyValue += o.qty * o.tradedPrice;
      } else {
        summary[o.symbol].totalQty -= o.qty;
        summary[o.symbol].sellCount += 1;
        summary[o.symbol].totalSellValue += o.qty * o.tradedPrice;
      }
    });
    setStockSummary(Object.values(summary));
  }, [fromDate, toDate, orders]);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const getStockTransactions = (symbol) => {
    return filteredOrders.filter(o => o.symbol === symbol);
  };

  return (
    <>
      <div style={{ padding: "16px" }}>
        {/* Date Filter Section */}
        <div className="card mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
          <div className="card-body p-3">
            <label className="form-label fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>Select Date Range</label>
            <div className="row g-2">
              <div className="col-6 col-sm">
                <label className="form-label small text-muted">From</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm" 
                  value={fromDate} 
                  onChange={e => setFromDate(e.target.value)}
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
              <div className="col-6 col-sm">
                <label className="form-label small text-muted">To</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm" 
                  value={toDate} 
                  onChange={e => setToDate(e.target.value)}
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overall P&L Card */}
        {fromDate && toDate && (
          <div className="card mb-3" style={{ 
            borderRadius: "10px", 
            border: "1px solid #e5e7eb",
            backgroundColor: overallPL >= 0 ? "#f0fdf4" : "#fef2f2"
          }}>
            <div className="card-body p-3 text-center">
              <div className="text-muted small mb-1">Overall Profit & Loss</div>
              <div className={`fw-bold ${overallPL >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "1.5rem" }}>
                {overallPL >= 0 ? "+" : ""}₹{overallPL.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}

        {/* MOBILE VIEW: Stock List */}
        {isMobile && fromDate && toDate && stockSummary.length > 0 && (
          <div className="card" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-transparent border-0 pb-0">
              <h6 className="fw-bold" style={{ fontSize: "0.95rem" }}>Stocks Traded</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {stockSummary.map((stock) => {
                  const pnl = symbolPL[stock.symbol] || 0;
                  return (
                    <div
                      key={stock.symbol}
                      className="list-group-item list-group-item-action p-3"
                      style={{ 
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background-color 0.2s"
                      }}
                      onClick={() => handleStockClick(stock)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{stock.symbol}</div>
                          <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                            {stock.companyName || stock.symbol}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold" style={{ fontSize: "0.95rem" }}>₹{stock.latestPrice}</div>
                          <div className={`small ${pnl >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "0.75rem" }}>
                            {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP VIEW: Stock-wise P&L Summary */}
        {!isMobile && fromDate && toDate && Object.keys(symbolPL).length > 0 && (
          <div className="card mb-3" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-transparent border-0 pb-0">
              <h6 className="fw-bold" style={{ fontSize: "0.95rem" }}>Stock-wise P&L</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-2">
                {Object.entries(symbolPL).map(([symbol, pnl]) => (
                  <div key={symbol} className="col-6 col-sm-4 col-md-3">
                    <div className="p-2 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="small text-muted" style={{ fontSize: "0.75rem" }}>{symbol}</div>
                      <div className={`fw-bold ${pnl >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "0.9rem" }}>
                        {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP VIEW: Transaction Table */}
        {!isMobile && fromDate && toDate && (
          <div className="card" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-transparent border-0 pb-0">
              <h6 className="fw-bold" style={{ fontSize: "0.95rem" }}>Transaction Details</h6>
            </div>
            <div className="card-body p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-chart-line me-2"></i>
                  No trades in selected date range
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{ fontSize: "0.85rem" }}>
                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0 }}>
                      <tr>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600" }}>Date</th>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600" }}>Symbol</th>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600" }}>Side</th>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600", textAlign: "right" }}>Qty</th>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600", textAlign: "right" }}>Price</th>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600", textAlign: "right" }}>Amount</th>
                        <th style={{ padding: "10px 12px", fontSize: "0.8rem", fontWeight: "600", textAlign: "right" }}>P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => {
                        const stockPnl = o.side === "SELL" ? (symbolPL[o.symbol] || 0) : 0;
                        return (
                          <tr key={o._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                              {new Date(o.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "500" }}>{o.symbol}</td>
                            <td style={{ padding: "10px 12px" }}>
                              <span className={`badge ${o.side === "BUY" ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
                                {o.side}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>{o.qty}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>₹{o.tradedPrice}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                              ₹{(o.qty * o.tradedPrice).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                              {o.side === "SELL" ? (
                                <span className={stockPnl >= 0 ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                                  {stockPnl >= 0 ? "+" : ""}₹{stockPnl.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                                </span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE: Empty State */}
        {isMobile && fromDate && toDate && stockSummary.length === 0 && (
          <div className="card" style={{ borderRadius: "10px" }}>
            <div className="card-body text-center py-4 text-muted">
              <i className="fas fa-chart-line me-2"></i>
              No trades in selected date range
            </div>
          </div>
        )}
      </div>

      {/* Stock Detail Modal (Mobile) */}
      {showModal && selectedStock && (
        <div 
          className="modal d-block" 
          style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            zIndex: 1050,
            overflow: "auto"
          }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ marginTop: "5%" }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold">{selectedStock.symbol}</h5>
                  <small className="text-muted">{selectedStock.companyName || selectedStock.symbol}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Stock Summary */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="text-muted small">Latest Price</div>
                      <div className="fw-bold">₹{selectedStock.latestPrice}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="text-muted small">Net Position</div>
                      <div className="fw-bold">{selectedStock.totalQty > 0 ? "Long" : selectedStock.totalQty < 0 ? "Short" : "Square Off"}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="text-muted small">Total Buy</div>
                      <div className="fw-bold">{selectedStock.buyCount} trades</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="text-muted small">Total Sell</div>
                      <div className="fw-bold">{selectedStock.sellCount} trades</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded" style={{ 
                      backgroundColor: (symbolPL[selectedStock.symbol] || 0) >= 0 ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${(symbolPL[selectedStock.symbol] || 0) >= 0 ? "#86efac" : "#fca5a5"}`
                    }}>
                      <div className="text-muted small">Realized P&L</div>
                      <div className={`fw-bold ${(symbolPL[selectedStock.symbol] || 0) >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "1.25rem" }}>
                        {(symbolPL[selectedStock.symbol] || 0) >= 0 ? "+" : ""}₹{(symbolPL[selectedStock.symbol] || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <h6 className="fw-bold mb-3">Transaction History</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-hover" style={{ fontSize: "0.85rem" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Side</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStockTransactions(selectedStock.symbol).map(o => (
                        <tr key={o._id}>
                          <td>{new Date(o.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                          <td>
                            <span className={`badge ${o.side === "BUY" ? "bg-success" : "bg-danger"}`}>{o.side}</span>
                          </td>
                          <td>{o.qty}</td>
                          <td>₹{o.tradedPrice}</td>
                          <td>₹{(o.qty * o.tradedPrice).toLocaleString("en-IN", { minimumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}