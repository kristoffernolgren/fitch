var sequelize = require('../database.js').sequelize,
	render = (req, res) => {
		var output = {},
			async = [],
			fulluser;

		if(req.user){
			fulluser = req.user.obj.full();
			async.push(fulluser);
		}
		if(Object.keys(req.query).length){
			output.params = req.query;
		}
		if(req.validationErrors().length > 0 ){
			output.errors = req.validationErrors();
		}
		sequelize.Promise.all(async).then((response) => {
			if(response.length > 0){
				output.user = response[0];
			}
			res.json(output);
		});
	};

exports.render = render;