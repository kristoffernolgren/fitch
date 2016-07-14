var isValid =	require('./validator.js').isValid,
	sequelize = require('../database.js').sequelize,
	hail =		sequelize.models.hail,
	create = (req, res, next) => {
		var q = req.body,
			latlong = {lat: q.lat, lon: q.lon},
			test = [
				req.assert('lat', 'required').notEmpty(),
				req.assert('lon', 'required').notEmpty(),
				req.assert('user phone','required for making a hail').userHas('phone', req.user),
				req.assert('user creditCard','required for making a hail').userHas('stripeId', req.user),
				req.assert('lat', 'invalid location').inside(latlong),
				req.assert('lon', 'invalid location').inside(latlong)
			];

		if(isValid(test)){
			hail.make(latlong, req.user);
		}
		next();
	},
	search = (req, res, next) => {
		var test = req.assert('user', 'Must be driver.').userHas('driver', req.user);
		if(!isValid(test)){
			return next();
		}
		hail.search().then((hails)=>{
			res.locals.result = hails;
			next();
		});
	},
	complete = (req,res,next) => {
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
		req.user.hails = [];
		next();
	},
	cancel = (req, res, next) => {
		var test = req.assert('hail','user has no current hail').isDefined(req.user.hails.length);
		if(!isValid(test)){
			return next();
		}
		req.user.hails[0].destroy();
		req.user.hails = [];
		next();
	};

exports.create = create;
exports.search = search;
exports.complete = complete;
exports.cancel = cancel;