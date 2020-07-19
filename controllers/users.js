const express = require('express');
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const Word = require("../models/words.js");
const AllWords = require("../models/words.js");
const allUsers = require('../models/users');
const methodOverride = require('method-override');

// middleware to help with the form submission
usersRouter.use(express.urlencoded({extended:true}));
usersRouter.use(methodOverride('_method'));
usersRouter.use(express.static('public'));

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next();
    } else {
      res.redirect('/sessions/new');
    }
  };
//new user
usersRouter.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        currentUser: req.session.currentUser
    });
});

//post for user creation
usersRouter.post("/",(req,res) => {
    // Hash the password before putting it in the database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    allUsers.findOne({username:req.body.username}, (err, foundUser) => {
     if(foundUser)
     res.render("login.ejs", {message:"User Already Exists!"});

      else
      {
        User.create(req.body, (err, createdUser) => {
          console.log('user is created', createdUser);
          console.log(err);
         /* if (err)
          res.render("login.ejs",{message:"User already exists!"});
          //res.send("successful");
          else */
          res.render("login.ejs", {message:"Signup is Complete."});
        });
      }
    });

});

usersRouter.get("/:id", isAuthenticated, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log('user is found', foundUser);
        console.log(err);
        //res.send("successful");
        Message.find({}, (err, messages) =>{
          //console.log(messages);
          res.render("users/show.ejs", {user: foundUser, currentUser: req.session.currentUser, messages:messages});
        });
        
    });
});

// edit
usersRouter.get('/words/:id/edit', isAuthenticated, (req, res)=>{
    Word.findById(req.params.id, (err, foundWord)=>{ 
        res.render('words/edit.ejs', {
          word: foundWord, 
          currentUser: req.session.currentUser
        });
    });
  });

// inbox 
usersRouter.get('/:id/new', isAuthenticated, (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{ 

      res.render("users/newword.ejs", {user: foundUser, currentUser: req.session.currentUser});
  });
});

//get all users
usersRouter.get('/', isAuthenticated, (req, res)=>{
  User.findOne({ username: req.session.currentUser.username }, (err, foundUser) => {
            req.session.currentUser = foundUser;
            Word.find({user: foundUser.id},(err , words) =>{
              console.log(words);
                res.render("index.ejs",{currentUser: foundUser,
                    words:words});
            });
      });
});

// update
usersRouter.put('/words/:id', isAuthenticated, (req, res)=>{
    Word.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel)=> {
/*         AllWords.find({},(err , words) =>{
            res.render("index.ejs",{currentUser: req.session.currentUser,
                words:words});
        }); */    res.redirect(`/users/`);
    });
});

// update connections
usersRouter.put('/:id/:connectionId/update', isAuthenticated, (req, res)=>{
  User.findByIdAndUpdate(req.params.id, {$push:{userConnections:{connectionId:req.params.connectionId}}}, { new: true}, (err, updatedModel)=> {
    console.log(err); 
    console.log(updatedModel.userConnections); 
    });
  //res.redirect(`../../${req.params.connectionId}`);
  res.redirect(`../../`);
  });


  
//post messages
usersRouter.post("/words/:babyName/:id", isAuthenticated, (req,res) => {
req.body.babyName = req.params.babyName;
req.body.user = req.params.id;
  Word.create(req.body, (err, createdMessage) => {
      console.log('message is created', createdMessage);
      console.log(err);
      //res.send("successful");
      res.redirect(`/users/`);
  });
});

//delete user
usersRouter.delete('/:id/', isAuthenticated, (req, res) => {
  User.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect(`/`);
  });
});

//delete messages
usersRouter.delete('/words/:id/', isAuthenticated, (req, res) => {
  Word.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect(`/users`);
  });
});

//delete inbox messages
usersRouter.delete('/inbox/:id/:to', isAuthenticated, (req, res) => {
  Message.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect(`/users/${req.params.to}/inbox`);
  });
});

module.exports = usersRouter;