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
app.use('/api', indexRoutes)
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
