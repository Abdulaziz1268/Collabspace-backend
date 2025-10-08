import mongoose from "mongoose"
import bcrypt from "bcryptjs"

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
    const { username, email, oldPassword, newPassword } = req.body
    const { id } = req.user

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid user ID." })

    if (userId !== id) return res.status(403).json({ error: "Not Allowed." })

    const user = await User.findOne({ _id: userId })
    if (!user) return res.status(404).json({ error: "The user not found." })

    const updatedFields = {}

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: userId },
      })
      if (existingUsername)
        return res.status(409).json({ error: "The username is taken." })
      updatedFields.username = username
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } })
      if (existingEmail)
        return res.status(409).json({ error: "The email is already in use." })
      updatedFields.email = email
    }

    if (newPassword && oldPassword) {
      if (newPassword === oldPassword) {
        return res.status(400).json({
          error: "New password must be different from current password.",
        })
      }

      const match = await bcrypt.compare(oldPassword, user.password)
      if (!match) {
        return res.status(401).json({ error: "Invalid current password!" })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "New password must be at least 6 characters long.",
        })
      }

      const hashed = await bcrypt.hash(newPassword, 10)
      updatedFields.password = hashed
    } else if ((newPassword && !oldPassword) || (!newPassword && oldPassword)) {
      return res.status(400).json({
        error: "Both current and new password are required to change password.",
      })
    }

    if (req.file) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
        })
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          error: "File too large. Maximum size is 5MB.",
        })
      }

      updatedFields.imageUrl = `/uploads/${req.file.filename}`
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No changes provided." })
    }

    const updatedProfile = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
      select: "-password",
    })

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
