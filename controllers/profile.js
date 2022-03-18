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
    res.render('profile/visitProfile', {user, chartData: JSON.stringify(chartData)});
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
        let data = await getQuote(asset)
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
exports.getEditPortfolio = async (req,res)=>{
    let portfolio = await Portfolio.findById(req.query.id).populate('assets');
    res.render('profile/editPortfolio', {portfolio: portfolio});
}
exports.putUpdatePortfolio = async (req,res)=>{
    await Portfolio.findByIdAndUpdate(req.body.id, req.body);
    if (!Array.isArray(req.body.assetId)){
        await Asset.findByIdAndUpdate(req.body.assetId, req.body);
    }
    else{
        for (i=0;i<req.body.assetId.length;i++){
            await Asset.findByIdAndUpdate(req.body.assetId[i], {
                assetName: req.body.assetName[i],
                typeOfAsset: req.body.typeOfAsset[i],
                priceObtained: req.body.priceObtained[i],
                qtyOwned: req.body.qtyOwned[i],
            });
        }
    }
    let user = await User.findById(req.user.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
        path: 'assets',
        model: 'Assets'
        }
    });
    await updateUserGains(user);
    await updateUserGains(user);
    console.log(req.user);
    res.redirect('/profile')
}
exports.getDeletePortfolioRemoveGains = async (req,res)=>{
    let user = await User.findById(req.user.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
        path: 'assets',
        model: 'Assets'
        }
    });
    await updateUserGains(user);
    let portfolio = await Portfolio.findById(req.query.id).populate('assets');
    user.userGainsHist.push(user.userGainsHist[user.userGainsHist.length-1]-portfolio.gainsHist[portfolio.gainsHist.length-1])
    user.userGainsHistTimestamps.push(new Date().toISOString())
    for (let i=0; i<portfolio.assets.length;i++){
        await Asset.findByIdAndDelete(portfolio.assets[i].id);
    }
    await Portfolio.findByIdAndDelete(portfolio.id)
    await updateUserGains(user);
    res.redirect('/profile');
}
exports.getDeletePortfolioKeepGains = async (req,res)=>{
    let portfolio = await Portfolio.findById(req.query.id).populate('assets');
    for (let i=0; i<portfolio.assets.length;i++){
        await Asset.findByIdAndDelete(portfolio.assets[i].id);
    }
    await Portfolio.findByIdAndDelete(portfolio.id);
    res.redirect('/profile');
}
exports.getEditUser = async (req,res)=>{
    let user = await User.findById(req.user.id);
    res.render('profile/editUser', {user});
}
exports.putUpdateUser = async (req,res)=>{
    if (req.file){
        const imagPath = '/uploads/' + req.file.filename;
        await User.findByIdAndUpdate(req.user.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            preferredCurrency: req.body.preferredCurrency,
            bio: req.body.bio,
            image: imagPath,
        })
    }
    else {
        await User.findByIdAndUpdate(req.user.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            preferredCurrency: req.body.preferredCurrency,
            bio: req.body.bio,
        })
    }
    res.redirect('/profile');
}
exports.getDeleteUser = async (req,res)=>{
    user = await User.findById(req.user.id).populate({
        path: 'portfolios',
        model: 'Portfolios',
        populate: {
        path: 'assets',
        model: 'Assets'
        }
    })
    for (let i=0; i<user.length;i++){
        for (j=0; j<user.portfolios[i].length;j++){
            await Asset.findByIdAndDelete(user.portfolios[i].assets[j].id);
        }
        await Portfolio.findByIdAndDelete(user.portfolios[i].id);
    }
    await User.findByIdAndDelete(req.user.id);
    res.redirect('/profile');
}

exports.postSearchResult = async (req,res) =>{
    let query = new RegExp(req.body.searchFriend, "i");
    let matchingUsers = [];
    let allUsers = await User.find();
    allUsers.forEach(user=>{
        if (query.test(user.firstName)&&user.id!==req.user.id){
            matchingUsers.push(user);
        }
        else if(query.test(user.lastName)&&user.id!==req.user.id){
            matchingUsers.push(user)
        }
    })
    res.render('search/search', {matchingUsers: matchingUsers})
}
exports.getLeaderboard = async (req,res)=>{
    allUsers = await User.find();
    let allUserGains = [];
    for (i=0;i<allUsers.length;i++){
        let user = await User.findById(allUsers[i].id).populate({
            path: 'portfolios',
            model: 'Portfolios',
            populate: {
            path: 'assets',
            model: 'Assets'
            }
        })
        await updateUserGains(user);
        let tempArr = [];
        tempArr.push(user.firstName+" "+user.lastName)
        if (user.userGainsHist){
            tempArr.push(user.userGainsHist[user.userGainsHist.length-1])
        }
        else tempArr.push(0)

        if(user.portfolios[0]){
            tempArr.push(user.portfolios.sort(function compareFn(a, b){(b.gainsHist[b.gainsHist.length-1]-a.gainsHist[a.gainsHist.length-1])})[0].portfolioName);
        }
        else tempArr.push('No Portfolios');
        tempArr.push(user.id);
        allUserGains.push(tempArr);
    }
    allUserGains.sort((a,b)=>b[1]-a[1]);
    allUserGains = {users: allUserGains};
    res.render('leaderboard/leaderboard', {allUserGains: allUserGains})
}
// Functions
async function getQuote(asset){
    let ticker = asset.assetName;
    let quote;
    if (asset.typeOfAsset == "S"){
        quote = await new Promise((resolve, reject)=>{
            finnhubClient.quote(ticker, (error, data, response) => {
                resolve(data.c)
            });
        });
    }
    else {
        let temp = "BINANCE:USDT";
        let input = temp.slice(0,8)+ticker+temp.slice(8)
        let date = Math.round((new Date()).getTime()/1000);
        quote = await new Promise((resolve, reject)=>{
            finnhubClient.cryptoCandles(input, 1, date-100, date, (error, data, response) => {
                resolve(data.c[data.c.length-1]);
            });
        });
    }
    return quote;
}

async function updateUserGains(user){
    let gainDiff = 0;
    let totalUserDiff;
    for (let portfolio of user.portfolios){
        let currentGain = 0;
        for (let asset of portfolio.assets){
            let data = await getQuote(asset);
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