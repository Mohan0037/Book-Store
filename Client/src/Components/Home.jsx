import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1.5rem", background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BookStore
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.25rem", marginBottom: "3rem" }}>
            The ultimate platform for readers, sellers, and organizers. Discover, trade, and manage your favorite books seamlessly.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", width: "100%", margin: "0 auto 3rem auto" }}>
            <div className="premium-card" style={{ padding: "2rem", cursor: "pointer" }} onClick={() => navigate("/user/login")}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--accent-primary)" }}>Reader Portal</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Browse hundreds of titles, read reviews, track your progress, and buy books securely.</p>
            </div>

            <div className="premium-card" style={{ padding: "2rem", cursor: "pointer" }} onClick={() => navigate("/seller/login")}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--accent-secondary)" }}>Seller Portal</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>List your collection, manage inventory and orders, and reach eager readers worldwide.</p>
            </div>

            <div className="premium-card" style={{ padding: "2rem", cursor: "pointer" }} onClick={() => navigate("/admin/login")}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--accent-warning)" }}>Admin Panel</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Manage listings, approve sellers, track system operations, and manage accounts.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
