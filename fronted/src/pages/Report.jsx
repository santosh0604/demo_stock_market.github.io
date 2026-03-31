import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Reports from "../components/Reports";

export default function Report() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { user } = useAuth();



  
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





  return (
    <div className="d-flex" style={{ backgroundColor: "var(--body-bg, #f4f9ff)", minHeight: "100vh" }}>
     

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} isMobile={isMobile} />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: !isMobile && isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div style={{ flex: 1, padding: "16px" }}>
          {/* Header Section */}
          <div className="mb-3">
            <h2 className="fw-bold" style={{ color: "var(--primary, #0d6efd)", fontSize: "1.5rem", marginBottom: "4px" }}>
              Trade Report
            </h2>
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
              View your detailed trade history and realized P&L
            </p>
          </div>

          {/* Reports Component */}
          <div className="card shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <Reports />
          </div>
        </div>
      </div>
    </div>
  );
}