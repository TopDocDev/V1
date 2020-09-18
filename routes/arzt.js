const router = require("express").Router()
const moment = require("moment")
const passport = require('passport')

const custom = require("../functions/custom")
const Termin = require("../models/termin.js")
const Doc = require("../models/doc.js")
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

router.get("/login", forwardAuthenticated, (req, res) => res.render("arzt/login"))

router.post("/login", (req, res, next) => {
    console.log(req.body)
    require('../config/doc-passport')(passport)
    passport.authenticate('docLocal', {
        successRedirect: '/arzt/calendar',
        failureRedirect: '/arzt/login',
        badRequestMessage: 'Nutzer und Passwort stimmen nicht überein',
        failureFlash: true
    })(req, res, next);
})


router.get("/calendar", ensureAuthenticated, (req, res) => {
    Termin.find({}, (err, result) => {
        const momentified = result.map((e,i,a) => {
            return {
                name: e.name,
                start: moment(e.start).format("YYYY-MM-DD HH:mm"),
                end: moment(e.end).format("YYYY-MM-DD HH:mm"),
                duration: e.duration,
                color: e.color,
                startFormated: e.startFormated,
                type: e.type
            }
        })
        res.render("arzt/calendar", {data: JSON.stringify(momentified)})
    })
})

router.post("/calendar", (req, res) => {
    deleteWeek = () => {
        const weekStart = moment(req.body.params.now).startOf("week").toISOString()
        const weekEnd = moment(req.body.params.now).endOf("week").toISOString()
        Termin.deleteMany({
            start: {
                $gte: weekStart,
                $lte: weekEnd
            },
            type: "unbooked"
        }, (err, result) => {
            if(err){
                console.log(err)
            } else {
                console.log("Previous week deleted!")
            }
        })
    }
    deleteWeek()
    const weekArray = JSON.parse(req.body.params.week)
    const orangeArray = weekArray.map(custom.makeOrange)
    for (let i = 0; i < orangeArray.length; i++) {
        const e = orangeArray[i];
        Termin.create(e)  
        console.log(e.start)
    }
    
})



module.exports = router

