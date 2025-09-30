import mongoose from "mongoose"
import Task from "../Models/Task.js"

export const getTasks = async (req, res) => {
  try {
    const { id } = req.user

    const tasks = await Task.find({ user: id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body
    const { id } = req.user

    const task = new Task({
      title,
      description,
      user: id,
    })
    await task.save()

    res.json({ message: "Task created Successfully." })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params
    const { id: userId } = req.user

    if (!mongoose.Types.ObjectId.isValid(taskId))
      return res.status(400).json({ error: "Invalid task Id." })

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!task)
      return res.status(404).json({ error: "Task not found or unauthorized." })

    res.json(task)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params
    const { id: userId } = req.user

    if (!mongoose.Types.ObjectId.isValid(taskId))
      return res.status(400).json({ error: "Invalid task Id." })

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    })

    if (!deletedTask)
      return res.status(404).json({ error: "Task not found or unauthorized." })

    res.json({ message: "Task deleted successfully." })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}
