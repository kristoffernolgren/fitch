var	userAttributes = require('./userAttributes.js'),
	User = require('./user.js'),
	Hail = require('./hail.js');

User.hasMany(userAttributes);
userAttributes.belongsTo(User);

Hail.belongsTo(User, {as: 'driver'});
Hail.belongsTo(User, {as: 'rider'});
User.hasMany(Hail);