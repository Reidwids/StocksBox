const express = require('express');
const ctrl = require('../controllers/SignInCtrl');
const router = express.Router();

router.get('/',ctrl.index_get);

module.exports = router;