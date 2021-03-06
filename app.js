const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    // Doc         = require("./models/doc"),
    // Comment     = require("./models/comment"),
    Termin = require("./models/termin")
    seedDB      = require("./seeds"),
    // sql         = require("mssql"),
    // sequelize   = require("sequelize"),
    // moment      = require('moment'),
    // axios       = require("axios"),
    // async       = require("async"),
    passport    = require("passport")
    LocalStrategy = require("passport-local")
    bcrypt      = require("bcryptjs"),
    session = require('express-session'),
    flash = require('connect-flash')
    mail = require("./mail.js")
//seedDB()

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

const db = 'build'
mongoose.connect('mongodb://louis:louis@cluster0-shard-00-00-bbdc4.mongodb.net:27017,cluster0-shard-00-01-bbdc4.mongodb.net:27017,cluster0-shard-00-02-bbdc4.mongodb.net:27017/' + db + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true })  
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})

const docRoutes = require("./routes/docs")
const indexRoutes = require("./routes/index")
const authRoutes = require("./routes/auth")
const arztRoutes = require("./routes/arzt");
const termin = require("./models/termin.js");

app.use("/", indexRoutes)
app.use("/docs", docRoutes)
app.use("/auth", authRoutes)
app.use("/arzt", arztRoutes)

// setInterval(() => {
//     mail.updateSuccess()
//     mail.updateFailure() 
// }, 3000)
setInterval(() => {
    mail.updateSuccess()
    mail.updateFailure()
}, 3000)



var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
})