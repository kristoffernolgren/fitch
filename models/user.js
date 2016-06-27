var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	userAttributes = sequelize.models.userAttributes,
	Chance = require('chance'),
    chance = new Chance();

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

				name = name.save();
				phone = phone.save();

			return sequelize.Promise.all([name, phone])
				.then(afterAllResolved);
		}
	},
	classMethods: {
		findByProfile: (fbprofile) => {
			return userAttributes.findOne({
				where: {'name': 'fbprofile', 'value': fbprofile },
				include: [User]
			//return user or false
			}).then((userAttribute) => (userAttribute === null) ? false : userAttribute.user );
		},
		auth: (fbprofile) => {
			return User.findByProfile(fbprofile)
				//return or make+return user.
				.then((user) =>  user ? user : User.register(fbprofile).then((user) => user) );
		},
		register: (fbprofile) => {
			var user = User.build(),
				profile = userAttributes.build({name: 'fbprofile', value: fbprofile}),
				pubId = userAttributes.build({name: 'pubId', value: chance.guid() }),
				//relate attributes to user
				afterAllResolved = (results) => results[0].addUserAttributes([results[1], results[2]]);

			return sequelize.Promise.all([user.save(), profile.save(), pubId.save()])
				.then(afterAllResolved);

		}
	}
});



module.exports = User;