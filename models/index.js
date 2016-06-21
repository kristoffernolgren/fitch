var Sequelize = require('sequelize'),
	env = process.env.NODE_ENV,
	settings = require('../config.json')[env].database,
	sequelize = new Sequelize(settings),
	db  = {};

db.User = sequelize.define('user', {
	authID:		Sequelize.STRING,
	name:		Sequelize.STRING,
});

db.UserAttribute = sequelize.define('userAttributes', {
	name:		Sequelize.STRING,
	value:		Sequelize.STRING,
});
db.UserAttribute.belongsTo(db.User);


db.Hail = sequelize.define('hail', {
	lat:		Sequelize.INTEGER,
	lon:		Sequelize.INTEGER,
});

db.Hail.belongsTo(db.User, {as: 'driver'});
db.Hail.belongsTo(db.User, {as: 'rider'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
