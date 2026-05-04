const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// User schema definition
const userSchema = new mongoose.Schema(
  {
    // User's first name
    first_name: { type: String, required: true },
    // User's last name
    last_name: { type: String, required: true },
    // Unique username for the user
    username: { type: String, required: true, unique: true },
    // Unique email address
    email: { type: String, required: true, unique: true },
    // Hashed password
    password: { type: String, required: true },
    // User's birthday
    birthday: { type: Date },
    // User's gender
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
)

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) return
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)
