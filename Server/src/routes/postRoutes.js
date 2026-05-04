const express = require('express')
const { 
  listPublishedPosts, 
  getFeed, 
  getSinglePublishedPost, 
  createPost, 
  updatePostState, 
  updatePost, 
  deletePost, 
  getMyPosts 
} = require('../controllers/postController')

const { likePost, unlikePost } = require('../controllers/likeController')
const { auth, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// Public routes
router.get('/', listPublishedPosts)

// Feed: public + logged-in
router.get('/feed', optionalAuth, getFeed)

// Authenticated routes
router.post('/', auth, createPost)
router.get('/:id', getSinglePublishedPost)
router.put('/:id/state', auth, updatePostState)
router.put('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.get('/my/posts', auth, getMyPosts)
router.post('/:postId/like', auth, likePost)
router.delete('/:postId/like', auth, unlikePost)

module.exports = router
