// const mongoose = require("mongoose");

// const stockSchema = new mongoose.Schema({
//   symbol: { type: String, required: true },
//   companyName: { type: String, required: true },
//   exchange: { type: String, enum: ["NSE", "BSE"], default: "NSE" },
//   marketPrice: { type: Number, default: 0 },
//   dayChange: { type: Number, default: 0 }, // e.g., -1.25
//   dayChangePercent: { type: Number, default: 0 }, // e.g., -0.45%
// });

// const watchlistSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   watchlist_name: { type: String, required: true }, // watchlist name like "Water Management"
//   stocks: [stockSchema], // array of stocks
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Watchlist", watchlistSchema);






const  mongoose =require("mongoose");



const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  name: { type: String, required: true },
  stocks: [
    {
      symbol: String,
      name: String,
      image: String,
      price: Number,
      change: Number,
      percentChange: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model("Watchlist", watchlistSchema);










