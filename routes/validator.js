var bodyParser =	require('body-parser'),
	app =			require('../app.js').app,
	validator =		require('express-validator'),
	render =		require('./output.js').render,
	validate = (req, res, next) => {
		if (req.validationErrors().length) {
			return render(req, res);
		}else{
			next();
		}
	};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	validator({
		customValidators: {
			falsy: (value, test) => typeof test === undefined
		}
	})
);

exports.validate = validate;