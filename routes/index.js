var app = require('../app.js').app,
	passport = require('./passport.js').passport,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	auth = passport.authenticate('facebook-token',  { session: false });

app.use(passport.initialize());

app.use((req, res, next) => {
	req.resolve = (promise) => {
		return promise.then(() => {
			return req.user.user.full().then((fulluser) => {
				return res.json({
					user: fulluser,
					params: req.query
				});
			});
		}).catch(Sequelize.ValidationError, err => {
				// respond with validation errors
				return res.status(422).send(err.errors);
		}).catch(err => {
			// every other error
			return res.status(400).send({ message: err.message });
		});
	};
	next();
});


app.get('/user/me', auth,
	(req, res, next) => {
		req.resolve(Promise.resolve());
	});

app.get('/user/makeRider', auth,
	(req, res, next) => {
		req.resolve(req.user.user.makeRider(req.query));
	}
);
/*
app.all('*', (req, res) => {

});
*/