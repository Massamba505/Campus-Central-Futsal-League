const Team = require("../models/team.model");
const Player = require("../models/player.model");

const PlayerReg =  async (req, res) => {
    try {
        const { name, surname, teamId, goals, assists, photo } = req.body;
  
        if (!name || !teamId || !surname) {
            return res.status(400).json({ error: "name, surname and team ID are required." });
        }
  
        if(!photo){
          photo = `https://eu.ui-avatars.com/api/?name=${name}+${surname}&size=50`;
        }
  
        const fullname = `${name} ${surname}`;
  
        const player = new Player({ fullname, teamId, goals: goals || 0, assists: assists || 0, photo });
        await player.save();
        res.status(201).json({ error: "Player registered successfully", player });
    } catch (error) {
        res.status(500).json({ error: "Failed to register player", error });
    }
}

const TeamReg = async (req, res) => {
    try {
        const { name, logo } = req.body;
        
        if (!name || !logo) {
            return res.status(400).json({ error: "Name and logo are required." });
        }
        
        const team = new Team({ name, logo });
        await team.save();
        res.status(201).json({ error: "Team registered successfully", team });
    } catch (error) {
        res.status(500).json({ error: "Failed to register team", error });
    }
}

module.exports = {
    PlayerReg,
    TeamReg
}