const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/UsersController");
const { verifyUser } = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyUser, getProfile);
router.put("/profile", verifyUser, updateProfile);

router.get("/books", verifyUser, getBooks);
router.get("/books/:id", verifyUser, getBookById);

router.post("/interactions", verifyUser, addInteraction);
router.get("/books/:bookId/interactions", verifyUser, getBookInteractions);

router.post("/orders", verifyUser, placeOrder);
router.get("/orders", verifyUser, getMyOrders);

module.exports = router;
