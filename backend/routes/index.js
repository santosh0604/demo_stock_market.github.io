const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const axios = require("axios");
const NewsAPI = require("newsapi");
const multer = require("multer"); // ✅ Correct
const jwt = require("jsonwebtoken");
const Nominee = require("../models/Nominee");
const https = require("https");
const Order = require("../models/Order");
// Define axiosNSE for NSE requests
const axiosNSE = require("axios").create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.nseindia.com/",
    Connection: "keep-alive",
  },
});

/* Home Page */
router.get("/", function (req, res) {
  res.send("hello World");
});

// const axios=require('axios');

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.error("❌ Passport error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.error("❌ Login error:", err);
        return res.status(500).json({ message: "Login failed" });
      }

      // ✅ Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET || "your_jwt_secret_key",
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// ✅ TOKEN VERIFICATION MIDDLEWARE
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Accept "Bearer <token>" or just the token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret_key",
    (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid or expired token" });
      req.user = decoded; // { id, username, ... }
      next();
    }
  );
}

// ✅ PROTECTED HOME ROUTE
router.get("/home", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to the protected home page!",
    user: req.user, // decoded user info
  });
});

// GET /api/users/profile
router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.post("/register", async (req, res) => {
  try {
    const {
      fullname,
      username,
      phone_no,
      email,
      password,
      dob,
      doid,
      income,
      gender,
      marital_status,
    } = req.body;

    // ✅ make sure both username and password are not empty
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const newUser = new User({
      fullname,
      username,
      phone_no,
      email,
      dob,
      doid,
      income,
      gender,
      marital_status,
    });

    await User.register(newUser, password); // ✅ register using passport-local-mongoose

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /api/nominee/add - Add or update single nominee per user
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, dob, number, age } = req.body;

    if (!name || !dob || !number || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if nominee already exists for this user
    let nominee = await Nominee.findOne({ userId: req.user.id });

    if (nominee) {
      // Update existing nominee
      nominee.name = name;
      nominee.dob = dob;
      nominee.number = number;
      nominee.age = age;
      await nominee.save();
      return res
        .status(200)
        .json({ message: "Nominee updated successfully", nominee });
    } else {
      // Create new nominee
      nominee = new Nominee({
        userId: req.user.id,
        name,
        dob,
        number,
        age,
      });
      await nominee.save();
      return res
        .status(201)
        .json({ message: "Nominee added successfully", nominee });
    }
  } catch (error) {
    console.error("Error saving nominee:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/nominee/my - Fetch all nominees for logged-in user
router.get("/my", verifyToken, async (req, res) => {
  try {
    const nominees = await Nominee.find({ userId: req.user.id });
    res.json(nominees);
  } catch (error) {
    console.error("Error fetching nominees:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const Parser = require("rss-parser");
const parser = new Parser();

router.get("/news", async (req, res) => {
  const feed = await parser.parseURL(
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
  );
  //  console.log(feed);
  const articles = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    description: item.contentSnippet,
    pubDate: item.pubDate,
  }));
  // console.log(items.content)
  res.render("news", { articles });
});

// 1️⃣ Show logout confirmation page
router.get("/logout", (req, res) => {
  res.render("logout"); // just render, don't log out yet
});

// 2️⃣ Handle actual logout
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/"); // redirect after logging out
    });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

async function getNseData(url) {
  await getCookies(); // Get cookies first
  const res = await axiosNSE.get(url);
  return res.data;
}
async function getCookies() {
  await axiosNSE.get("https://www.nseindia.com");
}
// for stock page .............................
async function getFullNameFromSymbol(symbol) {
  try {
    const response = await axios.get(
      `https://www.nseindia.com/api/search/autocomplete?q=${symbol}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    // NSE returns a list of matches, so take the first result
    if (response.data && response.data[0]) {
      return response.data[0].symbol_info || response.data[0].symbol;
    } else {
      return symbol; // fallback if not found
    }
  } catch (err) {
    console.error("NSE lookup failed:", err.message);
    return symbol; // fallback
  }
}

router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const profileTemplate = fs.readFileSync("views/profile.ejs", "utf8"); // utf8 is required
  const profileHTML = ejs.render(profileTemplate, { user: req.user });

  res.render("layout", {
    title: "Profile",
    activeMenu: "profile",
    body: profileHTML,
  });
});

router.get("/nominee", async (req, res) => {
  try {
    // Find nominee for the logged-in user
    const nominee = await Nominee.findOne({ userId: req.user._id }).lean();
    const nomineeHtml = ejs.render(
      fs.readFileSync("views/display/nominee.ejs", "utf8"),
      { nominee: nominee || null } // pass nominee or null
    );
    res.render("layout", {
      title: "Nominee",
      activeMenu: "nominee",
      body: nomineeHtml,
    });
  } catch (err) {
    console.error("Nominee fetch error:", err);
    res.status(500).send("Error loading nominee");
  }
});
router.post("/nominee", async function (req, res) {
  try {
    const { name, dob, number, age } = req.body;
    // Always remove any existing nominee for this user
    await Nominee.deleteOne({ userId: req.user._id });
    const nominee = new Nominee({
      userId: req.user._id,
      name,
      dob,
      number,
      age,
    });

    await nominee.save();

    res.redirect("/nominee");
  } catch (err) {
    console.error("Nominee save error:", err);
    res.status(500).send("Error saving nominee information");
  }
});


// GET USER ORDERS ..... this is used to display the orders on the portfolio page
router.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      date: -1,
    });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// DEBUG: get orders for a user + symbol (helps inspect executed prices)
router.get("/orders/:userId/:symbol", async (req, res) => {
  try {
    const { userId, symbol } = req.params;
    if (!userId || !symbol)
      return res.status(400).json({ error: "Missing userId or symbol" });

    const orders = await Order.find({ userId, symbol }).sort({ date: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    console.error("Failed to fetch orders by symbol:", err);
    res.status(500).json({ error: "Failed to fetch orders by symbol" });
  }
});

// GET USER HOLDINGS .. this is used to display the holdings on the portfolio page
router.get("/portfolio/holdings/:userId/:symbol", async (req, res) => {
  try {
    const { userId, symbol } = req.params;

    // Only COMPLETED orders count towards holdings
    const orders = await Order.find({ userId, symbol, status: "COMPLETED" });

    let totalBuy = 0;
    let totalSell = 0;

    orders.forEach((o) => {
      if (o.side === "BUY") totalBuy += o.qty;
      if (o.side === "SELL") totalSell += o.qty;
    });

    const qtyOwned = totalBuy - totalSell;

    res.json({ quantity: qtyOwned }); // IMPORTANT → frontend expects "quantity"
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load holdings" });
  }
});

router.post("/place/order", async (req, res) => {
  try {
    const {
      userId,
      stockSymbol,
      companyName,
      quantity,
      transactionType,
      priceType,
      limitPrice,
      marketPrice,
      percentChnage,
    } = req.body;

    if (!userId || !stockSymbol || !quantity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const tradedPrice =
      priceType === "Market" ? Number(marketPrice) : Number(limitPrice);

    const totalAmount = tradedPrice * Number(quantity);

    // -------------------------------
    // Executing only for MARKET ORDER
    // -------------------------------
    if (priceType === "Market") {
      if (transactionType === "BUY") {
        if (user.balance < totalAmount) {
          return res.status(400).json({ error: "Insufficient balance" });
        }
        user.balance = Number((user.balance - totalAmount).toFixed(2));
      } else {
        // SELL LOGIC
        const existingOrders = await Order.find({
          userId,
          symbol: stockSymbol,
        });

        let totalBuy = 0,
          totalSell = 0;

        existingOrders.forEach((o) => {
          if (o.side === "BUY") totalBuy += o.qty;
          if (o.side === "SELL") totalSell += o.qty;
        });

        const currentQty = totalBuy - totalSell;

        if (quantity > currentQty) {
          return res.status(400).json({ error: "Not enough holdings to sell" });
        }

        user.balance = Number((user.balance + totalAmount).toFixed(2));
      }

      await user.save();
    }

    // -------------------------------
    // LIMIT ORDER validations (SELL cannot exceed available completed holdings minus pending sells)
    // -------------------------------
    if (priceType === "Limit" && transactionType === "SELL") {
      // completed holdings
      const completed = await Order.find({
        userId,
        symbol: stockSymbol,
        status: "COMPLETED",
      });
      let totalBuy = 0,
        totalSell = 0;
      completed.forEach((o) => {
        if (o.side === "BUY") totalBuy += o.qty;
        if (o.side === "SELL") totalSell += o.qty;
      });
      const qtyOwned = totalBuy - totalSell;

      // pending sells already placed
      const pendingSells = await Order.find({
        userId,
        symbol: stockSymbol,
        status: "PENDING",
        side: "SELL",
      });
      const pendingQty = pendingSells.reduce((s, o) => s + o.qty, 0);

      const availableToSell = qtyOwned - pendingQty;
      if (Number(quantity) > availableToSell) {
        return res
          .status(400)
          .json({
            error:
              "Not enough available holdings to place this limit sell (consider pending sells).",
          });
      }
    }

    // -------------------------------
    // SAVE ORDER (PENDING if LIMIT)
    // For BUY limit orders reserve required amount so it cannot be used elsewhere
    // -------------------------------
    let reservedAmount = 0;
    if (priceType === "Limit" && transactionType === "BUY") {
      // Reserve totalAmount at placement so user cannot spend it elsewhere
      if (user.balance < totalAmount) {
        return res
          .status(400)
          .json({
            error: "Insufficient balance to reserve for limit buy order",
          });
      }
      user.balance = Number((user.balance - totalAmount).toFixed(2));
      reservedAmount = totalAmount;
      await user.save();
    }

    const order = new Order({
      userId,
      symbol: stockSymbol,
      companyName,
      side: transactionType,
      qty: quantity,
      priceType,
      percentChnage: percentChnage,
      tradedPrice: priceType === "Market" ? tradedPrice : null,
      limitPrice: priceType === "Limit" ? tradedPrice : null,
      totalAmount,
      avgPrice: priceType === "Market" ? tradedPrice : 0,
      status: priceType === "Market" ? "COMPLETED" : "PENDING",
      reservedAmount,
    });

    await order.save();

    return res.json({
      success: true,
      message: "Order placed successfully",
      balance: user.balance,
    });
  } catch (err) {
    console.error("Order Error:", err);
    return res.status(500).json({ error: "Order failed" });
  }
});

// ---------------------------------------------------------
// 5. CHECK PENDING LIMIT ORDERS
// ---------------------------------------------------------
async function checkPendingOrders(currentPrices) {
  try {
    const pendingOrders = await Order.find({ status: "PENDING" });

    for (const order of pendingOrders) {
      // Normalize symbol for matching
      const symbolKey = order.symbol ? order.symbol.trim().toUpperCase() : "";
      const livePrice = Number(currentPrices[symbolKey]);
      const limitPrice = Number(order.limitPrice);

      console.log(`Checking order ${order._id}: symbol=${symbolKey}, side=${order.side}, livePrice=${livePrice}, limitPrice=${limitPrice}, status=${order.status}`);

      if (!livePrice) {
        console.log(`Order ${order._id}: No live price found for symbol ${symbolKey}`);
        continue;
      }

      // BUY LIMIT ORDER
      if (order.side === "BUY") {
        if (livePrice <= limitPrice) {
          console.log(`Order ${order._id}: Executing BUY limit order. livePrice (${livePrice}) <= limitPrice (${limitPrice})`);
          await executeOrder(order, livePrice);
        } else {
          console.log(`Order ${order._id}: BUY not executed. livePrice (${livePrice}) > limitPrice (${limitPrice})`);
        }
      }

      // SELL LIMIT ORDER
      if (order.side === "SELL") {
        if (livePrice >= limitPrice) {
          console.log(`Order ${order._id}: Executing SELL limit order. livePrice (${livePrice}) >= limitPrice (${limitPrice})`);
          await executeOrder(order, livePrice);
        } else {
          console.log(`Order ${order._id}: SELL not executed. livePrice (${livePrice}) < limitPrice (${limitPrice})`);
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Error in checkPendingOrders:", err);
    return { success: false, error: err.message };
  }
}
// ---------------------------------------------------------
// 6. EXECUTE LIMIT ORDERS
// ---------------------------------------------------------

async function executeOrder(order, price) {
  const user = await User.findById(order.userId);
  if (!user) return;
  // Determine executed price:
  // - For LIMIT orders, use the placed limit price (user expectation / requested behavior).
  // - For MARKET orders, use the live price passed in.
  const executedPrice =
    order.priceType === "Limit" && order.limitPrice
      ? Number(order.limitPrice)
      : Number(price);
  const totalAmount = Number((executedPrice * Number(order.qty)).toFixed(2));

  if (order.side === "BUY") {
    const reserved = Number(order.reservedAmount || 0);

    if (reserved > totalAmount) {
      // refund excess reserved amount back to user
      const refund = Number((reserved - totalAmount).toFixed(2));
      user.balance = Number((user.balance + refund).toFixed(2));
    } else if (reserved < totalAmount) {
      // deduct remaining from user's current balance
      const remaining = Number((totalAmount - reserved).toFixed(2));
      if (user.balance < remaining) {
        console.warn("Insufficient balance at execution for order", order._id);
        return; // leave as pending
      }
      user.balance = Number((user.balance - remaining).toFixed(2));
    }
    // if reserved === totalAmount, nothing to do (already reserved)
  } else {
    // SELL — credit user with proceeds
    user.balance = Number((user.balance + totalAmount).toFixed(2));
  }

  await user.save();

  order.tradedPrice = executedPrice;
  // Update totalAmount and avgPrice to reflect actual executed price
  order.totalAmount = totalAmount;
  const qty = Number(order.qty) || 1;
  order.avgPrice = Number((order.totalAmount / qty).toFixed(4));
  // clear reservedAmount when order completes
  order.reservedAmount = 0;
  order.status = "COMPLETED";
  order.completedAt = new Date();
  await order.save();
}

// ---------------------------------------------------------
// 7. GET LIVE PRICES (Dummy API — replace with real API)
// ---------------------------------------------------------
async function getLivePricesFromAPI() {
  // Fetch live prices for all symbols in pending orders
  const axios = require('axios');
  const Order = require('../models/Order');
  let prices = {};
  try {
    // Get all unique symbols from pending orders
    const pendingOrders = await Order.find({ status: 'PENDING' });
    const symbolSet = new Set();
    pendingOrders.forEach(order => {
      if (order.symbol) symbolSet.add(order.symbol.trim().toUpperCase());
    });
    const symbols = Array.from(symbolSet);
    for (const s of symbols) {
      try {
        const url = `https://www.nseindia.com/api/quote-equity?symbol=${s}`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: 'application/json',
          },
        });
        const livePrice = response.data?.priceInfo?.lastPrice;
        prices[s] = livePrice ? Number(livePrice) : null;
      } catch (err) {
        console.error(`Error fetching ${s}:`, err.message);
        prices[s] = null;
      }
    }
  } catch (err) {
    console.error('Error fetching pending order symbols:', err.message);
  }
  return prices;
}

