var isValid =	require('./validator.js').isValid,
	targetUser = (req, res, next) => {
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

exports.targetUser = targetUser;