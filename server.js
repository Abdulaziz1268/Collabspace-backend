import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { fileURLToPath } from "url"
import path from "path"

import authRoutes from "./Routes/auth.js"
import commentRoutes from "./Routes/Comment.js"
import postRoutes from "./Routes/Post.js"
import taskRoutes from "./Routes/Task.js"
import userRoutes from "./Routes/user.js"

import connectDB from "./Config/db.js"

dotenv.config()
connectDB()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use("/api/auth", authRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/post", postRoutes)
app.use("/api/task", taskRoutes)
app.use("/api/user", userRoutes)

app.get("/", (req, res) => {
  res.status(200).json({ status: "server is now live!" })
})

const port = process.env.PORT || 2005
app.listen(port, () => console.log(`server running on port ${port}`))
