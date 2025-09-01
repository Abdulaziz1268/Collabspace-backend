import cors from "cors"
import dotenv from "dotenv"
import express from "express"

import authRoutes from "./Routes/auth.js"
import userRoutes from "./Routes/user.js"

import connectDB from "./Config/db.js"

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

app.get("/", (req, res) => {
  res.status(200).json({ status: "server is now live!" })
})

const port = process.env.PORT || 2005
app.listen(port, () => console.log(`server running on port ${port}`))
