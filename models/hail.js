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
	paranoid: true,
	instanceMethods: {
		addDriver: function(user){
			this.driverId = user.id;
			this.save().then(()=> this.destroy());
		}
	},
	classMethods: {
		make: (latlong, user) => {
			if(user.hails.length > 0){
				user.hails[0].destroy();
			}
			var hail = Hail.build( latlong );
				user.hails[0] = hail;
				hail.save().then((attr) => user.addHail(hail));
		},
		search: () => {
			return Hail.findAll({
				attributes: ['lat', 'lon'],
				where: {
					driverId: null,
					createdAt: {
						$gt: new Date(new Date() - 60 * 60 * 1000)
					}
				}
			});
		}
	}
});

module.exports = Hail;