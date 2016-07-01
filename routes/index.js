var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	login =		require('./auth.js').login,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	validate =	require('./validator.js').validate,
	render =	require('./output.js').render,
	User =		sequelize.models.user;

app.all('/user/me',(req,res,next) =>{
		req.assert('access_token', 'required').notEmpty();
		next();
	}, validate, auth, render);

app.get('/user/makeRider',(req,res,next)=>{
		req.assert('phone', 'required').notEmpty();
		req.assert('access_token', 'required').notEmpty();
		next();
	},
	validate, auth,
	(req, res, next) => {
		//req.assert("phone", "must be number").isInt();

		sequelize.Promise.all([
			req.user.addAttribute('phone', req.query.phone),
			req.user.addAttribute('rider', 'true')
		]).then(() => next());

	},render
);