const router = require('express').Router();
const {body} = require('express-validator');

// Import Authentication Controller
const authCntrl = require("../controllers/auth");

// Routes for Authentication
router.get("/auth/signUp", authCntrl.auth_signup_get);
router.post("/auth/signUp", [
    body('firstName').isLength({min : 5}).withMessage('First Name must be at least 5 chars long').notEmpty().withMessage('Firstname cannot be null'),
    body('lastName').isLength({min : 5}),
    body('emailAddress').isEmail(),
    body('password').isLength({min : 5})
] , authCntrl.auth_signup_post);

router.get("/auth/signIn", authCntrl.auth_signin_get);
router.post("/auth/signIn", authCntrl.auth_signin_post);
router.get("/auth/logout", authCntrl.auth_logout_get);

module.exports = router;

