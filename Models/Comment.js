import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
)

export default mongoose.model("Comment", commentSchema)
