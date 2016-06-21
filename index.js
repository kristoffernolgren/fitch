var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport,
	sequelize = require('./database.js').sequelize,
	env = process.env.NODE_ENV,
	settings = require('./config.json')[env];

app.use(passport.initialize());
//just for testing the api
app.use(express.static('public'));

sequelize.sync(settings.sync).then(() => {
	app.listen(3000);
});


app.get('/rider/create',
	(req, res) => {
		res.json(req.user);
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