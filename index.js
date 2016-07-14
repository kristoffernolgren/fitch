var app =		require('./app.js').app,
	express =	require('./app.js').express,
	sequelize =	require('./database.js').sequelize,
	models =	require('./models'),
	controllers = require('./controllers'),
	routes =	require('./routes');
	settings =	require('./config.js').settings;


app.set('json spaces', settings.indent);

sequelize.sync(settings.sync).then(() => {
	app.listen(3000);
});