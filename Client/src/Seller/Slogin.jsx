import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Slogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/api/seller/login", { email, password });
      localStorage.setItem("sellerToken", response.data.token);
      navigate("/seller");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "1rem" }}>
      <div className="premium-card" style={{ padding: "2.5rem", width: "100%", maxWidth: "450px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>Seller Login</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", textAlign: "center" }}>Enter details to access seller dashboard</p>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="premium-input" />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="premium-input" />
          </div>

          <button type="submit" className="premium-btn" style={{ marginTop: "1rem", background: "linear-gradient(135deg, var(--accent-secondary) 0%, #059669 100%)" }}>Log In</button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Need an account? <span onClick={() => navigate("/seller/signup")} style={{ color: "var(--accent-secondary)", cursor: "pointer", fontWeight: "600" }}>Register</span>
        </p>
      </div>
    </div>
  );
}
