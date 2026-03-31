import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaUsers, FaLock, FaFileAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://demo-stock-market-backend.onrender.com/profile", {
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

  useEffect(() => {
    if (!loading && location.pathname === "/user") {
      navigate("/user/profile/personal-info");
    }
  }, [loading, location.pathname, navigate]);

  if (loading)
    return <h4 className="text-center mt-4 text-primary">Loading user data...</h4>;

  if (!user)
    return (
      <h5 className="text-center mt-4 text-danger">
        Unable to fetch user data. Please login again.
      </h5>
    );

  const menuItems = [
    { name: "Personal Info", path: "/user/profile/personal-info" },
    { name: "Nominee", path: "/user/profile/nominee" },
  ];

  return (
    <div className="profile-shell">
      <div className="profile-top">
        <div className="profile-left">
          <div className="avatar-circle">{user?.fullname?.charAt(0).toUpperCase() || "U"}</div>
          <div>
            <p className="user-name m-0">{user.fullname}</p>
            <div className="user-meta">{user.email || "No email"}</div>
          </div>
        </div>

        <div className="profile-tabs">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`profile-tab ${isActive ? "active" : ""}`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>

      <div className="profile-main">
        <div className="profile-grid">
          <div className="profile-card">
            <Outlet context={{ user }} />
          </div>
        </div>
      </div>
      <style>
        {`
        :root{
          --primary: #0d6efd;
          --muted: #6c757d;
          --card-bg: #ffffff;
          --page-bg: #f9fbff;
          --accent: #eef6ff;
          --success: #10b981;
        }
        .profile-shell{
          min-height:100vh;
          background: linear-gradient(135deg,var(--accent),var(--page-bg));
          font-family: 'Poppins', sans-serif;
        }
        .profile-top{
          background: var(--card-bg);
          border-bottom:1px solid rgba(13,110,253,0.06);
          position:sticky;top:0;z-index:20;
          padding:16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          flex-wrap: wrap;
        }
        .profile-left{display:flex;align-items:center;gap:12px}
        .avatar-circle{
          width:56px;
          height:56px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,var(--primary),rgba(13,110,253,0.9));
          color:#fff;
          font-weight:700;
          font-size:1.3rem;
          box-shadow:0 6px 18px rgba(13,110,253,0.12);
          flex-shrink: 0;
        }
        .user-name{font-size:1rem;font-weight:800;color:var(--primary);margin:0}
        .user-meta{color:var(--muted);font-size:.85rem}
        .profile-tabs{
          display:flex;
          gap:16px;
          overflow-x: auto;
          flex-shrink: 0;
        }
        .profile-tab{
          cursor:pointer;
          padding:8px 12px;
          border-bottom:3px solid transparent;
          color:var(--muted);
          font-weight:600;
          transition:all .22s;
          white-space: nowrap;
        }
        .profile-tab:hover{color:var(--primary)}
        .profile-tab.active{color:var(--primary);border-bottom-color:var(--primary);font-weight:700}
        .profile-main{padding:16px}
        .profile-grid{display:grid;grid-template-columns:1fr;gap:16px;align-items:start}
        .profile-card{
          background:var(--card-bg);
          border-radius:12px;
          padding:16px;
          border:1px solid rgba(13,110,253,0.04);
          box-shadow:0 10px 30px rgba(16,24,40,0.04);
        }
        .profile-stats{display:flex;flex-direction:column;gap:10px}
        .stat{display:flex;justify-content:space-between;align-items:center;padding:10px;border-radius:10px;background:linear-gradient(90deg, rgba(13,110,253,0.03), transparent)}
        .stat strong{color:var(--primary)}
        .edit-btn{background:var(--primary);color:#fff;border:none;padding:8px 12px;border-radius:10px;font-weight:700;box-shadow:0 8px 24px rgba(13,110,253,0.12);cursor:pointer}
        .section-title{font-weight:700;margin-bottom:12px;color:var(--primary)}
        
        @media(max-width:991.98px){
          .profile-top {
            padding: 12px;
            flex-direction: column;
            align-items: flex-start;
          }
          .profile-tabs {
            width: 100%;
            gap: 8px;
          }
          .profile-main {
            padding: 12px;
          }
        }
        @media(max-width:575.98px){
          .profile-shell{padding:0;}
          .profile-top{padding:10px 12px;}
          .avatar-circle{width:44px;height:44px;font-size:1rem;}
          .user-name{font-size:0.9rem;}
          .user-meta{font-size:.75rem;}
          .profile-tabs{gap:6px;}
          .profile-tab{padding:6px 8px;font-size:0.8rem;}
          .profile-main{padding:8px;}
          .profile-card{padding:12px;border-radius:8px;}
        }
        `}
      </style>
    </div>
  );
};

export default Profile;
