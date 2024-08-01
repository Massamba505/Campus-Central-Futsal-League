const express = require("express");
const router = express.Router();

const {login, signup,logout, logined} = require("../controllers/auth.controller");

router.post("/login",login);
router.post("/logined",logined);
router.post("/signup",signup);
router.get("/logout",logout);

module.exports = router;