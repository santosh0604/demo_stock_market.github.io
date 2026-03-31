// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaBell,
  FaSearch,
  FaHome,
  FaChartBar,
  FaWallet,
  FaExchangeAlt,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaEye,
  FaPlus,
  FaChartLine, // ✅ added this icon
} from "react-icons/fa";
import MainContent from "../components/MainContent";
import DashboardLayout from "../components/DashboardLayout";
export default function Home() {
 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [watchlist] = useState([
    { symbol: "GOOGL", name: "Alphabet Inc", price: 135.67, change: +1.2, color: "primary" },
    { symbol: "AAPL", name: "Apple Inc", price: 167.42, change: +2.8, color: "danger" },
    { symbol: "MSFT", name: "Microsoft Corp", price: 302.15, change: -0.3, color: "success" },
    { symbol: "TSLA", name: "Tesla Inc", price: 245.67, change: +3.1, color: "warning" },
    { symbol: "NFLX", name: "Netflix Inc", price: 378.29, change: -1.2, color: "purple" },
  ]);


  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [token]);
      console.log(user)


  const fmt = (n) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  return (

    
    <div>     <DashboardLayout user={user} handleLogout={handleLogout} /></div>

  );
}



