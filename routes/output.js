var sequelize = require('../database.js').sequelize,
	render = (req, res) => {
		var output = {}, hail;
		if(req.user){
			output.user = {
				id: req.user.getId()
			};
			if(Boolean( req.user.userAttributes )){
				req.user.userAttributes.forEach((attr) => {
					output.user[attr.name] = attr.value;
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
			output.errors = req.validationErrors();
		}

		res.json(output);
	};

exports.render = render;