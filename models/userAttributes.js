var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize;


UserAttribute = sequelize.define('userAttributes', {
	name: {
		type:		Sequelize.STRING,
		allowNull:	false,
		validate: {
			isIn: [['phone', 'name','driverRequest']],
		}
	},
	value: {
		type:		Sequelize.STRING,
		allowNull:  false
	}
});


module.exports = UserAttribute;