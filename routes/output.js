var sequelize = require('../database.js').sequelize,
	render = (req, res) => {
		var output = {};
		if(req.user && req.user.guid){
			output.user = req.user.locals;
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