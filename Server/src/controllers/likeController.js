const Like = require('../models/likeModel')
const Post = require('../models/postModel')

const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const like = new Like({ user: req.user.id, post: postId })
    await like.save()
    await Post.findByIdAndUpdate(postId, { $inc: { like_count: 1 } })
    res.status(201).json({ message: 'Liked' })
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Already liked' })
    next(error)
  }
}

const unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const like = await Like.findOneAndDelete({ user: req.user.id, post: postId })
    if (like) {
      await Post.findByIdAndUpdate(postId, { $inc: { like_count: -1 } })
    }
    res.json({ message: 'Unliked' })
  } catch (error) {
    next(error)
  }
}

module.exports = { likePost, unlikePost }