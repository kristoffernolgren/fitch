var app = require('../app.js').app,
	auth = require('./auth.js').auth,
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
		req.assert("name", "requierd").notEmpty();
		req.assert("phone", "requierd").notEmpty();
		//req.assert("phone", "must be number").isInt();

		sequelize.Promise.all([
			req.user.obj.addAttribute('name',req.query.name),
			req.user.obj.addAttribute('phone', req.query.phone),
			req.user.obj.addAttribute('rider', 'true')
		]).then(() => next());

	},render
);