var sequelize = require('../database.js').sequelize,
	error = (err, req, res, next) => {
		console.log(err.message);
		if(Boolean(err.message)){
			req._validationErrors.push({msg: err.message});
		}
		console.log(req._validationErrors);
		res.status(400);
		render(req, res, next);
	},
	render = (req, res) => {
		var output = {}, hail;
		if(req.user){
			output.user = {
				id: req.user.getId()
			};
			if(Boolean( req.user.userAttributes )){
				req.user.userAttributes.forEach((attr) => {
					if(attr.name === 'stripeId'){
						output.user.creditcard = true;
					}else{
						output.user[attr.name] = attr.value;
					}
				});
			}
			if(req.user.hails.length > 0){

				hail = req.user.hails[0];
				output.hail = {
					lon: hail.lon,
					lat: hail.lat,
					created: hail.createdAt
				};
			}

		}

		if(Boolean(res.locals.result)){
			output.result = res.locals.result;
		}

		if(Object.keys(req.query).length){
			output.params = req.query;
		}
		if(req.validationErrors().length > 0 ){
			output.errors = req.validationErrors();
		}

		res.json(output);
	};

exports.render = render;
exports.error = error;