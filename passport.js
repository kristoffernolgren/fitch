var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;
	local = require('passport-local').Strategy;


passport.use(new local(
  function(username, password, done) {
      return done(null, {});
  }
));

exports.passport = passport;