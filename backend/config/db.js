const mongoose = require('mongoose');

module.exports = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI); // 👈 DEBUG

        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
