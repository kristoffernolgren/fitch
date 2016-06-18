var passport = require('passport'),
	settings = require('./settings.js').settings,
	facebook = require('passport-facebook-token');


passport.use(new facebook(settings.facebookCredentials,
	(accessToken, refreshToken, profile, done) => {
		return done(null, profile);
	}
));

exports.passport = passport;