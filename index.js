var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport,
	sequelize = require('./database.js').sequelize,
	env = process.env.NODE_ENV,
	models = require('./models'),
	settings = require('./config.json')[env];

//just for testing the api
app.use(express.static('public'));

sequelize.sync(settings.sync).then(() => {
	app.listen(3000);
});


app.use(passport.initialize());

app.get('/rider/create',
	(req, res) => {
		var User = sequelize.models.user,
		user = User.createRider(req.query);
		res.json(user);
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