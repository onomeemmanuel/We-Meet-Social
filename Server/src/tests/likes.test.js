const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('../server')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Like = require('../models/likeModel')
const Follow = require('../models/followModel')
const Notification = require('../models/notificationModel')

dotenv.config({ path: 'Server/.env' })

let token
let userId
let postId

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await User.deleteMany()
  await Post.deleteMany()
  await Like.deleteMany()
  await Follow.deleteMany()
  await Notification.deleteMany()
  // Create test user
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoelikes',
      email: 'johnlikes@example.com',
      password: 'password123'
    })
  token = signupRes.body.token
  userId = signupRes.body.user._id
  // Create test post
  const postRes = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Post', content: 'Content', tags: ['test'] })
  postId = postRes.body._id
  // Publish post
  await request(app)
    .put(`/api/posts/${postId}/state`)
    .set('Authorization', `Bearer ${token}`)
    .send({ state: 'published' })
})

describe('Likes Endpoints', () => {
  test('Like post', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(201)
    const post = await Post.findById(postId)
    expect(post.like_count).toBe(1)
  })

  test('Cannot like twice', async () => {
    await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(400)
  })

  test('Unlike post', async () => {
    await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .delete(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    const post = await Post.findById(postId)
    expect(post.like_count).toBe(0)
  })
})