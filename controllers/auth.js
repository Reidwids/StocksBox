// API's for Authentication
const User = require('../models/user');
const bcrypt = require('bcrypt');
let passport = require('../authConfig/ppConfig');
const bodyParser = require('body-parser')
const salt = 10;
const {validationResult} = require('express-validator');
require('dotenv').config()

//Get - signup
exports.auth_signup_get = (req, res) => {
    res.render("auth/signUp");
}

// HTTP POST - Signup - to post the data
exports.auth_signup_post = (req, res) => {
    let user = new User(req.body);
    console.log(req.body)
    console.log(req.file);
    let hash = bcrypt.hashSync(req.body.password, salt);
    user.password = hash;
    const imagPath = '/uploads/' + req.file.filename;
    user.image = imagPath;
    user.save()
    .then(() => {
        console.log('user saved')
        res.redirect('/auth/signIn');
    })
    .catch((err) => {
      console.log(err)
        if(err.code == 11000){
            req.flash("error", "Email already exists");
            res.redirect("/auth/signIn");
        }
        else
        {
          const errors = validationResult(req);
          if(!errors.isEmpty()){
            req.flash("validationErrors", errors.errors);
          }
          res.redirect("/auth/signUp");
        }
    })
}

// HTTP GET - Signin - to load the signin form
exports.auth_signin_get =  (req, res) => {
    res.render("auth/signIn");
  }
  

// HTTP POST - Signin - to post the data
exports.auth_signin_post = 
  passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/signIn",
      failureFlash: "Invalid username or password",
      successFlash: "You are logged in successfully"
  })

// HTTP GET - Logout - to logout the user
exports.auth_logout_get = (req, res) => {
    // This will clear the session
    req.logout();
    req.flash("success", "Your are successfully logged out");
    res.redirect("/auth/signIn");
}