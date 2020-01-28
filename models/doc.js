var mongoose = require("mongoose");

var docSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   spec: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("doc", docSchema);