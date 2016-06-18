var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;
	local = require('passport-local').Strategy,
	settings = require('./settings.js').settings;


passport.use(new local(
  function(username, password, done) {
      return done(null, {});
  }
));

exports.passport = passport;