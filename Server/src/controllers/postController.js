const mongoose = require('mongoose')
const Post = require('../models/postModel')
const Follow = require('../models/followModel')
const User = require('../models/userModel')

const buildAuthorFilter = async (author) => {
  if (!author) return {}
  if (mongoose.Types.ObjectId.isValid(author)) {
    return { author }
  }
  const users = await User.find({
    $or: [
      { username: { $regex: author, $options: 'i' } },
      { email: { $regex: author, $options: 'i' } },
      { first_name: { $regex: author, $options: 'i' } },
      { last_name: { $regex: author, $options: 'i' } }
    ]
  }).select('_id')
  if (!users.length) return { author: { $in: [] } }
  return { author: { $in: users.map((user) => user._id) } }
}

const normalizeSortBy = (sort_by) => {
  if (sort_by === 'timestamp') return 'createdAt'
  return ['like_count', 'comment_count', 'createdAt'].includes(sort_by) ? sort_by : 'createdAt'
}

const listPublishedPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, author, title, tags, sort_by = 'createdAt', order = 'desc' } = req.query
    const query = { state: 'published' }
    if (author) Object.assign(query, await buildAuthorFilter(author))
    if (title) query.title = { $regex: title, $options: 'i' }
    if (tags) query.tags = { $in: tags.split(',').map((tag) => tag.trim()) }
    const sort = {}
    sort[normalizeSortBy(sort_by)] = order === 'asc' ? 1 : -1
    const posts = await Post.find(query)
      .populate('author', 'username first_name last_name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
    const total = await Post.countDocuments(query)
    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}

const getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, author, title, tags, sort_by = 'createdAt', order = 'desc' } = req.query
    const query = { state: 'published' }

    if (req.user && req.user.id) {
      const following = await Follow.find({ follower: req.user.id }).select('following')
      const authorIds = [req.user.id, ...following.map((f) => f.following)]
      query.author = { $in: authorIds }
    }

    if (author) Object.assign(query, await buildAuthorFilter(author))
    if (title) query.title = { $regex: title, $options: 'i' }
    if (tags) query.tags = { $in: tags.split(',').map((tag) => tag.trim()) }
    const sort = {}
    sort[normalizeSortBy(sort_by)] = order === 'asc' ? 1 : -1
    const posts = await Post.find(query)
      .populate('author', 'username first_name last_name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
    const total = await Post.countDocuments(query)
    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}

const getSinglePublishedPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, state: 'published' })
      .populate('author', 'username first_name last_name')
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (error) {
    next(error)
  }
}

const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, image, file, state } = req.body
    const post = new Post({
      title,
      content,
      tags,
      image_url: image || '',
      file_name: file || '',
      author: req.user.id,
      state: state || 'draft',
    })
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    next(error)
  }
}

const updatePostState = async (req, res, next) => {
  try {
    const { state } = req.body
    if (!['draft', 'published'].includes(state)) {
      return res.status(400).json({ error: 'Invalid state' })
    }
    const post = await Post.findById(req.params.id)
    if (!post || post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    post.state = state
    await post.save()
    res.json(post)
  } catch (error) {
    next(error)
  }
}

const updatePost = async (req, res, next) => {
  try {
    const { title, content, tags, image, file } = req.body
    const post = await Post.findById(req.params.id)
    if (!post || post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    if (title !== undefined) post.title = title
    if (content !== undefined) post.content = content
    if (tags !== undefined) post.tags = tags
    if (image !== undefined) post.image_url = image
    if (file !== undefined) post.file_name = file
    await post.save()
    res.json(post)
  } catch (error) {
    next(error)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post || post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    await post.remove()
    res.json({ message: 'Post deleted' })
  } catch (error) {
    next(error)
  }
}

const getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, state } = req.query
    const query = { author: req.user.id }
    if (state) query.state = state
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    const total = await Post.countDocuments(query)
    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}

module.exports = { listPublishedPosts, getFeed, getSinglePublishedPost, createPost, updatePostState, updatePost, deletePost, getMyPosts }