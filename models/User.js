var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('../node_modules/bcrypt'));

var userSchema = Schema({
      username          : String,
      email             : String,
      password          : String,
      profile_image_url : String,
      friends           : [ {type: mongoose.Schema.Types.ObjectId,
                              ref: 'User' } ]
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
        })
    })
})

userSchema.methods.comparePasswordSync = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password)
}



var User = mongoose.model('User', userSchema)
module.exports = User
