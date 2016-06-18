var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;
	local = require('passport-local').Strategy,
	facebook = require('passport-facebook').Strategy,
	settings = require('./settings.js').settings;


passport.use(new local(
  function(username, password, done) {
      return done(null, {});
  }
));

passport.use(new FacebookStrategy(settings.facebookCredentials,
	function(accessToken, refreshToken, profile, done) {
		console.log('test')
		console.log(accessToken, refreshToken, profile)
	/*User.findOrCreate(..., function(err, user) {
	  if (err) { return done(err); }
	  done(null, user);
	});*/
	done(null, {});
	}
));

exports.passport = passport;