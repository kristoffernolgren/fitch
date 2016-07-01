var env =		process.env.NODE_ENV,
	settings =	require('./config.json')[env];

exports.settings = settings;