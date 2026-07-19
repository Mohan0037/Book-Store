import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Snavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
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
      <div style={{ fontWeight: "800", fontSize: "1.25rem", color: "var(--accent-secondary)" }}>
        BookStore Seller
      </div>
      <div style={{ display: "flex", gap: "2rem", marginLeft: "auto", alignItems: "center" }}>
        <Link to="/seller" style={{ fontWeight: "500" }}>Dashboard</Link>
        <Link to="/seller/my-products" style={{ fontWeight: "500" }}>My Books</Link>
        <Link to="/seller/add-book" style={{ fontWeight: "500" }}>Add Book</Link>
        <Link to="/seller/orders" style={{ fontWeight: "500" }}>Orders</Link>
        <button onClick={handleLogout} className="premium-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-danger)" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
