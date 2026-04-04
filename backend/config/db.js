// config/db.js
const mongoose = require('mongoose');

// ✅ FIX: async function that returns a promise
// so `await connectDB()` in bin/www actually waits before server starts
module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // ✅ Stop server if DB fails — prevents 500 errors on /register
    }
};
