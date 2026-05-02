// app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const connectDB = require('./config/db'); // ✅ DB connection

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const WatchlistRoutes = require('./routes/watchlist');

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS (frontend URL)
app.use(
  cors({
    origin: 'https://demo-stock-market-frontend.onrender.com',
    credentials: true,
  })
);

// ✅ REQUIRED for Render (proxy)
app.set('trust proxy', 1);

// ================== SESSION ==================
app.use(
  session({
    secret: process.env.JWT_SECRET || 'yoursecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// ================== PASSPORT ==================
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// ================== FLASH ==================
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// ================== VIEW ==================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================== STATIC ==================
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// ================== ROUTES ==================
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/api/watchlists', WatchlistRoutes);

// ================== CHART API ==================
app.get('/api/chart', async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Yahoo API Error:', err.message);

    if (err.response) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: 'Failed to fetch chart data' });
    }
  }
});

// Avoid favicon error
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ================== START SERVER (IMPORTANT) ==================
const PORT = process.env.PORT || 3000;

// ✅ Start ONLY after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

module.exports = app;











// // app.js
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const path = require('path');
// const flash = require('connect-flash');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const indexRouter = require('./routes/index');
// const authRouter = require('./routes/auth');
// const WatchlistRoutes = require('./routes/watchlist');

// const app = express();

// // ================== MIDDLEWARE ==================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ CORS — allow your Render frontend to call this backend
// app.use(
//   cors({
//     origin: 'https://demo-stock-market-frontend.onrender.com',
//     credentials: true,
//   })
// );

// // ✅ FIX: trust proxy — REQUIRED on Render (sits behind a reverse proxy)
// // Without this, secure cookies don't work even with HTTPS
// app.set('trust proxy', 1);

// // ✅ FIX: SESSION — secure + sameSite set correctly for Render (HTTPS)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'yoursecret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',       // true on Render (HTTPS)
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' needed for cross-origin on Render
//     },
//   })
// );

// // ================== PASSPORT ==================
// require('./config/passport')(passport);
// app.use(passport.initialize());
// app.use(passport.session());

// // ================== FLASH MESSAGES ==================
// app.use(flash());
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg   = req.flash('error_msg');
//   res.locals.error       = req.flash('error');
//   next();
// });

// // ================== VIEW ENGINE ==================
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // ================== STATIC FILES ==================
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));

// // ================== ROUTES ==================
// app.use('/', indexRouter);
// app.use('/', authRouter);
// app.use('/api/watchlists', WatchlistRoutes);

// // ================== CHART API ==================
// app.get('/api/chart', async (req, res) => {
//   const { symbol } = req.query;

//   if (!symbol) {
//     return res.status(400).json({ error: 'Symbol is required' });
//   }

//   try {
//     const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;

//     const response = await axios.get(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0',
//         Accept: 'application/json',
//       },
//     });

//     res.json(response.data);
//   } catch (err) {
//     console.error('❌ Yahoo API Error:', err.message);

//     if (err.response) {
//       res.status(err.response.status).json({ error: err.response.data });
//     } else {
//       res.status(500).json({ error: 'Failed to fetch chart data' });
//     }
//   }
// });

// // Avoid favicon 404 noise in logs
// app.get('/favicon.ico', (req, res) => res.status(204).end());
// app.listen(5000, () => console.log('Server started on http://localhost:3000'));
// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));


// // ✅ FIX: Export app only — do NOT call app.listen() here.
// // bin/www handles the server startup (and now connects DB before listening).
// module.exports = app;
