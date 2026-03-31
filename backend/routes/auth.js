// const passport = require("passport");
// const User = require("../models/User");
// const Watchlist = require("../models/Watchlist");
// const express = require("express");
// const ejs = require("ejs");
// const fs = require("fs");

// const router = express.Router();
// const axios = require("axios");
// const path = require("path");

// const { NSELive } = require("nse-api-package");
//  // import model


// async function getFullNameFromSymbol(symbol) {
//   try {
//     const response = await axios.get(
//       `https://www.nseindia.com/api/search/autocomplete?q=${symbol}`,
//       {
//         headers: {
//           "User-Agent": "Mozilla/5.0",
//           Accept: "application/json",
//         },
//       }
//     );

//     // NSE returns a list of matches, so take the first result
//     if (response.data && response.data[0]) {
//       return response.data[0].symbol_info || response.data[0].symbol;
//     } else {
//       return symbol; // fallback if not found
//     }
//   } catch (err) {
//     console.error("NSE lookup failed:", err.message);
//     return symbol; // fallback
//   }
// }

// router.get("/stock/:name", async (req, res) => {
//   const stockName = req.params.name;

//   try {
//     // Step 1: Resolve full name dynamically
//     const fullName = await getFullNameFromSymbol(stockName);

//     // Step 2: Fetch stock data from RapidAPI using full name
//     const options = {
//       method: "GET",
//       url: "https://indian-stock-exchange-api2.p.rapidapi.com/stock",
//       params: { name: fullName },
//       headers: {
//         "x-rapidapi-key": "1544c3c6cemsh1fd8164e771e630p10e013jsne6a0249f2d6d",
//         "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
//       },
//     };

//     const response = await axios.request(options);
//     const data = response.data;

//     // Always include a symbol field for frontend image mapping
//     let symbol = null;
//     if (data && data.symbol) {
//       symbol = data.symbol.toUpperCase();
//     } else if (data && data.data && data.data.symbol) {
//       symbol = data.data.symbol.toUpperCase();
//     } else if (fullName) {
//       symbol = fullName.toUpperCase();
//     } else {
//       symbol = stockName.toUpperCase();
//     }

//     res.json({ ...data, symbol });
//   } catch (error) {
//     console.error("Error fetching stock data:", error.message);
//     res.status(500).json({ error: "Failed to fetch stock data" });
//   }
// });

// router.get("/nse/:symbol", async (req, res) => {
//   const symbol = req.params.symbol.toUpperCase();

//   try {
//     const response = await axios.get(
//       `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
//       {
//         headers: {
//           "User-Agent": "Mozilla/5.0",
//           Accept: "application/json",
//         },
//       }
//     );

//     const data = response.data;

//     // Prevent caching
//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     // Add a timestamp to help debug polling freshness
//     res.json({
//       ...data,
//       _fetchedAt: new Date().toISOString(),
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to fetch NSE stock data" });
//   }
// });

// // we can find index from this   index.................................
// const INDEX_MAP = {
//   // Benchmark
//   nifty50: "NIFTY 50",
//   sensex: "S&P BSE SENSEX",

//   // Volatility Index
//   indiavix: "India VIX",

//   // Broad & Large
//   niftynext50: "NIFTY NEXT 50",
//   nifty100: "NIFTY 100",
//   nifty200: "NIFTY 200",
//   nifty500: "NIFTY 500",
//   bse100: "BSE 100",

//   // Market Cap Segments
//   niftysmallcap50: "NIFTY SMALLCAP 50",
//   niftymidcap50: "NIFTY MIDCAP 50",
//   niftymidcap100: "NIFTY MIDCAP 100",
//   niftysmallcap100: "NIFTY SMALLCAP 100",
//   niftysmallcap250: "NIFTY SMALLCAP 250",
//   bsesmallcap: "BSE SMALLCAP",

