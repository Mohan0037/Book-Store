import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import OrderItem from "./OrderItem";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user/login");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8000/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch order history");
    }
  };

  useEffect(() => {
    fetchOrders();
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, [navigate]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const token = localStorage.getItem("userToken");
    try {
      const orderData = {
        books: cart.map(item => ({ bookId: item.bookId, quantity: item.quantity }))
      };
      await axios.post("http://localhost:8000/api/user/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("cart");
      setCart([]);
      setMessage("Order placed successfully!");
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    }
  };

  const handleUpdateCartQty = (idx, qty) => {
    const updated = [...cart];
    if (qty <= 0) {
      updated.splice(idx, 1);
    } else {
      updated[idx].quantity = qty;
    }
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          <span onClick={() => navigate("/user/books")} style={{ cursor: "pointer", fontWeight: "500" }}>Browse</span>
          <span style={{ fontWeight: "500", color: "var(--accent-primary)" }}>My Orders</span>
          <span style={{ fontWeight: "600" }}>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          <button onClick={handleLogout} className="premium-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-danger)" }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem" }}>
        
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem" }}>My Shopping Cart</h2>
          {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}
          {message && <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{message}</div>}

          <div className="premium-card" style={{ padding: "2rem" }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                <div>
                  <h4 style={{ fontWeight: "600" }}>{item.title}</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>${item.price.toFixed(2)} each</p>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => handleUpdateCartQty(idx, item.quantity - 1)} className="premium-btn" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateCartQty(idx, item.quantity + 1)} className="premium-btn" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>+</button>
                </div>
              </div>
            ))}

            {cart.length > 0 ? (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "between", fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem" }}>
                  <span>Total Cost:</span>
                  <span style={{ marginLeft: "auto" }}>${totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="premium-btn" style={{ width: "100%" }}>Proceed to Purchase</button>
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>Your cart is empty.</p>
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem" }}>Order History</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {orders.map((order) => (
              <OrderItem key={order._id} order={order} />
            ))}
            {orders.length === 0 && (
              <p style={{ color: "var(--text-secondary)" }}>You have not placed any orders yet.</p>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
