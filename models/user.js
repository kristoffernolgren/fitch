var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize;

User = sequelize.define('user', {
	authID:		Sequelize.STRING,
	name:		Sequelize.STRING,
});


module.exports = User;