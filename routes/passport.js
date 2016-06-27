var passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env].facebookCredentials,
	facebook = require('passport-facebook-token'),
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user;

passport.use(new facebook(settings,
	(accessToken, refreshToken, profile, done) => {
		User.auth(profile.id).then((user) => done(null, {
			user: user, profile: profile
		}));
	}
));

exports.passport = passport;