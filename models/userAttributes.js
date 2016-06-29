var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	validator = require('validator');


UserAttribute = sequelize.define('userAttributes', {
	name: {
		type:		Sequelize.STRING,
		allowNull:	false,
		validate: {
			isIn: [['phone', 'name', 'test']],
		}
	},
	value: {
		type:		Sequelize.STRING,
		allowNull:	false
	},
});


module.exports = UserAttribute;