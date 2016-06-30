var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
	render =		require('./output.js').render,
	validate = (tests, req, res) => {
		req.assert(tests);
		if (req.validationErrors().length) {
			render(req, res);
		}
	};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			invalidAuth: (value, err) => err === null
		}
	})
);

exports.validate = validate;