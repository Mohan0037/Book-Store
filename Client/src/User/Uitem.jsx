import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";

export default function Uitem() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [interactions, setInteractions] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBookDetails = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user/login");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [bookRes, interRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/user/books/${id}`, config),
        axios.get(`http://localhost:8000/api/user/books/${id}/interactions`, config)
      ]);
      setBook(bookRes.data);
      setInteractions(interRes.data);
    } catch (err) {
      setError("Failed to load book details");
    }
  };

  useEffect(() => {
    fetchBookDetails();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!book) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex((item) => item.bookId === book._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({ bookId: book._id, title: book.title, price: book.price, quantity: qty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    alert("Added to cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    try {
      await axios.post("http://localhost:8000/api/user/interactions", {
        bookId: id,
        rating,
        review: reviewText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviewText("");
      fetchBookDetails();
    } catch (err) {
      setError("Failed to post review");
    }
  };

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
          <span onClick={() => navigate("/user/books")} style={{ cursor: "pointer", fontWeight: "500" }}>Browse</span>
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
        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        {book ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div className="premium-card" style={{ padding: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
              <div style={{ maxHeight: "400px", overflow: "hidden", borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {book.image ? (
                  <img src={`http://localhost:8000${book.image}`} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ color: "var(--text-secondary)", padding: "4rem" }}>No Cover Photo</div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "0.875rem", textTransform: "uppercase", color: "var(--accent-primary)", fontWeight: "700", marginBottom: "0.5rem" }}>
                  {book.genre}
                </span>
                <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: "0.5rem" }}>{book.title}</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", marginBottom: "1.5rem" }}>by {book.author}</p>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "2rem" }}>{book.description}</p>

                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "2rem" }}>
                  ${book.price.toFixed(2)}
                </div>

                {book.quantity > 0 ? (
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <input
                      type="number"
                      min="1"
                      max={book.quantity}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="premium-input"
                      style={{ width: "80px", textAlign: "center" }}
                    />
                    <button onClick={handleAddToCart} className="premium-btn">Add to Cart</button>
                  </div>
                ) : (
                  <div style={{ color: "var(--accent-danger)", fontWeight: "700", fontSize: "1.25rem" }}>Out of Stock</div>
                )}
              </div>
            </div>

            <div className="premium-card" style={{ padding: "3rem" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Customer Reviews</h2>

              <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Write a Review</h3>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: "600" }}>Rating:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="premium-input" style={{ width: "auto" }}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Describe your reading experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    className="premium-input"
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="premium-btn" style={{ alignSelf: "flex-start" }}>Submit Review</button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {interactions.filter(i => i.review || i.rating).map((inter) => (
                  <div key={inter._id} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: "700" }}>{inter.userId?.name || "Reader"}</span>
                      <span style={{ marginLeft: "auto", color: "var(--accent-warning)", fontWeight: "700" }}>
                        {"★".repeat(inter.rating)}{"☆".repeat(5 - inter.rating)}
                      </span>
                    </div>
                    {inter.review && <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{inter.review}</p>}
                  </div>
                ))}
                {interactions.filter(i => i.review || i.rating).length === 0 && (
                  <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>No reviews yet. Be the first to leave one!</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
