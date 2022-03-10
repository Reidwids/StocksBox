// API's for Authentication
const User = require('../models/user');
const bcrypt = require('bcrypt');
let passport = require('../authConfig/ppConfig');
const bodyParser = require('body-parser')
bodyParser.urlencoded({ extended: true })
const salt = 10;
const {validationResult} = require('express-validator');
require('dotenv').config()
// const AWS = require('aws-sdk');
// const fs = require('fs');
// const path = require('path');

// //configuring the AWS environment
// AWS.config.update({
//     accessKeyId: `${process.env.ID}`,
//     secretAccessKey: `${process.env.AWS_SECRET}`
//   });

// Multer Initialize
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });


//Get - signup
exports.auth_signup_get = (req, res) => {
    res.render("auth/signUp");
}

// HTTP POST - Signup - to post the data
exports.auth_signup_post = (req, res) => {
    let user = new User(req.body);
    console.log(req.body);
    let hash = bcrypt.hashSync(req.body.password, salt);
    user.password = hash;

    // const imgPath = req.image.filename;
    // user.image = imgPath;
    // console.log(req.body);

// app.post('/', upload.single('image'), (req, res, next) => {  
//   const obj = {
//       name: req.body.name,
//       desc: req.body.desc,
//       img: {
//           data: fs.readFileSync(path.join(__dirname + '/images/' + req.file.filename)),
//           contentType: 'image/png'
//       }
//   }
//   imgModel.create(obj, (err, item) => {
//       if (err) {
//           console.log(err);
//       }
//       else {
//           // item.save();
//           res.redirect('/');
//       }
//   });
// });
    // //AWS picture upload
    // const s3 = new AWS.S3();

    // console.log("The file path is : ", req.body.image.path);
    // const filePath = fs.readFileSync(req.body.image);
   
    // console.log("The file path is : ", filePath);
    // //configuring parameters
    // const params = {
    //   Bucket: `${process.env.BUCKET_NAME}`,
    //   // Body : fs.createReadStream(filePath),
    //   Body : fs.createReadStream(filePath),
    //   Key : "folder/"+Date.now()+"_"+path.basename(filePath)
    // };
    // console.log("this is the image: ", req.body.image);
    // console.log("ENDING")
    // const location = s3.upload(params, function (err, data) {
    //   //handle error
    //   if (err) {
    //     console.log("Error", err);
    //   }
    //   //success
    //   if (data) {
    //     console.log("Uploaded in:", data.Location);
    //     return data.Location;
    //   }
    // });
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
// app.post('/', upload.single('image'), (req, res, next) => {  
//   const obj = {
//       name: req.body.name,
//       desc: req.body.desc,
//       img: {
//           data: fs.readFileSync(path.join(__dirname + '/images/' + req.file.filename)),
//           contentType: 'image/png'
//       }
//   }
//   imgModel.create(obj, (err, item) => {
//       if (err) {
//           console.log(err);
//       }
//       else {
//           // item.save();
//           res.redirect('/');
//       }
//   });
// });



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