var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	userAttributes = sequelize.models.userAttributes,

User = sequelize.define('user', {},{
	instanceMethods: {
		full: function() {
			return this.getUserAttributes()
				.then(function(attributes) {
					var obj = {};
					attributes.forEach((attr) => {
						obj[attr.name] = attr.value;
					});
					return obj;

				});
		},
		makeRider: function(params) {
			var user = this,
				name = userAttributes.build({name: 'name', value: params.name}),
				phone = userAttributes.build({name: 'phone', value: params.phone}),
				afterAllResolved = (results) => this.addUserAttributes(results);

				user = user.save();
				name = name.save();
				phone = phone.save();

			return sequelize.Promise.all([name, phone])
				.then(afterAllResolved);
		}
	},
	classMethods: {
		findByProfile: (fbprofile) => {
			return User.findOne({
				include: [{
					model: userAttributes,
					where: {
						name: 'fbprofile',
						value: fbprofile
					}
				}]
			//return user if found
			}).then((user) => (user === null) ? false : user );
		},
		auth: (fbprofile) => {
			return User.findByProfile(fbprofile)
				.then((user) => {
					//return or make+return user.
					console.log(user);
					return user ? user : User.register(fbprofile).then((user) => user);
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

		}
	}
});



module.exports = User;