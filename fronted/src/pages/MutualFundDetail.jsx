import React, { useEffect, useState } from "react";
import axios from "axios";

// ModernCard Component (FULL WIDTH)
const ModernCard = ({ fund }) => (
  <div
    className="modern-card p-3 mb-4"
    style={{
      borderRadius: 22,
      background: "var(--card-bg)",
      boxShadow: "0 8px 32px rgba(30,64,175,0.10)",
      width: "100%",
      transition: "all .3s cubic-bezier(.4,2,.6,1)",
      transform: "translateY(0px)",
      animation: "fadeInUp .5s",
      marginBottom: 24,
      border: '1.5px solid #e3e6f0',
      overflow: 'hidden',
      color: '#1a1a1a', // default text color for card body
    }}
    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.025)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
  >
    {/* Card Header */}
    <div style={{
      background: 'linear-gradient(90deg, var(--primary) 0%, #1E40AF 100%)',
      padding: '18px 20px 12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      borderBottom: '1.5px solid #e3e6f0',
      color: '#fff', // make all header text white for contrast
    }}>
      <div style={{
        width: 54,
        height: 54,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        fontWeight: 800,
        color: '#1E40AF',
        boxShadow: '0 2px 8px #1E40AF22',
      }}>
        {(fund.scheme_name || fund.name || fund.fund_name || "M")[0].toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 2, textShadow: '0 1px 4px #1E40AF55' }}>
          {fund.scheme_name || fund.name || fund.fund_name}
        </div>
        <div style={{ fontSize: 15, color: '#e0e0e0', fontWeight: 600, marginBottom: 2 }}>
          <span style={{
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            borderRadius: 6,
            padding: '2px 10px',
            fontWeight: 700,
            fontSize: 13,
            marginRight: 8,
          }}>{fund.category}</span>
          <span style={{ color: '#e0e0e0', fontWeight: 500 }}>{fund.subcategory}</span>
        </div>
        {fund.star_rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < fund.star_rating ? '#FFD700' : '#e0e0e0', fontSize: 18, textShadow: '0 1px 2px #1E40AF55' }}>★</span>
              ))}
            </div>
            <span style={{ color: '#fff', fontSize: 13, marginLeft: 2, textShadow: '0 1px 2px #1E40AF55' }}>
              {fund.star_rating} Star{Number(fund.star_rating) > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Card Body */}
    <div style={{ padding: '18px 20px 10px 20px', display: 'flex', flexWrap: 'wrap', gap: 24, color: '#1a1a1a' }}>
      {/* Left Column */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ marginBottom: 8, fontSize: 15, color: '#1a1a1a' }}>
          <b>NAV:</b> <span style={{ color: 'var(--primary)' }}>{fund.latest_nav || fund.nav || fund.price || 'N/A'}</span>
        </div>
        <div style={{ marginBottom: 8, fontSize: 15, color: '#1a1a1a' }}>
          <b>Asset Size:</b> <span style={{ color: '#388e3c' }}>{fund.asset_size ? `${fund.asset_size} Cr` : 'N/A'}</span>
        </div>
        <div style={{ marginBottom: 8, fontSize: 15, color: '#1a1a1a' }}>
          <b>1D Change:</b> <span style={{ color: fund.percentage_change >= 0 ? '#388e3c' : '#d32f2f' }}>{fund.percentage_change ? `${fund.percentage_change}%` : 'N/A'}</span>
        </div>
        <div style={{ marginBottom: 8, fontSize: 15, color: '#1a1a1a' }}>
          <b>Symbol:</b> <span style={{ color: '#607d8b' }}>{fund.symbol || fund.code || 'MF'}</span>
        </div>
        {fund.description && (
          <div style={{ fontSize: 13, color: '#444', marginTop: 8 }}>{fund.description}</div>
        )}
      </div>

      {/* Right Column: Returns */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#1E40AF', fontSize: 15 }}>Returns</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))', gap: 8 }}>
          <div>1M: <b style={{ color: '#388e3c' }}>{fund["1_month_return"] ?? 'N/A'}%</b></div>
          <div>3M: <b style={{ color: '#388e3c' }}>{fund["3_month_return"] ?? 'N/A'}%</b></div>
          <div>6M: <b style={{ color: '#388e3c' }}>{fund["6_month_return"] ?? 'N/A'}%</b></div>
          <div>1Y: <b style={{ color: '#388e3c' }}>{fund["1_year_return"] ?? 'N/A'}%</b></div>
          <div>3Y: <b style={{ color: '#388e3c' }}>{fund["3_year_return"] ?? 'N/A'}%</b></div>
          <div>5Y: <b style={{ color: '#388e3c' }}>{fund["5_year_return"] ?? 'N/A'}%</b></div>
        </div>
      </div>
    </div>
  </div>
);

