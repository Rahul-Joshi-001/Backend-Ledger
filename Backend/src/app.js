require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())

const authrouter = require("./routes/auth.routes")
const accountrouter = require("./routes/account.routes")
const transactionRouter = require('./routes/transaction.routes')

app.use("/api/auth",authrouter)
app.use("/api/accounts/",accountrouter)

 
module.exports = app