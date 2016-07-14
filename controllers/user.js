var	isValid =	require('./validator.js').isValid,
	edit = (req, res, next) => {
		var attributes = ['name', 'phone', 'bank', 'bankNo'],
			q = req.body,
			test;

		//updated userdetails
		attributes.forEach((attribute) => {
			if(Boolean( q[attribute] )){
				test = req.assert(attribute, 'required').optional().notEmpty();
				if(isValid(test)){
					req.user.setAttribute(attribute, q[attribute]);
				}
			}
		});


		//Make driver request
		if(Boolean(q.driverrequest)){
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
	},


	admin =	(req, res, next) => {
		var q = req.body, test;
		if(Boolean(q.driver)){
			test = [
				req.assert('user', 'Must be admin').userHas('admin',req.user),
				req.assert('User', 'Is already driver' ).userHasNot('driver', res.locals.targetUser)
			];
			if(!isValid(test)){
				return next();
			}

			res.locals.targetUser.setAttribute('driver', true);

			return next();
		}else if(Boolean(q.admin)){
			test = req.assert('secret', 'Invalid secret').isSecret();
			if(!isValid(test)){
				return next();
			}
			res.locals.targetUser.setAttribute('admin', true);
			return next();
		}

	};

exports.edit = edit;
exports.admin = admin;
