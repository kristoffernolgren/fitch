var app = require('../app.js').app,
	passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env].facebookCredentials,
	facebook = require('passport-facebook-token'),
	sequelize = require('../database.js').sequelize,
	validate = require('./validator.js').validate,
	User = sequelize.models.user,
	auth = (req, res, next) => {
		passport.authenticate('facebook-token',	(err, user, info) => {
			var test = {
				access_token: {
					notEmpty: {
						errorMessage: 'requierd'
					},
					invalidAuth: {
						options: [err],
						errorMessage: 'Invalid access_token'
					}
				}
			};
			validate(test, req, res);

			//Login, yay
			req.logIn(user, { session: false }, (err) => next());
		})(req, res, next);
	};

app.use(passport.initialize());


passport.use(new facebook(settings,
	(accessToken, refreshToken, profile, done) => {
		if(typeof profile === 'undefined'){
			done(null, false, {message: 'invalid access_token'});
		}
		User.auth(profile.id)
			.then((user) => done(null, {obj: user, profile: profile}));
	}
));

exports.auth = auth;