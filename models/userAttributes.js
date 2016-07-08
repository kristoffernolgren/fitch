var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize;


UserAttribute = sequelize.define('userAttributes', {
	name: {
		type:		Sequelize.STRING,
		allowNull:	false,
		unique: 'compositeIndex',
		validate: {
			isIn: [['phone', 'name','driverRequest', 'bank', 'bankNo']],
		}
	},
	value: {
		type:		Sequelize.STRING,
		allowNull:  false
	},
	userId: {
		type: Sequelize.STRING,
		unique: 'compositeIndex'
	},
});


module.exports = UserAttribute;