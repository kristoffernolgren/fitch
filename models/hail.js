var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	User =		require('./user.js');

Hail = sequelize.define('hail', {
	lat: {
		type:	Sequelize.FLOAT,
		allowNull:	false,
		validate: {
			notEmpty: true,
			min: -90,
			max: 90

		}

	},
	lon: {
		type:	Sequelize.FLOAT,
		allowNull:	false,
		validate: {
			notEmpty: true,
			min: -180,
			max: 180
		}
	}
});
Hail.belongsTo(User, {as: 'driver'});
Hail.belongsTo(User, {as: 'rider'});

module.exports = Hail;