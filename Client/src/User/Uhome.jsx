import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";

export default function Uhome() {
  const [profile, setProfile] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        localStorage.removeItem("userToken");
        navigate("/user/login");
      }
    };

    fetchProfile();

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <nav style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "between",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: "800", fontSize: "1.25rem", color: "var(--accent-primary)", cursor: "pointer" }} onClick={() => navigate("/user")}>
          BookStore
        </div>
        <div style={{ display: "flex", gap: "2rem", marginLeft: "auto", alignItems: "center" }}>
          <Link to="/user/books" style={{ fontWeight: "500" }}>Browse</Link>
          <Link to="/user/orders" style={{ fontWeight: "500" }}>My Orders</Link>
          <span style={{ position: "relative", cursor: "pointer", fontWeight: "600" }} onClick={() => navigate("/user/orders")}>
            Cart ({cartCount})
          </span>
          <button onClick={handleLogout} className="premium-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-danger)" }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <div className="premium-card" style={{ padding: "3rem", background: "linear-gradient(135deg, var(--bg-card) 0%, #171d2b 100%)", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>
            Welcome back, {profile ? profile.name : "Reader"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", marginBottom: "2rem", maxWidth: "600px" }}>
            Ready to discover your next adventure? Dive into our massive curated catalog of fiction, technology, science, and history.
          </p>
          <button onClick={() => navigate("/user/books")} className="premium-btn">Explore Catalog</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div className="premium-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>My Order History</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Check delivery statuses, invoices, and purchase records.
            </p>
            <span onClick={() => navigate("/user/orders")} style={{ color: "var(--accent-primary)", cursor: "pointer", fontWeight: "600" }}>View Orders &rarr;</span>
          </div>

          <div className="premium-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Update Account Profile</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Update your password, registered email, and username details.
            </p>
            <span style={{ color: "var(--accent-primary)", cursor: "pointer", fontWeight: "600" }}>Profile Settings</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
