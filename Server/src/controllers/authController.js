const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next)
}

const signup = asyncHandler(async (req, res) => {
  const { first_name, last_name, username, email, password, birthday, gender } = req.body
  const user = new User({ first_name, last_name, username, email, password, birthday, gender })
  await user.save()
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  const safeUser = user.toObject()
  delete safeUser.password
  res.status(201).json({ user: safeUser, token })
})

const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  })
  if (!user) {
    return res.status(401).json({ error: 'User not found. Please sign up first.' })
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid password.' })
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  const safeUser = user.toObject()
  delete safeUser.password
  res.json({ user: safeUser, token })
})

module.exports = { signup, login }