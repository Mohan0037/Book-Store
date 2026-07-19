const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/SellerControllers");
const { verifySeller } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifySeller, getProfile);
router.put("/profile", verifySeller, updateProfile);

router.post("/books", verifySeller, upload.single("image"), addBook);
router.get("/books", verifySeller, getMyBooks);
router.put("/books/:id", verifySeller, upload.single("image"), updateBook);
router.delete("/books/:id", verifySeller, deleteBook);

router.get("/orders", verifySeller, getOrders);
router.put("/orders/:id", verifySeller, updateOrderStatus);

module.exports = router;
