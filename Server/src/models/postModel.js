const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    image_url: { type: String, default: '' },
    file_name: { type: String, default: '' },
    state: { type: String, enum: ['draft', 'published'], default: 'draft' },
    like_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
    share_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Post', postSchema)