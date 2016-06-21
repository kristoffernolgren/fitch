var Sequelize = require('sequelize'),
	env = process.env.NODE_ENV,
	settings = require('./config.json')[env].database;

module.exports = {
	'sequelize': new Sequelize(settings),
	'Sequelize': Sequelize
};