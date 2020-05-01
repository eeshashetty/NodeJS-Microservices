const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const timestampRouter = require('./routers/timestamp')

app.use(express.json())
app.use(timestampRouter)

app.listen(port, () => {
    console.log('Server is up on port '+port)
})