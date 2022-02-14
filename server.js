const express = require('express')
const connectDB = require('./config/db')
const app = express()
const path = require('path')
//Connect DATAbase
connectDB()

//Init Middelware
app.use(express.json({ extended: false }))

// app.get('/', (req, res) => res.send('API Runing'))

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))

//Serve static assets in production 在生产中服务静态资产
if (process.env.NODE_ENV === 'production') {
  //set static folder 设置静态文件夹
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server port ${PORT}`)
})
