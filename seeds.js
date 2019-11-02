var mongoose = require("mongoose");
var Doc = require("./models/doc");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Dr. Jasmine Parambia", 
        image: "https://images.docfinder.at/vl0vay6wgW/dr-jasmin-darabnia-praktische-aerztin-1010-wien-54267.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Dr. Florent Ratatouille", 
        image: "https://www.aerzteversicherung.de/site/daev/get/params_Dattachment/6523216/Berufshaftpflicht-Arzt_mob.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Dr. Ilo Probst", 
        image: "https://image.stern.de/7508798/16x9-940-529/ef6b6936d4f0cfe72591b4c2394bb4ce/uN/guter-arzt-tipps.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Dr. Areva Gonzalez", 
        image: "https://previews.123rf.com/images/chagin/chagin1611/chagin161100047/69687005-portr%C3%A4t-von-gl%C3%BCcklich-erfolgreiche-%C3%84rztin.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
]

function seedDB(){

   Doc.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed docs!");
 
        data.forEach(function(seed){
            Doc.create(seed, function(err, doc){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a doc");

                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                doc.comments.push(comment);
                                doc.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;
