var	userAttributes = require('./userAttributes.js'),
	User = require('./user.js');

User.hasMany(userAttributes);
userAttributes.belongsTo(User);