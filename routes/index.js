var app =		require('../app.js').app,
	c =			app.controllers,
	auth =		app.controllers.auth,
	targetUser = app.controllers.targetUser,
	sequelize = require('../database.js').sequelize,
	render =	require('./output.js').render,
	hail =		sequelize.models.hail,
	isValid =	require('./validator.js').isValid;

app.get('/hail/create',		c.auth,					c.hail.create,		render);
app.get('/hail/search',		c.auth,					c.hail.search,		render);
app.get('/hail/complete',	c.auth, c.targetUser,	c.hail.complete,	render);
app.get('/hail/cancel',		c.auth,					c.hail.cancel,	render);

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

app.get('/user/:id',auth,targetUser,(req, res, next) => {
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