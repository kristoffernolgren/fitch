var passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('./config.json')[env],
	facebook = require('passport-facebook-token'),
	db = require('./models');

passport.use(new facebook(settings.facebookCredentials,
	(accessToken, refreshToken, profile, done) => {
		db.User
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