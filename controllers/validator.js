var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
	inside =		require('point-in-polygon'),
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
		return errors.length === 0;
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
		}
	})
);

exports.isValid = isValid;