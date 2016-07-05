var app =		require('../app.js').app,
	passport =	require('passport'),
	settings =	require('../config.js').settings.facebookCredentials,
	facebook =	require('passport-facebook-token'),
	User =		require('../database.js').sequelize.models.user,
	render =	require('./output.js').render,
	isValid =	require('./validator.js').isValid,
	auth =	(req,res,next) => {
		var test = req.assert('access_token', 'required').notEmpty();
		if (!isValid(test)) {
			return render(req, res);
		}
		passport.authenticate('facebook-token', (err, user, info) => {
			//Error if invalid accestoken
			if(err !== null){
				req.assert('access_token', err.message).isDefined(user);
				return render(req, res);
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
		if(typeof profile === 'undefined'){
			done(null, false, {message: 'not valid'});
		}else{
			done(null, profile);
		}
	}
));

exports.auth = auth;