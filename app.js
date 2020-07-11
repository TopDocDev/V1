const { format } = require("path");

const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    doc         = require("./models/doc"),
    Comment     = require("./models/comment"),
    week        = require("./models/week"),
    seedDB      = require("./seeds"),
    sql         = require("mssql"),
    sequelize   = require("sequelize"),
    moment      = require('moment'),
    axios       = require("axios"),
    async       = require("async")

const custom = require("./functions/custom")



mongoose.connect("mongodb+srv://louis:louis@cluster0-bbdc4.mongodb.net/TopDoc?retryWrites=true&w=majority", {useNewUrlParser: true,  useUnifiedTopology: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

//ROUTES
app.post("/login", function(req, res){
    console.log(req.body)
})

app.get("/", (req, res) => res.render("landing"))




app.post("/calendar", (req, res) => {
    const weekArray = JSON.parse(req.body.params.week)
    for (let i = 0; i < weekArray.length; i++) {
        const e = weekArray[i];
            week.create(e)  
    }
    console.log(weekArray)
})
//INDEX
app.get("/docs", (req, res) => doc.find({}, function(err, allDocs){
    if(err){
        console.log(err)
    } else {
        week.find({}, function(err, allWeeks){
            if(err){
                console.log(err)
            } else {
                const sorted = allWeeks.sort(function(a, b){
                    var x = a.end;
                    var y = b.end;
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                  })
                const data = JSON.stringify(custom.getFiveDays(sorted))
                res.render("docs/index",{
                    doc : JSON.stringify(allDocs),
                    data: data
                })
                //console.log(data)
            }
        })
    }
}))
try {
    doc.deleteMany( { "name" : "Dr. Jasmine Parambia" } );
 } catch (e) {
    print (e);
 }
//CREATE
app.post("/docs", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newDoc = {name: name, image: image, description: desc}

    doc.create(newDoc, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {

            res.redirect("/docs");
        }
    });
});


app.get("/docs/new", (req, res) => res.render("docs/new"))


app.get("/docs/:id", function(req, res){
    doc.findById(req.params.id).populate("comments").exec(function(err, foundDoc){
        if(err){
            console.log(err);
        } else {
            res.render("docs/show", {doc: JSON.stringify(foundDoc)});
        }
    });
});

/*
app.get("/docs/:id/signup", function(req, res){
    doc.findById(req.params.id).exec(function(err){
        if(err){
            console.log(err)
        } else {
            res.render("docs/signup");

        }
        

    }

});
*/

app.get("/docs/buchung", (req, res) => res.render("docs/buchung"))
app.get("/calendar", (req, res) => custom.getCalendar(req,res))

// ====================
// COMMENTS ROUTES
// ====================

app.get("/docs/:id/comments/new", function(req, res){
    doc.findById(req.params.id, function(err, doc){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {doc: doc});
        }
    });
});

app.post("/docs/:id/comments", function(req, res){
   doc.findById(req.params.id, function(err, doc){
       if(err){
           console.log(err);
           res.redirect("/docs");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               doc.comments.push(comment);
               doc.save();
               res.redirect('/docs/' + doc._id);
           }
        });
       }
   });

});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");

})