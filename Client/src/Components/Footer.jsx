import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-secondary)",
      padding: "2rem 0",
      borderTop: "1px solid var(--border-color)",
      marginTop: "auto",
      textAlign: "center"
    }}>
      <div className="premium-container">
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          &copy; {new Date().getFullYear()} BookStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