//   // Sectoral Indices
//   niftybank: "NIFTY BANK",
//   niftyit: "NIFTY IT",
//   niftypharma: "NIFTY PHARMA",
//   niftyauto: "NIFTY AUTO",
//   niftymetal: "NIFTY METAL",
//   niftyenergy: "NIFTY ENERGY",
//   niftyrealty: "NIFTY REALTY",
//   niftypsubank: "NIFTY PSU BANK",
//   niftyprivatebank: "NIFTY PRIVATE BANK",
//   niftyfinancialservices: "NIFTY FINANCIAL SERVICES",
//   finnifty: "NIFTY FINNIFTY",

//   // Thematic & Others
//   niftyfmcg: "NIFTY FMCG",
//   niftyinfrastructure: "NIFTY INFRASTRUCTURE",
//   niftyservices: "NIFTY SERVICES SECTOR",
//   niftymnc: "NIFTY MNC",
//   niftyconsumption: "NIFTY CONSUMPTION",
//   niftynoncyclical: "NIFTY NON-CYCLICAL CONSUMER",
//   niftygrowth15: "NIFTY GROWTH SECTORS 15",

//   // BSE
//   bseipo: "BSE IPO",
// };

// // 🧠 Route: GET /api/index/:symbol
// router.get("/:symbol", async (req, res) => {
//   const key = req.params.symbol.toLowerCase();
//   if (key === "sensex") {
//     // Special handling for SENSEX: proxy to /bse/sensex route for consistent frontend usage
//     try {
//       const response = await axios.get("/bse/sensex", { baseURL: req.protocol + '://' + req.get('host') });
//       return res.json(response.data);
//     } catch (err) {
//       return res.status(500).json({ error: "Failed to fetch SENSEX data" });
//     }
//   }
//   const indexName = INDEX_MAP[key];
//   if (!indexName) {
//     return res.status(400).json({ error: "Invalid index name" });
//   }
//   try {
//     const response = await axios.get(
//       `https://www.nseindia.com/api/equity-stockIndices?index=${encodeURIComponent(indexName)}`,
//       {
//         headers: {
//           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//           Accept: "application/json",
//           "Accept-Encoding": "gzip, deflate, br",
//           Connection: "keep-alive",
//         },
//       }
//     );
//     res.json(response.data);
//   } catch (err) {
//     console.error("❌ Error fetching NSE data:", err.message);
//     res.status(500).json({ error: "Failed to fetch index data" });
//   }
// });

// // gainsers stock
// const axiosNSE = axios.create({
//   timeout: 10000,
//   headers: {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     Accept: "application/json",
//     "Accept-Language": "en-US,en;q=0.9",
//     Referer: "https://www.nseindia.com/",
//     Connection: "keep-alive",
//   },
// });

// // Fetch cookies first
// async function getCookies() {
//   await axiosNSE.get("https://www.nseindia.com");
// }

// async function getNseData(url) {
//   await getCookies(); // Get cookies first
//   const res = await axiosNSE.get(url);
//   return res.data;
// }

// router.get("/trending/gain", async (req, res) => {
//   try {
//     const data = await getNseData(
//       "https://www.nseindia.com/api/live-analysis-variations?index=gainers"
//     );

//     res.json(data);
//   } catch (err) {
//     console.error("NSE ERROR:", err.response?.status, err.message);

//     res.status(500).json({
//       error: "Failed to fetch trending stocks",
//       details: err.response?.status || err.message,
//     });
//   }
// });

// // industry stocks  market overwiew page
// router.get("/industry/mmm/:name", async (req, res) => {
//   try {
//     const industry = req.params.name; // "AUTO", "IT", "PHARMA"
//     const indexName = `NIFTY ${industry.toUpperCase()}`;

//     const url = `https://www.nseindia.com/api/equity-stockIndices?index=${encodeURIComponent(
//       indexName
//     )}`;

//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//         accept: "application/json",
//       },
//     });

//     res.json(response.data.data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch industry stocks" });
//   }
// });

// router.get("/ipo/qqq", async (req, res) => {
//   const options = {
//     method: "GET",
//     url: "https://indian-stock-exchange-api2.p.rapidapi.com/ipo",
//     headers: {
//       "x-rapidapi-key": "33b950c51cmshb5509d6c627d853p187a86jsn182f5aacf8b8",
//       "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     res.json(response.data); // return full IPO data to frontend
//   } catch (error) {
//     console.error("Error fetching IPO details:", error.message);
//     res.status(500).json({ error: "Error fetching IPO details" });
//   }
// });




