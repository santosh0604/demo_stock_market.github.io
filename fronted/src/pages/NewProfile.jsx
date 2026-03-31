import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Profile from "./Profile";
import { useAuth } from "../context/AuthContext";

export default function NewProfile() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { user } = useAuth();

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
    <div className="d-flex" style={{ backgroundColor: "var(--body-bg)", minHeight: "100vh" }}>


      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} isMobile={isMobile} />

      <div className="flex-grow-1" style={{ marginLeft: !isMobile && isSidebarVisible ? "250px" : "0", transition: "margin-left 0.3s ease", backgroundColor: "var(--body-bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container py-3 py-md-4 flex-grow-1">
          <Profile />
        </div>
      </div>
    </div>
  );
}