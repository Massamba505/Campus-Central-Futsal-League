const Player = require("../models/player.model");
const Team = require("../models/team.model");

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

const getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().populate('teamId', 'name logo');
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve players", error });
    }
};

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({});
        res.status(200).json(teams);
    } catch (error) {
        console.log("errorr:",error);
        res.status(500).json({ error: "Failed to retrieve teams" });
    }
};

const editPlayer = async (req, res) => {
    try {
        // Extract player details from request body
        const { fullname, goals, assists } = req.body;

        // Validate required fields
        if (!fullname || !goals || !assists) {
            return res.status(400).json({ error: "All fields (fullname, goals, assists) are required." });
        }

        // Convert goals and assists to integers and check if they are valid numbers
        const parsedGoals = parseInt(goals, 10);
        const parsedAssists = parseInt(assists, 10);

        if (isNaN(parsedGoals) || isNaN(parsedAssists)) {
            return res.status(400).json({ error: "Goals and assists must be valid numbers." });
        }

        // Find the player by fullname
        const player = await Player.findOne({ fullname });

        if (!player) {
            return res.status(404).json({ error: 'Player not found.' });
        }

        // Update player stats
        player.goals = parsedGoals;
        player.assists = parsedAssists;
        await player.save();

        // Respond with success message
        res.status(200).json({ message: 'Player stats updated successfully.' });
    } catch (error) {
        // Log error for debugging and respond with a generic error message
        console.error('Error updating player stats:', error);
        res.status(500).json({ error: 'An error occurred while updating player stats.', details: error.message });
    }
};


module.exports = {
    top_goals_players,
    top_assists_players,
    getAllTeams,
    getAllPlayers,
    editPlayer
}
