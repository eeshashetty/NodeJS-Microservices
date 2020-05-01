const express = require('express')
const router = new express.Router()
const date = require('date-and-time')

router.get('/api/timestamp/:date_string?', (req, res) => {
    const date_string = req.params.date_string
    const valid_date = isNaN(date_string)?new Date(date_string+' GMT'):new Date(parseInt(date_string))

    const utc = valid_date.toUTCString()
    const unix = valid_date.getTime()

    res.send({
        unix: unix,
        utc: utc
    })

})

module.exports = router