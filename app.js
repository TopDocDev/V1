const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    // Doc         = require("./models/doc"),
    // Comment     = require("./models/comment"),
    // seedDB      = require("./seeds"),
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
//seedDB()

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

mongoose.connect('mongodb://louis:louis@cluster0-shard-00-00-bbdc4.mongodb.net:27017,cluster0-shard-00-01-bbdc4.mongodb.net:27017,cluster0-shard-00-02-bbdc4.mongodb.net:27017/TopDoc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true })  
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
const arztRoutes = require("./routes/arzt")

app.use("/", indexRoutes)
app.use("/docs", docRoutes)
app.use("/auth", authRoutes)
app.use("/arzt", arztRoutes)

var port = process.env.PORT || 3000;

// var privateKey = fs.readFileSync( 'privatekey.pem' );
// var certificate = fs.readFileSync( 'certificate.pem' );

// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(port);


app.listen(port, function () {
    console.log("Server Has Started!");
})