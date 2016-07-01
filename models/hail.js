var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	User =		require('./user.js');

Hail = sequelize.define('hail', {
	lat:		Sequelize.INTEGER,
	lon:		Sequelize.INTEGER,
});
Hail.belongsTo(User, {as: 'driver'});
Hail.belongsTo(User, {as: 'rider'});

module.exports = Hail;