// router.get("/api/top-gainers", async (req, res) => {
//   try {
//     const url = "https://www.nseindia.com/api/live-analysis-variations?index=gainers";

//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//         "Referer": "https://www.nseindia.com/"
//       }
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Scraping Error:", error.message);
//     res.status(500).json({ error: "Unable to fetch NSE data" });
//   }
// });

// router.get("/etfs/sant", async (req, res) => {
//   try {
//     const url = "https://www.nseindia.com/api/etf";

//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//         "Referer": "https://www.nseindia.com/",
//       },
//     });

//     const data = response.data?.data || [];

//     if (!data.length) {
//       return res.status(404).json({ message: "No ETF data available" });
//     }

//     res.json({
//       count: data.length,
//       etfs: data,
//     });
//   } catch (error) {
//     console.error("ETF Fetch Error:", error.message);
//     res.status(500).json({ error: "Failed to fetch ETF data" });
//   }
// });



// router.get("/mutual-funds/qqq", async (req, res) => {
//   const options = {
//     method: "GET",
//     url: "https://indian-stock-exchange-api2.p.rapidapi.com/mutual_funds",
//     headers: {
//       "x-rapidapi-key": "33b950c51cmshb5509d6c627d853p187a86jsn182f5aacf8b8",
//       "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     res.json(response.data); // send data to frontend
//   } catch (error) {
//     console.error("Error fetching mutual funds:", error.message);
//     res.status(500).json({ error: "Failed to fetch mutual funds data" });
//   }
// });
// // mutual fund data search
// router.get("/mutual-fund-search/qqq", async (req, res) => {
//   const query = req.query.query || "nippon";

//   const options = {
//     method: "GET",
//     url: "https://indian-stock-exchange-api2.p.rapidapi.com/mutual_fund_search",
//     params: { query },
//     headers: {
//       // "x-rapidapi-key": "33b950c51cmshb5509d6c627d853p187a86jsn182f5aacf8b8",
//       "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     res.json(response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching mutual fund search:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({
//       error: "Failed to fetch mutual fund data",
//       details: error.response?.data,
//     });
//   }
// });

// // Route to fetch SENSEX data from Yahoo Finance
// router.get("/bse/sensex", async (req, res) => {
//   try {
//     // Yahoo Finance API for SENSEX index
//     const response = await axios.get(
//       "https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?region=IN&lang=en-IN&includePrePost=false&interval=1d&range=1d"
//     );
//     // console.log("Yahoo Finance SENSEX response:", response.data);
//     const chart = response.data.chart;
//     if (!chart || chart.error) {
//       return res.status(500).json({ error: "Failed to fetch SENSEX data" });
//     }
//     const result = chart.result[0];
//     const meta = result.meta;
//     const lastPrice = meta.regularMarketPrice;
//     const previousClose = meta.chartPreviousClose;
//     const change = lastPrice - previousClose;
//     const pChange = ((change / previousClose) * 100).toFixed(2);
//     const timestamp = new Date(meta.regularMarketTime * 1000).toLocaleString();
//     // Return in a similar format as NSE indices
//     res.json({
//       name: "SENSEX",
//       data: [{
//         symbol: "SENSEX",
//         lastPrice,
//         previousClose,
//         change: change.toFixed(2),
//         pChange,
//         open: meta.regularMarketOpen,
//         dayHigh: meta.regularMarketDayHigh,
//         dayLow: meta.regularMarketDayLow,
//         yearHigh: meta.fiftyTwoWeekHigh,
//         yearLow: meta.fiftyTwoWeekLow,
//       }],
//       timestamp,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching SENSEX from Yahoo Finance:", err.message);
//     res.status(500).json({ error: "Failed to fetch SENSEX data" });
//   }
// });

// const cheerio = require("cheerio");

