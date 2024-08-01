const mongoose = require("mongoose");

const connect = async () => {
    try {
        const response = await mongoose.connect("mongodb+srv://neyon71133:rjluDggFuLO0hQNm@cluster0.9mky0hu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected successfully");
        return response;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw new Error("Failed to connect to MongoDB");
    }
}

module.exports = connect;