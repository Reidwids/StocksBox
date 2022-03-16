const User = require('../models/user');
const Portfolio = require('../models/portfolios').Portfolios;
const Asset = require('../models/portfolios').Assets;

const finnhub = require('finnhub');
const { findById } = require('../models/user');
let moment = require('moment');
require('dotenv').config();
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_KEY;
const finnhubClient = new finnhub.DefaultApi();

exports.getProfileFromHome = (req,res)=>{
    res.redirect('/profile')
}
exports.getVisitProfile = async (req,res)=>{
    let user = await User.findById(req.query.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
          path: 'assets',
          model: 'Assets'
        }
    });
    var dateLastUpdate = new Date(user.updatedAt); 
    var dateNow = Date.now()
    var timeSinceLastUpdate = dateNow-dateLastUpdate.getTime(); 
    if (timeSinceLastUpdate>1000*60*15){
        await updateUserGains(user);
        user = await User.findById(user.id).populate({
            path: 'portfolios',
            model: 'Portfolios',
            populate: {
            path: 'assets',
            model: 'Assets'
            }
        })
    }
    let chartData = [];
    if (user.userGainsHistTimestamps.length<10){
        for (let i=0;i<user.userGainsHist.length;i++){
            let tempArr = [];
            tempArr.push(moment(user.userGainsHistTimestamps[i]).format('D/M/YY/LT'));
            tempArr.push(user.userGainsHist[i]);
            chartData.push(tempArr);
        }
    }
    else {
        for (let i=user.userGainsHist.length-10;i<user.userGainsHist.length;i++){
            let tempArr = [];
            tempArr.push(moment(user.userGainsHistTimestamps[i]).format('D/M/YY/LT'));
            tempArr.push(user.userGainsHist[i]);
            chartData.push(tempArr);
        }
    }
    chartData = {
        data: chartData
    }
    res.render('profile/profile', {user, chartData: JSON.stringify(chartData)});
}
exports.getProfile = async (req,res)=>{
    let user = await User.findById(req.user.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
          path: 'assets',
          model: 'Assets'
        }
    });
    var dateLastUpdate = new Date(req.user.updatedAt); 
    var dateNow = Date.now()
    var timeSinceLastUpdate = dateNow-dateLastUpdate.getTime(); 
    if (timeSinceLastUpdate>1000*60*15){
        await updateUserGains(user);
        user = await User.findById(req.user.id).populate({
            path: 'portfolios',
            model: 'Portfolios',
            populate: {
            path: 'assets',
            model: 'Assets'
            }
        })
    }
    let chartData = [];
    if (user.userGainsHistTimestamps.length<10){
        for (let i=0;i<user.userGainsHist.length;i++){
            let tempArr = [];
            tempArr.push(moment(user.userGainsHistTimestamps[i]).format('D/M/YY/LT'));
            tempArr.push(user.userGainsHist[i]);
            chartData.push(tempArr);
        }
    }
    else {
        for (let i=user.userGainsHist.length-10;i<user.userGainsHist.length;i++){
            let tempArr = [];
            tempArr.push(moment(user.userGainsHistTimestamps[i]).format('D/M/YY/LT'));
            tempArr.push(user.userGainsHist[i]);
            chartData.push(tempArr);
        }
    }
    chartData = {
        data: chartData
    }
    res.render('profile/profile', {user, chartData: JSON.stringify(chartData)});
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
    await portfolio.save()

    portfolio.gainsHistTimestamps.push(portfolio.updatedAt);
    await portfolio.save();

    if (!req.user.userGainsHist[0]){
        req.user.userGainsHist.push(portfolio.gainsHist[0])
    }
    else {
        req.user.userGainsHist.push(portfolio.gainsHist[0]+req.user.userGainsHist[req.user.userGainsHist.length-1])
    }
    req.user.portfolios.push(portfolio._id);
    req.user.userGainsHistTimestamps.push(new Date().toISOString());
    await req.user.save();
    res.redirect("/profile");
}

exports.getLeaderboard = async (req,res)=>{
    allUsers = await User.find();
    for (let user of allUsers){
        user = await User.findById(user.id).populate({
            path: 'portfolios',
            model: 'Portfolios',
            populate: {
            path: 'assets',
            model: 'Assets'
            }
        })
        await updateUserGains(user);
    }

    let allUserGains = [];
    allUsers.forEach(user=>{
        allUserGains.push([user.firstName+" "+user.lastName, user.userGainsHist[user.userGainsHist.length-1]])
    })
    allUserGains.sort((a,b)=>b[1]-a[1]);
    allUserGains = {users: allUserGains};
    res.render('leaderboard/leaderboard', {allUserGains: allUserGains})
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
            await Asset.findByIdAndUpdate(asset.id, {assetGain: Math.round((data*asset.qtyOwned-asset.priceObtained*asset.qtyOwned)*100)/100});
            currentGain += asset.assetGain;
        }
        gainDiff += currentGain-portfolio.gainsHist[portfolio.gainsHist.length-1]
        await Portfolio.findByIdAndUpdate(portfolio.id, {$push: {gainsHist: Math.round((currentGain)*100)/100}});
        await Portfolio.findByIdAndUpdate(portfolio.id, {$push: {gainsHistTimestamps: new Date().toISOString()}});
    }
    if (user.userGainsHist[0]){
        let totalUserDiff =  user.userGainsHist[user.userGainsHist.length-1]+gainDiff
        await User.findByIdAndUpdate(user.id, {$push: {userGainsHist: Math.round((totalUserDiff*100)/100)}});
        await User.findByIdAndUpdate(user.id, {$push: {userGainsHistTimestamps: new Date().toISOString()}});
    }
}