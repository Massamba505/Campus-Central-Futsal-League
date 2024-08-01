const express = require('express');
const { TeamReg, PlayerReg } = require('../controllers/register.controller');
const router = express.Router();
const upload = require('../middleware/upload');
const protect  = require("../middleware/protect");
// Register a new team
router.post("/team",protect,upload.single('logo'),TeamReg);

router.get("/admin.html",protect,upload.single('logo'),TeamReg);

// Register a new player
router.post("/player",protect,upload.single('photo'),PlayerReg);


module.exports = router;
