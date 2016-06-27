var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	userAttributes = sequelize.models.userAttributes,

User = sequelize.define('user', {},{
	instanceMethods: {
		show: function() {
			return this.getUserAttributes()
				.then(function(attributes) {
					var obj = {};
					attributes.forEach((attr) => {
						obj[attr.name] = attr.value;
					});
					return obj;

				});
		}
	},
	classMethods: {
		findOrMake: (fbprofile) => {
			var returner = (user) =>{
				return user.show().then((user) => user);
			};
			return User.findOne({
				include: [{
					model: userAttributes,
					where: {
						name: 'fbprofile',
						value: fbprofile
					}
				}]
			}).then((user) => {
				if(user === null){
					return User.register(fbprofile)
						.then((user) => {
							return returner(user);
						});
				}else{
					return returner(user);
				}
			});

		},
		register: (fbprofile) => {
			var user = User.build(),
				profile = userAttributes.build({name: 'fbprofile', value: fbprofile}),
				afterAllResolved = (results) =>
				{
					return results[0]
						.addUserAttributes([
							results[1]
						]);
				};

			return sequelize.Promise.all(
					[user.save(), profile.save()]
				)
				.then(afterAllResolved);

		},

		makeRider: (params) => {
			var user = User.build(),
				name = userAttributes.build({name: 'name', value: params.name}),
				phone = userAttributes.build({name: 'phone', value: params.phone}),
				afterAllResolved = (results) =>
				{
					return results[0]
						.addUserAttributes([
							results[1],
							results[2],
							results[3]
						]);
				};

				user = user.save();
				name = name.save();
				phone = phone.save();

			return sequelize.Promise.all([user, name, fbprofile, phone])
				.then(afterAllResolved);
		}
	}
});



module.exports = User;