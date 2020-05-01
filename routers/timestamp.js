const express = require('express')
const router = new express.Router()
 
router.get('/api/timestamp/:date_string?', (req, res) => {
    const date_string = req.params.date_string
    var valid_date = new Date()
    if(date_string){
        valid_date = isNaN(date_string)?new Date(date_string+' GMT'):new Date(parseInt(date_string))
    }
    const utc = valid_date.toUTCString()
    const unix = valid_date.getTime()
    if(!isNaN(unix))
    {    
        res.send({
            unix: unix,
            utc: utc
        })  
    } else {
        res.send({
            error: 'Invalid Date'
        })
    }
})

module.exports = router