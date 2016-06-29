var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	userAttributes = sequelize.models.userAttributes,
	Chance = require('chance'),
    chance = new Chance();

User = sequelize.define('user', {
		fbid: {
			type:		Sequelize.INTEGER,
			allowNull:	false,
			unique: true,
			validate: {
				notEmpty: true
			}
		},
		pubid: {
			type:		Sequelize.STRING,
			allowNull:	false,
			unique: true,
			validate: {
				is: ["^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$", "i"],
				notEmpty: true
			}
		}
	},{
	instanceMethods: {
		full: function() {
			var user = this;
			return this.getUserAttributes()
				.then(function(attributes) {
					var obj = {
						pubid: user.pubid
					};
					attributes.forEach((attr) => {
						obj[attr.name] = attr.value;
					});
					return obj;
				});
		},
		addAttribute: function(name, value){
			return userAttributes.create({name: name, value: value})
				.then((attr) =>{
					this.addUserAttributes(attr);
				});
		}
	},
	classMethods: {
		auth: (fbid) => {
			return User.findOrCreate(
				{
					where: {fbid: fbid},
					defaults: {pubid: chance.guid()}
				})
				.spread((user, created) => user);
		}
	}
});



module.exports = User;