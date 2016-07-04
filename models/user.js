var sequelize =			require('../database.js').sequelize,
	Sequelize =			require('../database.js').Sequelize,
	userAttributes =	sequelize.models.userAttributes,
	Chance =			require('chance'),
    chance =			new Chance();

User = sequelize.define('user', {
		fbid: {
			type:		Sequelize.INTEGER,
			allowNull:	false,
			unique: true,
			validate: {
				notEmpty: true
			}
		},
		guid: {
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
		getAttribute: function(name){
			var attr;
			if(typeof this.userAttributes === "undefined"){return false;}

			attr = this.userAttributes.find((attr)=> {
				return attr.name === name;
			});
			return typeof attr === 'undefined'? false : attr;
		},
		setAttribute: function(name, value){
			var newAttr = {name: name, value: value},
			attribute = this.getAttribute(name);
			if(attribute){
				attribute.update({value: value});
			}else{
				var attr = userAttributes.build(newAttr);
				this.userAttributes.push(attr);
				attr.save().then((attr) => this.addUserAttributes(attr));

			}

		}
	},
	classMethods: {
		auth: (fbid, name) => {
			return User.findOrCreate(
				{
					where: {fbid: fbid},
					defaults: {
						guid: chance.guid()
					},
					include: [
						{model: userAttributes}
					]
				})
				.spread((user, created) => {
					if(created){
						user.userAttributes = [];
						user.setAttribute('name', name);
					}
					return user;
				});
		}
	}
});



module.exports = User;