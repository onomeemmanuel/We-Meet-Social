const express = require('express')
const { 
  getNotifications, 
  markAsRead, 
  getProfile, 
  getMyProfile, 
  updateProfile 
} = require('../controllers/profileController')

const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/notifications', auth, getNotifications)
router.put('/notifications/:id/read', auth, markAsRead)
router.get('/profile', auth, getMyProfile)
router.put('/profile', auth, updateProfile)
router.get('/profile/:id', auth, getProfile)

module.exports = router
