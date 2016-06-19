var Sequelize = require('sequelize'),
	settings = require('./settings.js').settings,
	sequelize = new Sequelize(settings.database),
	//Datamodel
	User = sequelize.define('user', {
		auth:		Sequelize.STRING,
		name:		Sequelize.STRING,
	}),
	UserAttribute = sequelize.define('userAttributes', {
		name:		Sequelize.STRING,
		value:		Sequelize.STRING,
	}),
	Hail = sequelize.define('hail', {
		lat:		Sequelize.INTEGER,
		lon:		Sequelize.INTEGER,
	});

UserAttribute.belongsTo(User);
Hail.belongsTo(User, {as: 'driver'});
Hail.belongsTo(User, {as: 'rider'});

sequelize.sync(settings.sync).then(function() {
	return User.create({});
}).then(function(driver) {
  console.log(driver.get({
    plain: true
  }));
});
