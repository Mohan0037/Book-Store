const Seller = require("../models/Seller");
const Book = require("../models/Book");
const Inventory = require("../models/Inventory");
const MyOrder = require("../models/MyOrder");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({
      name,
      email,
      password: hashedPassword
    });

    await newSeller.save();

    res.status(201).json({
      message: "Registration successful. Please wait for admin approval.",
      seller: {
        id: newSeller._id,
        name: newSeller.name,
        email: newSeller.email,
        isApproved: newSeller.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!seller.isApproved) {
      return res.status(403).json({ message: "Account is pending approval" });
    }

    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const seller = await Seller.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (name) seller.name = name;
    if (email) seller.email = email;
    if (password) {
      seller.password = await bcrypt.hash(password, 10);
    }

    await seller.save();
    res.status(200).json({
      message: "Profile updated successfully",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, quantity } = req.body;
    if (!title || !author || !genre || !description || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newBook = new Book({
      title,
      author,
      genre,
      description,
      price: Number(price),
      quantity: Number(quantity),
      image: imagePath,
      sellerId: req.user.id
    });

    await newBook.save();

    const newInventory = new Inventory({
      bookId: newBook._id,
      quantity: Number(quantity),
      location: "Warehouse A",
      condition: "New"
    });

    await newInventory.save();

    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user.id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, description, price, quantity } = req.body;

    const book = await Book.findOne({ _id: id, sellerId: req.user.id });
    if (!book) {
      return res.status(404).json({ message: "Book not found or unauthorized" });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (description) book.description = description;
    if (price) book.price = Number(price);
    if (quantity !== undefined) {
      book.quantity = Number(quantity);
      await Inventory.findOneAndUpdate(
        { bookId: book._id },
        { quantity: Number(quantity) },
        { upsert: true }
      );
    }

    if (req.file) {
      book.image = `/uploads/${req.file.filename}`;
    }

    await book.save();
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({ _id: id, sellerId: req.user.id });
    if (!book) {
      return res.status(404).json({ message: "Book not found or unauthorized" });
    }
    await Inventory.findOneAndDelete({ bookId: id });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const myBooks = await Book.find({ sellerId: req.user.id }).select("_id");
    const bookIds = myBooks.map(b => b._id);

    const orders = await MyOrder.find({
      "books.bookId": { $in: bookIds }
    }).populate("userId", "name email").populate("books.bookId", "title author price");

    const sellerOrders = orders.map(order => {
      const filteredBooks = order.books.filter(b => bookIds.some(id => id.equals(b.bookId._id)));
      return {
        _id: order._id,
        user: order.userId,
        books: filteredBooks,
        status: order.status,
        createdAt: order.createdAt
      };
    });

    res.status(200).json(sellerOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await MyOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  addBook,
  getMyBooks,
  updateBook,
  deleteBook,
  getOrders,
  updateOrderStatus
};
