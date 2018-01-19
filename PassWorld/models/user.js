var mongoose = require('mongoose');
var Cryptojs = require('crypto-js');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema(
    {
        login: {type: String, unique: true, required: true },
        email: {type: String, unique: true, required: true },
        phone: {type: Number, required: true},
        password: {type: String, required: true },
        key: {type: String, required: true },
        hash: {type: String, required: true}
    }
);

UserSchema.methods.generateHash = function(passPhrase) {
    var salt = Cryptojs.lib.WordArray.random(128/8).toString(Cryptojs.enc.Hex);
    return salt+"."+Cryptojs.PBKDF2(passPhrase, salt, 10000, 512/8).toString(Cryptojs.enc.Base64);
};

UserSchema.methods.verifyPassword = function(passPhrase){
    var salt = this.password.split(".")[0];
    var newHash = salt+"."+Cryptojs.PBKDF2(passPhrase, salt, 10000, 512/8).toString(Cryptojs.enc.Base64);
    return this.password == newHash;
};

UserSchema.methods.verifyHash = function(passPhrase){
    var salt = this.hash.split(".")[0];
    var newHash = salt+"."+Cryptojs.PBKDF2(passPhrase, salt, 10000, 512/8).toString(Cryptojs.enc.Base64);
    return this.hash == newHash;
};

module.exports = mongoose.model('user', UserSchema);