// // Dynamic route to fetch SENSEX companies from BSE website
// router.get("/bse/sensex/companies", async (req, res) => {
//   try {
//     const url = "https://www.bseindia.com/indices/IndexConstituents.html?indexId=30";
//     const { data: html } = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//         "Accept-Language": "en-US,en;q=0.9",
//         "Referer": "https://www.bseindia.com/",
//         "Connection": "keep-alive",
//         "DNT": "1",
//         "Upgrade-Insecure-Requests": "1"
//       }
//     });
//     const $ = cheerio.load(html);
//     const companies = [];
//     $("table#constituents tr").each((i, el) => {
//       if (i === 0) return; // skip header
//       const tds = $(el).find("td");
//       if (tds.length >= 3) {
//         companies.push({
//           scripCode: $(tds[0]).text().trim(),
//           name: $(tds[1]).text().trim(),
//           industry: $(tds[2]).text().trim()
//         });
//       }
//     });
//     res.json({
//       name: "SENSEX",
//       count: companies.length,
//       companies
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch SENSEX companies", details: err.message });
//   }
// });



// router.get("/company-logo/:symbol", async (req, res) => {
//   try {
//     const { symbol } = req.params;

//     // NSE format: TCS.NS | BSE format: TCS.BO
//     const yahooSymbol = symbol.includes(".")
//       ? symbol
//       : `${symbol}.NS`;

//     const yahooUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}?modules=assetProfile`;

//     const { data } = await axios.get(yahooUrl);

//     const profile =
//       data.quoteSummary.result?.[0]?.assetProfile;

//     if (!profile || !profile.website) {
//       return res.status(404).json({
//         success: false,
//         message: "Company website not found",
//       });
//     }

//     // Extract domain
//     const domain = profile.website
//       .replace("https://", "")
//       .replace("http://", "")
//       .split("/")[0];

//     res.json({
//       success: true,
//       symbol,
//       company: profile.longBusinessSummary?.slice(0, 80),
//       logo: `https://logo.clearbit.com/${domain}`,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Logo fetch failed",
//     });
//   }
// });



// module.exports = router;






























const passport = require("passport");
const User = require("../models/User");
const Watchlist = require("../models/Watchlist");
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");

const router = express.Router();
const axios = require("axios");
const path = require("path");
const { NSELive } = require("nse-api-package");

// ─── NSE Live instance — handles all cookies/session internally ───────────────
const nse = new NSELive();
// ──────────────────────────────────────────────────────────────────────────────

async function getFullNameFromSymbol(symbol) {
  try {
    const data = await nse.get("/search/autocomplete", { q: symbol });
    if (data && data[0]) {
      return data[0].symbol_info || data[0].symbol;
    }
    return symbol;
  } catch (err) {
    console.error("NSE lookup failed:", err.message);
    return symbol;
  }
}

