const express = require('express')
const router = new express.Router()

router.get('/api/whoami', async(req, res) => {
    const headerdata = req.headers
    res.send({
        ipaddress: req.ip,
        language: headerdata['accept-language'],
        software: headerdata['user-agent']
    })
})

module.exports = router