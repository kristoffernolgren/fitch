var app =		require('../app.js').app,
	auth =		require('./auth.js').auth,
	Sequelize = require('../database.js').Sequelize,
	sequelize = require('../database.js').sequelize,
	render =	require('./output.js').render,
	hail =		sequelize.models.hail,
	isValid =	require('./validator.js').isValid,
	getUser = (req, res, next) => {
		//sometimes it's a param
		if(Boolean(req.params.id)){
			req.query.id = req.params.id;
		}

		var test = [
			req.checkQuery('id', 'required').notEmpty(),
			req.checkQuery('id', 'Must only contain letters').isAlpha(),
		];
		if(!isValid(test)){
			return render(req, res);
		}

		return User.getById(req.query.id)
			.then((user)=>{
				test = req.checkQuery('id', 'User does not exist').isDefined(user);
				if(isValid(test)){
					res.locals.targetUser = user;
					return next();
				}else{
					return render(req, res);
				}

			});
	};


app.get('/hail/create', auth, (req, res, next) => {
	var q = req.query,
		latlong = {lat: q.lat, lon: q.lon},
		test = [
			req.checkQuery('lat', 'required').notEmpty(),
			req.checkQuery('lon', 'required').notEmpty(),
			req.assert('user phone','required for making a hail').userHas('phone', req.user),
			req.checkQuery('lat', 'invalid location').inside(latlong),
			req.checkQuery('lon', 'invalid location').inside(latlong)
		];

	if(isValid(test)){
		hail.make(latlong, req.user);
	}
	next();
}, render);

app.get('/hail/search', auth, (req, res, next) => {
	test = req.assert('user', 'Must be driver.').userHas('driver', req.user);
	if(!isValid(test)){
		return next();
	}
	hail.search().then((hails)=>{
		res.locals.result = hails;
		next();
	});
}, render);

app.get('/hail/complete',auth, getUser, (req,res,next) => {
	console.log(res.locals.targetUser.getAttribute('driver'));
	var hail = req.user.hails[0],
		test = [
			req.assert('hail','user has no current hail').isDefined(hail),
			req.assert('user', 'No such driver exists').isDefined(res.locals.targetUser.getAttribute('driver'))
		];

	if(!isValid(test)){
		return next();
	}
	hail.driverId = res.locals.targetUser.id;
	hail.save().then(()=> hail.destroy());

	next();
}, render);

app.get('/hail/cancel', auth, (req, res, next) => {
	if(req.user.hails.length > 0){
		req.user.hails[0].destroy();
	}
	next();
}, render);

app.get('/user/me',auth,(req, res, next) => {
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
	return next();
},render);

app.get('/user/:id',auth,getUser,(req, res, next) => {
	var test;
	if(Boolean(req.query.driver)){
		test = [
			req.assert('user', 'Must be admin').userHas('admin',req.user),
			req.assert('User', 'Is already driver' ).userHasNot('driver', req.user)
		];
		if(!isValid(test)){
			return next();
		}

		res.locals.targetUser.setAttribute('driver', true);

		return next();
	}
}, render);