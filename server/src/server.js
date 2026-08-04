require("dotenv").config()

const dns = require("dns")
dns.setServers(["8.8.8.8"])

const express = require("express")
const connectDB = require("./config/db");

const app = express();
app.use(express.json)

connectDB()

const PORT = process.env.PORT

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Server running at Port ${PORT}`)
})