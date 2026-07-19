import React from "react";

export default function OrderItem({ order }) {
  return (
    <div className="premium-card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>
            Ordered on {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span style={{ fontSize: "0.875rem", fontWeight: "700" }}>ID: {order._id}</span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            padding: "0.25rem 0.5rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            fontWeight: "700",
            background: order.status === "Delivered" ? "rgba(16, 185, 129, 0.2)" : order.status === "Shipped" ? "rgba(99, 102, 241, 0.2)" : "rgba(245, 158, 11, 0.2)",
            color: order.status === "Delivered" ? "var(--accent-secondary)" : order.status === "Shipped" ? "var(--accent-primary)" : "var(--accent-warning)"
          }}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
        {order.books?.map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "between", fontSize: "0.875rem" }}>
            <span>
              {item.bookId?.title || "Deleted Book"} <span style={{ color: "var(--text-secondary)" }}>x{item.quantity}</span>
            </span>
            <span style={{ marginLeft: "auto", fontWeight: "600" }}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "between", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", fontWeight: "700" }}>
        <span>Total:</span>
        <span style={{ marginLeft: "auto" }}>${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
