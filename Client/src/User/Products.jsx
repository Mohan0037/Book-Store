import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";

export default function Products() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user/login");
      return;
    }
    try {
      let url = "http://localhost:8000/api/user/books";
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setBooks(response.data);
    } catch (err) {
      setError("Failed to fetch books catalog");
    }
  };

  useEffect(() => {
    fetchBooks();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [navigate, search, genre]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

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
          <span style={{ fontWeight: "500", color: "var(--accent-primary)" }}>Browse</span>
          <span onClick={() => navigate("/user/orders")} style={{ cursor: "pointer", fontWeight: "500" }}>My Orders</span>
          <span onClick={() => navigate("/user/orders")} style={{ cursor: "pointer", fontWeight: "600" }}>
            Cart ({cartCount})
          </span>
          <button onClick={handleLogout} className="premium-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-danger)" }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "2rem" }}>Browse Catalog</h1>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="premium-input"
            style={{ flex: 2, minWidth: "250px" }}
          />
          <input
            type="text"
            placeholder="Filter by genre..."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="premium-input"
            style={{ flex: 1, minWidth: "150px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2.5rem" }}>
          {books.map((book) => (
            <div key={book._id} className="premium-card" style={{ display: "flex", flexDirection: "column", height: "100%", cursor: "pointer" }} onClick={() => navigate(`/user/books/${book._id}`)}>
              <div style={{ height: "220px", overflow: "hidden", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)", background: "var(--bg-secondary)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {book.image ? (
                  <img src={`http://localhost:8000${book.image}`} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No Cover Photo</div>
                )}
              </div>
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-primary)", fontWeight: "700", marginBottom: "0.5rem" }}>{book.genre}</span>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "0.25rem" }}>{book.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>by {book.author}</p>
                <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "800" }}>${book.price.toFixed(2)}</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.8125rem", color: book.quantity > 0 ? "var(--accent-secondary)" : "var(--accent-danger)", fontWeight: "600" }}>
                    {book.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {books.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
              No books matching your criteria.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
