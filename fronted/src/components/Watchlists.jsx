import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

// ✅ IMPORTANT: API BASE URL
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Watchlists({ user }) {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [symbolInput, setSymbolInput] = useState("");
  const [priceAnim, setPriceAnim] = useState({});
  const [addSuccess, setAddSuccess] = useState(false);

  const prevPercentRef = useRef({});
  const navigate = useNavigate();

  // ================= FETCH WATCHLISTS =================
  const fetchWatchlists = async () => {
    try {
      if (!user || !user._id) return;

      const res = await axios.get(
        `${API}/api/watchlists?userId=${user._id}`
      );

      setWatchlists(res.data);

      if (!selectedWatchlist && res.data.length > 0) {
        const first = res.data[0];
        setSelectedWatchlist(first);

        (first.stocks || []).forEach((s) => {
          prevPercentRef.current[s.symbol] = Number(s.percentChange || 0);
        });
      } else if (selectedWatchlist) {
        const updated = res.data.find(
          (wl) => wl._id === selectedWatchlist._id
        );
        setSelectedWatchlist(updated || null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWatchlists();
  }, []);

  // ================= LIVE PRICE POLLING =================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (
          selectedWatchlist &&
          Array.isArray(selectedWatchlist.stocks) &&
          selectedWatchlist.stocks.length > 0
        ) {
          const symbols = selectedWatchlist.stocks.map((s) => s.symbol);

          const res = await axios.post(`${API}/live-prices`, { symbols });

          const prices = res.data?.prices || {};
          const yesterdayCloses = res.data?.yesterdayCloses || {};

          setSelectedWatchlist((prev) => {
            if (!prev) return prev;

            const updatedStocks = prev.stocks.map((s) => {
              const livePrice = prices[s.symbol];
              const prevClose = yesterdayCloses[s.symbol];

              let change = Number(s.change || 0);
              let percentChange = Number(s.percentChange || 0);

              if (livePrice != null && prevClose != null) {
                change = Number(livePrice) - Number(prevClose);
                percentChange =
                  prevClose !== 0 ? (change / prevClose) * 100 : 0;
              }

              return {
                ...s,
                price: livePrice ?? s.price ?? 0,
                change,
                percentChange,
                previousClose: prevClose ?? s.previousClose ?? 0,
              };
            });

            return { ...prev, stocks: updatedStocks };
          });
        }
      } catch {
        // ignore polling errors
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedWatchlist]);

  // ================= CREATE WATCHLIST =================
  const createWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      alert("Enter watchlist name");
      return;
    }

    try {
      await axios.post(`${API}/api/watchlists`, {
        name: newWatchlistName,
        userId: user._id,
      });

      setNewWatchlistName("");
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE WATCHLIST =================
  const deleteWatchlist = async (id) => {
    if (!window.confirm("Delete this watchlist?")) return;

    try {
      await axios.delete(`${API}/api/watchlists/${id}`);
      setSelectedWatchlist(null);
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD STOCK =================
  const addStockToWatchlist = async () => {
    if (!symbolInput.trim() || !selectedWatchlist) return;

    try {
      await axios.post(
        `${API}/api/watchlists/${selectedWatchlist._id}/stocks`,
        { symbol: symbolInput }
      );

      setSymbolInput("");
      fetchWatchlists();

      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE STOCK =================
  const deleteStock = async (symbol) => {
    if (!selectedWatchlist) return;

    try {
      await axios.delete(
        `${API}/api/watchlists/${selectedWatchlist._id}/stocks/${symbol}`
      );
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="watchlist-container">
      <h2 className="page-title">
        <FaStar /> My Watchlists
      </h2>

      {/* CREATE */}
      <div className="create-bar">
        <input
          className="form-control"
          placeholder="New Watchlist"
          value={newWatchlistName}
          onChange={(e) => setNewWatchlistName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createWatchlist}>
          Create
        </button>
      </div>

      {/* WATCHLIST TABS */}
      <div className="watchlist-navbar">
        {watchlists.map((wl) => (
          <div
            key={wl._id}
            className={`watchlist-tab ${
              selectedWatchlist?._id === wl._id ? "active" : ""
            }`}
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

      {/* CONTENT */}
      {selectedWatchlist ? (
        <>
          {addSuccess && (
            <div className="alert alert-success text-center">
              Stock added successfully!
            </div>
          )}

          <div className="add-stock-bar">
            <input
              className="form-control"
              placeholder="Enter stock symbol"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
            />
            <button className="btn btn-success" onClick={addStockToWatchlist}>
              Add
            </button>
          </div>

          {selectedWatchlist.stocks?.length > 0 ? (
            selectedWatchlist.stocks.map((s) => {
              const price = Number(s.price || 0);
              const change = Number(s.change || 0);
              const percent = Number(s.percentChange || 0);

              const nseSymbol = s.symbol?.replace(/\.NS$/, "");

              return (
                <div
                  key={s.symbol}
                  className="stock-card"
                  onClick={() => navigate(`/stock/${nseSymbol}`)}
                >
                  <div>
                    <strong>{s.name}</strong>
                    <div>
                      ₹{price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {"  "}
                      <span
                        style={{
                          color: percent >= 0 ? "green" : "red",
                        }}
                      >
                        ({change.toFixed(2)}) {percent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <button
                    className="delete-stock-btn"
                    onClick={(e) => {
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
        <p className="text-muted">Select a watchlist</p>
      )}
    </div>
  );
}
