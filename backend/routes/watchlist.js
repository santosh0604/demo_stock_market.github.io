// backend/routes/watchlist.routes.js
const express=require("express");
const Watchlist = require("../models/Watchlist");
const axios=require("axios")
const router = express.Router();

// all this are the watchlist routes      start
// ✅ Create a new watchlist
router.post("/", async (req, res) => {
  try {
    console.log("Received:", req.body);
    const { name, stocks, userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const newWatchlist = new Watchlist({ name, stocks, userId });
    const saved = await newWatchlist.save();
    console.log("✅ Watchlist saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating watchlist:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all watchlists for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const watchlists = await Watchlist.find({ userId });
    res.json(watchlists);
  } catch (err) {
    res.status(500).json({ message: "Error fetching watchlists", error: err });
  }
});

// ✅ Get a specific watchlist by ID
router.get("/:id", async (req, res) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id);
    res.json(watchlist);
  } catch (err) {
    res.status(404).json({ message: "Watchlist not found", error: err });
  }
});

// ✅ Add a stock to watchlist
// ✅ Add a stock to a specific watchlist
router.put("/:id/add", async (req, res) => {
  try {
    const { stock } = req.body;

    if (!stock || !stock.trim()) {
      return res.status(400).json({ message: "Stock symbol is required" });
    }

    const updatedWatchlist = await Watchlist.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { stocks: stock.toUpperCase() } }, // prevent duplicates
      { new: true }
    );

    if (!updatedWatchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    res.json(updatedWatchlist);
  } catch (err) {
    console.error("❌ Error adding stock:", err.message);
    res.status(500).json({ message: "Error adding stock", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedWatchlist = await Watchlist.findByIdAndDelete(req.params.id);

    if (!deletedWatchlist) {
      return res.status(404).json({ error: "Watchlist not found" });
    }

    console.log(`✅ Watchlist deleted: ${deletedWatchlist.name} (${req.params.id})`);
    res.json({ message: "Watchlist deleted successfully", deletedWatchlist });
  } catch (err) {
    console.error("❌ Error deleting watchlist:", err);
    res.status(500).json({ error: "Failed to delete watchlist", details: err.message });
  }
});

// DELETE a stock from a watchlist
router.delete("/:watchlistId/stocks/:symbol", async (req, res) => {
  const { watchlistId, symbol } = req.params;

  try {
    const updatedWatchlist = await Watchlist.findByIdAndUpdate(
      watchlistId,
      { $pull: { stocks: { symbol: symbol } } }, // Remove stock with matching symbol
      { new: true }
    );

    if (!updatedWatchlist) {
      return res.status(404).json({ error: "Watchlist not found" });
    }

    res.json(updatedWatchlist);
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ error: "Failed to delete stock", details: err.message });
  }
});


router.post("/:id/stocks", async (req, res) => {
  const { symbol } = req.body;
  console.log("📩 Received request to add stock:", symbol);

  if (!symbol) {
    return res.status(400).json({ error: "Stock symbol is required" });
  }

  try {
    // ✅ Step 1: Fetch stock info from RapidAPI
    const options = {
      method: "GET",
      url: "https://indian-stock-exchange-api2.p.rapidapi.com/stock",
      params: { name: symbol },
      headers: {
        "x-rapidapi-key": "1544c3c6cemsh1fd8164e771e630p10e013jsne6a0249f2d6d",
        "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data;

    if (!data) {
      return res.status(404).json({ error: "Stock data not found" });
    }

    console.log("✅ RapidAPI Stock Data Received:", data.companyName);

    // ✅ Step 2: Try fetching NSE data (optional)
    let nseData = null;
    try {
      const nseResponse = await axios.get(
        `https://www.nseindia.com/api/quote-equity?symbol=${symbol.toUpperCase()}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Referer": `https://www.nseindia.com/get-quotes/equity?symbol=${symbol.toUpperCase()}`,
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive"
            // You may also need to add a valid 'cookie' header from a real browser session for production use
          },
        }
      );
      nseData = nseResponse.data;
      console.log(nseData)
      console.log("✅ NSE Stock data received successfully");
    } catch (err) {
      console.warn("⚠️ NSE API fetch failed:", err.message);
    }

    // ✅ Step 3: Match main company with peers for image
    const mainCompanyName = (data?.companyName || "").toLowerCase();
    const peers = data?.companyProfile?.peerCompanyList || [];

    let matchedImage = null;
    let matchedPeer = null;

    for (const peer of peers) {
      const peerName = (peer?.companyName || "").toLowerCase();
      if (peerName.includes(mainCompanyName) || mainCompanyName.includes(peerName)) {
        matchedImage = peer?.imageUrl || null;
        matchedPeer = peer;
        break;
      }
    }

    console.log("✅ Matched Peer Company:", matchedPeer?.companyName || "No match found");
    console.log("🖼️ Matched Image URL:", matchedImage || "No image found");

    // ✅ Step 4: Normalize stock data safely
    const stockData = {
      symbol: symbol.toUpperCase(),
      name: data?.companyName || nseData?.info?.companyName || symbol,
      image:
        matchedImage ||
        "https://static.thenounproject.com/png/602633-200.png", // fallback image
      price: parseFloat(nseData?.priceInfo?.lastPrice || data.currentPrice.BSE).toFixed(2),
      change: nseData.priceInfo.change,
      percentChange: parseFloat(
        nseData?.priceInfo?.pChange ||
          data?.percentChange ||
          data?.priceChangePercent ||
          0
      ),
    };

    console.log("✅ Final Stock Object:", stockData);

    // ✅ Step 5: Update the watchlist in DB
    const updatedWatchlist = await Watchlist.findByIdAndUpdate(
      req.params.id,
      { $push: { stocks: stockData } },
      { new: true }
    );

    if (!updatedWatchlist) {
      console.log("❌ Watchlist not found for ID:", req.params.id);
      return res.status(404).json({ error: "Watchlist not found" });
    }

    console.log("✅ Watchlist updated successfully");
    res.json(updatedWatchlist);
  } catch (err) {
    console.error("❌ Error adding stock:", err.message);
    res.status(500).json({
      error: "Failed to add stock",
      details: err.response?.data || err.message,
    });
  }
});

// ✅ Get a user's watchlist by userId (returns the first watchlist for the user)
router.get('/user/:userId', async (req, res) => {
  try {
    // Find all watchlists for the user
    const watchlists = await Watchlist.find({ userId: req.params.userId });
    if (!watchlists || watchlists.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    // Merge all stocks from all watchlists (if you want to show all stocks)
    const allStocks = watchlists.flatMap(wl => wl.stocks || []);
    res.json({ stocks: allStocks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user watchlist', details: err.message });
  }
});

module.exports = router;
