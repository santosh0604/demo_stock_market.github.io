const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require("connect-flash");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');


const cors = require("cors");
const { corsOptions } = require('./routes/watchlist'); // <-- Import corsOptions
require('dotenv').config();
const WatchlistRoutes = require("./routes/watchlist");
const { fyersModel } = require("fyers-api-v3");
const fs = require("fs");

const axios = require('axios');

const fetch = require('node-fetch');


const app = express();
app.use(express.json());

// DB & Passport config
require('./config/db')();
require('./config/passport')(passport);



// app.use(cors(corsOptions)); 
// <-- Use your custom CORS options globally
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "yoursecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // ✅ must be false on localhost
      httpOnly: true,
      sameSite: "lax", // ✅ important for cross-origin cookie sending
    },
  })
);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static('uploads'));
// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//setting flash
app.use(flash());

// Make flash messages available to all views (optional)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); // important for passport
  next();
});



// for charts
app.get("/api/chart", async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?range=1mo&interval=1d`;

    console.log("🔍 Fetching data from:", url); // 👈 Log for debugging

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "application/json",
      },
    });

    // Log result status
    console.log("✅ Response received:", response.status);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error fetching Yahoo data:", err.message);

    if (err.response) {
      console.error("📄 Yahoo response:", err.response.data);
      res.status(err.response.status).json({
        error: err.response.data || "Yahoo API error",
      });
    } else {
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  }
});
















app.get("/favicon.ico", (req, res) => res.status(204));




// Routes
app.use('/', indexRouter);
app.use('/', authRouter);

app.use("/api/watchlists", WatchlistRoutes);



mongoose.connect("mongodb://localhost:27017/stockdb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));





app.listen(5000, () => console.log('Server started on http://localhost:3000'));
module.exports = app;







