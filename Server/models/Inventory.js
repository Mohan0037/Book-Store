const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  location: {
    type: String,
    default: "Warehouse A"
  },
  condition: {
    type: String,
    enum: ["New", "Good", "Fair"],
    default: "New"
  }
});

module.exports = mongoose.model("Inventory", InventorySchema);
