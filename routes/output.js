var sequelize = require('../database.js').sequelize,
	render = (req, res) => {
		var output = {}, hail;
		if(req.user){
			output.user = {
				guid: req.user.guid
			};
			if(typeof req.user.userAttributes !== 'undefined'){
				req.user.userAttributes.forEach((attr) => {
					output.user[attr.name] = attr.value;
				});
			}
			if(typeof req.user.hails !== 'undefined'){
				hail = req.user.hails[0];
				output.hail = {
					lon: hail.lon,
					lat: hail.lat,
					created: hail.createdAt
				};
			}

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