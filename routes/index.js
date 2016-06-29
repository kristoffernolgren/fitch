var app = require('../app.js').app,
	passport = require('./passport.js').passport,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	bodyParser = require('body-parser'),
	validator = require('express-validator'),
	auth = (req, res, next) => {
		passport.authenticate('facebook-token',	(err, user, info) => {
			req.assert("access_token", "requierd").notEmpty();
			req.assert("access_token", "Invalid access_token").invalidAuth(err);
			if (err || !user) {
				return render(req, res);
			}

			req.logIn(user, { session: false }, (err) => next());
		})(req, res, next);
	},
	render = (req, res) => {
		var response = {};
		if(req.user){
			response.user = req.user.fulluser;
		}
		if(Object.keys(req.query).length){
			response.params = req.query;
		}
		if(req.validationErrors().length > 0 ){
			response.errors = req.validationErrors();
		}
		res.json(response);
	};

app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			invalidAuth: (value, err) => err === null
		}
	})
);


app.all('/user/me', auth,
	(req, res, next) => {
		render(req, res);
	});

app.get('/user/makeRider', auth,
	(req, res, next) => {
		req.user.user.makeRider(req.query)
			.then(render(req, res));
	}
);