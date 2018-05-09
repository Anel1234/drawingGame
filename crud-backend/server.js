var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

var app = express();

const route = require('./route/routes.js');

//connect to mongodb
mongoose.connect('mongodb://localhost/local')

mongoose.connection.on('connected', ()=>{
    console.log('MongoDB connected at port 27017');
});

mongoose.connection.on('error',(err)=>{
    console.log(err);
});

const PORT = 3000;

app.get('/', (req, res)=>{
    res.send('works');
});

//body-parser

app.use(bodyparser.json());

app.use('/api', route);

app.listen(PORT, ()=>{
    console.log('Server has been started at port:'+PORT)
});