var render = (req, res) => {
		var response = {};
		if(req.user){
			response.user = req.user.fulluser;
		}
		if(Object.keys(req.query).length){
			response.params = req.query;
		}
		if(req.validationErrors().length > 0 ){
			response.errors = req.validationErrors();
		}
		res.json(response);
	};

exports.render = render;