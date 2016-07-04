var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	render =	require('./output.js').render,
	isValid =	require('./validator.js').isValid;


app.all('/user/me', auth, render);

app.get('/user/set',auth,(req, res, next) => {
		var attributes = ['name', 'phone', 'bank', 'bankNo'],
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
		if(typeof req.query.driverrequest !== 'undefined'){
			test = [
				req.assert('phone', 'required for becomming a driver').userHas('phone',req.user),
				req.assert('bank', 'required for becomming a driver').userHas('bank',req.user),
				req.assert('bankNo', 'required for becomming a driver').userHas('bankNo',req.user),
			];
			if(isValid(test)){
				req.user.setAttribute('driverRequest', 'true');
			}

		}

		next();

	},render
);