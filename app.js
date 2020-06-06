var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    doc         = require("./models/doc"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    sql         = require("mssql"),
    sequelize   = require("sequelize"),
    dayjs       = require("dayjs")
    moment      = require('moment');


moment().format();
mongoose.connect("mongodb://localhost/Doc"); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
 seedDB();



function makeSchedule(){
    for(start = moment("08:00", "HH:mm"); start < moment("12:00", "HH:mm"); start += 1200000){
        let s = moment(start).format("HHmm")
        let end = moment(start).add(1200000).format("HHmm");
        // let show =  s + "-" + end;
        let text = ""
        text += "<div class='session session-1 track-5' style='grid-column: track-5; grid-row: time-" + s + " / time-" + end + ";'> \n <h3 class='session-title'><a href='#'>Sprechstunde</a></h3> \n <span class='session-time'>" + s + "-" + end + "</span> \n </div>"
        console.log(text);
    };
};


var sampleDb = new sequelize(
    'SampleDb', 'louis', 'password', {
  host: 'localhost',
  dialect: 'mssql',
  port: 1433,
  logging: false,
});

var User = sampleDb.define("user", {
    firstName: sequelize.STRING,
    lastName: sequelize.STRING,

});


var dbConfig = {  
    server: 'localhost', 
    database: "v21db",
    authentication: {
        type: 'default',
        options: {
            userName: 'louis', 
            password: 'password'  
        }
    },
}; 

// connect to mssql database

function getDb(req, res) {
    var conn = new sql.ConnectionPool(dbConfig);  // create sql instance
    var req = new sql.Request(conn);
    conn.connect(function (err){
        if (err) {
            console.log(err);
            return;
        }
        req.query("select top 4 TT_DATEIN from v21db.dbo.Tabelle1$", function (err, myobject){
            if(err){
                console.log(err);
            } else {
                doc.find({}, function(err, allDocs){
                    if(err){
                        console.log(err);
                    } else {
                       res.render("docs/index4",{
                           doc : JSON.stringify(allDocs),
                           data: myobject
                        })
                    }
                 });
                //res.send(employees);
                


            }
            conn.close();
        });
    });
}



//ROUTES


app.get("/", function(req, res){
    res.render("landing");
});
//INDEX
app.get("/docs", function(req, res){

    getDb(req, res);
});

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


app.get("/docs/new", function(req, res){
   res.render("docs/new"); 
});


app.get("/docs/:id", function(req, res){
    doc.findById(req.params.id).populate("comments").exec(function(err, foundDoc){
        if(err){
            console.log(err);
        } else {
            console.log(foundDoc)
            res.render("docs/show2", {doc: foundDoc});
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

// Arztbereich

app.get("/buchung", function(req, res){
    res.render("buchung");
});

app.get("/arztbereich/arzt", function(req, res){
    res.render("arztbereich/arzt");
});

app.get("/arztbereich/scheduleInput", function(req, res){
    res.render("arztbereich/scheduleInput");
});



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

});