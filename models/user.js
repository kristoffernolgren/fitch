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
			if(!Boolean(this.userAttributes)){return false;}

			attr = this.userAttributes.find((attr)=> {
				return attr.name === name;
			});
			return !Boolean(attr) ? false : attr;
		},
		setAttribute: function(name, value){
			var newAttr = {name: name, value: value},
			attribute = this.getAttribute(name);
			if(attribute){
				//update
				attribute.value = value;
				if(!Boolean(attribute.promise)){
					attribute.update({value: value});
				}else{
					attribute.promise.then(() => attribute.update({value: value}) );
				}
			}else{
				//create
				attribute = userAttributes.build(newAttr);
				attribute.promise = attribute.save().then((attribute) => this.addUserAttributes(attribute));
				this.userAttributes.push(attribute);
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
						{
							model: sequelize.models.userAttributes,
							required: false
						},
						{
							model: sequelize.models.hail,
							where: {
								driverId: null,
								createdAt: {
									$gt: new Date(new Date() - 60 * 60 * 1000)
								}
							},
							required: false
						}
					]

				})
				.spread((user, created) => {
					if(created){
						//arrays needed before data is added.
						user.userAttributes = [];
						user.hails = [];
						user.setAttribute('name', name);
					}
					return user;
				});
		}
	}
});

module.exports = User;