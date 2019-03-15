let mongoose = require("mongoose");

// Country Schema
let countrySchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

let Country = module.exports = mongoose.model("Country", countrySchema);