const express = require('express')
const router = express.Router()
const { getHealth, getUsers } = require('../controllers/indexController')
const authRoutes = require('./authRoutes')
const profileRoutes = require('./profileRoutes')
const postRoutes = require('./postRoutes')
const followRoutes = require('./followRoutes')

router.get('/', getHealth)
router.get('/users', getUsers)
router.use('/auth', authRoutes)
router.use('/profile', profileRoutes)
router.use('/posts', postRoutes)
router.use('/follows', followRoutes)

module.exports = router
