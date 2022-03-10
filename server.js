//Server Requires
const express = require('express');
const mongoose = require('mongoose');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
// const multer = require('multer');

require('dotenv').config()

let session = require('express-session');
let passport = require('./authConfig/ppConfig');
const flash = require('connect-flash');

//Route Requires
const authRoutes = require("./routes/auth");
const profileRoute = require('./routes/profile');

//Initialize Server
const app = express();
const port = process.env.PORT;

// Parsing application

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

//Login 
app.use(session({
  secret: process.env.secret,
  saveUninitialized: true,
  resave: false,
  cookie: {maxAge: 36000000}
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Sharing the information with all pages.
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
})

// Initialize layouts and view engine
app.use(ejsLayouts);
app.set('view engine', 'ejs');

//Enable static files
app.use(express.static('public'));

//Link DB
mongoose.connect(process.env.mongoDBURL, 
{
    useNewURLParser: true,
    useUnifiedTopology: true,
},
()=>{console.log("Connected to MongoDB")}
)


//Image Saving Middleware
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
  
// const upload = multer({ storage: storage });
// const imgModel = require('./models/user');

// app.get('/', (req, res) => {
//   imgModel.find({}, (err, items) => {
//       if (err) {
//           console.log(err);
//           res.status(500).send('An error occurred', err);
//       }
//       else {
//         //next line needs different routing
//           res.render('ImagePage', { items: items });
//       }
//   });
// });

// app.post('/', upload.single('image'), (req, res, next) => {  
//   const obj = {
//       name: req.body.name,
//       desc: req.body.desc,
//       img: {
//           data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
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


//Link Routes
app.use('/', profileRoute);
app.use('/', authRoutes);

//Listen
app.listen(port, ()=> console.log(`Port ${port} is running`));