var express = require('express');
const { TeamReg, PlayerReg } = require('../controllers/register.controller');
var router = express.Router();

// Register a new team
router.post("/team",TeamReg);

// Register a new player
router.post("/player",PlayerReg);


module.exports = router;
