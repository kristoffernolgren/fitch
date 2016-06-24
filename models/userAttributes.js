var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,

UserAttribute = sequelize.define('userAttributes', {
	name:		Sequelize.STRING,
	value:		Sequelize.STRING,
});


module.exports = UserAttribute;