import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Overview from "../components/Overview";
import TradingViewWidget from "../components/TradingViewWidget";
import IndexList from "../components/IndexList";
import Trending from "../components/Trending";
import { useAuth } from "../context/AuthContext";
import IndustryStocks from "../components/IndustryStocks";
import ProductsTools from "../components/ProductsTools";
import TopGainers from "../components/TopGainers";
import Footer from "../components/Footer";

export default function MarketOverview() {
  // Only render the dashboard-style layout, and inject MarketOverview content as MainContent
  return <Layout mainComponent="market-overview" />;
}

























