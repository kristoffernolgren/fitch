var passport = require('passport'),
	settings = require('./settings.js').settings,
	facebook = require('passport-facebook-token');


passport.use(new facebook(settings.facebookCredentials,
	(accessToken, refreshToken, profile, done) => {
		User.findOrCreate({authID: profile.id}, function (error, user) {
			return done(error, {profile: profile, user: user});
		});
	}
));

exports.passport = passport;