import express from "express"
import { authentication } from "../Middlewares/auth.js"
import { createPost, getAllPosts, likePost } from "../Controllers/Post.js"
import upload from "../Config/Storage.js"

const router = express.Router()

router.post("/createPost", authentication, upload.single("media"), createPost)
router.get("/getPosts", authentication, getAllPosts)
router.put("/:id/like", authentication, likePost)

export default router
