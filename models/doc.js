var mongoose = require("mongoose");

var docSchema = new mongoose.Schema({
   username: String,
   password: String,
   name: String,
   image: String,
   description: String,
   spec: String,
   star: String,
   rating: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("doc", docSchema);