var key =		require('../config.js').settings.stripe,
	stripe =	require('stripe')(key),
	isValid =	require('./validator.js').isValid,
	make = (req, res, next) => {
		var q =		req.query,
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
				req.checkQuery('exp_month', 'required for regestering a card').notEmpty(),
				req.checkQuery('exp_year',	'required for regestering a card').notEmpty(),
				req.checkQuery('cvc',		'required for regestering a card').notEmpty()
			];
			if(!isValid(test)){
				next();
			}
			stripe.customers.create(createObj).then((customer)=> {
				req.user.setAttribute('stripeId', customer.id);
			});
			next();
		}
	};

exports.make = make;