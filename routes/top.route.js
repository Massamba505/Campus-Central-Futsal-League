const express = require('express');
const { top_goals_players, top_assists_players, getAllPlayers, getAllTeams, editPlayer } = require('../controllers/features.controller');
const router = express.Router();

router.get("/top-goals-players",top_goals_players);

router.get("/top-assists-players",top_assists_players);

router.get("/allPlayers",getAllPlayers);

router.get("/allTeams",getAllTeams);
router.post("/editplayer",editPlayer);


module.exports = router;
