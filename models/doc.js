var mongoose = require("mongoose");


var docSchema = new mongoose.Schema({
   username: String,
   password: String,
   name: String,
   image: String,
   description: String,
   testimonial: String,
   spec: String,
   star: String,
   street: String,
   location: String,
   adress: String,
   email: String,
   phone: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("doc", docSchema);