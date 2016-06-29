var passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env].facebookCredentials,
	facebook = require('passport-facebook-token'),
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user;

//should pass return done(err) if user.auth fails
passport.use(new facebook(settings,
	(accessToken, refreshToken, profile, done) => {
		if(typeof profile === 'undefined'){
			done(null, false, {message: 'invalid accessToken'});
		}
		User.auth(profile.id)
			.then((user) => {
				return user.full()
					.then((fulluser) => {
						return {user: user, fulluser:fulluser};
					});
			})
			.then((user) => done(null, {fulluser: user.fulluser, user: user.user, profile: profile}));
	}
));




exports.passport = passport;