var sequelize = require('../database.js').sequelize,
	error = (err, req, res, next) => {
		if(Boolean(err.message)){
			req._validationErrors.push({msg: err.message});
		}
		res.status(400);
		render(req, res, next);
	},
	render = (req, res) => {
		var output = {}, hail;
		//if user
		if(req.user){
			output.meta = {
				user: {
					id: req.user.getId()
				}
			};
			if(Boolean( req.user.userAttributes )){
				req.user.userAttributes.forEach((attr) => {
					if(attr.name === 'stripeId'){
						output.meta.user.creditcard = true;
					}else{
						output.meta.user[attr.name] = attr.value;
					}
				});
			}
			if(req.user.hails.length > 0){
				hail = req.user.hails[0];
				output.meta.user.hail = {
					lon: hail.lon,
					lat: hail.lat,
					created: hail.createdAt
				};
			}

		}
		if(Object.keys(req.query).length){
			if(!Boolean(output.meta)){
				output.meta = {};
			}
			output.meta.query = req.query;
		}
		if(Object.keys(req.body).length){
			if(!Boolean(output.meta)){
				output.meta = {};
			}
			output.meta.body = req.body;
		}

		if(req.validationErrors().length > 0 ){
			if(!Boolean(output.meta)){
				output.meta = {};
			}
			output.meta.errors = req.validationErrors();
		}


		if(Boolean(res.locals.data)){
			output.data = res.locals.data;
		}
		res.json(output);
	};

exports.render = render;
exports.error = error;