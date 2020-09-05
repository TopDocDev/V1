var mongoose = require("mongoose")

var terminSchema = new mongoose.Schema({
    name: String,
    start: Date,
    end: Date,
    duration: Number,
    open: Boolean,
    toDb: Boolean,
    color: String,
    startFormated: String,
    dateFormated: String,
    status: String,
    user: String,
    type: String
})

module.exports = mongoose.model("termin", terminSchema)