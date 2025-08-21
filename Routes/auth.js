import express from "express"
import { login, register, sendEmail, verifyEmail } from "../Controllers/auth.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/sendEmail", sendEmail)
router.post("/verifyEmail", verifyEmail)

export default router
