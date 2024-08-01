const express = require('express');
const { top_goals_players, top_assists_players } = require('../controllers/features.controller');
const router = express.Router();

// top goals players
router.post("/top-goals-players",top_goals_players);

// top assists players
router.post("/top-assists-players",top_assists_players);


module.exports = router;
