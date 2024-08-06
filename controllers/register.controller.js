const Team = require("../models/team.model");
const Player = require("../models/player.model");

const PlayerReg =  async (req, res) => {
    try {
        const { name, surname, teamId } = req.body;
        let photo = req.file ? req.file.path : null;
  
        if (!name || !teamId || !surname) {
            return res.status(400).json({ error: "name, surname and team ID are required." });
        }
  
        if(!photo){
            photo = `public/uploads/dummy.jpg`;
        }

        const myTeam = await Team.findOne({name:teamId});
        if (!myTeam) {
            return res.status(400).json({ error: "Invalid Team" });
        }
  
        const fullname = `${name} ${surname}`;

        const dubFullName = Player.findOne({fullname});

        // if(dubFullName){
        //     return res.status(400).json({ error: "full name exists" });
        // } // need to do better
  
        const player = new Player({ fullname, teamId:myTeam._id, photo });
        await player.save();
        
        res.status(201).json({ error: "Player registered successfully", player });
    } catch (error) {
        res.status(500).json({ error: "Failed to register player", error });
    }
}

const TeamReg = async (req, res) => {
    try {
        const { name } = req.body;
        const logo = req.file ? req.file.path : null;

        if (!name || !logo) {
            return res.status(400).json({ error: "Name and logo are required." });
        }

        const team = new Team({ name, logo });
        await team.save();
        
        res.status(201).json({ message: "Team registered successfully", team });
    } catch (error) {
        res.status(500).json({ error: "Failed to register team", error });
    }
};


module.exports = {
    PlayerReg,
    TeamReg
}