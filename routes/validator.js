var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
	inside =		require('point-in-polygon'),
	codes =			require('../config.js').settings.admincodes,
	//lat, long
	polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ],
	isValid = (tests) => {
		var errors = [];
		if(!Array.isArray(tests)){
			tests = [tests];
		}
		//flatten
		newTests = [].concat.apply([], tests);
		tests.forEach((test)=> {
			errors = errors.concat(test.validationErrors);
		});
		console.log(errors)
		return errors.length === 0;
	};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			//return false when validation fails
			isDefined: (value, test) => Boolean(test),
			userHas: (value, attr, user) => user.getAttribute(attr),
			userHasNot: (value, attr, user) => !user.getAttribute(attr),
			inside: (value, latlong) => inside([latlong.lat, latlong.lon], polygon),
			isAdmin: (value) => codes.indexOf(value) > -1,
			isGuid: (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
		}
	})
);

exports.isValid = isValid;