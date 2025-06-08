const mongoose = require("mongoose");

// Ensure environment variables are loaded
require('dotenv').config();

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined");
    process.exit(1);
}

const Connection = mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB connected");
    })
    .catch((error) => {
        console.error("DB connection error:", error);
    });

module.exports = Connection;