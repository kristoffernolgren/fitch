var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,

User = sequelize.define('user', {},{
	classMethods: {
		createRider: (params) => {
			var values = [],
				userAttributes = sequelize.models.userAttributes,
				user = User.build(),
				name = userAttributes.build({name: 'name', value: params.name}),
				fbprofile = userAttributes.build({name: 'fbprofile', value: params.fbprofile}),
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
				fbprofile = fbprofile.save();
				phone = phone.save();

			return sequelize.Promise.all([user, name, fbprofile, phone])
				.then(afterAllResolved);
		}
	}
});



module.exports = User;