const Player = require("../models/player.model");

const top_assists_players = async (req, res) => {
    try {
        const topPlayers = await Player.find().sort({ assists: -1 }).populate('teamId', 'name logo');
        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve top assist players", error });
    }
};

const top_goals_players = async (req, res) => {
    try {
        const topPlayers = await Player.find().sort({ goals: -1 }).populate('teamId', 'name logo');
        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve top goal-scoring players", error });
    }
};

module.exports = {
    top_goals_players,
    top_assists_players
}
