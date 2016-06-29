var app = require('../app.js').app,
	passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env].facebookCredentials,
	facebook = require('passport-facebook-token'),
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	render = require('./output.js').render,
	auth = (req, res, next) => {
		passport.authenticate('facebook-token',	(err, user, info) => {
			//validation
			req.assert("access_token", "requierd").notEmpty();
			req.assert("access_token", "Invalid access_token").invalidAuth(err);
			//Just render if we can't auth.
			if (err || !user) {
				return render(req, res);
			}
			//Login, yay!
			req.logIn(user, { session: false }, (err) => next());
		})(req, res, next);
	};

app.use(passport.initialize());


passport.use(new facebook(settings,
	(accessToken, refreshToken, profile, done) => {
		if(typeof profile === 'undefined'){
			done(null, false, {message: 'invalid accessToken'});
		}
		//findOrCreate the user
		User.auth(profile.id)
			.then((user) => done(null, {obj: user, profile: profile}));
	}
));




exports.auth = auth;