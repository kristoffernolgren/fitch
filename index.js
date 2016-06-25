var app = require('./app.js').app,
	express = require('./app.js').express,
	sequelize = require('./database.js').sequelize,
	env = process.env.NODE_ENV,
	models = require('./models'),
	routes = require('./routes'),
	settings = require('./config.json')[env].sync;


//just for testing the api
app.use(express.static('public'));

sequelize.sync(settings).then(() => {
	app.listen(3000);
});