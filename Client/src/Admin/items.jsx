import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Anavbar from "./Anavbar";
import Footer from "../Components/Footer";

export default function AdminItems() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/books", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooks(response.data);
      } catch (err) {
        setError("Failed to fetch books");
      }
    };

    fetchBooks();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm("Are you sure you want to delete this book listing?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(books.filter((b) => b._id !== id));
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Anavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "2rem" }}>Manage Book Listings</h1>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        <div className="premium-card" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem" }}>Title</th>
                <th style={{ padding: "1rem" }}>Author</th>
                <th style={{ padding: "1rem" }}>Genre</th>
                <th style={{ padding: "1rem" }}>Price</th>
                <th style={{ padding: "1rem" }}>Stock</th>
                <th style={{ padding: "1rem" }}>Seller</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>{book.title}</td>
                  <td style={{ padding: "1rem" }}>{book.author}</td>
                  <td style={{ padding: "1rem" }}>{book.genre}</td>
                  <td style={{ padding: "1rem", color: "var(--accent-secondary)" }}>${book.price.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>{book.quantity}</td>
                  <td style={{ padding: "1rem" }}>{book.sellerId?.name || "N/A"}</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button onClick={() => handleDelete(book._id)} className="premium-btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8125rem", background: "var(--accent-danger)" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>No books found in database.</td>
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
