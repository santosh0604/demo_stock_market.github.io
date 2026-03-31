import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ✅ IMPORTANT: API BASE URL
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ⭐ Star icon inline (removes react-icons dependency causing status 127)
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="gold"
    viewBox="0 0 24 24"
    style={{ marginRight: 8 }}
  >
    <path d="M12 .587l3.668 7.431L24 9.306l-6 5.848 1.416 8.258L12 18.896l-7.416 3.516L6 14.154 0 8.306l8.332-1.288z" />
  </svg>
);

export default function Watchlists({ user }) {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [symbolInput, setSymbolInput] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [error, setError] = useState("");

  const prevPercentRef = useRef({});
  const navigate = useNavigate();

  // ================= FETCH WATCHLISTS =================
  const fetchWatchlists = async () => {
    try {
      if (!user || !user._id) return;

      const res = await fetch(`${API}/api/watchlists?userId=${user._id}`);
      if (!res.ok) throw new Error("Failed to fetch watchlists");
      const data = await res.json();

      setWatchlists(data);

      if (!selectedWatchlist && data.length > 0) {
        const first = data[0];
        setSelectedWatchlist(first);
        (first.stocks || []).forEach((s) => {
          prevPercentRef.current[s.symbol] = Number(s.percentChange || 0);
        });
      } else if (selectedWatchlist) {
        const updated = data.find((wl) => wl._id === selectedWatchlist._id);
        setSelectedWatchlist(updated || null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load watchlists.");
    }
  };

  useEffect(() => {
    fetchWatchlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          const res = await fetch(`${API}/live-prices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbols }),
          });

          if (!res.ok) return;
          const json = await res.json();

          const prices = json?.prices || {};
          const yesterdayCloses = json?.yesterdayCloses || {};

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
        // ignore polling errors silently
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
      const res = await fetch(`${API}/api/watchlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWatchlistName, userId: user._id }),
      });
      if (!res.ok) throw new Error("Failed to create watchlist");

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
      const res = await fetch(`${API}/api/watchlists/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete watchlist");

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
      const res = await fetch(
        `${API}/api/watchlists/${selectedWatchlist._id}/stocks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol: symbolInput.toUpperCase().trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to add stock");

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
      const res = await fetch(
        `${API}/api/watchlists/${selectedWatchlist._id}/stocks/${symbol}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete stock");

      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE ENTER KEY =================
  const handleSymbolKeyDown = (e) => {
    if (e.key === "Enter") addStockToWatchlist();
  };

  const handleWatchlistKeyDown = (e) => {
    if (e.key === "Enter") createWatchlist();
  };

  return (
    <div className="watchlist-container">
      <h2 className="page-title">
        <StarIcon /> My Watchlists
      </h2>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* CREATE */}
      <div className="create-bar">
        <input
          className="form-control"
          placeholder="New Watchlist"
          value={newWatchlistName}
          onChange={(e) => setNewWatchlistName(e.target.value)}
          onKeyDown={handleWatchlistKeyDown}
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
              placeholder="Enter stock symbol (e.g. RELIANCE)"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              onKeyDown={handleSymbolKeyDown}
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
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <strong>{s.name || s.symbol}</strong>
                    <div>
                      ₹
                      {price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {"  "}
                      <span style={{ color: percent >= 0 ? "green" : "red" }}>
                        ({change >= 0 ? "+" : ""}
                        {change.toFixed(2)}) {percent.toFixed(2)}%
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
        <p className="text-muted">Select a watchlist to get started</p>
      )}
    </div>
  );
}
