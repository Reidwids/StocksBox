//Server Requires
const express = require('express');
const mongoose = require('mongoose');
const ejsLayouts = require('express-ejs-layouts');
require('dotenv').config()
const { auth } = require('express-openid-connect');

//Route Requires
const indexRoute = require('./routes/signInRoute');


//Initialize Server
const app = express();
const port = 3000;
app.listen(port, ()=> console.log(`Port ${port} is running`));

// Initialize layouts and view engine
app.use(ejsLayouts);
app.set('view engine', 'ejs');

//Link Routes
// app.use('/',indexRoute);

//Enable static files
app.use(express.static('public'));

//Link DB
mongoose.connect("mongodb://localhost:27017/InvestBook", 
{
    useNewURLParser: true,
    useUnifiedTopology: true,
},
()=>{console.log("Connected to MongoDB")}
)


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000/',
  clientID: 'KVQcrfTFRIHKS4FJYMz8gXqLtUT8zCfW',
  issuerBaseURL: 'https://dev-tswrvacb.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.use('/',indexRoute);
