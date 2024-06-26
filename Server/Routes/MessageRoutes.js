const express = require('express');

const {getMessages} = require('../Controllers/MessageController');
const { Authorize } = require('../Middlewear/Token');
const router = express.Router();

router.post('/getmessages',Authorize,getMessages)

module.exports = router;
