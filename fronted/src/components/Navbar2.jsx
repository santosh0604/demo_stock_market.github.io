// ✅ src/components/Navbar2.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaSearch,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Navbar2 = ({ toggleSidebar }) => {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const navigate = useNavigate();

  const { user } = useAuth();

  // Handle responsive breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔍 Handle search submission
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      setIsSearchOpen(false);
      navigate(`/stock/${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  // 📊 Fetch NSE autocomplete dynamically
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://www.nseindia.com/api/search/autocomplete?q=${search}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0",
              Accept: "application/json",
            },
          }
        );
        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data.slice(0, 10));
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Suggestion fetch failed:", err.message);
        setSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // ⌨️ Close overlay on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* ===== Main Navbar ===== */}
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{
          backgroundColor: "#1E40AF",
          color: "#fff",
          height: "64px",
          zIndex: 1000,
          position: "sticky",
          top: 0,
        }}
      >
        <div className="container-fluid px-2 px-md-4 d-flex justify-content-between align-items-center">
          {/* ✅ Left Section */}
          <div className="d-flex gap-2 gap-md-3 align-items-center">
            {/* Hamburger Menu - Mobile Only */}
                  <button 
            onClick={() => navigate("/user/home")}
            className="btn flex-shrink-0 ms-2"
            style={{
              background: "white",
              color: "black",
              borderRadius: "50%",
              // padding: "8px 14px",
              fontWeight: 400,
              fontSize: '1.2rem',
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
       <FaArrowLeft />
          </button>

            {/* ✅ Search Input - Desktop */}
            <div
              className="bg-white rounded-pill d-flex align-items-center px-3 shadow-sm d-none d-md-flex"
              style={{
                width: "350px",
                height: "40px",
                cursor: "pointer",
              }}
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch className="text-muted me-2" />
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={{ fontSize: "0.95rem" }}
                readOnly
              />
            </div>

            {/* Search Icon - Mobile */}
            <button
              className="btn p-1 d-md-none"
              style={{ color: '#fff' }}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>
          </div>

          {/* ✅ Right Section */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* 🔔 Notifications - Desktop only */}
            <Link
              to="/home/news"
              state={{ userInfo: user }}
              style={{ textDecoration: "none" }}
              className="d-none d-md-block"
            >
              <FaBell
                className="text-white"
                style={{ fontSize: "1.3rem", cursor: "pointer" }}
              />
            </Link>

            {/* 👤 User Avatar */}
            <Link to="/home/profile" style={{ textDecoration: "none" }}>
              <div
                className="bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "36px", height: "36px", minWidth: "36px" }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            </Link>

            {/* Username - Desktop only */}
            <Link to="/home/profile" style={{ textDecoration: "none" }} className="d-none d-md-block">
              <span
                className="fw-semibold text-white"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
              >
                {user?.username || "Guest User"}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== Fullscreen Search Overlay ===== */}
      {isSearchOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 2000,
          }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-pill shadow-lg d-flex align-items-center px-4"
            style={{
              width: "90%",
              maxWidth: "600px",
              height: "56px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaSearch className="text-muted me-3" size={18} />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search stocks (e.g. RELIANCE, TATASTEEL)..."
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              style={{ fontSize: "1rem" }}
            />
            <FaTimes
              className="text-muted ms-3"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
              onClick={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ✅ Suggestion Dropdown */}
      {isSearchOpen && suggestions.length > 0 && (
        <div
          className="position-fixed bg-white shadow rounded"
          style={{
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "250px",
            overflowY: "auto",
            borderRadius: "12px",
            zIndex: 2050,
          }}
        >
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                navigate(`/stock/${encodeURIComponent(item.symbol)}`);
                setIsSearchOpen(false);
                setSearch("");
                setSuggestions([]);
              }}
              className="px-3 py-2 border-bottom"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f2f2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <strong>{item.symbol}</strong> —{" "}
              <span className="text-muted">{item.symbol_info}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar2;