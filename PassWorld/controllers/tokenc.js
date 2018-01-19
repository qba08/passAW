var TokenStr = require('../models/tokenStr');
var message = require('../message');
var config = require('../config');
var hashGen = require('../controllers/generator');

exports.saveToken = function (req, cb) {
    if (req.userId && req.type &&  req.ipAddress){

        var newToken = new TokenStr();
        newToken.userId = req.userId;
        newToken.ipAddress = req.ipAddress;

        if (req.type == config.typeJWT){
            newToken.hash = hashGen.generate(config.lengthJWT,4);
            newToken.expire = (Date.now()+60000*config.expiresTimeJWT);
        }else if(req.type == config.typeSEC) {
            newToken.hash = hashGen.generate(config.lengthSEC, 0);
            newToken.expire = (Date.now() + 60000 * config.expiresTimeSEC);
        }else if(req.type == config.typeDAT){
            newToken.hash = hashGen.generate(config.lengthDAT, 0);
            newToken.expire = (Date.now() + 60000 * config.expiresTimeDAT);
        }else{
            cb(message.msg1, null);
        }
        newToken.type = req.type;

        newToken.save(function(err) {
            if (err)
                return cb(message.msg5, null);
            cb(null, newToken);
        });
    } else {
        cb(message.msg1, null);
    }
};

exports.checkToken = function (req, cb) {
    if (req.userId && req.type && req.ipAddress && req.hash) {
        TokenStr.findOne({userId: req.userId, type: req.type, hash: req.hash, expire: {$gt: Date.now()}},
            function (err, findToken) {
                if (err)
                    cb(message.msg5, null);
                if (findToken) {
                    if(findToken.type != config.typeJWT){
                        findToken.remove(function (err) {
                            if (err){
                                cb(null, false);
                            }else{
                                cb(null, true);
                            }
                        });
                    }else{
                        cb(null, true);
                    }
                }else{
                    cb(null, false);
                }
            });
    } else {
        cb(message.msg1, null);
    }

};