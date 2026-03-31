import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaTimes, FaBars, FaRegNewspaper } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("site-theme") || "default";
    } catch (e) {
      return "default";
    }
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      const query = search.trim();
      setIsSearchOpen(false);
      navigate(`/stock/${encodeURIComponent(query)}`);
      setSearch("");
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("site-theme") || theme;
      applyTheme(saved);
    } catch (e) {
      applyTheme(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTheme(name) {
    const root = document.documentElement;
    const themes = {
      default: {
        "--nav-bg": "#1E40AF",
        "--nav-text": "#ffffff",
        "--body-bg": "#f4f9ff",
        "--primary": "#0d6efd",
        "--card-bg": "#ffffff",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#0b1221",
      },
      green: {
        "--nav-bg": "#065f46",
        "--nav-text": "#e6fff7",
        "--body-bg": "#e6f9f0",
        "--primary": "#10b981",
        "--card-bg": "#f0fdf4",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#064e3b",
      },
      purple: {
        "--nav-bg": "#5b21b6",
        "--nav-text": "#fff7ff",
        "--body-bg": "#f7f0ff",
        "--primary": "#7c3aed",
        "--card-bg": "#faf5ff",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#3b0764",
      },
      mocha: {
        "--nav-bg": "rgba(45,35,30,0.58)",
        "--nav-text": "#fff9f6",
        "--body-bg": "#fbf7f5",
        "--primary": "#b9846f",
        "--card-bg": "#fff9f7",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#2d1f1a",
      },
      teal: {
        "--nav-bg": "#0d9488",
        "--nav-text": "#ffffff",
        "--body-bg": "#e6fffb",
        "--primary": "#14b8a6",
        "--card-bg": "#f0fdfc",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#064e3b",
      },
      sunset: {
        "--nav-bg": "#ff7a2a",
        "--nav-text": "#fff8f3",
        "--body-bg": "#fff6ee",
        "--primary": "#fb923c",
        "--card-bg": "#fff7ef",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#7c2d12",
      },
    };

    const picked = themes[name] || themes.default;
    Object.entries(picked).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{
          backgroundColor: "var(--nav-bg, #1E40AF)",
          color: "var(--nav-text, #fff)",
          height: "64px",
          zIndex: 1000,
          position: "sticky",
          top: 0,
        }}
      >
        <div className="container-fluid px-2 px-md-3 d-flex justify-content-between align-items-center">
          {/* Left Section */}
          <div className="d-flex align-items-center gap-2" style={{ flex: '0 0 auto' }}>
            {/* Hamburger Toggle Button */}
            <button
              className="btn btn-outline-light p-2"
              onClick={toggleSidebar}
              style={{ 
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle sidebar"
            >
              <FaBars size={18} />
            </button>

            {/* Search - Hidden on mobile, opens overlay on click */}
            <div className="d-none d-md-block">
              <input
                type="text"
                className="form-control search-input border-0 shadow-none"
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={{ 
                  fontSize: "0.9rem", 
                  width: "200px",
                  background: "var(--search-bg, #fff)",
                  color: "var(--search-text, #000)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                }}
              />
            </div>

            {/* Search icon for mobile - opens full screen search */}
            <button 
              className="d-md-none btn p-1"
              style={{ color: 'var(--nav-text, #fff)' }}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search stocks"
            >
              <FaSearch size={18} />
            </button>

            {/* News icon for mobile only */}
            <Link 
              to="/user/news" 
              state={{ userInfo: user }} 
              style={{ textDecoration: "none" }}
              className="d-md-none"
            >
              <span className="text-white">
                <FaRegNewspaper size={20} />
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-2" style={{ flex: '0 0 auto' }}>
            {/* Bell icon - desktop only */}
            <span className="d-none d-md-block">
              <Link to="/user/news" state={{ userInfo: user }} style={{ textDecoration: "none" }}>
                <FaBell size={18} style={{ cursor: "pointer", color: 'var(--nav-text, #fff)' }} />
              </Link>
            </span>
            
            {/* User Avatar */}
            <Link to="/user/profile" style={{ textDecoration: "none" }}>
              <div 
                className="bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle" 
                style={{ 
                  width: "36px", 
                  height: "36px",
                  minWidth: "36px",
                }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            </Link>
            
            {/* Username - desktop only */}
            <Link to="/user/profile" style={{ textDecoration: "none" }}>
              <span 
                className="fw-semibold d-none d-md-block" 
                style={{ 
                  cursor: "pointer", 
                  color: 'var(--nav-text, #fff)',
                  fontSize: '0.9rem',
                }}
              >
                {user?.username || "Guest User"}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Full-screen search overlay for mobile */}
      {isSearchOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 2000, transition: "all 0.3s ease" }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-4 shadow-lg d-flex align-items-center px-4"
            style={{ width: "90%", maxWidth: "500px", height: "56px", transition: "all 0.3s ease" }}
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
              style={{ fontSize: "1rem", color: "#000" }}
            />
            <FaTimes 
              className="text-muted ms-2" 
              style={{ cursor: "pointer", fontSize: "1.2rem" }} 
              onClick={() => setIsSearchOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;