const express = require('express');
const router = express.Router();
const rateLimit=require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 60 * 3 * 1000,
    max: 3
});

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', loginLimiter, userCtrl.login);

module.exports = router;