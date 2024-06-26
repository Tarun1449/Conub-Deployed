const express = require('express');
const { Authorize } = require('../Middlewear/Token');
const { search, addFriend,getFriends } = require("../Controllers/UserController");

const router = express.Router();

router.post("/search", Authorize, search);
router.post("/addfriend",Authorize,addFriend);
router.get("/friends",Authorize,getFriends);
module.exports = router; // Export the router directly, not as part of an object
