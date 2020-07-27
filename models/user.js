var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    vorname: String,
    nachname: String,
    username: String,
    password: String,
    handy: Number
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);