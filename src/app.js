const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const timestampRouter = require('./routers/timestamp')
const headerparserRouter = require('./routers/headerparser')
const urlshortenerRouter = require('./routers/urlshortener')
const exercisetrackerRouter = require('./routers/exercisetracker')
const path = require('path')
var bodyParser = require('body-parser')


app.set('trust proxy', true)
const publicDirectoryPath = path.join(__dirname, '../public')
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(publicDirectoryPath))
app.use(timestampRouter)
app.use(headerparserRouter)
app.use(urlshortenerRouter)
app.use(exercisetrackerRouter)

app.get("/", function (req, res) {
    res.sendFile(path.join(publicDirectoryPath,'/index.html'));
  })
app.get("/api/timestamp-main", function (req, res) {
  res.sendFile(path.join(publicDirectoryPath, '/timestamp.html'));
})
app.get("/api/shorturl", function (req, res) {
  res.sendFile(path.join(publicDirectoryPath, '/urlshortener.html'));
})
app.get("/api/exercise", function (req, res) {
  res.sendFile(path.join(publicDirectoryPath, '/exercise.html'));
})  
app.listen(port, () => {
    console.log('Server is up on port '+port)
})