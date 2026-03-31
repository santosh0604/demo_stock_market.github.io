// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaEye,
  FaWallet,
  FaExchangeAlt,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const [showImgModal, setShowImgModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Don't render if closed on mobile
  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`sidebar-root d-flex flex-column ${isMobile ? 'sidebar-mobile' : 'sidebar-desktop'}`}
        style={{
          width: "250px",
          height: "100vh",
          backgroundColor: "var(--card-bg)",
          zIndex: isMobile ? 1300 : 100,
          transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
          // Desktop: always fixed on left
          // Mobile: slide in/out
          ...(isMobile ? {
            position: 'fixed',
            top: 0,
            left: 0,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: '2px 0 16px rgba(0,0,0,0.08)',
          } : {
            position: 'fixed',
            top: 0,
            left: 0,
          })
        }}
      >
        {/* Logo and user info */}
        <div className="text-start mb-4 ps-3 pe-3 pt-3">
          <div className="d-flex align-items-center gap-2 mb-3 position-relative">
            <FaChartLine style={{ color: "var(--primary)", fontSize: '1.3rem' }} />
            <h5 className="fw-bold mb-0" style={{ color: 'var(--primary)', fontSize: '1rem' }}>StockMarket Pro</h5>
            {/* Cross button for mobile only */}
            {isMobile && (
              <button
                className="btn p-0"
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 20,
                  color: 'var(--nav-text, #fff)',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                aria-label="Close sidebar"
                onClick={onClose}
              >
                &#10005;
              </button>
            )}
          </div>
          
          {/* User Profile */}
          <div className="d-flex align-items-center rounded-4 p-2" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <img
              src="https://th.bing.com/th/id/OIP.umekQeOw3UokWqZl39t90wHaEK?w=278&h=180&c=7&r=0&o=7&dpr=1.3&pid:1.7&rm=3"
              alt="User"
              className="rounded-circle me-2"
              width="40"
              height="40"
              style={{ cursor: 'pointer', objectFit: 'cover' }}
              onClick={() => setShowImgModal(true)}
            />
            <div className="text-start">
              <h6 className="fw-semibold mb-0" style={{ color: 'var(--sidebar-text, rgba(0,0,0,0.85))', fontSize: '0.9rem' }}>
                {user?.username || "Guest"}
              </h6>
              <small style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.75rem' }}>Investor</small>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <ul className="nav flex-column text-start px-3 flex-grow-1" style={{ overflowY: 'auto' }}>
          <li className="nav-item mb-3">
            <NavLink
              to="/user/home"
              end
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaHome className="me-2" /> Dashboard
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/market-overview"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaChartBar className="me-2" /> Market Overview
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/watchlist"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaEye className="me-2" /> My Watchlist
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/portfolio"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaWallet className="me-2" /> My Portfolio
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/transaction"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaExchangeAlt className="me-2" /> Transactions
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/setting"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaCogs className="me-2" /> Settings
            </NavLink>
          </li>

          {/* Bottom Section */}
          <li className="nav-item mb-3 mt-auto">
            <NavLink
              to="/user/profile"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaUser className="me-2" /> Profile
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/report"
              className={({ isActive }) =>
                `nav-link fw-semibold py-2 px-3 rounded-3 ${isActive ? "active-nav-link" : "nav-link-inactive"}`
              }
            >
              <FaChartBar className="me-2" /> Report
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <button
              onClick={handleLogout}
              className="btn nav-link fw-semibold text-danger text-start py-2 px-3 w-100 rounded-3"
              style={{ color: '#dc3545' }}
            >
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Image Modal */}
      {showImgModal && (
        <div 
          className="sidebar-img-modal" 
          style={{
            position: 'fixed',
            zIndex: 2000,
            left: 0, top: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowImgModal(false)}
        >
          <div onClick={e => e.stopPropagation()}>
            <img
              src="https://th.bing.com/th/id/OIP.umekQeOw3UokWqZl39t90wHaEK?w=278&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="User Large"
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '16px' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;