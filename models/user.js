var bcrypt = require('bcrypt');
var _ = require('underscore');
var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes){
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING 		// when hashing data gonna get same result everytime,alt adds random set of characters on to the end of plain text password before its hashed
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,	// In Sequelize there is a virtual datatype, it doesn't get stored in the databse but it is accessible
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		},
	}, {
		hooks: {
			beforeValidate: function(user, options){
				// user.email
				if(typeof user.email === 'string'){
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body){
				var _this = this;

				return new Promise(function(resolve, reject){
					if(typeof body.email !== 'string' || typeof body.password !== 'string'){
				        return reject();
				    }

					console.log(_this);
				    _this.findOne({
				        where: {
				            email: body.email
				        }
				    }).then(function(user){
				        if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
				            return reject();
				        }

				        resolve(user);
				    }, function(err){
				        return reject();
				    });
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function(){
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type){
				if(!_.isString(type)){
					return undefined;
				}

				try{
					var stringData = JSON.stringify({id: this.get('id'), type: type})
					var encryptedData = crypto.AES.encrypt(stringData, 'qwerty@12ui').toString();

					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty09');

					return token;
				} catch(e){
					return undefined;
				}
			}
		}
	});

	// return user;
};