export default function MutualFundDetail() {
  const [funds, setFunds] = useState([]);
  const [displayFunds, setDisplayFunds] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Animation CSS
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0px); }
    }
  `;

  // Flatten nested structure
  const flattenFunds = (data) => {
    const flat = [];
    for (const category in data) {
      const subcategories = data[category];
      for (const subcategory in subcategories) {
        const fundsArray = subcategories[subcategory];
        if (Array.isArray(fundsArray)) {
          flat.push(
            ...fundsArray.map((fund) => ({
              ...fund,
              category,
              subcategory,
            }))
          );
        }
      }
    }
    return flat;
  };

  // Fetch on load
  useEffect(() => {
    fetchAllFunds();
  }, []);

  const fetchAllFunds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mutual-funds/qqq");
      const flatFunds = flattenFunds(res.data);
      console.log(flatFunds);
      setFunds(flatFunds);

      setTimeout(() => {
        // Show only 20 cards regardless of category
        setDisplayFunds(flatFunds.slice(0, 20));
      }, 150);
    } catch (err) {
      console.error("Error fetching mutual funds:", err.message);
    }
  };

  // Search
  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/mutual-fund-search/qqq?query=${query}`
      );

      const flatFunds = flattenFunds(res.data);
      setFunds(flatFunds);
      setSuggestions([]);

      setTimeout(() => {
        setDisplayFunds(flatFunds);
      }, 150);
    } catch (err) {
      console.error("Search error:", err.message);
    }
  };

  // Enter = Search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Filter by type (case-insensitive, exact match for main types)
  const applyFilter = (list, type = filterType) => {
    if (type === "all") return list;
    if (type === "others") {
      // Exclude equity, debt, index, hybrid
      return list.filter((fund) => {
        const cat = (fund.category || "").toLowerCase();
        return (
          cat !== "equity" &&
          cat !== "debt" &&
          cat !== "index" &&
          cat !== "hybrid"
        );
      });
    }
    return list.filter((fund) =>
      (fund.category || "").toLowerCase().includes(type.toLowerCase())
    );
  };

  // Letter filter
  const handleLetterClick = async (letter) => {
    setSelectedLetter(letter);

    try {
      const res = await axios.get(
        `http://localhost:5000/mutual-fund-search/qqq?query=${letter}`
      );

      const flatFunds = flattenFunds(res.data);
      const filtered = applyFilter(flatFunds);

      setSuggestions(filtered.slice(0, 10));
    } catch (err) {
      console.error("Letter fetch error:", err.message);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        background: "var(--body-bg)",
        minHeight: "100vh",
      }}
    >
      <style>{animationStyles}</style>

      <h1 style={{ fontWeight: 700, marginBottom: 18, animation: "fadeIn .5s" }}>
        Mutual Funds
      </h1>

      {/* Filter + Search Row */}
      <div className="d-flex" style={{ gap: 15, marginBottom: 20 }}>

        {/* Select Filter */}
        <select
          value={filterType}
          onChange={(e) => {
            const newType = e.target.value;
            setFilterType(newType);
            // Always filter from the full funds list
            const filtered = applyFilter(funds, newType);
            if (newType === 'all') {
              setDisplayFunds(funds.slice(0, 20));
            } else {
              setDisplayFunds(filtered.slice(0, 20));
            }
            // Also update suggestions if a query is present
            if (query.length > 0) {
              setSuggestions(
                filtered
                  .filter((fund) =>
                    (fund.scheme_name || fund.name || fund.fund_name || "")
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .slice(0, 6)
              );
            }
          }}
          style={{
            padding: "12px 14px",
            minWidth: 180,
            borderRadius: 10,
            border: "1.5px solid #bdbdbd",
            fontSize: 16,
            background: "#fff",
            cursor: "pointer",
            animation: "fadeInUp .4s",
          }}
        >
          <option value="all">All Funds</option>
          <option value="equity">Equity Funds</option>
          <option value="debt">Debt Funds</option>
          <option value="index">Index Funds</option>
          <option value="others">Others</option>
          <option value="hybrid">Hybrid Funds</option>
        </select>

        {/* Search Box */}
        <div
          style={{
            display: "flex",
            flex: 1,
            position: "relative",
            animation: "fadeInUp .4s",
          }}
        >
          <input
            type="text"
            placeholder="Search mutual fund..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);

              if (e.target.value.length > 0) {
                setSuggestions(
                  applyFilter(funds)
                    .filter((fund) =>
                      (fund.scheme_name || fund.name || fund.fund_name || "")
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    )
                    .slice(0, 6)
                );
              } else {
                setSuggestions([]);
              }
            }}
            onKeyPress={handleKeyPress}
            style={{
              padding: "12px 14px",
              width: "100%",
              borderRadius: "10px 0 0 10px",
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              background: "#fff",
            }}
          />

          <button
            type="button"
            onClick={handleSearch}
            style={{
              padding: "12px 20px",
              borderRadius: "0 10px 10px 0",
              background: "#4caf50",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#43a047")}
            onMouseLeave={(e) => (e.target.style.background = "#4caf50")}
          >
            Search
          </button>

          {/* Auto Suggestions box */}
          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: 52,
                left: 0,
                right: 0,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: 10,
                overflow: "hidden",
                zIndex: 20,
                animation: "fadeIn .3s",
              }}
            >
              {suggestions.map((fund, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f3f6",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f8f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  onClick={() => {
                    setQuery(fund.scheme_name || fund.name || fund.fund_name);
                    setSuggestions([]);
                    setDisplayFunds([fund]);
                  }}
                >
                  {fund.scheme_name || fund.name || fund.fund_name}
                  <span style={{ color: "#777", fontSize: 13, marginLeft: 8 }}>
                    ({fund.category} / {fund.subcategory})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main List */}
      <h3 style={{ fontWeight: 800, color: '#0a2540', letterSpacing: 1, marginBottom: 18, fontSize: 26 }}>Mutual Funds List:</h3>
      <div
        className="funds-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '24px',
          alignItems: 'stretch',
          marginBottom: 32,
        }}
      >
        {applyFilter(displayFunds).map((fund, index) => (
          <ModernCard key={index} fund={fund} />
        ))}
      </div>

      {/* Alphabet Filter */}
      {/* <div style={{ marginTop: 24, animation: "fadeIn .5s" }}>
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{
              margin: "3px",
              padding: "8px 12px",
              backgroundColor: selectedLetter === letter ? "#4caf50" : "#e0e0e0",
              color: selectedLetter === letter ? "#fff" : "#000",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {letter}
          </button>
        ))}
      </div> */}
    </div>
  );
}





