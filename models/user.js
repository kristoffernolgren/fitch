var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,

User = sequelize.define('user', {},{
	classMethods: {
		createRider: function(params) {
			var values = [],
				userAttributes = sequelize.models.userAttributes,
				user = User.build(),
				name = userAttributes.build({name: 'name', value: params.name}),
				fbprofile = userAttributes.build({name: 'fbprofile', value: params.fbprofile}),
				phone = userAttributes.build({name: 'phone', value: params.phone});

			user.save().then((user) => {
				sequelize.Promise.all([
					fbprofile.save(),
					name.save(),
					phone.save()
				])
				.then((attributes) => {
					user.addUserAttributes(attributes);
				});
			});

			//Kolla att alla attribut är medskickade(inte undefined)
			//validering av phone och fbprofile (kanske i db-modellen)
			//avbryt hela grejjen om det inte funkar.
			return;
		}
	}
});



module.exports = User;