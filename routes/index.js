var app = require('../app.js').app,
	passport = require('./passport.js').passport,
	sequelize = require('../database.js').sequelize;


app.use(passport.initialize());

app.get('/rider/create',
	(req, res) => {
		var User = sequelize.models.user;
		User.createRider(req.query).then((user) => {
			user.getUserAttributes().then((attributes)=> {
				res.json({
					user: user,
					attributes: attributes
				});

			});
		});
	}
);

app.get('/rider/edit',  passport.authenticate('facebook-token',  { session: false }),
	(req, res) => {
	if(req.user.created){
		res.json(req.user);
	}else{
		res.json({error: 'User already exists'});
	}
});