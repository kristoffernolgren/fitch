var isValid =	require('./validator.js').isValid,
	render =	require('../routes/output.js').render,
	targetUser = (req, res, next) => {
		//sometimes it's a param
		if(Boolean(req.params.id)){
			req.body.id = req.params.id;
		}

		var test = [
			req.assert('id', 'required').notEmpty(),
			req.assert('id', 'Must only contain letters').isAlpha(),
		];
		if(!isValid(test)){
			return render(req, res);
		}

		return User.getById(req.body.id)
			.then((user)=>{
				test = req.assert('id', 'User does not exist').isDefined(user);
				if(isValid(test)){
					res.locals.targetUser = user;
					return next();
				}else{
					return render(req, res);
				}

			});
	};

exports.targetUser = targetUser;