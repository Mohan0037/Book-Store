import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Anavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <nav style={{
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border-color)",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "between",
      alignItems: "center"
    }}>
      <div style={{ fontWeight: "800", fontSize: "1.25rem", color: "var(--accent-warning)" }}>
        BookStore Admin
      </div>
      <div style={{ display: "flex", gap: "2rem", marginLeft: "auto", alignItems: "center" }}>
        <Link to="/admin" style={{ fontWeight: "500", transition: "var(--transition-smooth)" }}>Dashboard</Link>
        <Link to="/admin/books" style={{ fontWeight: "500" }}>Books</Link>
        <Link to="/admin/sellers" style={{ fontWeight: "500" }}>Sellers</Link>
        <Link to="/admin/users" style={{ fontWeight: "500" }}>Users</Link>
        <button onClick={handleLogout} className="premium-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-danger)" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
