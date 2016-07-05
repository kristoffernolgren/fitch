var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	render =	require('./output.js').render,
	hails =		sequelize.models.hail,
	isValid =	require('./validator.js').isValid;


app.get('/hail/create', auth, (req, res, next) => {
	var q = req.query,
		hail = hails.build( {lat: q.lat,lon: q.lon} ),
		test = [
			req.assert('lat', 'required').notEmpty(),
			req.assert('lon', 'required').notEmpty(),
			req.assert('required for making a hail').userHas('phone', req.user),
			req.assert('lat', 'location not allowed').inside(q.lat, q.lon),
			req.assert('lon', 'location not allowed').inside(q.lat, q.lon)
		];

	if(isValid(test)){
		//kan ev tas bort när det laddas via user
		req.user.hails = [];
		req.user.hails.push(hail);
		hail.save().then((attr) => req.user.addHail(hail, {as: 'rider'}));
	}
	next();
}, render);

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