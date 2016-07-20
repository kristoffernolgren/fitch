var sequelize = require('../database.js').sequelize,
	error = (err, req, res, next) => {
		if(Boolean(err.message)){
			req._validationErrors.push({msg: err.message});
		}
		res.status(400);
		render(req, res, next);
	},
	render = (req, res) => {
		var output = {}, meta = {}, data = {}, hail;
		//if user
		if(req.user){
			meta.user = {
				id: req.user.getId()
			};
			if(Boolean( req.user.userAttributes )){
				req.user.userAttributes.forEach((attr) => {
					if(attr.name === 'stripeId'){
						meta.user.creditcard = true;
					}else{
						meta.user[attr.name] = attr.value;
					}
				});
			}
			if(req.user.hails.length > 0){
				hail = req.user.hails[0];
				meta.user.hail = {
					lon: hail.lon,
					lat: hail.lat,
					created: hail.createdAt
				};
			}

		}
		if(Object.keys(req.query).length){
			meta.query = req.query;
		}
		if(Object.keys(req.body).length){
			meta.body = req.body;
		}

		if(req.validationErrors().length > 0 ){
			meta.errors = req.validationErrors();
		}
		if(res.locals.messages.length > 0){
			data.messages = res.locals.messages;
		}
		if(Boolean(res.locals.result)){
			data.result = res.locals.result;
		}

		if(Object.keys(meta).length > 0){
			output.meta = meta;
		}
		if(Object.keys(data).length > 0){
			output.data = data;
		}
		res.json(output);
	};

exports.render = render;
exports.error = error;