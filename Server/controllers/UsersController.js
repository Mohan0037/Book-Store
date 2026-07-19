const User = require("../models/User");
const Book = require("../models/Book");
const Inventory = require("../models/Inventory");
const MyOrder = require("../models/MyOrder");
const Interaction = require("../models/Interaction");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: "user" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    if (genre) {
      query.genre = genre;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    const books = await Book.find(query).populate("sellerId", "name");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("sellerId", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addInteraction = async (req, res) => {
  try {
    const { bookId, progress, rating, review } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    let interaction = await Interaction.findOne({ userId: req.user.id, bookId });
    if (interaction) {
      if (progress !== undefined) interaction.progress = progress;
      if (rating !== undefined) interaction.rating = rating;
      if (review !== undefined) interaction.review = review;
    } else {
      interaction = new Interaction({
        userId: req.user.id,
        bookId,
        progress: progress || 0,
        rating,
        review
      });
    }

    await interaction.save();
    res.status(200).json({ message: "Interaction updated", interaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookInteractions = async (req, res) => {
  try {
    const { bookId } = req.params;
    const interactions = await Interaction.find({ bookId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { books } = req.body;
    if (!books || books.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of books) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with id ${item.bookId} not found` });
      }

      if (book.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for book: ${book.title}` });
      }

      totalPrice += book.price * item.quantity;
      orderItems.push({
        bookId: book._id,
        quantity: item.quantity,
        price: book.price
      });
    }

    for (const item of books) {
      await Book.findByIdAndUpdate(item.bookId, { $inc: { quantity: -item.quantity } });
      await Inventory.findOneAndUpdate({ bookId: item.bookId }, { $inc: { quantity: -item.quantity } });
    }

    const newOrder = new MyOrder({
      userId: req.user.id,
      books: orderItems,
      totalPrice,
      status: "Pending"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ userId: req.user.id })
      .populate("books.bookId", "title author image")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  getBooks,
  getBookById,
  addInteraction,
  getBookInteractions,
  placeOrder,
  getMyOrders
};
