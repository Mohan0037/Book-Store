import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Anavbar from "./Anavbar";
import Footer from "../Components/Footer";

export default function Ahome() {
  const [stats, setStats] = useState({ users: 0, sellers: 0, books: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [usersRes, sellersRes, booksRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/users", config),
          axios.get("http://localhost:8000/api/admin/sellers", config),
          axios.get("http://localhost:8000/api/admin/books", config)
        ]);

        setStats({
          users: usersRes.data.length,
          sellers: sellersRes.data.length,
          books: booksRes.data.length
        });
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Anavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "2rem" }}>Admin Dashboard</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
          <div className="premium-card" style={{ padding: "2rem" }}>
            <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Total Readers</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--accent-primary)" }}>{stats.users}</p>
          </div>

          <div className="premium-card" style={{ padding: "2rem" }}>
            <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Total Sellers</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--accent-secondary)" }}>{stats.sellers}</p>
          </div>

          <div className="premium-card" style={{ padding: "2rem" }}>
            <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Listed Books</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--accent-warning)" }}>{stats.books}</p>
          </div>
        </div>

        <div className="premium-card" style={{ padding: "2.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>System Management Overview</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
            As an administrator, you have full control over the BookStore backend system. Use the navigation links above to inspect user profiles, approve or reject seller accounts, and audit the global inventory of cataloged books.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
