const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const timestampRouter = require('./routers/timestamp')
const headerparserRouter = require('./routers/headerparser')
const urlshortenerRouter = require('./routers/urlshortener')
const exercisetrackerRouter = require('./routers/exercisetracker')
var bodyParser = require('body-parser')


app.set('trust proxy', true)

// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(timestampRouter)
app.use(headerparserRouter)
app.use(urlshortenerRouter)
app.use(exercisetrackerRouter)

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  })  
app.listen(port, () => {
    console.log('Server is up on port '+port)
})