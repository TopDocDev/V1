var mongoose = require("mongoose")

var terminSchema = new mongoose.Schema({
    arzt: String,
    name: String,
    start: Date,
    end: Date,
    duration: Number,
    color: String,
    startFormated: String,
    dateFormated: String,
    user: String,
    type: String
})

module.exports = mongoose.model("termin", terminSchema)