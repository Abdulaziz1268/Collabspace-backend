import express from "express"
import { getUser, profile } from "../Controllers/user.js"
import { authentication } from "../Middlewares/auth.js"

const router = express.Router()

router.get("/profile", authentication, profile)
router.get("/getUser/:id", authentication, getUser)
router.post("/editProfile/:id", authentication, editProfile)

export default router
