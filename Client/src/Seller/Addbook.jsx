import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snavbar from "./Snavbar";
import Footer from "../Components/Footer";

export default function Addbook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("sellerToken");
    if (!token) {
      navigate("/seller/login");
      return;
    }

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
      await axios.post("http://localhost:8000/api/seller/books", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Book added successfully");
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Snavbar />
      <main className="premium-container" style={{ flex: 1, padding: "3rem 2rem" }}>
        <div className="premium-card" style={{ padding: "2.5rem", maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>Add New Book Listing</h2>

          {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{error}</div>}
          {message && <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>{message}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Book Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="premium-input" />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Author Name</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="premium-input" />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Genre</label>
              <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required className="premium-input" />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="premium-input" rows="4" style={{ resize: "vertical" }}></textarea>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Price ($)</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="premium-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Quantity Stock</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="premium-input" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Book Cover Image</label>
              <input type="file" onChange={handleFileChange} className="premium-input" accept="image/*" />
            </div>

            <button type="submit" className="premium-btn" style={{ marginTop: "1rem", background: "linear-gradient(135deg, var(--accent-secondary) 0%, #059669 100%)" }}>List Book</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
