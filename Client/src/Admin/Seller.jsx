import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Anavbar from "./Anavbar";
import Footer from "../Components/Footer";

export default function AdminSeller() {
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchSellers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/sellers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSellers(response.data);
      } catch (err) {
        setError("Failed to fetch sellers");
      }
    };

    fetchSellers();
  }, [navigate]);

  const handleToggleApprove = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.put(`http://localhost:8000/api/admin/sellers/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellers(sellers.map((s) => (s._id === id ? response.data.seller : s)));
    } catch (err) {
      setError("Failed to update seller status");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/sellers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellers(sellers.filter((s) => s._id !== id));
    } catch (err) {
      setError("Failed to delete seller");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Anavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "2rem" }}>Manage Seller Accounts</h1>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        <div className="premium-card" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem" }}>Business Name</th>
                <th style={{ padding: "1rem" }}>Email</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>{seller.name}</td>
                  <td style={{ padding: "1rem" }}>{seller.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      background: seller.isApproved ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                      color: seller.isApproved ? "var(--accent-secondary)" : "var(--accent-warning)"
                    }}>
                      {seller.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button onClick={() => handleToggleApprove(seller._id)} className="premium-btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8125rem", background: seller.isApproved ? "var(--accent-warning)" : "var(--accent-secondary)" }}>
                      {seller.isApproved ? "Suspend" : "Approve"}
                    </button>
                    <button onClick={() => handleDelete(seller._id)} className="premium-btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8125rem", background: "var(--accent-danger)" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sellers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>No sellers registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
