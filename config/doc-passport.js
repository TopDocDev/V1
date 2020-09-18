const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const custom = require("../functions/custom")
const passport = require("passport")
const Doc = require("../models/doc")

module.exports = function(docPassport) {
    passport.use("docLocal",
      new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        // Match user
        Doc.findOne({
          username: username
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
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
      Doc.findById(id, function(err, user) {
        done(err, user);
      });
    });
  };