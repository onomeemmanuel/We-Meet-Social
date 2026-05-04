const User = require('../models/userModel')

const getHealth = (req, res) => {
  res.json({ status: 'ok', message: 'We Meet Social API' })
}

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    next(error)
  }
}

module.exports = { getHealth, getUsers }
