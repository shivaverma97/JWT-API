const express = require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const app = express()
app.listen(5000)
app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const token = req.body.token

    if(token == null) return res.sendStatus(404)

    try{       
        if (refreshTokens.includes(token)){
            jwt.verify(token, process.env.RERESH_ACCESS_TOKEN_SECRET, (err, user) => {
                if(err) return res.sendStatus(403)

                const refreshToken = GenerateAccessToken({name : user.name})
                return res.json({refreshToken : refreshToken})
            })
        }
        else{
            return res.sendStatus(401)
        }
    }
    catch(ex){
        console.log(ex)
        res.json({errorMessage : ex})
    }
})

app.post('/login',(req, res) => {
    try{  
        const username = req.body.username
        const user = { name : username}

        const accessToken = GenerateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.RERESH_ACCESS_TOKEN_SECRET)
        refreshTokens.push(refreshToken)

        res.json({accessToken : accessToken, refreshToken : refreshToken})
    }
    catch(ex){
        console.log(ex)
        res.json({errorMessage : ex})
    }
})

app.delete('/logout', (req, res) => {
    const token = req.body.token

    if(token == null) return res.sendStatus(404)

    try{            
        if (refreshTokens.includes(token)){
            jwt.verify(token, process.env.RERESH_ACCESS_TOKEN_SECRET, (err, user) => {
                if(err) return res.sendStatus(403)

                refreshTokens = refreshTokens.filter(item => item !== token)
                return res.status(200).json({Status : "Successfuly logged out"})
            })
        }
        else{
            return res.sendStatus(401)
        }
    }
    catch(ex){
        console.log(ex)
        res.json({errorMessage : ex})
    }
})

function GenerateAccessToken(user){
    const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '60s'})
    return refreshToken
}