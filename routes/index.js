var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	render =	require('./output.js').render,
	hail =		sequelize.models.hail,
	isValid =	require('./validator.js').isValid;


app.get('/hail/create', auth, (req, res, next) => {
	var q = req.query,
		latlong = {lat: q.lat, lon: q.lon},
		test = [
			req.assert('lat', 'required').notEmpty(),
			req.assert('lon', 'required').notEmpty(),
			req.assert('user phone','required for making a hail').userHas('phone', req.user),
			req.assert('lat', 'invalid location').inside(latlong),
			req.assert('lon', 'invalid location').inside(latlong)
		];

	if(isValid(test)){
		hail.make(latlong, req.user);
	}
	next();
}, render);

app.get('/hail/search', auth, (req, res, next) => {
	//funkar den här inline? Nog ja
	hail.search().then((hails)=>{
		res.locals.result = hails;
		next();
	});
}, render);

app.get('/hail/cancel', auth, (req, res, next) => {
	if(req.user.hails.length > 0){
		req.user.hails[0].destroy();
	}
	next();
}, render);

app.get('/user/me', auth, render);

app.get('/user/set',auth,(req, res, next) => {
	var attributes = ['name', 'phone', 'bank', 'bankNo'],
		test;
	attributes.forEach((attribute) => {
		//Only do requests on lines that have properties.
		if(Boolean( req.query[attribute] )){
			test = req.assert(attribute, 'required').optional().notEmpty();
			if(isValid(test)){
				req.user.setAttribute(attribute, req.query[attribute]);
			}
		}
	});
	//driverRequest has special conditions
	if(Boolean(req.query.driverrequest)){
		test = [
			req.assert('phone', 'required for becomming a driver').userHas('phone',req.user),
			req.assert('bank', 'required for becomming a driver').userHas('bank',req.user),
			req.assert('bankNo', 'required for becomming a driver').userHas('bankNo',req.user),
		];
		if(isValid(test)){
			req.user.setAttribute('driverRequest', 'true');
		}
	}
	//Approving driverRequest
	if(Boolean(req.query.driver)){
		test = [
			req.assert('code', 'required').notEmpty(),
			req.assert('code', 'invalid').isAdmin(),
			req.assert('guid', 'required').notEmpty(),
			req.assert('guid', 'must be guid').isGuid(),
		];
	}

	if(!isValid(test)){
		next();
	}

	User.findOne({
		where: {
			guid: req.query.guid,
		},
		include: {
			model: sequelize.models.userAttributes,
			required: false
		}
	}).then((user) => {
		test = req.assert('guid', 'User does not exist').isDefined(user);
		if(!isValid(test)){
			next();
		}
		test = req.assert('guid', 'User is already driver').userHasNot('driver', user);
		if(!isValid(test)){
			next();
		}
		user.setAttribute('driver', true);

		next();
	});



	},render
);