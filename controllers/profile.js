function getProfile(req,res){
    res.render('profile/profile');
}
function getCreatePortfolio(req,res){
    res.render('profile/addPortfolio');
}
module.exports = {
    getProfile,
    getCreatePortfolio,
}
