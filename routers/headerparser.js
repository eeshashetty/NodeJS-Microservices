const express = require('express')
const router = new express.Router()
const ip = require('public-ip')

router.get('/api/whoami', async(req, res) => {
    const headerdata = req.headers
    res.send({
        ipaddress: await ip.v4(),
        language: headerdata['accept-language'],
        software: headerdata['user-agent']
    })
})

module.exports = router