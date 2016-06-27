var app = require('../app.js').app,
	passport = require('./passport.js').passport,
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	auth = passport.authenticate('facebook-token',  { session: false });


app.use(passport.initialize());

app.get('/user/me', auth,
	(req, res) => {
		res.json(req.user);
});

app.get('/user/makerider', auth,
	(req, res) => {
		req.user.user.makeRider(req.query)
			.then((user) => {
				res.json(req.user);
			});
	}
);

app.get('/rider/edit',  auth, (req, res) => {
	if(req.user.created){
		res.json(req.user);
	}else{
		res.json({error: 'User already exists'});
	}
});