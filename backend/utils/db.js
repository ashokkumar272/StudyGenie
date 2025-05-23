const mongoose = require("mongoose");

const Connection = mongoose.connect('mongodb://0.0.0.0/chatbot')
    .then(() => {
        console.log("DB connected");
    })
    .catch((error) => {
        console.error("DB connection error:", error);
    });

module.exports = Connection;