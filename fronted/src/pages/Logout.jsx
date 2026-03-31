import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleFill, BoxArrowRight } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Logout() {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDone(true);
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "520px", width: "100%" }}>
        <div className="card-body text-center p-5">
          {/* Icon */}
          <div className="mb-4">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center bg-primary bg-gradient text-white shadow"
              style={{ width: "70px", height: "70px" }}
            >
              <BoxArrowRight size={36} />
            </div>
          </div>

          {/* Title */}
          <h2 className="fw-bold mb-2 text-dark">Sign Out</h2>
          <p className="text-muted mb-4">
            You’re currently signed in. Signing out will end your session on this device.
          </p>

          {/* Buttons */}
          {!confirming && !done && (
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-danger px-4 rounded-pill shadow-sm"
                onClick={() => setConfirming(true)}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Sign Out
              </button>
              <button
                className="btn btn-outline-secondary px-4 rounded-pill"
                onClick={() => navigate("/user/home")}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Confirmation */}
          {confirming && !done && (
            <div className="mt-4">
              <p className="text-muted">Are you sure you want to sign out?</p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={() => setConfirming(false)}
                >
                  No, stay signed in
                </button>
                <button
                  className="btn btn-danger rounded-pill shadow-sm"
                  onClick={handleLogout}
                >
                  Yes, sign out
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {done && (
            <div className="mt-4 text-success">
              <CheckCircleFill size={40} className="mb-2" />
              <p className="fw-semibold mb-0">You’re signed out successfully!</p>
              <small className="text-muted">Redirecting to login...</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
