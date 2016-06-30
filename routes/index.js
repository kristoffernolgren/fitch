var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	validator =	require('./validator.js').validator,
	render =	require('./output.js').render,
	User =		sequelize.models.user;




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