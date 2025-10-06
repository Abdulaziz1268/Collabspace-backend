import mongoose from "mongoose"

import User from "../Models/User.js"
import Post from "../Models/Post.js"

export const profile = async (req, res) => {
  const response = await User.findById(req.user.id).select("-password")
  res.json({ message: "welcome user", user: response })
}

export const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid user Id." })

    const user = await User.findById(userId).select("-password")

    if (!user) return res.status(404).json({ error: "The user doesn't exist." })

    const posts = await Post.find({ author: userId })
      .populate("author", "username imageUrl")
      .sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message || "Server error." })
  }
}

export const editProfile = async (req, res) => {
  try {
    const { id: userId } = req.params
    const { username, email, password } = req.body
    const { id } = req.user

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid user ID." })

    if (userId !== id) return res.status(403).json({ error: "Not Allowed." })

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      {
        username,
        email,
        password,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      },
      { new: true, runValidators: true }
    )

    if (!updatedProfile)
      return res
        .status(403)
        .json({ error: "The user is not found or unauthorized." })

    res.json({
      message: "The profile succefully updated.",
      user: updatedProfile,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message || "Server error." })
  }
}
