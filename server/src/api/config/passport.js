var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userList = require('../models/users');

passport.use('user-local', new LocalStrategy({
  usernameField: 'email'},
  function(username, password, done) {
    userList.findAccountByEmail(username, function (err, user) {
      if(err) {//Error
        return done(err);
      }
      if(!user) {//User not Found
        return done(null, false, {
          message: 'User not found'
        });
      }
      if(!user.validPassword(password)) {//Bad Login
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      console.log("Successful Login for User: " + user.emailAddress);
      return done(null, user);//Successful Login
    });
  }
));
