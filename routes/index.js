var app = require('../app.js').app,
	passport = require('./passport.js').passport,
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	auth = passport.authenticate('facebook-token',  { session: false });

app.use(passport.initialize());


app.get('/user/me', auth,
	(req, res, next) => {
		next();
});

app.get('/user/makeRider', auth,
	(req, res, next) => {
		req.user.user.makeRider(req.query)
			.then((user) => {
				next();
			});
	}
);

app.all('*', (req, res) => {
	req.user.user.full().then((fulluser) => {
		res.json({
			user: fulluser,
			params: req.query
		});
	});
});