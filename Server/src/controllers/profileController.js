const Notification = require('../models/notificationModel')
const User = require('../models/userModel')

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('from', 'first_name last_name username')
      .populate('post', 'title')
      .sort({ createdAt: -1 })
    res.json(notifications)
  } catch (error) {
    next(error)
  }
}

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params
    await Notification.findByIdAndUpdate(id, { read: true })
    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { bio, location, website, avatar } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (bio !== undefined) user.bio = bio
    if (location !== undefined) user.location = location
    if (website !== undefined) user.website = website
    if (avatar !== undefined) user.avatar = avatar
    await user.save()
    const updated = user.toObject()
    delete updated.password
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

module.exports = { getNotifications, markAsRead, getProfile, getMyProfile, updateProfile }