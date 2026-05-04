const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('../server')
const User = require('../models/userModel')
const Follow = require('../models/followModel')
const Notification = require('../models/notificationModel')

dotenv.config({ path: 'Server/.env' })

let token
let userId
let otherUserId

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await User.deleteMany()
  await Follow.deleteMany()
  await Notification.deleteMany()
  // Create test user
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoefollows',
      email: 'johnfollows@example.com',
      password: 'password123'
    })
  token = signupRes.body.token
  userId = signupRes.body.user._id
  // Create another user
  const otherSignup = await request(app)
    .post('/api/auth/signup')
    .send({
      first_name: 'Jane',
      last_name: 'Doe',
      username: 'janedoefollows',
      email: 'janefollows@example.com',
      password: 'password123'
    })
  otherUserId = otherSignup.body.user._id
})

describe('Follows Endpoints', () => {
  test('Follow user', async () => {
    const res = await request(app)
      .post(`/api/follows/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(201)
  })

  test('Cannot follow self', async () => {
    const res = await request(app)
      .post(`/api/follows/${userId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(400)
  })

  test('Cannot follow twice', async () => {
    await request(app)
      .post(`/api/follows/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .post(`/api/follows/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(400)
  })

  test('Unfollow user', async () => {
    await request(app)
      .post(`/api/follows/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .delete(`/api/follows/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
  })

  test('Get following', async () => {
    await request(app)
      .post(`/api/follows/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .get('/api/follows/following')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('Get followers', async () => {
    const otherToken = (await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: 'jane@example.com', password: 'password123' })).body.token
    await request(app)
      .post(`/api/follows/${userId}`)
      .set('Authorization', `Bearer ${otherToken}`)
    const res = await request(app)
      .get('/api/follows/followers')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})