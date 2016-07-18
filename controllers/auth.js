var app =		require('../app.js').app,
	passport =	require('passport'),
	settings =	require('../config.js').settings.facebookCredentials,
	facebook =	require('passport-facebook-token'),
	User =		require('../database.js').sequelize.models.user,
	render =	require('../routes/output.js').render,
	validate =	require('./validator.js').validate,
	authTests =	(req, res, next) => {
		req.checkHeaders('access_token', 'required').notEmpty();
		next();
	},
	getUser =	(req,res,next) => {
		passport.authenticate('facebook-token', (err, user, info) => {
			//Error if invalid accestoken
			if(Boolean(err)){
				req.assert('access_token', err.message).fail();
				return next(new Error());
			}else{
				//Login and create user
				return User.auth(user.id, user.displayName)
					.then((user) => {
						return req.logIn(user, { session: false }, () => next());
					});
			}
		})(req, res, next);
	};
app.use(passport.initialize());


passport.use(new facebook(settings,
	(accessToken, refreshToken, profile, done) => {

		if(Boolean(profile)){
			done(null, profile);
		}else{
			done(null, false, {message: 'not valid'});
		}
	}
));

exports.auth = [authTests, validate, getUser];