const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  home: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  away: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  date: {
    type: Date, 
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: { 
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Fixture', fixtureSchema);
