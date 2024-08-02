const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    matchesPlayed: { 
        type: Number, 
        default: 0
    },
    wins: { 
        type: Number, 
        default: 0
    },
    draws: { 
        type: Number, 
        default: 0
    },
    losses: { 
        type: Number, 
        default: 0
    },
    goalsFor: { 
        type: Number, 
        default: 0
    },
    goalsAgainst: { 
        type: Number, 
        default: 0
    },
    goalDifference: { 
        type: Number, 
        default: 0
    },
    points: { 
        type: Number, 
        default: 0
    }
});

module.exports =  mongoose.model("Team", TeamSchema);