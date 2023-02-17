const express = require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const app = express()
app.listen(3000)
app.use(express.json())

posts = [
    {
        name : 'John',
        post : 'post1'
    },
    {
        name : 'Alex',
        post : 'post2'
    }
]

app.get('/home', ValidateUser, (req, res) => {
    try{
        const post = posts.filter(post => post.name === req.user.name)
        res.json(post)
    }
    catch(ex){
        console.log(ex)
        res.json({errorMessage : ex})
    }
})

function ValidateUser(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader &&  authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })
}