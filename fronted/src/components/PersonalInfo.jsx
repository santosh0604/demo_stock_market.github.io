import React from "react";
import { useOutletContext } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUniversity,
  FaMoneyBill,
  FaVenusMars,
  FaIdBadge,
  FaHeart,
} from "react-icons/fa";

const PersonalInfo = () => {
  // ✅ Access user data from Profile.jsx via Outlet context
  const { user } = useOutletContext();

  if (!user) {
    return <p className="text-center mt-5">Loading user data...</p>;
  }

  const infoItems = [
    { icon: <FaUser />, label: "Full Name", value: user.fullname },
    { icon: <FaIdBadge />, label: "Username", value: user.username },
    { icon: <FaPhone />, label: "Phone No", value: user.phone_no },
    { icon: <FaEnvelope />, label: "Email", value: user.email },
    { icon: <FaBirthdayCake />, label: "Date of Birth", value: user.dob },
    { icon: <FaIdBadge />, label: "Demat ID", value: user._id },
    { icon: <FaMoneyBill />, label: "Income", value: user.income ? `₹${user.income}` : "—" },
    { icon: <FaVenusMars />, label: "Gender", value: user.gender },
    { icon: <FaHeart />, label: "Marital Status", value: user.marital_status },
  ];

  return (
    <div className="profile-main" style={{ padding: "0" }}>
      <div className="profile-card" style={{ maxWidth: "100%", padding: "0" }}>
        <h3 className="section-title text-center mb-3" style={{ fontSize: "1.1rem" }}>Personal Information</h3>

        <div className="row g-2 g-md-3">
          {infoItems.map((item, index) => (
            <div key={index} className="col-12 col-sm-6">
              <div
                className="d-flex align-items-center p-2 p-md-3 rounded-3"
                style={{
                  background: "var(--accent)",
                  border: "1px solid rgba(13,110,253,0.06)",
                  transition: "transform 0.18s ease",
                  minHeight: "70px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div
                  className="me-2 me-md-3 d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    width: "40px",
                    height: "40px",
                    fontSize: "1rem",
                    minWidth: "40px",
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p className="mb-1 text-secondary" style={{ fontSize: "0.8rem", fontWeight: "500", lineHeight: "1.2" }}>
                    {item.label}
                  </p>
                  <p className="fw-semibold text-dark" style={{ fontSize: "0.9rem", marginBottom: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.value || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;