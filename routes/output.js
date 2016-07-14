var sequelize = require('../database.js').sequelize,
	render = (req, res) => {
		var output = {}, hail, code = 200;
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

		if(Boolean(res.locals.result) && res.locals.result.length > 0){
			output.result = res.locals.result;
		}

		if(Object.keys(req.query).length){
			output.params = req.query;
		}
		if(req.validationErrors().length > 0 ){
			code = 400;
			output.errors = req.validationErrors();
		}

		res.status(code).json(output);
	};

exports.render = render;