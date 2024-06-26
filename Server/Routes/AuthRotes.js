const express = require('express');
const { signUp,login,verifyToken,logout } = require('../Controllers/AuthController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login',login);
router.post('/authorize',verifyToken);
router.get('/logout',logout);
module.exports = router;
