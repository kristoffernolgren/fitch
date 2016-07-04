var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
	isValid = (test) => test.validationErrors.length === 0;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			//return false when validation fails
			isDefined: (value, test) => typeof test === undefined
		}
	})
);

exports.isValid = isValid;