// src/pages/News.jsx
import React, { useEffect, useState, useRef} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaNewspaper, FaBolt } from "react-icons/fa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
export default function News() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { user } = useAuth();
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  const location = useLocation();
  const { userInfo } = location.state || {};
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newArticlesAvailable, setNewArticlesAvailable] = useState(false);
  const latestTitle = useRef(null);
  const NEWS_API_KEY = "21b65a4f74e8471989c44f43571bd895";

  const fetchNews = async (isInitial = false) => {
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=(India OR stock OR economy OR business)&language=en&pageSize=42&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
      );
      const newData = res.data.articles;
      if (isInitial) {
        setArticles(newData);
        latestTitle.current = newData[0]?.title;
      } else {
        if (newData[0]?.title !== latestTitle.current) {
          setNewArticlesAvailable(true);
          latestTitle.current = newData[0]?.title;
          setArticles(newData);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(true);
    const interval = setInterval(() => {
      fetchNews();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <h4 className="loading-text">Loading News…</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ backgroundColor: "var(--body-bg)", minHeight: "100vh", minWidth: 0 }}>
      <style>{`
        .news-page {
          background: var(--body-bg);
          transition: background 200ms ease;
        }
        .news-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 2rem;
          background: linear-gradient(135deg, var(--primary), rgba(13,110,253,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .news-header svg {
          width: 36px;
          height: 36px;
          color: var(--primary);
          filter: drop-shadow(0 2px 4px rgba(13,110,253,0.2));
        }
        .news-alert {
          background: linear-gradient(135deg, rgba(13,110,253,0.1), rgba(13,110,253,0.05));
          border: 2px solid var(--primary);
          border-radius: 20px;
          padding: 12px 20px;
          margin-bottom: 2rem;
          font-weight: 600;
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(13,110,253,0.1);
        }
        .news-card {
          background: linear-gradient(135deg, var(--card-bg), rgba(255,255,255,0.8));
          border: 1px solid rgba(13,110,253,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(16,24,40,0.06);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .news-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(13,110,253,0.15);
          border-color: rgba(13,110,253,0.15);
        }
        .news-card-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: linear-gradient(135deg, rgba(13,110,253,0.1), rgba(13,110,253,0.05));
        }
        .news-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .news-card-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--sidebar-text);
          line-height: 1.4;
          margin-bottom: 0.8rem;
        }
        .news-card-meta {
          font-size: 0.85rem;
          color: rgba(0,0,0,0.65);
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .news-card-desc {
          font-size: 0.95rem;
          color: rgba(0,0,0,0.7);
          line-height: 1.5;
          margin-bottom: 1rem;
          flex: 1;
        }
        .news-read-btn {
          background: linear-gradient(135deg, var(--primary), rgba(13,110,253,0.8));
          border: none;
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px;
          margin-top: auto;
          box-shadow: 0 4px 12px rgba(13,110,253,0.2);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
        }
        .news-read-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13,110,253,0.3);
          color: white;
          text-decoration: none;
          background: linear-gradient(135deg, rgba(13,110,253,0.9), var(--primary));
        }
        .news-read-btn:focus {
          outline: none;
          text-decoration: none;
        }
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--body-bg);
        }
        .loading-text {
          font-weight: 700;
          font-size: 1.3rem;
          color: var(--primary);
        }
      `}</style>
      {/* <Sidebar user={userInfo} /> */}

      {/* <Sidebar user={userInfo} /> */}
      {isSidebarVisible && <Sidebar user={userInfo} />}

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease-in",
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container py-4 news-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h3 className="news-header"><FaBolt style={{ color: 'var(--primary)', marginRight: '10px' }} /> Latest Market & Economic News</h3>
          {newArticlesAvailable && (
            <div className="news-alert text-center">
              🆕 New articles added recently!
            </div>
          )}
          <div className="row g-4 justify-content-center align-items-stretch" style={{ flex: 1 }}>
            {articles.map((article, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-4 d-flex align-items-stretch">
                <div className="news-card d-flex flex-column w-100 h-100">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      className="news-card-img"
                      alt={article.title}
                    />
                  )}
                  <div className="news-card-body d-flex flex-column flex-grow-1">
                    <h5 className="news-card-title">{article.title}</h5>
                    <p className="news-card-meta">
                      {article.source.name} • {new Date(article.publishedAt).toLocaleString()}
                    </p>
                    <p className="news-card-desc flex-grow-1">
                      {article.description || "No description available."}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-read-btn mt-auto"
                    >
                      Read Full Article
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
                    
