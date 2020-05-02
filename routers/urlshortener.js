var express = require('express')
var mongo = require('mongodb')
var mongoose = require('mongoose')
var dns = require('dns')
var url = require('url')

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const router = new express.Router()

const URL = new mongoose.model('URL', mongoose.Schema({
    short_url: {
        type: Number,
        unique: true
    },
    original_url: {
        type: String,
        required: true,
        unique: true
    }
}))


const shorten = (input_url) => {
    
    const parsed_url = url.parse(input_url)
    if(!parsed_url.protocol) {
        return false
    }   
    dns.lookup(parsed_url.host, (err, address, family) => {
        if(err) {
            return false
        } 
    })

    return true
}

router.post("/api/shorturl/new", async (req, res) => {
    const input_url = req.body.url
    const validurl = shorten(input_url)
    
    if(validurl){
        const shorturl = await URL.findOne({original_url: input_url}) 
        if(shorturl){
            res.send({
                original_url: shorturl.original_url,
                short_url: shorturl.short_url
            })
        } else {
        const urlobject = new URL({
            original_url: input_url,
            short_url: Math.floor(Math.random()*1000)
        })

        await urlobject.save()
        
        res.send({
            original_url: urlobject.original_url,
            short_url: urlobject.short_url
        })

      }
        
    } else {
        res.send({
            error: 'invalid URL'
        })
    }
})

router.get("/api/shorturl/:id", async (req, res) => {
    const short_url = req.params.id
    const shorturl = await URL.findOne({short_url: short_url})
    
    if(shorturl)
    {res.redirect(shorturl.original_url)} 
    else {
        res.send({error: 'No short url found for given input'})
    }
})

module.exports = router