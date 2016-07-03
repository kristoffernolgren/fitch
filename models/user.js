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
		detailed: function() {
			var user = this;
			return this.getUserAttributes()
				.then(function(attributes) {
					var obj = {
						guid: user.guid
					};
					attributes.forEach((attr) => {
						obj[attr.name] = attr.value;
					});
					return obj;
				});
		},
		getAttribute: function(name){
			return this.getUserAttributes({
					where:{
						name: name
					}
				}).then((attr) => {
					return attr[0];
				});
		},
		setAttribute: function(name, value){
			var newAttr = {name: name, value: value};
			if(typeof this.locals[name] === 'undefined'){
				userAttributes.create(newAttr).then((attr) => this.addUserAttributes(attr));
			}else{
				this.getAttribute(name).then((attribute) => attribute.update({value: value}));
			}
			this.locals[name] = value;
		}
	},
	classMethods: {
		auth: (fbid, name) => {
			return User.findOrCreate(
				{
					where: {fbid: fbid},
					defaults: {
						guid: chance.guid()
					}
				})
				.spread((user, created) => {
					if(created){
						user.locals = {};
						user.setAttribute('name', name);
						return user;
					}else{
						//get details from database
						return user.detailed().
							then((details) => {
								user.locals = details;
								return user;
							});
					}
				});
		}
	}
});



module.exports = User;