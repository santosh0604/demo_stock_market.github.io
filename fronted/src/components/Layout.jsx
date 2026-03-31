// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useAuth } from "../context/AuthContext";
import IndexList from "./IndexList";
import TopGainers from "./TopGainers";
import ProductsTools from "./ProductsTools";
import IndustryStocks from "./IndustryStocks";

const Layout = ({ mainComponent }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Closed on mobile by default, open on desktop
  const { user } = useAuth();

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

  return (
    <div className="d-flex align-items-stretch" style={{ minHeight: "100vh", backgroundColor: "var(--body-bg)" }}>
      {/* Sidebar - Always visible on desktop, controlled by state on mobile */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: !isMobile ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar - hamburger menu toggles sidebar on mobile */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="flex-grow-1">
          {mainComponent === "market-overview" ? (
            <div className="container py-4">
              <div className="market-responsive">
                <IndexList />
                <div className="market-flex" style={{ marginTop: "32px", padding: "0 70px" }}>
                  <div className="market-col">
                    <TopGainers
                      cardStyle={{
                        width: "80%",
                        boxShadow: "0 4px 18px rgba(30,64,175,0.08)",
                        borderRadius: 16,
                        background: "#fff",
                        padding: 18,
                        margin: "20px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      compact
                    />
                  </div>
                  <div className="market-col">
                    <ProductsTools
                      columnLayout
                      cardStyle={{
                        boxShadow: "0 4px 18px rgba(30,64,175,0.08)",
                        borderRadius: 16,
                        background: "#fff",
                        margin: "10px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    />
                  </div>
                </div>
                <IndustryStocks stocks={[]} />
              </div>
              <style>{`
                .market-responsive {
                  width: 100%;
                  max-width: 100vw;
                }
                .market-flex {
                  display: flex;
                  gap: 16px;
                  margin: 32px 0;
                  align-items: stretch;
                  min-height: 420px;
                }
                .market-col {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  min-width: 0;
                }
                @media (max-width: 991.98px) {
                  .market-flex {
                    flex-direction: column;
                    gap: 16px;
                    margin: 16px 0;
                    padding: 0 !important;
                  }
                  .market-col {
                    min-width: 0;
                    width: 100%;
                  }
                }
                @media (max-width: 450px) {
                  .container {
                    padding: 8px !important;
                  }
                  .market-flex {
                    flex-direction: column;
                    gap: 8px;
                    margin: 8px 0;
                  }
                  .market-col {
                    min-width: 0;
                    width: 100%;
                  }
                  .market-responsive {
                    padding: 0;
                  }
                }
              `}</style>
            </div>
          ) : (
            <MainContent user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

// Ensure viewport meta tag for mobile scaling
if (typeof document !== "undefined") {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(viewport);
  } else {
    viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
  }
}

export default Layout;