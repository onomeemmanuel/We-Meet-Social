const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('../server')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Follow = require('../models/followModel')
const Like = require('../models/likeModel')
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
  await Follow.deleteMany()
  await Like.deleteMany()
  await Notification.deleteMany()
  // Create test user
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoeposts',
      email: 'johnposts@example.com',
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
})

describe('Posts Endpoints', () => {
  test('Create post (auth)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Post', content: 'Content', tags: ['new'] })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('_id')
  })

  test('List published posts (public)', async () => {
    // Publish the post
    await request(app)
      .put(`/api/posts/${postId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' })
    const res = await request(app).get('/api/posts')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.posts)).toBe(true)
  })

  test('Feed returns own and followed published posts', async () => {
    // Publish the first user's post
    await request(app)
      .put(`/api/posts/${postId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' })

    const otherUser = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoeposts',
        email: 'janeposts@example.com',
        password: 'password123'
      })

    const otherToken = otherUser.body.token
    const otherPost = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Other Post', content: 'Other Content', tags: ['other'] })

    await request(app)
      .put(`/api/posts/${otherPost.body._id}/state`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ state: 'published' })

    await request(app)
      .post(`/api/follows/${otherUser.body.user._id}`)
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .get('/api/posts/feed')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.posts.some((post) => post._id === postId)).toBe(true)
    expect(res.body.posts.some((post) => post._id === otherPost.body._id)).toBe(true)
  })

  test('Get single published post (public)', async () => {
    await request(app)
      .put(`/api/posts/${postId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' })
    const res = await request(app).get(`/api/posts/${postId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('_id', postId)
  })

  test('Owner update post', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' })
    expect(res.statusCode).toBe(200)
  })

  test('Non-owner cannot update post', async () => {
    // Create another user
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123'
      })
    const otherToken = signupRes.body.token
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked' })
    expect(res.statusCode).toBe(403)
  })

  test('Pagination', async () => {
    await request(app)
      .put(`/api/posts/${postId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' })
    const res = await request(app).get('/api/posts?page=1&limit=10')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('page', 1)
  })

  test('Search by title', async () => {
    await request(app)
      .put(`/api/posts/${postId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' })
    const res = await request(app).get('/api/posts?title=Test')
    expect(res.statusCode).toBe(200)
    expect(res.body.posts.length).toBeGreaterThan(0)
  })

  test('Sort by createdAt desc', async () => {
    await request(app)
      .put(`/api/posts/${postId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' })
    const res = await request(app).get('/api/posts?sort_by=createdAt&order=desc')
    expect(res.statusCode).toBe(200)
  })
})