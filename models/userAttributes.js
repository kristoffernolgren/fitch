var sequelize = require('../database.js').sequelize,
	Sequelize = require('../database.js').Sequelize,
	validator = require('validator'),
	tests = {
		phone: {
			test: (value) => validator.isInt(value),
			msg: 'phonenumber must contain numbers'
		}
	};


UserAttribute = sequelize.define('userAttributes', {
	name: {
		type:		Sequelize.STRING,
		allowNull:	false,
		validate: {
			isIn: [['phone', 'name']],
		}
	},
	value: {
		type:		Sequelize.STRING,
		allowNull:	false
	},
}, {
	validate: {
		InvalidValue: function() {
			var test = tests[this.name],
				value = this.value;
			if(typeof test !== 'undefined' && !test.test(value)){
				throw new Error(test.msg);
			}

		}
	}
});


module.exports = UserAttribute;