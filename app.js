const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    doc         = require("./models/doc"),
    Comment     = require("./models/comment"),
    week        = require("./models/week"),
    terminGebucht = require("./models/terminGebucht"),
    seedDB      = require("./seeds"),
    sql         = require("mssql"),
    sequelize   = require("sequelize"),
    moment      = require('moment'),
    axios       = require("axios"),
    async       = require("async"),
    User        = require("./models/user"),
    passport    = require("passport")
    LocalStrategy = require("passport-local")
    bcrypt      = require("bcryptjs")


require('./config/passport')(passport)

    // passport-local = require("passport-local"),
    // passport-local-mongoose = require("passport-local-mongoose")
const custom = require("./functions/custom")

// session herecy
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
	secret:'happy dog',
	saveUninitialized: true,
	resave: true
}));

app.use(flash())
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next();
  });

app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//mongodb+srv://louis:<password>@cluster0-bbdc4.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect("mongodb+srv://louis:louis@cluster0-bbdc4.mongodb.net/TopDoc?retryWrites=true&w=majority", {useNewUrlParser: true,  useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))

//seedDB();

//ROUTES

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
                    startFormated: e.startFormated,
                    status: e.status
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
    week.findById(req.params.id).exec(function(err, result){
        if(err){
            console.log(err)
        } else {
            res.render("docs/buchung", {termin: result})
        }
    })
})

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
        })
       }
   })
})

// Authentication

app.get("/register", function(req, res){
    res.render("register")
})

app.post('/register', (req, res) => {
    const { vorname, nachname, username, handy, password, password2} = req.body
    let errors = []
    if (!vorname || !nachname || !username || !handy || !password || !password2) {
      errors.push({ msg: 'Bitte füllen Sie alle Felder aus' });
    }  
    if (password != password2) {
      errors.push({ msg: 'Passwörter sind nicht gleich' });
    }  
    if (password.length < 6) {
      errors.push({ msg: 'Passwort muss mindestens 6 Zeichen lang sein!' });
    }  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        vorname,
        nachname,
        username,
        handy,
        password,
        password2
      })
    } else {
      User.findOne({ username: username }).then(user => {
        if (user) {
          errors.push({ msg: 'Email wird bereits verwendet!' });
          console.log(errors)
          res.render('register', {
            errors: errors,
            vorname,
            nachname,
            username,
            handy,
            password,
            password2
          })
        } else {
          const newUser = new User({
            vorname,
            nachname,
            username,
            handy,
            password
          })


          console.log(newUser)
          
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                    res.render('register', {success: "Erfolgreich registriert!!!", errors: errors})
                })
                .catch(err => console.log(err));
            })
        })
      }
    })
  }
})

app.post('/buchung/:id/register', (req, res) => {
    week.findById(req.params.id,  function(err, termin){
        const { vorname, nachname, username, handy, password, password2} = req.body
        let errors = []
        if (!vorname || !nachname || !username || !handy || !password ) {
          errors.push({ msg: 'Bitte füllen Sie alle Felder aus' });
        }  
        if (password.length < 6) {
          errors.push({ msg: 'Passwort muss mindestens 6 Zeichen lang sein!' });
        }  
        if (errors.length > 0) {
          res.render('docs/buchung', {
            termin,
            errors,
            vorname,
            nachname,
            username,
            handy,
            password,
          })
        } else {
          User.findOne({ username: username }).then(user => {
            if (user) {
              errors.push({ msg: 'Email wird bereits verwendet!' })
              res.render('docs/buchung', {
                termin,
                errors,
                vorname,
                nachname,
                username,
                handy,
                password,
              })
            } else {
              const newUser = new User({
                vorname,
                nachname,
                username,
                handy,
                password
              })
              //console.log(newUser)  
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                        req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                        )
                        res.redirect('/buchung/' + req.params.id)
                        custom.saveDate(termin.id)
                    })
                    .catch(err => console.log(err))
                })
            })
          }
        })
      }
    })
})


// const id = "5f26acdac412ed33a85e1bf0"





//handling user sign up
// app.post("/register", function(req, res){
//     console.log(req.body)
//     User.register(new User(
//         {
//         vorname: req.body.vorname,
//         nachname: req.body.nachname,
//         username: req.body.username,
//         handy: req.body.handy,
//         }
//     ), req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render('register', {err: err});
//         }
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/secret");
//         })
//     })
// })

app.get("/login", (req, res) => res.render("login"))

app.post('/buchung/:id/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/buchung/' + req.params.id,
      successFlash: 'Welcome!',
      failureRedirect: '/buchung/' + req.params.id,
      failureFlash: true
    })
    (req, res, next);
})

// app.post('/buchung/:id/login', (req, res) => {
//     week.findById(req.params.id,  function(err, termin){
//         passport.authenticate('local', { failureRedirect: '/login' }),
//         function(req, res) {
//             res.render('docs/buchung', {
//                 termin
//             })
//         }
//     })
// })

// app.post('/buchung/:id/login', (req, res) => {
//     week.findById(req.params.id, (err, termin) => {
//         passport.authenticate('local'),
//         function(req, res){
//             res.render("landing")
//         } 
//         // {
//         //     successRedirect: res.render("docs/buchung", {
//         //         termin: termin,
//         //         loginSuccess: "Termin erfolgreich gebucht!"
//         //     }),
//         //     failureRedirect: res.render("docs/buchung", {
//         //         termin: termin,
//         //         loginError: "kein Erfolg!"
//         //     })
//         // }
//     })
// })

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
})