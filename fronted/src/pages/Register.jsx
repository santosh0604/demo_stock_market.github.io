import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {

  FaChartLine

} from "react-icons/fa";
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    phone_no: "",
    email: "",
    password: "",
    dob: "",
    income: "",
    gender: "",
    marital_status: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://demo-stock-market-backend.onrender.com/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage("✅ Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("❌ Registration failed!");
    }
  };

  // List of fields except gender and marital_status for rendering
  const fields = [
    { name: "fullname", label: "Full Name" },
    { name: "username", label: "Username" },
    { name: "phone_no", label: "Phone No" },
    { name: "email", label: "Email" },
    { name: "password", label: "Password", type: "password" },
    { name: "dob", label: "Date of Birth" },
    { name: "income", label: "Income" },
  ];

  return (
    <div className="min-vh-100 p-3 d-flex align-items-center justify-content-center" style={{ background: "#f7fafd" }}>
      <div
        className="d-flex flex-column flex-md-row shadow-lg rounded-4 overflow-hidden w-100 p-2 p-sm-3 p-md-4"
        style={{ maxWidth: 1150, background: "#fff", maxHeight: "90vh" }}
      >
        {/* Left: Register Form */}
        <style>{`
          @media (max-width: 767.98px) {
            .register-mobile-scroll {
              max-height: 90vh !important;
              overflow-y: auto !important;
            }
          }
          @media (min-width: 768px) {
            .register-mobile-scroll {
              max-height: none !important;
              overflow-y: visible !important;
            }
          }
        `}</style>
        <div
          className="d-flex flex-column justify-content-start px-3 px-md-5 py-4 py-md-1 register-mobile-scroll"
          style={{ flex: 1.2, minWidth: 0 }}
        >
          <style>{`
            @media (min-width: 768px) {
              .register-scroll-area {
                max-height: none !important;
                overflow-y: visible !important;
              }
            }
          `}</style>
          <div className="register-scroll-area">
            <div className="mb-4">
            {/* Logo and Social Register Icons */}
            {/* <div className="d-flex align-items-center  gap-2 mb-2">
              <FaChartLine style={{ color: "var(--primary)", fontSize: '1.2rem' }} />
              <h5 className="fw-bold mb-0 text-start" style={{ color: 'var(--primary)' }}>StockMarket Pro</h5>
            </div> */}
            <h4 className="fw-bold mb-1 text-center" style={{ fontSize: '2.0rem' }}>Create Account</h4>
            <p className="text-muted mb-2 text-center">Sign up using your details</p>
            <div className="d-flex justify-content-center align-items-center mb-2 gap-3">
              <a href="#" className="d-flex align-items-center justify-content-center border rounded-circle shadow-sm bg-white" style={{ width: 48, height: 48 }} title="Register with Facebook">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#3b5998" d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg>
              </a>
              <a href="http://localhost:5000/auth/google" className="d-flex align-items-center justify-content-center border rounded-circle shadow-sm bg-white" style={{ width: 48, height: 48 }} title="Register with Google">
                <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 14.13 17.62 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.36 46.1 31.45 46.1 24.55z" /><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.91l7.98 6.2z" /><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.59c-2.01 1.35-4.6 2.15-7.96 2.15-6.38 0-11.87-4.63-13.33-10.81l-7.98 6.2C6.73 42.18 14.82 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></g></svg>
              </a>
              <a href="#" className="d-flex align-items-center justify-content-center border rounded-circle shadow-sm bg-white" style={{ width: 48, height: 48 }} title="Register with LinkedIn">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#0077b5" d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z" /></svg>
              </a>
            </div>
            <div className="d-flex align-items-center mb-3">
              <hr className="flex-grow-1" style={{ minWidth: 0 }} />
              <span className="mx-2 text-muted">OR</span>
              <hr className="flex-grow-1" style={{ minWidth: 0 }} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {fields.map((field) => (
                  <div className="font-20px col-12 col-md-6" key={field.name}>
                    <label className="form-label fs-8 text-capitalize">{field.label}</label>
                    <input

                      type={field.type || (field.name === "dob" ? "date" : "text")}
                      name={field.name}
                      className="form-control fs-8 p-1 m-0"
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                {/* Gender select */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {/* Marital Status select */}
                <div className="col-12 col-md-6 fs-6">
                  <label className="form-label">Marital Status</label>
                  <select
                    className="form-control"
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-success w-100 mt-4 rounded-pill fw-semibold fs-6" type="submit">
                Sign Up
              </button>
              {message && (
                <div className="alert alert-success" style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                  minWidth: 240,
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 500,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                  color: message.includes('\u2705') ? '#059669' : '#ef4444',
                  background: '#fff',
                  border: message.includes('\u2705') ? '1.5px solid #059669' : '1.5px solid #ef4444',
                }}>
                  {message}
                </div>
              )}
            </form>
            </div>
          </div>
          <div className="mt-4 text-center">
            {/* Mobile only: Already have an account? Sign in */}
            <div className="d-block d-md-none">
              <span className="text-muted">Already have an account?</span>
              <button
                type="button"
                className=" btn btn-link p-0 ms-2 fw-semibold text-primary align-baseline"
                style={{ textDecoration: "underline" }}
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
        {/* Right: Welcome Panel (hidden on mobile) */}
        <div
          className="d-none d-md-flex flex-column align-items-center justify-content-center position-relative text-white"
          style={{ flex: 1,maxHeight:"700px", background: "linear-gradient(135deg, #1de9b6 0%, #1dc8e9 100%)" }}
        >
          <button
            onClick={() => navigate("/login")}
            className="position-absolute top-0 end-0 m-3 btn btn-link text-white fs-2"
            style={{ textDecoration: "none" }}
          >
            &times;
          </button>
          <h2 className="fw-bold mb-3 fs-2">Welcome Back!</h2>
          <p className="fs-6 text-center mb-4" style={{ maxWidth: 320 }}>
            Already have an account? Log in and discover a great amount of new opportunities!
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-light px-5 py-2 rounded-pill fw-semibold fs-5"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
