const res = require('dotenv').config();
const mongoose = require("mongoose");

  const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MongoDB connection URL is missing in .env file.");
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;