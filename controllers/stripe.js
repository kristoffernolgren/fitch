var key =		require('../config.js').settings.stripe,
	stripe =	require('stripe')(key),
	isValid =	require('./validator.js').isValid,
	render =	require('../routes/output.js').render,
	make = (req, res, next) => {
		var q =	req.body,
			createObj = {
				description: req.user.id + ' ' + req.user.getAttribute('name').dataValues.value,
				source: {
					object:		'card',
					exp_month:	q.exp_month,
					exp_year:	q.exp_year,
					number:		q.number,
					cvc:		q.cvc
				}
			};
		if(Boolean(q.number)){
			test = [
				req.assert('exp_month', 'required for regestering a card').notEmpty(),
				req.assert('exp_year',	'required for regestering a card').notEmpty(),
				req.assert('cvc',		'required for regestering a card').notEmpty()
			];
			if(!isValid(test)){
				next();
			}
			stripe.customers.create(createObj)
				.then((customer)=> {
					req.user.setAttribute('stripeId', customer.id);
					next();
				})
				.catch((err)=> {
					req.assert(err.raw.param, err.raw.message).fail();
					render(req, res);
				});
		}else{
			next();
		}
	},
	charge = (req, res, next) => {
		stripe.charges.create({
			amount: 2000,
			currency: "sek",
			customer: req.user.getAttribute('stripeId').dataValues.value,
		});
		next();
	};

exports.make = make;
exports.charge = charge;