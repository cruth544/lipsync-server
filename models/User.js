var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('../node_modules/bcrypt'));


var userSchema = Schema({
      fb: {
        id: String,
        access_token: String,
        firstName: String,
        lastName: String,
        email: String
      },

      name: { first : String,
              last  : String
            },
      username:           String,
      email:              String,
      password:           String,
      profile_image_url:  String,
      friends:            [ { } ] //type: Schema.Types.ObjectId, ref: 'User'
      // restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }]

})

userSchema.pre('save',function (next){
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    return bcrypt.genSaltAsync(10).then(function(result) {

        return bcrypt.hashAsync(user.password, result).then(function(hash){
            console.log("hash: " + hash);
            user.password = hash;
            next();
        });
    })
});

userSchema.methods.comparePasswordAsync = function(candidatePassword) {
    return bcrypt.compareAsync(candidatePassword, this.password);
};



var User = mongoose.model('User', userSchema)
module.exports = User;
