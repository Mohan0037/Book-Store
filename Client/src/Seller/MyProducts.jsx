import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snavbar from "./Snavbar";
import Book from "./Book";
import Footer from "../Components/Footer";

export default function MyProducts() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const token = localStorage.getItem("sellerToken");
    if (!token) {
      navigate("/seller/login");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8000/api/seller/books", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(response.data);
    } catch (err) {
      setError("Failed to load listed books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book listing?")) return;
    const token = localStorage.getItem("sellerToken");
    try {
      await axios.delete(`http://localhost:8000/api/seller/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(books.filter((b) => b._id !== id));
    } catch (err) {
      setError("Failed to delete book listing");
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setDescription(book.description);
    setPrice(book.price);
    setQuantity(book.quantity);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("sellerToken");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:8000/api/seller/books/${editingBook._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setEditingBook(null);
      setImage(null);
      fetchBooks();
    } catch (err) {
      setError("Failed to update book listing");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Snavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "2rem" }}>My Listed Books</h1>

        {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}

        {editingBook ? (
          <div className="premium-card" style={{ padding: "2.5rem", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Edit Book Details</h2>
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Book Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="premium-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="premium-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Genre</label>
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required className="premium-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="premium-input" rows="4"></textarea>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Price ($)</label>
                  <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="premium-input" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Stock Quantity</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="premium-input" />
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>New Cover Image (Optional)</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className="premium-input" accept="image/*" />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="premium-btn" style={{ flex: 1, background: "var(--accent-secondary)" }}>Save Changes</button>
                <button type="button" onClick={() => setEditingBook(null)} className="premium-btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2.5rem" }}>
          {books.map((book) => (
            <div key={book._id}>
              <Book book={book} onEdit={handleEditClick} onDelete={handleDelete} />
            </div>
          ))}
          {books.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
              No books listed. Click "Add Book" to list your first book.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
