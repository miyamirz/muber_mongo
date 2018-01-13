const express = require('express');
const Routes  = require('./routes/routes');
const bodyparser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !=="test")
{
  mongoose.connect('mongodb://localhost/muber');
}

app.use(bodyparser.json());
Routes(app);

app.use((err,req,res,next) => {
  res.status(422).send({error:err.message});
})

module.exports = app;
