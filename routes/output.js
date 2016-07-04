var sequelize = require('../database.js').sequelize,
	render = (req, res) => {
		var output = {};
		if(req.user){
			output.user = {
				guid: req.user.guid
			};
			if(typeof req.user.userAttributes !== 'undefined'){
				req.user.userAttributes.forEach((attr) => {
					output.user[attr.name] = attr.value;
				});
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