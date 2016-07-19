var validate =	require('./validator.js').validate,
	sequelize = require('../database.js').sequelize,
	hail =		sequelize.models.hail,
	User =		sequelize.models.user,
	createTests = (req, res, next) => {
		var latlong = {lat: req.body.lat, lon: req.body.lon};

		req.assert('lat', 'required').notEmpty();
		req.assert('lon', 'required').notEmpty();
		req.assert('user phone','required for making a hail').userHas('phone', req.user);
		req.assert('user creditCard','required for making a hail').userHas('stripeId', req.user);
		req.assert('lat', 'invalid location').inside(latlong);
		req.assert('lon', 'invalid location').inside(latlong);
		next();
	},
	create = (req, res, next) => {
		var latlong = {lat: req.body.lat, lon: req.body.lon};
		hail.make(latlong, req.user);
		next();
	},
	searchTests = (req, res, next) => {
		req.assert('user', 'Must be driver.').userHas('driver', req.user);
		next();
	},
	search = (req, res, next) => {
		hail.search().then((hails)=>{
			res.locals.result = hails;
			next();
		});
	},
	completeTests = (req, res, next) => {
		var hail = req.user.hails[0];
		req.assert('hail','user has no current hail').isDefined(hail);
		next();
	},
	complete = (req,res,next) => {
		var hail = req.user.hails[0];
		//Validation!!
		User.getById(req.body.id)
			.then((user)=>{
				if(user.getAttribute('driver')){
					hail.addDriver(user);
					req.user.hails = [];
					next();
				}else{
					req.assert('id', 'User is not driver').fail();
					next(new Error());
				}
			}).catch((err) => {
				req.assert('access_token', 'User is not defined').fail();
				next(new Error());
			});

	},
	cancelTest = (req, res, next) => {
		req.assert('hail','user has no current hail').isDefined(req.user.hails.length);
		next();
	},
	cancel = (req, res, next) => {
		req.user.hails[0].destroy();
		req.user.hails = [];
		next();
	};

exports.create = [createTests, validate, create];
exports.search = [searchTests , validate, search];
exports.complete = [completeTests, validate, complete];
exports.cancel = [cancelTest, validate, cancel];