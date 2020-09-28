const Termin = require("./models/termin");
const User = require("./models/user");
nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
       user: 'inkognito.more1@gmail.com',
       pass: "wSac6EaK"
    }
})

module.exports.updateSuccess = () => {
    Termin.find({type: "accepted"}, (err, terminArr) => {
        for (let i = 0; i < 1; i++) {
            const t = terminArr[i];
            // send Mail
            User.findById(t.user, (err, foundUser) => {
                const message = {
                    from: 'elonmusk@tesla.com',
                    to: foundUser.username,
                    subject: 'Design Your Model S | Tesla', 
                    text: 'Have the most fun you can in a car. Get your Tesla today!'
                }
                transport.sendMail(message, function(err, info) {
                    if (err) {
                    console.log(err)
                    } else {
                    console.log(info);
                    }
                });
            })
            // update MongoDb
            Termin.findOneAndUpdate({id: t.id}, {type: "confirmed"}, {useFindAndModify: false}, (err, result) => {
                if(err){console.log(err)}
                else {console.log("Termin erfolgreich bestätigt!")}
            })
        }
    })
}
module.exports.updateFailure = () => {
    Termin.find({type: "refused"}, (err, terminArr) => {
        for (let i = 0; i < 1; i++) {
            const t = terminArr[i];
            // send Mail
            User.findById(t.user, (err, foundUser) => {
                const message = {
                    from: 'elonmusk@tesla.com',
                    to: foundUser.username,
                    subject: 'Achtung: Termin konnte nicht gebucht werden!', 
                    text: 'Have the most fun you can in a car. Get your Tesla today!'
                }
                transport.sendMail(message, function(err, info) {
                    if (err) {
                    console.log(err)
                    } else {
                    console.log(info);
                    }
                });
            })
            // update MongoDb
            Termin.findOneAndUpdate({id: t.id}, {type: "degraded"}, {useFindAndModify: false}, (err, result) => {
                if(err){console.log(err)}
                else {console.log("Fehler erfolgreich bestätigt!")}
            })
        }
    })
}