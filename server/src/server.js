require("dotenv").config()

const dns = require("dns")
dns.setServers(["8.8.8.8"])

const userRoute = require("./routes/userRoutes")
const categoryRoute = require("./routes/categoryRoute")
const interviewRoute = require("./routes/interviewRoute")

const express = require("express")
const connectDB = require("./config/db");

const app = express();
app.use(express.json())
app.use("/users", userRoute)
app.use("/categories", categoryRoute)
app.use("/interview", interviewRoute)

connectDB()

const PORT = process.env.PORT

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Server running at Port ${PORT}`)
})