router.get("/stock/:name", async (req, res) => {
  const stockName = req.params.name;

  try {
    // Step 1: Resolve full name dynamically
    const fullName = await getFullNameFromSymbol(stockName);

    // Step 2: Fetch stock data from RapidAPI using full name
    const options = {
      method: "GET",
      url: "https://indian-stock-exchange-api2.p.rapidapi.com/stock",
      params: { name: fullName },
      headers: {
        "x-rapidapi-key": "1544c3c6cemsh1fd8164e771e630p10e013jsne6a0249f2d6d",
        "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data;

    // Always include a symbol field for frontend image mapping
    let symbol = null;
    if (data && data.symbol) {
      symbol = data.symbol.toUpperCase();
    } else if (data && data.data && data.data.symbol) {
      symbol = data.data.symbol.toUpperCase();
    } else if (fullName) {
      symbol = fullName.toUpperCase();
    } else {
      symbol = stockName.toUpperCase();
    }

    res.json({ ...data, symbol });
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

router.get("/nse/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    // correct method: stockQuote(symbol)
    const data = await nse.stockQuote(symbol);

    // Prevent caching
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.json({
      ...data,
      _fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch NSE stock data" });
  }
});

// we can find index from this   index.................................
const INDEX_MAP = {
  // Benchmark
  nifty50: "NIFTY 50",
  sensex: "S&P BSE SENSEX",

  // Volatility Index
  indiavix: "India VIX",

  // Broad & Large
  niftynext50: "NIFTY NEXT 50",
  nifty100: "NIFTY 100",
  nifty200: "NIFTY 200",
  nifty500: "NIFTY 500",
  bse100: "BSE 100",

  // Market Cap Segments
  niftysmallcap50: "NIFTY SMALLCAP 50",
  niftymidcap50: "NIFTY MIDCAP 50",
  niftymidcap100: "NIFTY MIDCAP 100",
  niftysmallcap100: "NIFTY SMALLCAP 100",
  niftysmallcap250: "NIFTY SMALLCAP 250",
  bsesmallcap: "BSE SMALLCAP",

  // Sectoral Indices
  niftybank: "NIFTY BANK",
  niftyit: "NIFTY IT",
  niftypharma: "NIFTY PHARMA",
  niftyauto: "NIFTY AUTO",
  niftymetal: "NIFTY METAL",
  niftyenergy: "NIFTY ENERGY",
  niftyrealty: "NIFTY REALTY",
  niftypsubank: "NIFTY PSU BANK",
  niftyprivatebank: "NIFTY PRIVATE BANK",
  niftyfinancialservices: "NIFTY FINANCIAL SERVICES",
  finnifty: "NIFTY FINNIFTY",

  // Thematic & Others
  niftyfmcg: "NIFTY FMCG",
  niftyinfrastructure: "NIFTY INFRASTRUCTURE",
  niftyservices: "NIFTY SERVICES SECTOR",
  niftymnc: "NIFTY MNC",
  niftyconsumption: "NIFTY CONSUMPTION",
  niftynoncyclical: "NIFTY NON-CYCLICAL CONSUMER",
  niftygrowth15: "NIFTY GROWTH SECTORS 15",

  // BSE
  bseipo: "BSE IPO",
};

// Route: GET /api/index/:symbol
router.get("/:symbol", async (req, res) => {
  const key = req.params.symbol.toLowerCase();

  if (key === "sensex") {
    // Special handling for SENSEX: proxy to /bse/sensex route
    try {
      const response = await axios.get("/bse/sensex", { baseURL: req.protocol + '://' + req.get('host') });
      return res.json(response.data);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch SENSEX data" });
    }
  }

  const indexName = INDEX_MAP[key];
  if (!indexName) {
    return res.status(400).json({ error: "Invalid index name" });
  }

  try {
    // correct method: liveIndex(indexName)
    const data = await nse.liveIndex(indexName);
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching NSE index:", err.message);
    res.status(500).json({ error: "Failed to fetch index data" });
  }
});

router.get("/trending/gain", async (req, res) => {
  try {
    // correct method: gainersAndLosers()
    const data = await nse.gainersAndLosers();
    res.json(data);
  } catch (err) {
    console.error("NSE ERROR:", err.response?.status, err.message);
    res.status(500).json({
      error: "Failed to fetch trending stocks",
      details: err.response?.status || err.message,
    });
  }
});

// industry stocks  market overwiew page
router.get("/industry/mmm/:name", async (req, res) => {
  try {
    const industry = req.params.name; // "AUTO", "IT", "PHARMA"
    const indexName = `NIFTY ${industry.toUpperCase()}`;
    // correct method: liveIndex(indexName)
    const data = await nse.liveIndex(indexName);
    res.json(data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch industry stocks" });
  }
});




router.get("/api/top-gainers", async (req, res) => {
  try {
    const url = "https://www.nseindia.com/api/live-analysis-variations?index=gainers";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.nseindia.com/"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ error: "Unable to fetch NSE data" });
  }
});

router.get("/ipo/qqq", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://indian-stock-exchange-api2.p.rapidapi.com/ipo",
    headers: {
      "x-rapidapi-key": "33b950c51cmshb5509d6c627d853p187a86jsn182f5aacf8b8",
      "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching IPO details:", error.message);
    res.status(500).json({ error: "Error fetching IPO details" });
  }
});

router.get("/api/top-gainers", async (req, res) => {
  try {
    // correct method: top10Gainers()
    const data = await nse.top10Gainers();
    res.json(data);
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ error: "Unable to fetch NSE data" });
  }
});

router.get("/etfs/sant", async (req, res) => {
  try {
    // correct method: listEtf()
    const data = await nse.listEtf();
    const etfs = data?.data || [];

    if (!etfs.length) {
      return res.status(404).json({ message: "No ETF data available" });
    }

    res.json({
      count: etfs.length,
      etfs,
    });
  } catch (error) {
    console.error("ETF Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch ETF data" });
  }
});

router.get("/mutual-funds/qqq", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://indian-stock-exchange-api2.p.rapidapi.com/mutual_funds",
    headers: {
      "x-rapidapi-key": "33b950c51cmshb5509d6c627d853p187a86jsn182f5aacf8b8",
      "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching mutual funds:", error.message);
    res.status(500).json({ error: "Failed to fetch mutual funds data" });
  }
});

