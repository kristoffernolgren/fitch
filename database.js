var Sequelize =	require('sequelize'),
	settings =	require('./config.js').settings.database;

module.exports = {
	'sequelize': new Sequelize(settings),
	'Sequelize': Sequelize
};