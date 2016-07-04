var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
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
			isDefined: (value, test) => typeof test === undefined,
			userHas: (value, attr, user) => {
				return user.getAttribute(attr);
			}
		}
	})
);

exports.isValid = isValid;