var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
	inside =		require('point-in-polygon'),
	secret =		require('../config.js').settings.secret,
	//lat, long
	polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ],
	validate = (req, res, next) => {
		if(req.validationErrors().length > 0){
			return next(new Error());
		}else{
			next();
		}
	};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			//return false when validation fails
			fail: (value) => false,
			isDefined: (value, test) => Boolean(test),
			userHas: (value, attr, user) => user.getAttribute(attr),
			userHasNot: (value, attr, user) => !user.getAttribute(attr),
			inside: (value, latlong) => inside([latlong.lat, latlong.lon], polygon),
			isSecret: (value) => value === secret,
		}
	})
);

exports.validate = validate;