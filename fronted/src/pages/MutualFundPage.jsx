// this is a layout with sidebar toggle functionality
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MutualFundDetail from "./MutualFundDetail";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MutualFundPage() {
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
    <div
      className="d-flex"
      style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}
    >
   
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} isMobile={isMobile}  />

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
          <MutualFundDetail />
        </div>

        {/* Footer - Hidden on mobile */}
        <div className="container-fluid p-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}