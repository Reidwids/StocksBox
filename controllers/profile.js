const User = require('../models/user');
const Portfolio = require('../models/portfolios').Portfolios;
const Asset = require('../models/portfolios').Assets;

const finnhub = require('finnhub');
const { findById } = require('../models/user');
require('dotenv').config();
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_KEY;
const finnhubClient = new finnhub.DefaultApi();

exports.getProfile = async (req,res)=>{
    let user = await User.findById(req.user.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
          path: 'assets',
          model: 'Assets'
        }
    })
    await updateUserGains(user);
    user = await User.findById(req.user.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
          path: 'assets',
          model: 'Assets'
        }
    })
    res.render('profile/profile', {user: user});
}
exports.getCreatePortfolio = (req,res)=>{
    res.render('profile/addPortfolio');
}
exports.postCreatePortfolio = async (req,res)=>{
    let portfolio = new Portfolio(req.body); 
    let currentGain = 0;
    for (let i=0;i<req.body.typeOfAsset.length;i++){
        let asset = new Asset()
        if (req.body.typeOfAsset.length===1){
            asset.assetName = req.body.assetName;
            asset.priceObtained = req.body.priceObtained;
            asset.typeOfAsset = req.body.typeOfAsset;
            asset.qtyOwned = req.body.qtyOwned;

        }
        else{
            asset.assetName = req.body.assetName[i];
            asset.priceObtained = req.body.priceObtained[i];
            asset.typeOfAsset = req.body.typeOfAsset[i];
            asset.qtyOwned = req.body.qtyOwned[i];
        }
        let data = await getQuote(asset.assetName)
        asset.assetGain = data*asset.qtyOwned-asset.priceObtained*asset.qtyOwned;
        currentGain += asset.assetGain;
        asset.save();
        portfolio.assets.push(asset._id);
    }
    portfolio.gainsHist.push(currentGain);
    portfolio.save()
    .then(() =>{
        if (!req.user.userGainsHist[0]){
            req.user.userGainsHist.push(portfolio.currentGain)
        }
        else {
            req.user.userGainsHist.push(portfolio.currentGain+req.user.userGainsHist[req.user.userGainsHist-1])
        }
        req.user.portfolios.push(portfolio._id);
        req.user.save();
        res.redirect("/profile");
    })
    .catch((err)=>{
        console.log(err);
        res.send('error')
    })
}


// Functions
async function getQuote(ticker){
    let quote = await new Promise((resolve, reject)=>{
        finnhubClient.quote(ticker, (error, data, response) => {
        resolve(data.c)
        });
    });
    return quote;
}

async function updateUserGains(user){
    let gainDiff = 0;
    let totalUserDiff;
    for (let portfolio of user.portfolios){
        let currentGain = 0;
        for (let asset of portfolio.assets){
            let data = await getQuote(asset.assetName);
            await Asset.findByIdAndUpdate(asset.id, {assetGain: data-asset.priceObtained});
            currentGain += asset.assetGain;
        }
        gainDiff += currentGain-portfolio.gainsHist[portfolio.gainsHist.length-1]
        await Portfolio.findByIdAndUpdate(portfolio.id, {$push: {gainsHist: currentGain}});
    }
    if (user.userGainsHist[0]){
        let totalUserDiff =  user.userGainsHist[user.userGainsHist.length-1]+gainDiff
        await User.findByIdAndUpdate(user.id, {$push: {userGainsHist: totalUserDiff}});
    }
    // console.log("UserID: ", user.id)
    // console.log("userGainsHist: ", user.userGainsHist)
    // console.log("totalUserDiff: ", totalUserDiff)
}


////code for finding property within a collection
// Asset.findById(asset.id).then((asset)=>{
//     console.log("assetName: ",asset.assetName);
// });
//Note that sometimes a then promise can stop an action from completing

//EJS for assets presentation
//        <% assets.forEach(x=>{
    // if (x.length>3){ %>
                    
    //     <% } else { %>

    //     <% }})%>