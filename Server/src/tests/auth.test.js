const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('../server')
const User = require('../models/userModel')

dotenv.config({ path: 'Server/.env' })

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await User.deleteMany()
})

describe('Auth Endpoints', () => {
  test('Signup success', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('user')
    expect(res.body).toHaveProperty('token')
  })

  test('Signup failure - missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ first_name: 'John' })
    expect(res.statusCode).toBe(500) // or 400 if validation
  })

  test('Signup failure - duplicate email', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      })
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoe',
        email: 'john@example.com',
        password: 'password123'
      })
    expect(res.statusCode).toBe(500)
  })

  test('Login success', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: 'john@example.com', password: 'password123' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('user')
    expect(res.body).toHaveProperty('token')
  })

  test('Login failure - wrong password', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: 'john@example.com', password: 'wrong' })
    expect(res.statusCode).toBe(401)
  })
})