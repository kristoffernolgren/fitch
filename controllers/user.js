var	validate =	require('./validator.js').validate,
	attributes = ['name', 'phone', 'bank', 'bankNo'],
	User =		require('../database.js').sequelize.models.user,

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
				res.addMessage(attribute + ' updated');
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
			res.addMessage('User has now requested to become a driver');
		}
		next();
	},

	//convert user to driver
	makeDriverTests = (req, res, next) => {
		if(Boolean(req.body.driver)){
			req.assert('user', 'Must be admin').userHas('admin',req.user);
			req.checkParams('id', 'required').notEmpty();
			req.checkParams('id', 'Must only contain letters').isAlpha();
		}
		next();
	},
	makeDriver  = (req, res, next) => {
		if(Boolean(req.body.driver)){
			User.getById(req.params.id)
				.then((user)=>{
					user.setAttribute('driver', true);
					res.addMessage('User is now a driver');
					res.locals.result = {driver: user.getId()};

					next();
				}).catch((err) => {
					next(new Error('User does not exist'));
				});
		}else{
			next();
		}
	},

	//Convert user to admin
	makeAdminTests = (req, res, next) => {
		if(Boolean(req.body.admin)){
			req.assert('secret', 'Invalid secret').isSecret();
			req.checkParams('id', 'required').notEmpty();
			req.checkParams('id', 'Must only contain letters').isAlpha();
		}
		next();
	},
	makeAdmin = (req, res, next) => {
		if(Boolean(req.body.admin)){
			//Validering också!
			User.getById(req.params.id)
				.then((user)=>{
					user.setAttribute('admin', true);
					res.addMessage('User is now an admin');
					res.locals.result = {admin: user.getId()};
					next();
				}).catch((err) => {
					next(new Error('User does not exist'));
				});

		}else{
			next();
		}
	};

exports.edit = [editTests, validate, edit];
exports.requestDriver = [requestDriverTests, validate, requestDriver];
exports.makeDriver = [makeDriverTests, validate, makeDriver];
exports.makeAdmin = [makeAdminTests, validate, makeAdmin];

