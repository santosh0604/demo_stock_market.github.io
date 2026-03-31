// src/AppRoutes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import Home from "../pages/Home";

// import Dashboard from "../pages/Dashboard";
import News from "../components/News";
import ProtectedRoute from "../components/ProtectedRoute";
import PersonalInfo from "../components/PersonalInfo";
import Nominee from "../components/Nominee";
import Reports from "../components/Reports";
import LogoutPage from "../pages/Logout";
import MarketOverview from "../pages/MarketOverview";
import Watchlist from "../pages/Watchlist";
import Portfolio from "../pages/Portfolio";
import Transaction from "../pages/Transaction";
import Settings from "../pages/Settings";
import MainContent from "../components/MainContent";
import StockPage from "../pages/StockPage";
import IndexDetail from "../components/IndexDetail";
import IPOPage from  "../components/FullIpopage";

import MutualFundPage from "../pages/MutualFundPage";
import EtfMain from "../pages/EtfMain";

import Report from "../pages/Report";
import NewProfile from "../pages/NewProfile";

const AppRoutes = () => {
  return (
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/home/logout" element={<LogoutPage/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/logout" element={<ProtectedRoute><LogoutPage /> </ProtectedRoute>} />
 
        <Route path="/user/market-overview" element={<ProtectedRoute><MarketOverview /></ProtectedRoute>} />
        <Route path="/user/market-overview/index/:symbol" element={<IndexDetail />} />
        <Route
          path="/user/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Profile with nested routes */}
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <NewProfile />
            </ProtectedRoute>
          }
        >
          {/* index -> show personal-info */}
          <Route index element={<PersonalInfo />} />
          <Route path="personal-info" element={<PersonalInfo />} />
          <Route path="nominee" element={<Nominee />} />
          
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="/user/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/user/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="/user/setting" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route
          path="/user/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="holdings" replace />} />
          <Route path="holdings" element={<Portfolio tab="holdings" />} />
          <Route path="orders" element={<Portfolio tab="orders" />} />
          <Route path="completed" element={<Portfolio tab="completed" />} />
        </Route>
        {/* News */}
        <Route
          path="/user/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route path="/stock/:name" element={<StockPage />} />

        <Route path="/user/market-overview/ipo" element={<IPOPage/>} />
         <Route path="/user/market-overview/mutualfunds" element={<MutualFundPage/>} />
         <Route path="/user/market-overview/etf" element={<EtfMain/>} />
        <Route path="/user/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      </Routes>
  );
};

export default AppRoutes;
