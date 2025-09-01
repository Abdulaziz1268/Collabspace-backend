import express from "express"
import { profile } from "../Controllers/user.js"
import { authentication } from "../Middlewares/auth.js"

const router = express.Router()

router.get("/profile", authentication, profile)

export default router
