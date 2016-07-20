var key =		require('../config.js').settings.stripe,
	stripe =	require('stripe')(key),
	validate =	require('./validator.js').validate,
	render =	require('../routes/output.js').render,
	makeTests = (req, res, next) => {

		if(Boolean(req.body.number)){
			req.assert('exp_month', 'required for regestering a card').notEmpty();
			req.assert('exp_year',	'required for regestering a card').notEmpty();
			req.assert('cvc',		'required for regestering a card').notEmpty();
			req.assert('number',		'required for regestering a card').notEmpty();
		}
		next();
	},
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
			stripe.customers.create(createObj)
				.then((customer)=> {
					req.user.setAttribute('stripeId', customer.id);
					res.addMessage('Credit card updated');
					next();
				})
				.catch((err)=> {
					next(new Error(err.raw.message));
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

exports.make = [makeTests, validate, make];
exports.charge = charge;