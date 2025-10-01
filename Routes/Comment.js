import e from "express"

import { authentication } from "../Middlewares/auth.js"
import {
  addComment,
  deleteComment,
  getCommentCount,
  getComments,
} from "../Controllers/Comment.js"

const router = e.Router()

router.get("/getComments/:id", authentication, getComments)
router.get("/getCommentCount/:id", authentication, getCommentCount)
router.post("/addComment/:id", authentication, addComment)
router.delete("/deleteComment/:id", authentication, deleteComment)

export default router
