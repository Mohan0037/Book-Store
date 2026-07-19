import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snavbar from "./Snavbar";
import Footer from "../Components/Footer";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("sellerToken");
    if (!token) {
      navigate("/seller/login");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8000/api/seller/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem("sellerToken");
    try {
      await axios.put(`http://localhost:8000/api/seller/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Snavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "2rem" }}>Customer Orders</h1>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {orders.map((order) => (
            <div key={order._id} className="premium-card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Order ID: {order._id}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Placed by {order.user?.name} ({order.user?.email}) on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="premium-input"
                    style={{ width: "auto", padding: "0.5rem 2rem 0.5rem 1rem", fontWeight: "600" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {order.books.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ fontWeight: "600" }}>{item.bookId?.title}</h4>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>by {item.bookId?.author}</p>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <p style={{ fontWeight: "600" }}>Qty: {item.quantity}</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
              No orders received yet.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
