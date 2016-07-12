var app =		require('./app.js').app,
	express =	require('./app.js').express,
	sequelize =	require('./database.js').sequelize,
	models =	require('./models'),
	settings =	require('./config.js').settings;
	app.controllers = require('./controllers');
	require('./routes');

//just for testing the api
app.use(express.static('public'));
app.set('json spaces', settings.indent);

sequelize.sync(settings.sync).then(() => {
	app.listen(3000);
});