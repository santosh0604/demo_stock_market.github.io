import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


const Nominee = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    number: "",
    age: "",
  });
  const [nominee, setNominee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch user's existing nominee when page loads
  useEffect(() => {
    const fetchNominee = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://demo-stock-market-backend.onrender.com/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) {
          setNominee(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching nominee:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchNominee();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Toast message state
  const [nomineeMessage, setNomineeMessage] = useState("");

  // ✅ Handle save / update nominee
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.number || !formData.age) {
      setNomineeMessage("❌ Please fill all fields!");
      setTimeout(() => setNomineeMessage(""), 2000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNominee(res.data.nominee);
      setIsEditing(false);
      setNomineeMessage("✅ Nominee saved successfully!");
      setTimeout(() => setNomineeMessage(""), 2000);
    } catch (error) {
      console.error("Error saving nominee:", error.response?.data || error);
      setNomineeMessage(error.response?.data?.message || "❌ Error saving nominee");
      setTimeout(() => setNomineeMessage(""), 2000);
    }
  };

  // ✅ Toggle edit mode
  const handleEdit = () => {
    if (nominee) {
      setFormData({
        name: nominee.name,
        dob: nominee.dob ? nominee.dob.split("T")[0] : "",
        number: nominee.number,
        age: nominee.age,
      });
    }
    setIsEditing(true);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      {nomineeMessage && (
        <div className="alert alert-success position-fixed top-50 start-50 translate-middle" style={{ zIndex: 9999, minWidth: 240, textAlign: 'center', fontSize: 18, fontWeight: 500, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', color: nomineeMessage.includes('✅') ? '#059669' : '#ef4444', background: '#fff', border: nomineeMessage.includes('✅') ? '1.5px solid #059669' : '1.5px solid #ef4444' }}>
          {nomineeMessage}
        </div>
      )}
      <div className="profile-main" style={{ padding: "0" }}>
        <div className="profile-card" style={{ maxWidth: "100%", margin: "0", padding: "0", border: "1px solid rgba(13,110,253,0.06)" }}>
          <h3 className="section-title text-center mb-3" style={{ fontSize: "1.1rem" }}>Nominee Information</h3>
          <hr className="my-2" />

          {nominee && !isEditing ? (
            <div className="mt-3">
              <h5 className="text-success fw-bold text-center mb-3" style={{ fontSize: "0.95rem" }}>
                ✅ Nominee details saved
              </h5>
              <div className="border rounded-3 p-3 bg-light">
                <div className="row g-2">
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Name</small>
                    <strong style={{ fontSize: "0.9rem" }}>{nominee.name}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Date of Birth</small>
                    <strong style={{ fontSize: "0.9rem" }}>{new Date(nominee.dob).toLocaleDateString()}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Mobile Number</small>
                    <strong style={{ fontSize: "0.9rem" }}>{nominee.number}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Age</small>
                    <strong style={{ fontSize: "0.9rem" }}>{nominee.age}</strong>
                  </div>
                </div>
              </div>

              <div className="text-center mt-3">
                <button className="btn btn-warning px-3 py-2" style={{ fontSize: "0.85rem" }} onClick={handleEdit}>
                  ✏️ Change Nominee
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="row g-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold text-primary" style={{ fontSize: "0.8rem" }}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="name"
                    placeholder="Enter nominee's full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold text-primary" style={{ fontSize: "0.8rem" }}>
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold text-primary" style={{ fontSize: "0.8rem" }}>
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="number"
                    placeholder="Enter nominee's phone number"
                    value={formData.number}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold text-primary" style={{ fontSize: "0.8rem" }}>
                    Age <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="age"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              <div className="text-center mt-3 d-flex justify-content-center gap-2 flex-wrap">
                <button type="submit" className="edit-btn px-3 py-2" style={{ fontSize: "0.85rem" }}>
                  {isEditing ? "Update Nominee" : "Save Nominee"}
                </button>

                {isEditing && (
                  <button type="button" className="btn btn-outline-secondary px-3 py-2" style={{ fontSize: "0.85rem" }} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Nominee;
