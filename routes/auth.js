var app =		require('../app.js').app,
	passport =	require('passport'),
	settings =	require('../config.js').settings.facebookCredentials,
	facebook =	require('passport-facebook-token'),
	User =		require('../database.js').sequelize.models.user,
	validate =	require('./validator.js').validate,
	auth =	(req,res,next) => {
			passport.authenticate('facebook-token', (err, user, info) => {
			//Validate the auth
			if(err !== null){
				req.assert('access_token', err.message).isDefined(user);
				return validate(req,res,next);
			}else{
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