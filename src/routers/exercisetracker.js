var express = require('express')
var mongo = require('mongodb')
var mongoose = require('mongoose')
var date = require('date-and-time')
var shortid = require('shortid')

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const router = new express.Router()

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: String,
        default: shortid.generate()
    }
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    return {
        username: userObject.username,
        _id: userObject.userId
    }
}

const User = mongoose.model('User', userSchema)

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    }
})

taskSchema.methods.toJSON = function () {
    const task = this
    const taskObject = task.toObject()
    
    taskObject.date = date.format(taskObject.date, date.compile('ddd MMM DD YYYY'))
    
    return {
        description: taskObject.description,
        duration: taskObject.duration,
        date: taskObject.date
    }
}

const Task = mongoose.model('Task', taskSchema)

router.get('/api/exercise/users', async (req,res) => {
    users = await User.find({})
    res.send(users)
})
router.post('/api/exercise/new-user', async (req,res) => {
    const username = req.body.username
    const exists = await User.findOne({username: username})
    if(exists){
        res.send('username already taken')
    } else 
    {
        try
        {
            const user = new User({username: req.body.username})
            await user.save()
            res.send(user)
        } catch(e) {
            res.status(500).send(e.errors.duration.message)
        }
    }
})

router.post('/api/exercise/add', async (req,res) => {
    const taskform = req.body
    const user = await User.findOne({userId: taskform.userId})
    const task = new Task({
        user: user, 
        description: taskform.description, 
        duration: taskform.duration, 
        date: date.format(new Date(taskform.date) || new Date(), date.compile('ddd MMM DD YYYY'))
    })

    try {
        await task.save()
        res.send({
            username: user.username, 
            description: task.description, 
            duration: task.duration, 
            _id: user.userId, 
            date: date.format(new Date(task.date), date.compile('ddd MMM DD YYYY'))
        })
    } catch(e) {
        res.status(500).send(e.errors.duration.message)
    }

})

router.get('/api/exercise/log', async (req,res) => {
    const from = req.query.from? new Date(req.query.from): null
    const to = req.query.to? new Date(req.query.to): new Date() 
    
    if(!req.query.userId){
        res.status(404).send('unknown userId')
    } 
    else 
    
    {const user = await User.findOne({userId: req.query.userId})
    
    try {
        await user.populate({
            path: 'tasks',
            options: {
                limit: parseInt(req.query.limit),
                sort: {'date': -1}
            }
        }).execPopulate()

        const log = []
        user.tasks.forEach((task) => {
            if (from<task.date && task.date<to)
            {log.push(task)}
        })
        
        res.send({
            _id: user.userId,
            username: user.username,
            count: log.length,
            log: log
        })

    } catch (e) {
        res.send(e)
    }
}
    
})

module.exports = router