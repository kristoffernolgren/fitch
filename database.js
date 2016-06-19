var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  // SQLite only
  storage: 'db.sqlite'
});

var Driver = sequelize.define('driver', {
	auth:		Sequelize.STRING,
	name:		Sequelize.STRING,
	phone:		Sequelize.INTEGER,
	bank:		Sequelize.INTEGER,
	idNo:		Sequelize.STRING
});

var Rider = sequelize.define('rider', {
	auth:		Sequelize.STRING,
	name:		Sequelize.STRING,
	phone:		Sequelize.INTEGER,
	payment:	Sequelize.STRING,
});

var Hail = sequelize.define('hail', {
	lat:		Sequelize.INTEGER,
	lon:		Sequelize.INTEGER,
});

Hail.belongsTo(Driver);
Hail.belongsTo(Rider);

sequelize.sync({force: true}).then(function() {
	return Hail.create({
		lat: 123,
		lon: 1234
	});
}).then(function(driver) {
  console.log(driver.get({
    plain: true
  }));
});
