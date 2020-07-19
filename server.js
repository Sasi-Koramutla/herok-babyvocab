//express, mongoose, methodOverride
const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bcrypt = require("bcrypt");

//dotenv, port, URI
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost/'+ 'babyvocab';
const session = require('express-session');

const app = express();

// middleware to help with the form submission
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

//session usage
app.use(
    session({
      secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
  );

  
// mongoose connection logic
mongoose.connect(mongodbURI, { useNewUrlParser: true, useFindAndModify: false}, (err, res) => {
    if (err) {
    console.log ('ERROR connecting to: ' + mongodbURI + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + mongodbURI);
    }});
  mongoose.connection.once('open', ()=> {
      console.log('connected to mongo');
  });

// User controller
const userController = require('./controllers/users.js');
app.use('/users', userController); 

// Session controller
const sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);


//get route
app.get("/", (req, res) => {
    //res.send("Hello");
    res.render("login.ejs");
});
// the app running the server
app.listen(PORT, () => {
    console.log('listening')
  });