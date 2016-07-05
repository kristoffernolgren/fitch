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
},{
	classMethods: {
		make: (latlong, user) => {
			var hail = Hail.build( latlong );
				//kan ev tas bort när det laddas via user
				user.hails = [];
				user.hails.push(hail);
				hail.save().then((attr) => user.addHail(hail, {as: 'rider'}));
		}
	}
});

module.exports = Hail;