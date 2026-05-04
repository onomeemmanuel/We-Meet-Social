const request = require('supertest')
const express = require('express')
const indexRoutes = require('../routes/index')

const app = express()
app.use(express.json())
app.use('/api', indexRoutes)

describe('API sanity checks', () => {
  test('GET /api returns status ok', async () => {
    const res = await request(app).get('/api')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ status: 'ok', message: 'We Meet Social API' })
  })
})
