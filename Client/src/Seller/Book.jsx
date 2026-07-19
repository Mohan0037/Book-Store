import React from "react";

export default function Book({ book, onEdit, onDelete }) {
  return (
    <div className="premium-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ height: "200px", overflow: "hidden", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)", background: "var(--bg-secondary)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {book.image ? (
          <img src={`http://localhost:8000${book.image}`} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No Image Uploaded</div>
        )}
      </div>

      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-secondary)", fontWeight: "700", marginBottom: "0.5rem", display: "inline-block" }}>
          {book.genre}
        </span>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.25rem" }}>{book.title}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>by {book.author}</p>
        
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem", flex: 1 }}>
          {book.description.length > 80 ? `${book.description.substring(0, 80)}...` : book.description}
        </p>

        <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Price</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>${book.price.toFixed(2)}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            <button onClick={() => onEdit(book)} className="premium-btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8125rem", background: "var(--accent-primary)" }}>
              Edit
            </button>
            <button onClick={() => onDelete(book._id)} className="premium-btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8125rem", background: "var(--accent-danger)" }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
