import Post from "../Models/Post.js"

export const createPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
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
      .populate("author", "username email imageUrl")
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message || "Server Error." })
  }
}

export const likePost = async (req, res) => {
  try {
    const { id: postId } = req.params
    const { id: userId } = req.user

    const post = await Post.findById(postId)
    if (!post)
      return res
        .status(404)
        .json({ error: "The post doesn't exist.", liked: false })

    let liked
    let updatedPost

    if (post.likes.includes(userId)) {
      // Unlike - remove user from likes array
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true } // Return updated document
      )
      liked = false
    } else {
      // Like - add user to likes array
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } }, // $addToSet prevents duplicates
        { new: true }
      )
      liked = true
    }

    const count = updatedPost.likes.length
    res.json({ count: count, liked })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}
