var mongoose = require("mongoose");
var doc = require("./models/doc");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Dr. Oliver Ph. Kreyden",
        image: "data:image/jpeg;base64,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",
        description: "Die Praxisklinik Kreyden ist eine spezialisierte Hautarztpraxis in Muttenz bei Basel und deckt sämtliche Teilgebiete der klassischen und ästhetischen Dermatologie (Laser, Botox, Filler, Peeling) ab. Hierzu gehört neben der ästhetischen Dermatologie auch die Behandlung des übermässigen Schwitzens (Hyperhidrose) sowie die plastisch rekonstruktive Chirurgie bei Tumorerkrankungen. Dr. Oliver Ph. Kreyden ist Pionier auf dem Gebiet der Hyperhidrose und ein international anerkannter Experte im grossen Feld der ästhetischen Dermatologie.",
        spec: "Dermatologie",
        star: "5.0",
        rating: "966"
    },     /*
    {
        name: "Dr. Céline Folly",
        image: "images\\folly.jpeg",
        description: "Die Praxisklinik Kreyden ist eine spezialisierte Hautarztpraxis in Muttenz bei Basel und deckt sämtliche Teilgebiete der klassischen und ästhetischen Dermatologie (Laser, Botox, Filler, Peeling) ab. Hierzu gehört neben der ästhetischen Dermatologie auch die Behandlung des übermässigen Schwitzens (Hyperhidrose) sowie die plastisch rekonstruktive Chirurgie bei Tumorerkrankungen. Dr. Oliver Ph. Kreyden ist Pionier auf dem Gebiet der Hyperhidrose und ein international anerkannter Experte im grossen Feld der ästhetischen Dermatologie.",
        spec: "Dermatologie",
        star: "5.0",
        rating: "966"
    },
   
    {
        name: "Dr. Jasmine Parambia", 
        image: "https://images.docfinder.at/vl0vay6wgW/dr-jasmin-darabnia-praktische-aerztin-1010-wien-54267.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Gynäkologie",
        star: "4.7",
        rating: "852",
    },
    {
        name: "Dr. Florent Ratatouille", 
        image: "https://www.aerzteversicherung.de/site/daev/get/params_Dattachment/6523216/Berufshaftpflicht-Arzt_mob.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Gastroenterologie",
        star: "4.2",
        rating: "1582",
    },
    {
        name: "Dr. Ilo Probst", 
        image: "https://image.stern.de/7508798/16x9-940-529/ef6b6936d4f0cfe72591b4c2394bb4ce/uN/guter-arzt-tipps.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Neonatologie",
        star: "5.0",
        rating: "201"
    },
    {
        name: "Dr. Areva Gonzalez", 
        image: "https://previews.123rf.com/images/chagin/chagin1611/chagin161100047/69687005-portr%C3%A4t-von-gl%C3%BCcklich-erfolgreiche-%C3%84rztin.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Gastroenterologie",
        star: "4.9",
        rating: "767",
    },
    {
        name: "Dr. Areva Gonzalez", 
        image: "https://previews.123rf.com/images/chagin/chagin1611/chagin161100047/69687005-portr%C3%A4t-von-gl%C3%BCcklich-erfolgreiche-%C3%84rztin.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Gastroenterologie",
        star: "4.9",
        rating: "767",
    },
    {
        name: "Dr. Areva Gonzalez", 
        image: "https://previews.123rf.com/images/chagin/chagin1611/chagin161100047/69687005-portr%C3%A4t-von-gl%C3%BCcklich-erfolgreiche-%C3%84rztin.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Gastroenterologie",
        star: "4.9",
        rating: "767",
    },
    {
        name: "Dr. Areva Gonzalez", 
        image: "https://previews.123rf.com/images/chagin/chagin1611/chagin161100047/69687005-portr%C3%A4t-von-gl%C3%BCcklich-erfolgreiche-%C3%84rztin.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        spec: "Gastroenterologie",
        star: "4.9",
        rating: "767",
    },*/
]

function seedDB(){

   doc.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed docs!");
 
        data.forEach(function(seed){
            doc.create(seed, function(err, doc){
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
seedDB

module.exports = seedDB;
