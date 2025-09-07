import Post from "../Models/Post.js"

export const createPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      author: req.user.id,
    })
    await post.save()
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
