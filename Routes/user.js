import express from "express"
import { editProfile, getUser, profile } from "../Controllers/user.js"
import { authentication } from "../Middlewares/auth.js"
import upload from "../Config/Storage.js"

const router = express.Router()

router.get("/profile", authentication, profile)
router.get("/getUser/:id", authentication, getUser)
router.post(
  "/editProfile/:id",
  authentication,
  upload.single("imageUrl"),
  editProfile
)

export default router
