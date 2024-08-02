const express = require('express');
const { top_goals_players, top_assists_players, getAllPlayers, getAllTeams, editPlayer, addMatch, getFixture, getStandings, changeStandings, details, currentMatch, editMatchScore } = require('../controllers/features.controller');
const router = express.Router();

router.get("/top-goals-players",top_goals_players);

router.get("/top-assists-players",top_assists_players);

router.get("/allPlayers",getAllPlayers);

router.get("/allTeams",getAllTeams);

router.get("/fixture",getFixture);

router.get("/standings",getStandings);

router.get("/details",details);

router.get("/current-match",currentMatch);

router.put("/changinstandings",changeStandings);

router.post("/editplayer",editPlayer);

router.post("/addMatches",addMatch);

router.post("/editMatchScore/:id",editMatchScore);


module.exports = router;
