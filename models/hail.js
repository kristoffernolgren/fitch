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
	classMethods: {
		make: (latlong, user) => {
			if(user.hail){
				user.hail.destroy();
			}
			var hail = Hail.build( latlong );
				user.hail = hail;
				hail.save().then((attr) => user.addHail(hail, {as: 'rider'}));
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
			})
			.then((result)=>{
				return result;
			});
		}
	}
});

module.exports = Hail;