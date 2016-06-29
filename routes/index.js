var app = require('../app.js').app,
	auth = require('./passport.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	User = sequelize.models.user,
	bodyParser = require('body-parser'),
	validator = require('express-validator'),
	render = require('./output.js').render;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			invalidAuth: (value, err) => err === null
		}
	})
);


app.all('/user/me', auth, render);

app.get('/user/makeRider', auth,
	(req, res, next) => {
		var name, phone;
		req.assert("name", "requierd").notEmpty();
		req.assert("phone", "requierd").notEmpty();
		//req.assert("phone", "must be number").isInt();

		sequelize.Promise.all([
			req.user.user.addAttribute('name',req.query.name),
			req.user.user.addAttribute('phone', req.query.phone)
		]).then(() => next());

	},render
);