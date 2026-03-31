import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function IPOPage() {
  const [ipoData, setIPOData] = useState({
    active: [],
    upcoming: [],
    listed: [],
    closed: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("active");

  const API_BASE = "https://demo-stock-market-backend.onrender.com";

  useEffect(() => {
    fetchIPO();
  }, []);

  const fetchIPO = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/ipo/qqq`);

      const mapIPO = (item) => ({
        ...item,
        company: item.name || "N/A",
        price_band:
          item.min_price != null && item.max_price != null
            ? `${item.min_price} - ${item.max_price}`
            : "N/A",
        lot_size: item.lot_size ?? "N/A",
        open_date: item.bidding_start_date || "N/A",
        close_date: item.bidding_end_date || "N/A",
      });

      setIPOData({
        active: (data.active || []).map(mapIPO),
        upcoming: (data.upcoming || []).map(mapIPO),
        listed: (data.listed || []).map(mapIPO),
        closed: (data.closed || []).map(mapIPO),
      });
    } catch (error) {
      console.error("Error fetching IPO:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "active", label: "Active", color: "success" },
    { key: "upcoming", label: "Upcoming", color: "info" },
    { key: "listed", label: "Listed", color: "primary" },
    { key: "closed", label: "Closed", color: "danger" },
  ];

  const CountBadge = ({ count, variant }) => (
    <span className={`badge bg-${variant} text-white ms-2`} style={{ fontWeight: 600, fontSize: '0.7rem' }}>
      {count}
    </span>
  );

  // Modern Card - Redesigned for Mobile
  const ModernCard = ({ ipo, type }) => (
    <div className="ipo-card mb-3">
      {/* Card Header */}
      <div className="ipo-card-header">
        <div className="d-flex align-items-center">
          <div className="ipo-logo">
            {ipo.company ? ipo.company[0].toUpperCase() : "I"}
          </div>
          <div className="ipo-header-content">
            <h5 className="ipo-company-name">{ipo.company}</h5>
            <p className="ipo-desc">{ipo.additional_text}</p>
            <div className="ipo-badges">
              <span className="ipo-pill">{ipo.symbol}</span>
              <span className={`ipo-status status-${type}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body - Info Grid */}
      <div className="ipo-card-body">
        <div className="ipo-info-grid">
          <InfoItem label="Price Band" value={ipo.price_band} highlight />
          <InfoItem label="Lot Size" value={ipo.lot_size} />
          <InfoItem label="Open Date" value={ipo.open_date} />
          <InfoItem label="Close Date" value={ipo.close_date} />
        </div>

        {/* Additional info for listed IPOs */}
        {type === "listed" && (
          <div className="ipo-listed-info">
            <div className="ipo-info-grid">
              <InfoItem label="Listing Price" value={ipo.listing_price ?? "N/A"} />
              <InfoItem 
                label="Listing Gains" 
                value={ipo.listing_gains != null ? `${ipo.listing_gains.toFixed(2)}%` : "N/A"} 
                highlight={ipo.listing_gains > 0}
                negative={ipo.listing_gains < 0}
              />
              <InfoItem label="Issue Price" value={ipo.issue_price ?? "N/A"} />
            </div>
          </div>
        )}

        {/* Additional info for closed IPOs */}
        {type === "closed" && (
          <div className="ipo-closed-info">
            <InfoItem label="Listing Date" value={ipo.listing_date ?? "N/A"} fullWidth />
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="ipo-card-footer">
        <div className="ipo-sme">
          <span className="sme-label">SME</span>
          <span className="sme-value">{ipo.is_sme ? "Yes" : "No"}</span>
        </div>
        {ipo.document_url ? (
          <a
            href={ipo.document_url}
            target="_blank"
            rel="noreferrer noopener"
            className="ipo-doc-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Prospectus
          </a>
        ) : null}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, highlight, negative, fullWidth }) => (
    <div className={`ipo-info-item ${fullWidth ? 'full-width' : ''} ${highlight ? 'highlight' : ''} ${negative ? 'negative' : ''}`}>
      <span className="ipo-info-label">{label}</span>
      <span className="ipo-info-value">{value}</span>
    </div>
  );

  return (
    <>
      <div className="ipo-page" style={{ maxWidth:"1100px" }}>
        <div className="ipo-page-header">
          <h2 className="ipo-title">IPO Dashboard</h2>
        </div>

        {/* Tabs */}
        <div className="ipo-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`ipo-tab ${selectedTab === t.key ? "active" : ""}`}
              onClick={() => setSelectedTab(t.key)}
            >
              {t.label}
              <CountBadge count={ipoData[t.key].length} variant={t.color} />
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="ipo-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : ipoData[selectedTab].length === 0 ? (
          <div className="ipo-empty">
            <div className="empty-icon">📋</div>
            <p>No {selectedTab} IPOs available</p>
          </div>
        ) : (
          <div className="ipo-list">
            {ipoData[selectedTab].map((ipo, idx) => (
              <ModernCard key={idx} ipo={ipo} type={selectedTab} />
            ))}
          </div>
        )}
      </div>

      {/* CSS */}
      <style>{`
        /* Page Container */
        .ipo-page {
          padding: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .ipo-page-header {
          margin-bottom: 16px;
        }

        .ipo-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }

        /* Tabs */
        .ipo-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .ipo-tabs::-webkit-scrollbar {
          display: none;
        }

        .ipo-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #f1f5f9;
          border: none;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .ipo-tab:hover {
          background: #e2e8f0;
        }
        .ipo-tab.active {
          background: #2563eb;
          color: #fff;
        }

        /* Card */
        .ipo-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }
        .ipo-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        /* Card Header */
        .ipo-card-header {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .ipo-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .ipo-header-content {
          margin-left: 12px;
          flex: 1;
          min-width: 0;
        }

        .ipo-company-name {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ipo-desc {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 0 0 8px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ipo-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ipo-pill {
          background: #dbeafe;
          color: #2563eb;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .ipo-status {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #fff;
        }
        .status-active { background: #22c55e; }
        .status-upcoming { background: #06b6d4; }
        .status-listed { background: #3b82f6; }
        .status-closed { background: #ef4444; }

        /* Card Body */
        .ipo-card-body {
          padding: 16px;
        }

        .ipo-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .ipo-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .ipo-info-item.full-width {
          grid-column: 1 / -1;
        }

        .ipo-info-item.highlight .ipo-info-value {
          color: #22c55e;
          font-weight: 700;
        }

        .ipo-info-item.negative .ipo-info-value {
          color: #ef4444;
        }

        .ipo-info-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ipo-info-value {
          font-size: 0.9rem;
          color: #334155;
          font-weight: 600;
          word-break: break-word;
        }

        .ipo-listed-info,
        .ipo-closed-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
        }

        /* Card Footer */
        .ipo-card-footer {
          padding: 12px 16px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ipo-sme {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sme-label {
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .sme-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
        }

        .ipo-doc-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #2563eb;
          color: #fff;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .ipo-doc-link:hover {
          background: #1d4ed8;
          color: #fff;
        }

        /* Loading & Empty */
        .ipo-loading {
          display: flex;
          justify-content: center;
          padding: 48px;
        }

        .ipo-empty {
          text-align: center;
          padding: 48px;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        /* Desktop Responsive */
        @media (min-width: 768px) {
          .ipo-page {
            padding: 24px;
          }

          .ipo-title {
            font-size: 1.75rem;
          }

          .ipo-logo {
            width: 56px;
            height: 56px;
            font-size: 24px;
            border-radius: 16px;
          }

          .ipo-company-name {
            font-size: 1.15rem;
          }

          .ipo-info-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }

          .ipo-info-item {
            padding: 12px 16px;
          }

          .ipo-listed-info .ipo-info-grid,
          .ipo-closed-info .ipo-info-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Small Mobile */
        @media (max-width: 380px) {
          .ipo-page {
            padding: 12px;
          }

          .ipo-tab {
            padding: 6px 12px;
            font-size: 0.8rem;
          }

          .ipo-logo {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .ipo-info-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .ipo-listed-info .ipo-info-grid,
          .ipo-closed-info .ipo-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
