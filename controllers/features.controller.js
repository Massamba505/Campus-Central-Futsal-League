const Player = require("../models/player.model");
const Team = require("../models/team.model");
const Fixture = require("../models/fixture.model");
const Match = require("../models/matches.models");

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
        const { fullname, goals } = req.body;

        if (!fullname || !goals ) {
            return res.status(400).json({ error: "All fields (fullname, goals, assists) are required." });
        }

        const parsedGoals = parseInt(goals, 10);
        // const parsedAssists = parseInt(assists, 10);

        if (isNaN(parsedGoals)) {// || isNaN(parsedAssists)
            return res.status(400).json({ error: "Goals and assists must be valid numbers." });
        }

        const player = await Player.findOne({ fullname });

        if (!player) {
            return res.status(404).json({ error: 'Player not found.' });
        }

        player.goals = parsedGoals;
        // player.assists = parsedAssists;
        await player.save();

        res.status(200).json({ message: 'Player stats updated successfully.' });
    } catch (error) {
        console.error('Error updating player stats:', error);
        res.status(500).json({ error: 'An error occurred while updating player stats.', details: error.message });
    }
};

const moment = require('moment');

const addMatch = async (req, res) => {
    try {
        const { home, away, datetime, location } = req.body;
    
        if (!home || !away || !datetime || !location) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        if (home === away) {
            return res.status(400).json({ error: 'A team cannot play against itself' });
        }

        const homeTeam = await Team.findOne({ name: home });
        if (!homeTeam) {
            return res.status(400).json({ error: 'Home team does not exist' });
        }

        const awayTeam = await Team.findOne({ name: away });
        if (!awayTeam) {
            return res.status(400).json({ error: 'Away team does not exist' });
        }

        const matchDateTime = moment(datetime);

        if (!matchDateTime.isValid()) {
            return res.status(400).json({ error: 'Invalid datetime format. Use YYYY-MM-DDTHH:mm.' });
        }
  
        const newFixture = new Fixture({
            home: homeTeam._id,
            away: awayTeam._id,
            date: matchDateTime.toDate(),
            time: matchDateTime.format('HH:mm'),
            location,
        });
    
        await newFixture.save();

        const newMatch = new Match({
            fixture: newFixture._id,
        });
    
        await newMatch.save();
    
        res.status(201).json({ message: 'Match added successfully', match: newMatch });
    } catch (error) {
        console.error('Error in fixture', error);
        res.status(500).json({ error: 'Server error', error: error.message });
    }
};

const getFixture = async (req, res) => {
    try {
        const fixtures = await Fixture.aggregate([
            {
                $addFields: {
                    dateTime: {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                                    "T",
                                    "$time",
                                    ":00.000Z"
                                ]
                            }
                        }
                    }
                }
            },
            {
                $sort: { dateTime: 1 }
            }
        ]).lookup({
            from: 'teams',
            localField: 'home',
            foreignField: '_id',
            as: 'home'
        }).lookup({
            from: 'teams',
            localField: 'away',
            foreignField: '_id',
            as: 'away'
        }).unwind('home').unwind('away');
        
        res.status(200).json(fixtures);
    } catch (error) {
        console.error("Error retrieving fixtures:", error);
        res.status(500).json({ error: "Failed to retrieve fixtures" });
    }
};

const getStandings = async (req, res) => {
    try {
        const teams = await Team.find().sort({ points: -1, goalDifference: -1 });
        res.status(200).json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const changeStandings = async (req, res) => {
    try {
        const {name} = req.body;
        const team = await Team.findOne({name});
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const { wins, draws, losses, goalsFor, goalsAgainst } = req.body;

        team.matchesPlayed = Number(wins) + Number(draws) + Number(losses);
        team.wins = wins;
        team.draws = draws;
        team.losses = losses;
        team.goalsFor = goalsFor;
        team.goalsAgainst = goalsAgainst;
        team.goalDifference = Number(goalsFor) - Number(goalsAgainst);
        team.points = Number(wins) * 3 + Number(draws);

        const updatedTeam = await team.save();
        res.json({ success: true, team: updatedTeam });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const details = async (req, res) => {
    try {
        const name = req.query.name; // Retrieve team name from query params
        if (!name) {
            return res.status(400).json({ error: 'Team name is required' });
        }

        const team = await Team.findOne({ name });
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json({
            wins: team.wins,
            draws: team.draws,
            losses: team.losses,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst
        });
    } catch (error) {
        console.error('Error fetching team details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const currentMatch = async (req, res) => {
    try {
        // Fetch fixtures with populated teams
        const fixtures = await Fixture.aggregate([
            {
                $addFields: {
                    dateTime: {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                                    "T",
                                    "$time",
                                    ":00.000Z"
                                ]
                            }
                        }
                    }
                }
            },
            { $sort: { dateTime: 1 } }
        ]).lookup({
            from: 'teams',
            localField: 'home',
            foreignField: '_id',
            as: 'home'
        }).lookup({
            from: 'teams',
            localField: 'away',
            foreignField: '_id',
            as: 'away'
        }).unwind('home').unwind('away');

        if (!fixtures || fixtures.length === 0) {
            return res.status(404).json({ message: 'No fixtures found' });
        }

        let now = new Date();
        let currentTimeMilliseconds = now.getTime();

        const curr = [];

        for (let i = 0; i < fixtures.length; i++) {
            const fixture = fixtures[i];
            let fixtureTime = new Date(fixture.dateTime).getTime();
            
            if (currentTimeMilliseconds <= fixtureTime) {
                curr.push(fixture);
            }
        }

        if (curr.length === 0) {
            return res.status(404).json({ message: 'No upcoming matches found' });
        }

        // Assuming you want to get the first match in the current array
        const allMatch = await Match.findOne({ fixture: curr[0]._id }).populate({
            path: 'fixture',
            populate: [
                { path: 'home' },
                { path: 'away' }
            ]
        });

        if (!allMatch) {
            return res.status(404).json({ message: 'No match found' });
        }
        const all = [];
        all.push(allMatch);
        res.status(200).json(all);
    } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const editMatchScore = async (req, res) => {
    try {
      const matchId = req.params.id;
      const { homeGoals, awayGoals } = req.body;
  
      if (!homeGoals || !awayGoals) {
        return res.status(400).json({ error: 'Both homeGoals and awayGoals are required' });
      }

      const match = await Match.findByIdAndUpdate(
        matchId,
        { homeGoals, awayGoals }
      );
  
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
  
      res.status(200).json(match);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    top_goals_players,
    top_assists_players,
    getAllTeams,
    getAllPlayers,
    editPlayer,
    addMatch,
    getFixture,
    getStandings,
    changeStandings,
    details,
    currentMatch,
    editMatchScore
}
