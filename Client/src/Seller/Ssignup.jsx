import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Ssignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/api/seller/signup", { name, email, password });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "1rem" }}>
      <div className="premium-card" style={{ padding: "2.5rem", width: "100%", maxWidth: "450px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>Seller Registration</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", textAlign: "center" }}>Register your business to sell books</p>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}
        {message && <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Business/Seller Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="premium-input" />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="premium-input" />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="premium-input" />
          </div>

          <button type="submit" className="premium-btn" style={{ marginTop: "1rem", background: "linear-gradient(135deg, var(--accent-secondary) 0%, #059669 100%)" }}>Register</button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Already have an account? <span onClick={() => navigate("/seller/login")} style={{ color: "var(--accent-secondary)", cursor: "pointer", fontWeight: "600" }}>Log In</span>
        </p>
      </div>
    </div>
  );
}
