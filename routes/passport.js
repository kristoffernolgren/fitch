var passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env],
	facebook = require('passport-facebook-token'),
	User = require('../models/user.js');

passport.use(new facebook(settings.facebookCredentials,
	(accessToken, refreshToken, profile, done) => {
		User
			.find({where: {"authID": profile.id}})
			.spread(
				(user, created) => {
					return done(null,
					{
						"profile": profile,
						"user": user
					});
			});
	}
));

exports.passport = passport;