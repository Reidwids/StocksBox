//Server Requires
const express = require('express');
const mongoose = require('mongoose');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

require('dotenv').config()

let session = require('express-session');
let passport = require('./authConfig/ppConfig');
const flash = require('connect-flash');

//Initialize Server
const app = express();
const port = process.env.PORT;

// Parsing application
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

//Route Requires
const authRoutes = require("./routes/auth");
const profileRoute = require('./routes/profile');

// app.use(bodyParser.json())

//Login 
app.use(session({
  secret: process.env.secret,
  saveUninitialized: true,
  resave: true,
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

//Link Routes
app.use('/', profileRoute);
app.use('/', authRoutes);

//Listen
app.listen(port, ()=> console.log(`Port ${port} is running`));