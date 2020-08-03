const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const custom = require("../functions/custom")

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Match user
      User.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {console.log(err)}
          if (isMatch) {
            custom.saveDate(user.id)
            return done(null, user, {message: "Welcome!"});
          } else {
            return done(null, false, { message: 'Password incorrect' });
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
