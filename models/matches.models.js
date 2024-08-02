const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    fixture: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Fixture', 
        required: true 
    },
    homeGoals: { 
        type: Number,
        default: 0
    },
    awayGoals: { 
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Match', matchSchema);
