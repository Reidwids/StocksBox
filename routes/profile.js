const router = require('express').Router();
const profileCtrl = require('../controllers/profile')
const isLoggedIn = require("../authConfig/isLoggedIn")
const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
  })
let upload = multer({ storage: storage });

router.get("/", isLoggedIn, profileCtrl.getProfileFromHome);
router.get("/profile", isLoggedIn, profileCtrl.getProfile);
router.get("/visitProfile", profileCtrl.getVisitProfile);
router.post("/searchResults", profileCtrl.postSearchResult);

router.get("/profile/addPortfolio", isLoggedIn, profileCtrl.getCreatePortfolio);
router.post("/profile/addPortfolio", isLoggedIn, profileCtrl.postCreatePortfolio);
router.get("/profile/editPortfolio", isLoggedIn, profileCtrl.getEditPortfolio);
router.put("/profile/updatePortfolio", isLoggedIn, profileCtrl.putUpdatePortfolio);
router.get("/profile/deletePortfolioKeepGains", isLoggedIn, profileCtrl.getDeletePortfolioKeepGains);
router.get("/profile/deletePortfolioRemoveGains", isLoggedIn, profileCtrl.getDeletePortfolioRemoveGains);

router.get('/profile/editUser', isLoggedIn, profileCtrl.getEditUser);
router.put('/profile/updateUser', isLoggedIn, upload.single('image'), profileCtrl.putUpdateUser);
router.get('/profile/deleteUser', isLoggedIn, profileCtrl.getDeleteUser);

router.get("/leaderboard",  profileCtrl.getLeaderboard);
module.exports = router;