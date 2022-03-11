const finnhub = require('finnhub');
const Portfolio = require('../models/portfolios');
require('dotenv').config()


exports.getProfile = (req,res)=>{
    res.render('profile/profile');
}
exports.getCreatePortfolio = (req,res)=>{
    res.render('profile/addPortfolio');
}
exports.postCreatePortfolio = (req,res)=>{
    let portfolio = new Portfolio(req.body); 
    portfolio.save()
    .then(() =>{
        req.user.portfolios = portfolio.id
        res.redirect("/profile");
    })
    .catch((err)=>{
        console.log(err);
        res.send('error')
    })  
    res.render('profile/addPortfolio');
}
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = process.env.FINNHUB_KEY
// const finnhubClient = new finnhub.DefaultApi()
// finnhubClient.quote("FB", (error, data, response) => {
//   console.log(data.c)
// });
