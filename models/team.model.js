const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    }
});


module.export =  mongoose.model("Team", TeamSchema);