const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')
const indexRoutes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')

dotenv.config({ path: path.resolve(__dirname, '../../Server/.env') })

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from Client/dist
const clientBuildPath = path.resolve(__dirname, '../../Client/dist')
app.use(express.static(clientBuildPath))

// API routes
app.use('/api', indexRoutes)

// Serve React frontend for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

app.use(errorHandler)

module.exports = app

const PORT = process.env.PORT || 5000

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error('Failed to start server:', err)
      process.exit(1)
    })
}
