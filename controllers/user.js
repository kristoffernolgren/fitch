var	validate =	require('./validator.js').validate,
	attributes = ['name', 'phone', 'bank', 'bankNo'],

	//update userdetails
	editTests = (req, res, next) => {
		attributes.forEach((attribute) => {
			req.assert(attribute, 'can\'t be empty' ).optional().notEmpty();
		});
		next();
	},
	edit = (req, res, next) => {
		attributes.forEach((attribute) => {
			if(Boolean(req.body[attribute] )){
				req.user.setAttribute(attribute, req.body[attribute]);
			}
		});

		next();
	},

	//Make driver request
	requestDriverTests = (req,res, next) => {
		if(Boolean(req.body.driverrequest)){
			req.assert('phone', 'required for becomming a driver').userHas('phone',req.user);
			req.assert('bank', 'required for becomming a driver').userHas('bank',req.user);
			req.assert('bankNo', 'required for becomming a driver').userHas('bankNo',req.user);
		}
		next();
	},
	requestDriver = (req, res, next) =>{
		if(Boolean(req.body.driverrequest)){
			req.user.setAttribute('driverRequest', 'true');
		}
		next();
	},

	//convert user to driver
	makeDriverTests = (req, res, next) => {
		if(Boolean(req.body.driver)){
			req.assert('user', 'Must be admin').userHas('admin',req.user);
			req.assert('User', 'Is already driver' ).userHasNot('driver', res.locals.targetUser);
		}
		next();
	},
	makeDriver  = (req, res, next) => {
		if(Boolean(req.body.driver)){
			res.locals.targetUser.setAttribute('driver', true);
		}
		next();
	},

	//Convert user to admin
	makeAdminTests = (req, res, next) => {
		if(Boolean(req.body.admin)){
			req.assert('secret', 'Invalid secret').isSecret();
		}
		next();
	},
	makeAdmin = (req, res, next) => {
		if(Boolean(req.body.admin)){
			res.locals.targetUser.setAttribute('admin', true);
		}
		next();
	};

exports.edit = [editTests, validate, edit];
exports.requestDriver = [requestDriverTests, validate, requestDriver];
exports.makeDriver = [makeDriverTests, validate, makeDriver];
exports.makeAdmin = [makeAdminTests, validate, makeAdmin];