// mutual fund data search
router.get("/mutual-fund-search/qqq", async (req, res) => {
  const query = req.query.query || "nippon";

  const options = {
    method: "GET",
    url: "https://indian-stock-exchange-api2.p.rapidapi.com/mutual_fund_search",
    params: { query },
    headers: {
      // "x-rapidapi-key": "33b950c51cmshb5509d6c627d853p187a86jsn182f5aacf8b8",
      "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching mutual fund search:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch mutual fund data",
      details: error.response?.data,
    });
  }
});

// Route to fetch SENSEX data from Yahoo Finance
router.get("/bse/sensex", async (req, res) => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?region=IN&lang=en-IN&includePrePost=false&interval=1d&range=1d"
    );
    const chart = response.data.chart;
    if (!chart || chart.error) {
      return res.status(500).json({ error: "Failed to fetch SENSEX data" });
    }
    const result = chart.result[0];
    const meta = result.meta;
    const lastPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const change = lastPrice - previousClose;
    const pChange = ((change / previousClose) * 100).toFixed(2);
    const timestamp = new Date(meta.regularMarketTime * 1000).toLocaleString();

    res.json({
      name: "SENSEX",
      data: [{
        symbol: "SENSEX",
        lastPrice,
        previousClose,
        change: change.toFixed(2),
        pChange,
        open: meta.regularMarketOpen,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        yearHigh: meta.fiftyTwoWeekHigh,
        yearLow: meta.fiftyTwoWeekLow,
      }],
      timestamp,
    });
  } catch (err) {
    console.error("❌ Error fetching SENSEX from Yahoo Finance:", err.message);
    res.status(500).json({ error: "Failed to fetch SENSEX data" });
  }
});

const cheerio = require("cheerio");

// Dynamic route to fetch SENSEX companies from BSE website
router.get("/bse/sensex/companies", async (req, res) => {
  try {
    const url = "https://www.bseindia.com/indices/IndexConstituents.html?indexId=30";
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.bseindia.com/",
        "Connection": "keep-alive",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1"
      }
    });
    const $ = cheerio.load(html);
    const companies = [];
    $("table#constituents tr").each((i, el) => {
      if (i === 0) return; // skip header
      const tds = $(el).find("td");
      if (tds.length >= 3) {
        companies.push({
          scripCode: $(tds[0]).text().trim(),
          name: $(tds[1]).text().trim(),
          industry: $(tds[2]).text().trim()
        });
      }
    });
    res.json({
      name: "SENSEX",
      count: companies.length,
      companies
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch SENSEX companies", details: err.message });
  }
});

router.get("/company-logo/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    // NSE format: TCS.NS | BSE format: TCS.BO
    const yahooSymbol = symbol.includes(".")
      ? symbol
      : `${symbol}.NS`;

    const yahooUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}?modules=assetProfile`;

    const { data } = await axios.get(yahooUrl);

    const profile = data.quoteSummary.result?.[0]?.assetProfile;

    if (!profile || !profile.website) {
      return res.status(404).json({
        success: false,
        message: "Company website not found",
      });
    }

    // Extract domain
    const domain = profile.website
      .replace("https://", "")
      .replace("http://", "")
      .split("/")[0];

    res.json({
      success: true,
      symbol,
      company: profile.longBusinessSummary?.slice(0, 80),
      logo: `https://logo.clearbit.com/${domain}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logo fetch failed",
    });
  }
});

module.exports = router;