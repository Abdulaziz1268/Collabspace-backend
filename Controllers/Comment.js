import mongoose, { mongo } from "mongoose"
import Comment from "../Models/Comment.js"

export const getComments = async (req, res) => {
  try {
    const { id: postId } = req.params

    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ error: "Invalid post Id." })

    const comments = await Comment.find({ post: postId })
      .populate("author", "username imageUrl")
      .sort({ createdAt: -1 })

    const count = comments.length
    res.json({ comments, count })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message || "server error" })
  }
}

export const getCommentCount = async (req, res) => {
  try {
    const { id: postId } = req.params

    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ error: "Invalid post Id." })

    const count = await Comment.countDocuments({ post: postId })
    res.json({ count })
  } catch (error) {}
}

export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params
    const { id: userId } = req.user
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ error: "Invalid post Id." })

    if (!content || typeof content !== "string")
      return res
        .status(400)
        .json({ error: "comment content is required and must be a string." })

    const comment = new Comment({
      content,
      author: userId,
      post: postId,
    })

    await comment.save()
    res.status(201).json(await comment.populate("author", "username"))
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message || "server error" })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params
    const { id: userId } = req.user

    if (!mongoose.Types.ObjectId.isValid(commentId))
      return res.status(400).json({ error: "Invalid Comment Id." })

    const comment = await Comment.findById(commentId)

    if (!comment)
      return res.status(404).json({ error: "The comment doesn't exist." })

    if (comment.author.toString() !== userId)
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment." })

    await comment.deleteOne()
    res.json({ comment, message: "Comment deleted successfully." })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message || "Server error." })
  }
}
