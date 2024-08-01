const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    teamId: {
        type: mongoose.Types.ObjectId,
        ref: "Team",
        required: true
    },
    goals: {
        type: Number,
        default: 0
    },
    assists: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Player", PlayerSchema);