const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    type: { type: String, enum: ['like', 'follow', 'comment', 'share'], required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who triggered
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // optional, for post-related
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Notification', notificationSchema)