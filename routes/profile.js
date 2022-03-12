const router = require('express').Router();
const profileCtrl = require('../controllers/profile')
const isLoggedIn = require("../authConfig/isLoggedIn")

router.get("/", isLoggedIn, profileCtrl.getProfile);
router.get("/profile", isLoggedIn, profileCtrl.getProfile);
router.get("/profile/addPortfolio", isLoggedIn, profileCtrl.getCreatePortfolio);
router.post("/profile/addPortfolio", isLoggedIn, profileCtrl.postCreatePortfolio);

module.exports = router;