const router = require('express').Router();
const profileCtrl = require('../controllers/profile')
const isLoggedIn = require("../authConfig/isLoggedIn")

router.get("/", isLoggedIn, profileCtrl.getProfileFromHome);
router.get("/profile", isLoggedIn, profileCtrl.getProfile);
router.get("/profile/:id", profileCtrl.getVisitProfile);
router.get("/profile/addPortfolio", isLoggedIn, profileCtrl.getCreatePortfolio);
router.post("/profile/addPortfolio", isLoggedIn, profileCtrl.postCreatePortfolio);
router.get("/leaderboard",  profileCtrl.getLeaderboard);
module.exports = router;