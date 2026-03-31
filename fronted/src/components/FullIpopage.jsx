import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import IPOPage from "../components/additional/IPOPage";
import Footer from "./Footer";

export default function FullIpopage() {
  const { user } = useAuth();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  // const closeSidebar = () => setIsSidebarVisible(false);



  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);



  // Handle responsive breakpoint
  // useEffect(() => {
  //   const handleResize = () => {
  //     const mobile = window.innerWidth < 992;
  //     setIsMobile(mobile);
  //     // Auto-show sidebar on desktop
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
    <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      {/* Mobile Overlay - shown when sidebar is open on mobile */}
      
      {/* Sidebar */}
      <Sidebar 
      isOpen={sidebarOpen} onClose={closeSidebar} isMobile={isMobile} 
      />

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
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="container py-4 flex-grow-1">
          <IPOPage />
        </div>

       
      </div>
    </div>
  );
}