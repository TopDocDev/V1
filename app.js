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
    async       = require("async"),
    User        = require("./models/user"),
    passport    = require("passport")
    // passport-local = require("passport-local"),
    // passport-local-mongoose = require("passport-local-mongoose")
const custom = require("./functions/custom");
// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


mongoose.connect("mongodb+srv://louis:louis@cluster0-bbdc4.mongodb.net/TopDoc?retryWrites=true&w=majority", {useNewUrlParser: true,  useUnifiedTopology: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//seedDB();

//ROUTES
app.post("/login", function(req, res){
    console.log(req.body)
})

app.get("/", (req, res) => res.render("landing"))

app.get("/calendar", (req, res) => {
    custom.getDb()
    .then((data) => {
        week.find({}, (err, result) => {
            const momentified = result.map((e,i,a) => {
                return {
                    name: e.name,
                    start: moment(e.start).format("YYYY-MM-DD HH:mm"),
                    end: moment(e.end).format("YYYY-MM-DD HH:mm"),
                    duration: e.duration,
                    open: e.open,
                    toDb: e.toDb,
                    color: e.color,
                    startFormated: e.startFormated
                }
            })
            res.render("calendar", {data: JSON.stringify(data.concat(momentified))})
        })
    })
})


app.post("/calendar", (req, res) => {
    deleteWeek = () => {
        const weekStart = moment(req.body.params.now).startOf("week").toISOString()
        const weekEnd = moment(req.body.params.now).endOf("week").toISOString()
        week.deleteMany({
            start: {
                $gte: weekStart,
                $lte: weekEnd
            }
        }, (err, result) => {
            if(err){
                console.log(err)
            } else {
                console.log(result)
            }
        })
        console.log(weekStart)
    }
    deleteWeek()
    const weekArray = JSON.parse(req.body.params.week)
    const orangeArray = weekArray.map(custom.makeOrange)
    for (let i = 0; i < orangeArray.length; i++) {
        const e = orangeArray[i];
        week.create(e)  
    }
    
})
//INDEX
/*
getDocs = () => {
    return new Promise((resolve, reject) => {
        doc.find({}, (err, allDocs) => {
            if(err){
                reject(err)
            } else {
                resolve(allDocs)
            }
        })

    })
}

findWeek = function(){
    const sub = week.find({}, (err, result) => {
        return result
    })
    return sub
}
//findWeek()
getWeeks = () => {
    return new Promise((resolve, reject) => {
        week.find({}, (err, result) => {
            if(err){
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
getDocs()
.then((data) => {
    return getWeeks()
})
.then((data) => {
    console.log(data)
})
.catch((err) => console.log(err))
*/

app.get("/docs", (req, res) => doc.find({}, function(err, allDocs){
    if(err){
        console.log(err)
    } else {
        week.find({}, function(err, allWeeks){
            if(err){
                console.log(err)
            } else {
                const sorted = allWeeks.sort(custom.sortByEnd)
                const data = custom.getFiveDays(sorted)
                res.render("docs/index",{
                    doc : JSON.stringify(allDocs),
                    data: JSON.stringify(data)
                })
            }
        })
    }
}))

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
            console.log(foundDoc)
            week.find({}, function(err, allWeeks){
                if(err){
                    console.log(err)
                } else {
                    const sorted = allWeeks.sort(custom.sortByEnd)
                    const data = custom.getFiveDays(sorted)
                    res.render("docs/show", {doc: JSON.stringify(foundDoc), data: JSON.stringify(data)}); 
                }
            })
        }
    })
})

app.get("/buchung/:id",function(req, res){
    console.log(req.params.id)
    week.findById(req.params.id).exec(function(err, result){
        if(err){
            console.log(err)
        } else {
            res.render("docs/buchung", {termin: result})
        }
    })
})

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
// register
app.get("/register", function(req, res){
    res.render("register"); 
 });
 //handling user sign up
 app.post("/register", function(req, res){
     console.log(req.body)
     User.register(new User(
            {
            vorname: req.body.vorname,
            nachname: req.body.nachname,
            username: req.body.username,
            handy: req.body.handy,
            }
        ), req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render('register');
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
         });
     });
 });

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");

})