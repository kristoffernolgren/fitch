var passport = require('passport'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env].facebookCredentials,
	facebook = require('passport-facebook-token'),
	sequelize = require('../database.js').sequelize,
	userAttributes = sequelize.models.userAttributes,
	User = sequelize.models.user,
	userOut = (done, user, profile) => {
		return user.show()
			.then((user) => {
				return done(null, {user: user, profile: profile});
			});
	};

//todo:
//Flytta auth så den körs på alla anrop.
//går den att göra bättre?
//return "profile": profile,


passport.use(new facebook(settings,
	(accessToken, refreshToken, profile, done) => {
		User.findOne({
			include: [{
				model: userAttributes,
				where: {
					name: 'fbprofile',
					value: profile.id
				}
			}]
		}).then((user) => {
			if(user === null){
				return User.register(profile.id)
					.then((user)=>{
						return userOut(done, user, profile);
					});
			}else{
				return userOut(done, user, profile);
			}
		});

/*		User
			.find({where: {"authID": profile.id}})
			.spread(
				(user, created) => {
					return done(null,
					{
						"profile": profile,
						"user": user
					});
			});
	*/
	}
));

exports.passport = passport;