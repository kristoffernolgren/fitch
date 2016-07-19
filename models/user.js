var sequelize =			require('../database.js').sequelize,
	Sequelize =			require('../database.js').Sequelize,
	userAttributes =	sequelize.models.userAttributes,
	convertId = (function() {
		var offset = 30,
			charmap = "skajweuhxpcqdvzmngtbfyr".split(""),
			base = charmap.length;
		return {
		toString: (i) => {
			i += offset;
			var result = "";
			do {
				result += charmap[i % base];
				i = (i - i % base) / base;
			} while (i > 0);

			return result;
		},
		fromString: (s) => {
			var result = 0,
				power = 1;

			s = s.toLowerCase();

			for (var i = 0; i < s.length; ++i) {
				var k = charmap.indexOf(s[i]);
				result += power * k;
				power *= base;
			}
			result -= offset;

			return result;
		}
		};
	}());

User = sequelize.define('user', {
		fbid: {
			type:		Sequelize.INTEGER,
			allowNull:	false,
			unique: true,
			validate: {
				notEmpty: true
			}
		}
	},{
	instanceMethods: {
		getId : function(){
			return convertId.toString(this.id);
		},
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
				if(Boolean(attribute.promise)){
					attribute.promise.then(() => {
						return attribute.update({value: value});
					});
				}else{
					attribute.update({value: value});
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
		getById: (id) => {
			id = convertId.fromString(id);
			return User.findOne({
				where: {
					id: id,
				},
				rejectOnEmpty: new Error('No such user'),
				include: {
					model: sequelize.models.userAttributes,
					required: false
				}
			});
		},
		auth: (fbid, name) => {
			return User.findOrCreate(
				{
					where: {fbid: fbid},
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