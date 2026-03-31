// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },

  transactionType: { type: String, enum: ["buy", "sell"], required: true },
  quantity: { type: Number, required: true },
  priceAtTransaction: { type: Number, required: true }, // store price at time of transaction

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
