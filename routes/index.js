var app = require('../app.js').app,
	passport = require('./passport.js').passport,
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	auth = passport.authenticate('facebook-token',  { session: false });


app.use(passport.initialize());


app.get('/user/create', auth,
	(req, res) => {
		User.register(req.query)
			.then((user) => {
				user.show().then((data) => {
					res.json(data);
				});
			});
	}
);

app.get('/user/me', auth,
	(req, res) => {
		console.log('here?');
		console.log(req.user);
		res.json(req.user);
});

/*
app.get('/user/makerider',
	(req, res) => {
		var User = sequelize.models.user;
		User.createRider(req.query)
			.then((user) => {
				user.getUserAttributes().then((attributes)=> {
					res.json({
						user: user,
						attributes: attributes
					});

				});
			});
	}
);*/

app.get('/rider/edit',  auth, (req, res) => {
	if(req.user.created){
		res.json(req.user);
	}else{
		res.json({error: 'User already exists'});
	}
});