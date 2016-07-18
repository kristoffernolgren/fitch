var validate =	require('./validator.js').validate,
	render =	require('../routes/output.js').render,
	targetUserTests = (req, res, next) => {
		//sometimes it's a param
		if(Boolean(req.params.id)){
			req.body.id = req.params.id;
		}
		req.assert('id', 'required').notEmpty();
		req.assert('id', 'Must only contain letters').isAlpha();
		next();
	},
	targetUser = (req, res, next) => {
		return User.getById(req.body.id)
			.then((user)=>{
				if(!Boolean(user)){
					req.assert('access_token', 'User is not defined').fail();
					return next(new Error());
				}
				res.locals.targetUser = user;
				return next();
			});
	};

exports.targetUser = [targetUserTests, validate, targetUser];