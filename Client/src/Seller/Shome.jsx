import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snavbar from "./Snavbar";
import Footer from "../Components/Footer";

export default function Shome() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) {
      navigate("/seller/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/seller/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        localStorage.removeItem("sellerToken");
        navigate("/seller/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Snavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "1rem" }}>
          Welcome back, {profile ? profile.name : "Seller"}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>Manage your bookstore catalog and process buyer orders.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          <div className="premium-card" style={{ padding: "2.5rem" }} onClick={() => navigate("/seller/my-products")}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--accent-secondary)", cursor: "pointer" }}>Manage Catalog</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Add new book listings, upload cover photos, modify pricing, and review your current stock.
            </p>
          </div>

          <div className="premium-card" style={{ padding: "2.5rem" }} onClick={() => navigate("/seller/orders")}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--accent-primary)", cursor: "pointer" }}>Fulfill Orders</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Track shipments and update shipment status for orders placed by users for your books.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
