import React from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaChartLine,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="d-none d-md-block"
      style={{
        width: "100vw",
        background: "linear-gradient(180deg, #f2f4f7 0%, #e9ecef 100%)",
        marginLeft: "calc(-50vw + 50%)",
        borderTop: "1px solid #d1d5db",
        color: "#1e293b",
        paddingTop: "60px",
        paddingBottom: "40px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container px-4">
        {/* Top Section */}
        <div className="row gy-5">
          {/* Brand */}
          <div className="col-md-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaChartLine className="text-primary fs-3" />
              <h4 className="fw-bold mb-0 text-primary">StockMarket</h4>
              <h4 className="fw-bold mb-0 text-dark">Pro</h4>
            </div>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.7" }}>
              Smarter tools to track, trade, and analyze NSE & BSE stocks.
              Experience a modern demo trading platform built for investors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="fw-semibold text-primary mb-3">Quick Links</h5>
            <ul className="list-unstyled" style={{ fontSize: "17px" }}>
              <li className="mb-2">
                <a href="/dashboard" className="text-secondary text-decoration-none" style={{ transition: "color 0.3s", color: "#475569" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>Home</a>
              </li>
              <li className="mb-2">
                <a href="/watchlist" className="text-secondary text-decoration-none" style={{ transition: "color 0.3s", color: "#475569" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>Watchlist</a>
              </li>
              <li className="mb-2">
                <a href="/portfolio" className="text-secondary text-decoration-none" style={{ transition: "color 0.3s", color: "#475569" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>Portfolio</a>
              </li>
              <li className="mb-2">
                <a href="/news" className="text-secondary text-decoration-none" style={{ transition: "color 0.3s", color: "#475569" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>Market News</a>
              </li>
            </ul>
          </div>

          {/* Our Products */}
          <div className="col-md-3">
            <h5 className="fw-semibold text-primary mb-3">Our Products</h5>
            <ul className="list-unstyled" style={{ fontSize: "17px" }}>
              <li className="mb-2 text-secondary">Stock Analysis Tool</li>
              <li className="mb-2 text-secondary">Real-time Market Data</li>
              <li className="mb-2 text-secondary">Portfolio Tracker</li>
              <li className="mb-2 text-secondary">ETF Explorer</li>
              <li className="mb-2 text-secondary">IPO Insights</li>
              <li className="mb-2 text-secondary">Mutual Funds</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-md-3">
            <h5 className="fw-semibold text-primary mb-3">Connect with Us</h5>
            <div className="d-flex gap-4 fs-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-secondary" style={{ transition: "color 0.3s" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-secondary" style={{ transition: "color 0.3s" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-secondary" style={{ transition: "color 0.3s" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-secondary" style={{ transition: "color 0.3s" }} onMouseEnter={(e) => (e.target.style.color = "#0d6efd")} onMouseLeave={(e) => (e.target.style.color = "#475569")}>
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4" style={{ borderColor: "#cbd5e1" }} />

        {/* Bottom Section */}
        <div className="text-center text-muted" style={{ fontSize: "15px" }}>
          © {new Date().getFullYear()} <strong>StockMarket Pro</strong> — Built for modern investors using NSE & BSE data.
          <br />
          <span style={{ color: "#64748b" }}>Designed with ❤️ for the demo trading community.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;