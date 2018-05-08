const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res)=>{
    res.json({message: "Hi "})
})


app.post('/api/posts', verifyToken, (req, res)=>{
    jwt.verify(req.token, 'secretpassword', (err, authData)=> {
        if(err) {
            res.status(403).json({message:"forbidden"});
        } else {
            res.json({
                authData
            })
        }
    })
})

app.post('/api/login', (req, res)=> {
    let data = req.body;
    const user = {
        id: data.id,
        email: data.email,
        username: data.username
    }

    jwt.sign({user}, 'secretpassword',{ expiresIn: '30s' },(err, token)=>{
        res.json({token: token})
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.status(403).json({message: 'forbidden'});
    }
}


app.listen(5000, ()=> console.log('app listen on port 5000'))