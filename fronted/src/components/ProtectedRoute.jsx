// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

/*
  ProtectedRoute:
  - Shows children only if user is authenticated.
  - Checks localStorage token; if token exists, optionally verifies it with backend /profile.
  - While verifying, shows a loading indicator (prevents premature redirect).
*/

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true); // still validating
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuth(false);
        setChecking(false);
        return;
      }

      // If you want faster UX and accept token presence as enough, uncomment:
      // setIsAuth(true); setChecking(false); return;

      // Otherwise verify token by calling backend /profile (recommended)
      try {
        const res = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // assume success means token valid
        if (res?.data) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        console.warn("Token verification failed:", err?.response?.data || err);
        setIsAuth(false);
      } finally {
        setChecking(false);
      }
    };

    validate();
  }, []);

  if (checking) {
    // while verifying, render nothing or a loader to avoid flash redirect
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: "#555" }}>Checking authentication…</p>
      </div>
    );
  }

  if (!isAuth) {
    // user not authenticated -> redirect to login
    return <Navigate to="/login" replace />;
  }

  // authenticated -> render children
  return <>{children}</>;
};

export default ProtectedRoute;
