var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	render =	require('./output.js').render,
	isValid =	require('./validator.js').isValid;


app.all('/user/me', auth, render);

app.get('/user/set',auth,(req, res, next) => {
		var attributes = ['name', 'phone'],
			test;
		attributes.forEach((attribute) => {
			//Only do requests on lines that have properties.
			if(typeof req.query[attribute] !=='undefined'){
				test = req.assert(attribute, 'required').optional().notEmpty();
				if(isValid(test)){
					req.user.setAttribute(attribute, req.query[attribute]);
				}
			}
		});
		next();

	},render
);