const Follow = require('../models/followModel')
const Notification = require('../models/notificationModel')

const followUser = async (req, res, next) => {
  try {
    const { followingId } = req.params
    if (followingId === req.user.id) return res.status(400).json({ error: 'Cannot follow yourself' })
    const follow = new Follow({ follower: req.user.id, following: followingId })
    await follow.save()
    const notification = new Notification({
      user: followingId,
      type: 'follow',
      from: req.user.id,
    })
    await notification.save()
    res.status(201).json({ message: 'Followed' })
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Already following' })
    next(error)
  }
}

const unfollowUser = async (req, res, next) => {
  try {
    const { followingId } = req.params
    await Follow.findOneAndDelete({ follower: req.user.id, following: followingId })
    res.json({ message: 'Unfollowed' })
  } catch (error) {
    next(error)
  }
}

const getFollowing = async (req, res, next) => {
  try {
    const follows = await Follow.find({ follower: req.user.id }).populate('following', 'username first_name last_name')
    res.json(follows.map(f => f.following))
  } catch (error) {
    next(error)
  }
}

const getFollowers = async (req, res, next) => {
  try {
    const follows = await Follow.find({ following: req.user.id }).populate('follower', 'username first_name last_name')
    res.json(follows.map(f => f.follower))
  } catch (error) {
    next(error)
  }
}

module.exports = { followUser, unfollowUser, getFollowing, getFollowers }