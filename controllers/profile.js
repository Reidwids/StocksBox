const finnhub = require('finnhub');
const Portfolio = require('../models/portfolios').Portfolio;
const Asset = require('../models/portfolios').Assets;

require('dotenv').config()


exports.getProfile = (req,res)=>{
    // console.log(req.user);
    // console.log(Asset.findById("622c2d43617720e8a4483f4d").assets)
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
        asset.save();
        portfolio.assets.push(asset._id);
    }
    portfolio.save()
    .then(() =>{
        req.user.portfolios.push(portfolio._id);
        req.user.save();
        // console.log('updated port: ', portfolio)
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

////code for finding property within a collection
// Asset.findById(asset.id).then((asset)=>{
//     console.log("assetName: ",asset.assetName);
// });
//Note that sometimes a then promise can stop an action from completing