// src/pages/StockPage.jsx
import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import Sidebar from "../components/Sidebar";
import Stock from "../components/Stock";
import OrderBox from "../components/OrderBox";
import Footer from "../components/Footer";

const StockPage = () => {
  const [selectedStockData, setSelectedStockData] = useState(null);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);







  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Handle responsive breakpoint
  // useEffect(() => {
  //   const handleResize = () => {
  //     const mobile = window.innerWidth < 992;
  //     setIsMobile(mobile);
  //     // On desktop, sidebar is always hidden
  //     if (!mobile) {
  //       setIsSidebarVisible(false);
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






  // const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  // const closeSidebar = () => setIsSidebarVisible(false);

  const openOrderModal = () => {
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
  };

  return (


    <div
      style={{
        backgroundColor: "#f9fbff",
        minHeight: "100vh",
      }}
    >
     

      {/* Main Content */}
      <div
        style={{
          marginLeft: "0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar with sidebar toggle (toggle only works on mobile) */}
        <Navbar2 toggleSidebar={toggleSidebar} />

        {/* DESKTOP VIEW - No sidebar, full width layout */}
        {!isMobile ? (
          <div
            className="container-fluid"
            style={{
              display: "flex",
              gap: "20px",
              padding: "20px 40px",
              flex: 1,
            }}
          >
            <div
              style={{
                width: "72%",
                minHeight: "calc(100vh - 140px)",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              <Stock setStockForOrderBox={setSelectedStockData} />
            </div>

            <div
              style={{
                width: "28%",
                position: "sticky",
                top: "80px",
                alignSelf: "flex-start",
                height: "calc(100vh - 140px)",
                overflowY: "auto",
              }}
            >
              <OrderBox stock={selectedStockData} />
            </div>
          </div>
        ) : (
          /* MOBILE VIEW - Redesigned */
          <div style={{ padding: "12px", paddingBottom: "100px", flex: 1 }}>
            {/* Floating Order Button */}
            <button
              className="btn btn-primary position-fixed"
              style={{
                bottom: "90px",
                right: "16px",
                zIndex: 100,
                borderRadius: "25px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "600",
                boxShadow: "0 4px 16px rgba(13, 110, 253, 0.3)",
              }}
              onClick={openOrderModal}
              aria-label="Trade"
            >
              Trade
            </button>

            {/* Stock Component */}
            <Stock setStockForOrderBox={setSelectedStockData} />
          </div>
        )}

        {/* Footer - Hidden on mobile */}
        <div className="container-fluid p-0">
          <Footer />
        </div>
      </div>

      {/* Order Modal for Mobile */}
      {showOrderModal && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
            overflow: "auto",
          }}
          onClick={closeOrderModal}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ marginTop: "5%" }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Place Order</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeOrderModal}
                  style={{ position: 'absolute', right: '16px' }}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <OrderBox stock={selectedStockData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;