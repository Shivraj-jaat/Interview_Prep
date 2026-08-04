const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB COnnected")
    } catch (error) {
        console.log(error, "DB Connection Failed")
    }
}

module.exports = connectDB