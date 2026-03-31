import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("site-theme") || "default";
  });
  const navigate = useNavigate();

  // const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  // const closeSidebar = () => setIsSidebarVisible(false);


   const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
     const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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

  useEffect(() => {
    const saved = localStorage.getItem("site-theme") || theme;
    applyTheme(saved);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="d-flex" style={{ backgroundColor: "var(--body-bg, #f4f9ff)", minHeight: "100vh" }}>
    

      <Sidebar  isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile} />

      <div className="flex-grow-1" style={{ marginLeft: !isMobile && isSidebarVisible ? "250px" : "0", transition: "margin-left 0.3s ease", backgroundColor: "var(--body-bg, #f4f9ff)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className="container py-3 py-md-4 flex-grow-1">
          <div className="card shadow-sm border-0 p-3 p-md-4" style={{ backgroundColor: "var(--card-bg, #fff)" }}>
 
         
            
            {/* Color Theme Select */}
            <div className="mb-4">
              <label htmlFor="theme-select" className="form-label fw-bold">Color Theme</label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => {
                  const t = e.target.value;
                  setTheme(t);
                  try { localStorage.setItem("site-theme", t); } catch (e) {}
                  applyTheme(t);
                }}
                className="form-select"
                style={{ maxWidth: 200, backgroundColor: "var(--search-bg, #fff)", color: "var(--search-text, #000)" }}
                title="Choose color theme"
              >
                <option value="default">Default</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="teal">Teal</option>
                <option value="sunset">Sunset</option>
                <option value="mocha">Mocha</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}