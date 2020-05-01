const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const timestampRouter = require('./routers/timestamp')
const headerparserRouter = require('./routers/headerparser')


app.set('trust proxy', true)

// app.use(express.json())
app.use(express.static('public'))
app.use(timestampRouter)
app.use(headerparserRouter)

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  })  
app.listen(port, () => {
    console.log('Server is up on port '+port)
})