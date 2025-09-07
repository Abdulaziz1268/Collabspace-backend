import express from "express"
import { authentication } from "../Middlewares/auth.js"
import { createPost, getAllPosts } from "../Controllers/Post.js"

const router = express.Router()

router.post("/createPost", authentication, createPost)
router.get("/getPosts", authentication, getAllPosts)

export default router
