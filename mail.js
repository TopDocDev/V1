const Termin = require("./models/termin");
const User = require("./models/user");
nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const termin = require("./models/termin");
 const nexmo = new Nexmo({
       apiKey: '4861d529',
       apiSecret: 'va8hb2hmjpjKJm0s',
     })

let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
       user: 'inkognito.more1@gmail.com',
       pass: "wSac6EaK"
    }
})

module.exports.updateSuccess = () => {
    Termin.find({type: "confirmed"}, {useFindAndModify: false}, (err, terminArr) => {
        if(err){
            console.log(err)
        } else {
            if (typeof terminArr !== 'undefined' && terminArr.length > 0) {
                for (let i = 0; i < 1; i++) {
                    const t = terminArr[i];
                    console.log(t)
                    User.findById(t.user, {useFindAndModify: false}, (err, foundUser) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log(foundUser)
                            nexmo.message.sendSms('TopDoc', foundUser.handy, 'Termin um ' + t.start + 'wurde erfolgreich bestätigt');
                            console.log("Success SMS!")
                            Termin.findByIdAndUpdate(t.id, {type: "accepted"}, err => {
                                if(err){console.log(err)}
                            })
                        }
                    })
                }
            
            } else {
    // console.log("no confirmed appointments found!")
            }
        }
    })
}
module.exports.updateFailure = () => {
    Termin.find({type: "rejected"}, {useFindAndModify: false}, (err, terminArr) => {
        //console.log(terminArr)
        if(err){
            console.log(err)
        } else {
            if (typeof terminArr !== 'undefined' && terminArr.length > 0) {
                for (let i = 0; i < 1; i++) {
                    const t = terminArr[i];
                    User.findById(t.user, {useFindAndModify: false}, (err, foundUser) => {
                        console.log(foundUser)
                        if(err){
                            console.log(err)
                        } else {
                            nexmo.message.sendSms('TopDoc', foundUser.handy, 'Termin konnte nicht gebucht werden!');
                            console.log("Failure SMS sent!")
                            Termin.findByIdAndUpdate(t.id, {type: "degraded"}, err => {
                                if(err){console.log(err)}
                            })
                        }
                    })
                }
            } else {
                //console.log("no rejected appointments found!")
            }
        }
    })
}

/*
User.findById('5f609f95942dc623cced78a7', (err, foundUser) => {
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
*/
