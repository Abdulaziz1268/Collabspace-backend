import e from "express"

import { authentication } from "../Middlewares/auth.js"
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../Controllers/Task.js"

const router = e.Router()

router.get("/getTasks", authentication, getTasks)
router.post("/createTask", authentication, createTask)
router.put("/updateTask/:id", authentication, updateTask)
router.delete("/deleteTask/:id", authentication, deleteTask)

export default router
