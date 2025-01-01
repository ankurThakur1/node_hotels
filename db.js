const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/hotels");
        console.log("MongoDB connected...")
    } catch (error) {
        mongoose.disconnect("MongoDB disconnected")
        console.log("Failed to connect with MongoDB");
    }
}

module.exports = connectToDB;