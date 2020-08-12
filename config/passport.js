const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const custom = require("../functions/custom")

// Load User model
const User = require('../models/user');

module.exports = function(passport, termin) {
  console.log(termin)
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Match user
      User.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Diese Email ist noch nicht registriert' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {console.log(err)}
          if (isMatch) {
            custom.saveDate(termin.id, user.id)
            return done(null, user, {message: "Termin erfolgreich gebucht!"});
          } else {
            return done(null, false, { message: 'falsches Passwort!' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
