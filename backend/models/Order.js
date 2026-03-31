const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  companyName: String,
  side: String, // BUY / SELL
  qty: Number,
  priceType: String, // Market or Limit
  tradedPrice: Number,
  limitPrice: Number,
  totalAmount: Number,
  // average executed price (for COMPLETED orders)
  avgPrice: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  date: { type: Date, default: Date.now },
  // for limit orders we may store the originally reserved amount
  reservedAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Order", orderSchema);
