var passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('./config.json')[env],
	facebook = require('passport-facebook-token');


passport.use(new facebook(settings.facebookCredentials,
	(accessToken, refreshToken, profile, done) => {
		User.findOrCreate({authID: profile.id}, function (error, user) {
			return done(error, {profile: profile, user: user});
		});
	}
));

exports.passport = passport;