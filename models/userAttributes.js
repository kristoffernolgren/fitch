var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	User = require('./user.js');

UserAttribute = sequelize.define('userAttributes', {
	name:		Sequelize.STRING,
	value:		Sequelize.STRING,
});
UserAttribute.belongsTo(User);

module.exports = UserAttribute;