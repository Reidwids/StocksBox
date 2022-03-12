const finnhub = require('finnhub');
const Portfolio = require('../models/portfolios').Portfolio;
const Asset = require('../models/portfolios').Assets;
require('dotenv').config()


exports.getProfile = (req,res)=>{
    res.render('profile/profile');
}
exports.getCreatePortfolio = (req,res)=>{
    res.render('profile/addPortfolio');
}
exports.postCreatePortfolio = (req,res)=>{
    let portfolio = new Portfolio(req.body); 
    for (let i=0;i<req.body.typeOfAsset.length;i++){
        let asset = new Asset()
        if (req.body.typeOfAsset.length===1){
            asset.assetName = req.body.assetName;
            asset.priceObtained = req.body.priceObtained;
            asset.typeOfAsset = req.body.typeOfAsset;
        }
        else{
            asset.assetName = req.body.assetName[i];
            asset.priceObtained = req.body.priceObtained[i];
            asset.typeOfAsset = req.body.typeOfAsset[i];
        }
        console.log(asset);
        asset.save().then(()=>{
            //Work on getting asset ID to push to portfolio properly
            portfolio.assets.push(asset._id);
        }).catch((err)=>{
            console.log(err);
        })
    }
    portfolio.save()
    .then(() =>{
        // let asset = new Asset(req.body);
        // req.user.portfolios = portfolio.id
        res.redirect("/profile");
    })
    .catch((err)=>{
        console.log(err);
        res.send('error')
    })
}
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = process.env.FINNHUB_KEY
// const finnhubClient = new finnhub.DefaultApi()
// finnhubClient.quote("FB", (error, data, response) => {
//   console.log(data.c)
// });
