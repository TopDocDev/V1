const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const Termin = require('../models/termin'); 
//const { forwardAuthenticated } = require('../config/auth');

router.get("/buchung/:id",function(req, res){
  Termin.findById(req.params.id).exec(function(err, result){
      if(err){
          console.log(err)
      } else {
          res.render("auth/buchung", {termin: result})
      }
  })
})

router.get("/register", function(req, res){
  res.render("auth/register")
})

router.post('/register', (req, res) => {
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
    res.render('auth/register', {
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
        res.render('auth/register', {
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
                  res.render('auth/register', {success: "Erfolgreich registriert!!!", errors: errors})
              })
              .catch(err => console.log(err));
          })
      })
    }
  })
}
})

router.post('/buchung/:id/register', (req, res) => {
  Termin.findById(req.params.id,  function(err, termin){
      const { vorname, nachname, username, handy, password, password2} = req.body
      let errors = []
      if (!vorname || !nachname || !username || !handy || !password ) {
        errors.push({ msg: 'Bitte füllen Sie alle Felder aus' });
      }  
      if (password.length < 6) {
        errors.push({ msg: 'Passwort muss mindestens 6 Zeichen lang sein!' });
      }  
      if (errors.length > 0) {
        res.render('auth/buchung', {
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
            res.render('auth/buchung', {
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
                      res.redirect('auth/buchung/' + req.params.id)
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

router.post('/buchung/:id/login', (req, res, next) => {
  Termin.findById(req.params.id, (err, result) => {
      require('../config/passport')(passport, result)
      req._toParam = 'Hello'
      passport.authenticate('local', {
        successRedirect: '/auth/buchung/' + req.params.id,
        successFlash: 'Termin erfolgreich gebucht!',
        failureRedirect: '/auth/buchung/' + req.params.id,
        failureFlash: true
      })
      (req, res, next);
  })

})

module.exports = router