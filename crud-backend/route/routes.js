var express = require('express');
var router = express.Router();

const User = require('../model/users')

router.get('/users', (req, res, next)=>{
    //res.send('get route tested');
    User.find(function(err, User){
        if(err){
            res.json(err);
        }
        else{
            res.json(User);
        }
    })
});

router.post('/user', (req, res, next)=>{
    let newUser = new User({
        userName: req.body.userName,
    });
    newUser.save((err, newUser)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json({msg: 'User has been added successfully'})
        }
    });
});

router.put('/post_route', (req, res, next)=>{
    //to do later
});

router.delete('/post_route', (req, res, next)=>{
    //to do later
});

module.exports = router;