// ---------------------------------------------------------
// 9. MODIFY PENDING ORDER (Update qty and/or price)
// ---------------------------------------------------------
router.put("/modify-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newQty, newLimitPrice, userId, priceType } = req.body;

    if (!orderId || (!newQty && !newLimitPrice)) {
      return res
        .status(400)
        .json({ error: "Missing orderId or fields to modify" });
    }

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify ownership and that order is PENDING
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (order.status !== "PENDING") {
      return res.status(400).json({ error: "Can only modify PENDING orders" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate old and new amounts
    const oldQty = order.qty;
    const oldPrice = order.limitPrice;
    const newPrice = newLimitPrice || oldPrice;
    const qty = newQty || oldQty;

    const oldAmount = oldQty * oldPrice;
    const newAmount = qty * newPrice;
    const amountDifference = newAmount - oldAmount;

    // Validation for BUY limit orders
    if (order.side === "BUY") {
      const oldReserved = Number(order.reservedAmount || 0);
      const oldAmountCalc = Number(oldQty) * Number(oldPrice);
      const newAmountCalc = Number(qty) * Number(newPrice);
      const diff = Number((newAmountCalc - oldAmountCalc).toFixed(2));

      if (diff > 0) {
        // Require additional balance to reserve
        if (user.balance < diff) {
          return res
            .status(400)
            .json({ error: "Insufficient balance for modified order" });
        }
        user.balance = Number((user.balance - diff).toFixed(2));
        order.reservedAmount = Number((oldReserved + diff).toFixed(2));
      } else if (diff < 0) {
        // Refund the excess reserved amount
        const refund = Math.abs(diff);
        user.balance = Number((user.balance + refund).toFixed(2));
        order.reservedAmount = Number(
          Math.max(0, oldReserved - refund).toFixed(2)
        );
      }
      // if diff === 0 nothing to do
    } else if (order.side === "SELL") {
      // For SELL orders, verify we have enough completed holdings
      const completed = await Order.find({
        userId,
        symbol: order.symbol,
        status: "COMPLETED",
      });
      let totalBuy = 0,
        totalSell = 0;
      completed.forEach((o) => {
        if (o.side === "BUY") totalBuy += o.qty;
        if (o.side === "SELL") totalSell += o.qty;
      });
      const qtyOwned = totalBuy - totalSell;

      // pending sells (excluding current order)
      const pendingSells = await Order.find({
        userId,
        symbol: order.symbol,
        status: "PENDING",
        side: "SELL",
        _id: { $ne: orderId },
      });
      const pendingQty = pendingSells.reduce((s, o) => s + o.qty, 0);
      const availableToSell = qtyOwned - pendingQty;

      if (qty > availableToSell) {
        return res.status(400).json({
          error: `Not enough holdings. Available: ${availableToSell}, Requested: ${qty}`,
        });
      }
    }

    // Update the order
    if (newQty) order.qty = newQty;
    if (newLimitPrice) order.limitPrice = newLimitPrice;
    order.totalAmount = order.qty * order.limitPrice;
    
    // If price type is MARKET, execute the order immediately
    if (priceType === "market") {
      await executeOrder(order, newPrice);
    } else {
      // Otherwise, save as pending limit order
      await order.save();
      if (order.side === "BUY") {
        await user.save();
      }
    }

    res.json({
      success: true,
      message: priceType === "market" ? "Order executed successfully" : "Order modified successfully",
      order,
      balance: user.balance,
    });
  } catch (err) {
    console.error("Modify Order Error:", err);
    res.status(500).json({ error: "Failed to modify order" });
  }
});

// ---------------------------------------------------------
// CANCEL PENDING ORDER
// ---------------------------------------------------------
router.delete("/cancel-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body || req.query || {};

    if (!orderId || !userId) {
      return res.status(400).json({ error: "Missing orderId or userId" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ error: "Only PENDING orders can be cancelled" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // If the order had reservedAmount (future improvement), refund it
    if (order.reservedAmount && order.reservedAmount > 0) {
      user.balance = Number((user.balance + order.reservedAmount).toFixed(2));
      await user.save();
    }

    // Mark order as cancelled
    order.status = "CANCELLED";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled",
      balance: user.balance,
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    return res.status(500).json({ error: "Failed to cancel order" });
  }
});

router.post("/live-prices", async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: "symbols must be an array" });
    }

    const prices = {};
    const changes = {};
    const yesterdayCloses = {};

    for (const symbol of symbols) {
      try {
        const candidates = [symbol, `${symbol}.NS`, `${symbol}.BO`];

        let livePrice = null;
        let prevClose = null;
        let dayChangePercent = 0;

        for (const s of candidates) {
          try {
            const data = await getNseData(
              `https://www.nseindia.com/api/quote-equity?symbol=${s}`
            );

            livePrice = data?.priceInfo?.lastPrice;
            prevClose = data?.priceInfo?.previousClose;

            if (livePrice != null && prevClose != null) {
              break;
            }

          } catch (err) {
            console.log(`Error fetching ${s}:`, err.message);
          }
        }

        prices[symbol] = livePrice ? Number(livePrice) : null;
        yesterdayCloses[symbol] = prevClose ? Number(prevClose) : null;

        if (livePrice != null && prevClose != null) {
          dayChangePercent = Number(
            (((livePrice - prevClose) / prevClose) * 100).toFixed(2)
          );
        }

        changes[symbol] = dayChangePercent;

      } catch (err) {
        console.log(`Failed ${symbol}:`, err.message);
        prices[symbol] = null;
        changes[symbol] = 0;
        yesterdayCloses[symbol] = null;
      }
    }

    return res.json({
      success: true,
      prices,
      changes,
      yesterdayCloses,
    });

  } catch (err) {
    console.error("Live Prices Error:", err);
    return res.status(500).json({ error: "Failed to fetch live prices" });
  }
});


// ---------------------------------------------------------
// AUTO CHECK LIMIT ORDERS EVERY 10 sec
// ---------------------------------------------------------
setInterval(async () => {
  try {
    const currentPrices = await getLivePricesFromAPI();
    await checkPendingOrders(currentPrices);
    // console.log("Checked Limit Orders...");
  } catch (err) {
    console.error("Error auto-checking limit orders:", err);
  }
}, 10000);


module.exports = router;
