var passport = require('passport'),
	local = require('passport-local').Strategy,
	settings = require('./settings.js').settings,
	facebook = require('passport-facebook-token');

passport.use(new local(
  function(username, password, done) {
      return done(null, {});
  }
));

passport.use(new facebook(settings.facebookCredentials,
	(accessToken, refreshToken, profile, done) => {
		return done(null, profile);
	}
));


exports.passport = passport;