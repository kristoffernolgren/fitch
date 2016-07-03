var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	validate =	require('./validator.js').validate,
	render =	require('./output.js').render;

app.all('/user/me',(req,res,next) =>{
		req.assert('access_token', 'required').notEmpty();
		next();
	}, validate, auth, render);

app.get('/user/set',(req,res,next)=>{
		req.assert('access_token', 'required').notEmpty();
		req.assert('name', 'required').optional().notEmpty();
		req.assert('phone', 'required').optional().notEmpty();
		req.assert('driverRequest', 'required').optional().notEmpty();
		next();
	},
	validate, auth,
	(req, res, next) => {
		var attributes = ['name', 'phone', 'driverRequest'];

		attributes.forEach((attribute) => {
			//Only do requests on lines that have properties.
			if(typeof req.query[attribute] !=='undefined'){
				req.user.setAttribute(attribute, req.query[attribute]);
			}
		});
		next();

	},render
);