var Sequelize = require('sequelize'),
	sequelize = new Sequelize('database', 'username', 'password', {
		host: 'localhost',
		dialect: 'sqlite',
		storage: 'db.sqlite'
	}),
	settings = require('./settings.js').settings,

	Driver = sequelize.define('driver', {
		auth:		Sequelize.STRING,
		name:		Sequelize.STRING,
		phone:		Sequelize.INTEGER,
		bank:		Sequelize.INTEGER,
		idNo:		Sequelize.STRING
	}),
	Rider = sequelize.define('rider', {
		auth:		Sequelize.STRING,
		name:		Sequelize.STRING,
		phone:		Sequelize.INTEGER,
		payment:	Sequelize.STRING,
	}),
	Hail = sequelize.define('hail', {
		lat:		Sequelize.INTEGER,
		lon:		Sequelize.INTEGER,
	});

Hail.belongsTo(Driver);
Hail.belongsTo(Rider);

sequelize.sync(settings.sync).then(function() {
	return Hail.create({
		lat: 123,
		lon: 1234
	});
}).then(function(driver) {
  console.log(driver.get({
    plain: true
  }));
});
