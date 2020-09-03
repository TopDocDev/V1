const router  = require("express").Router()
const custom = require("../functions/custom")
const Termin = require("../models/termin.js")
const moment = require("moment")

router.get("/calendar", (req, res) => {
    Termin.find({}, (err, result) => {
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
            type: "free"
        }, (err, result) => {
            if(err){
                console.log(err)
            } else {
                console.log(result)
            }
        })
    }
    deleteWeek()
    const weekArray = JSON.parse(req.body.params.week)
    const orangeArray = weekArray.map(custom.makeOrange)
    for (let i = 0; i < orangeArray.length; i++) {
        const e = orangeArray[i];
        Termin.create(e)  
    }
    
})



module.exports = router

