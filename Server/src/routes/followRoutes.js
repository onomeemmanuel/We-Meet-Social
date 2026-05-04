const express = require('express')
const { followUser, unfollowUser, getFollowing, getFollowers } = require('../controllers/followController')
const { auth } = require('../middleware/auth')
const router = express.Router()

router.post('/:followingId', auth, followUser)
router.delete('/:followingId', auth, unfollowUser)
router.get('/following', auth, getFollowing)
router.get('/followers', auth, getFollowers)

module.exports = router
