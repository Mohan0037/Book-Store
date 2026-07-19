const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUsers,
  deleteUser,
  getSellers,
  approveSeller,
  deleteSeller,
  getBooks,
  deleteBook
} = require("../controllers/AdminControllers");
const { verifyAdmin } = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", verifyAdmin, getUsers);
router.delete("/users/:id", verifyAdmin, deleteUser);

router.get("/sellers", verifyAdmin, getSellers);
router.put("/sellers/:id/approve", verifyAdmin, approveSeller);
router.delete("/sellers/:id", verifyAdmin, deleteSeller);

router.get("/books", verifyAdmin, getBooks);
router.delete("/books/:id", verifyAdmin, deleteBook);

module.exports = router;
