var jwt = require('jsonwebtoken');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('../config');
var secretConfig = require('../secret/config');
var message = require('../message');

var User = require('../models/user');
var tokenController = require('../controllers/tokenc');
var smsApi = require('../controllers/smsApi');

var option = {};
option.jwtFromRequest = ExtractJwt.fromAuthHeader();
option.secretOrKey = secretConfig.secret;

passport.use(new JwtStrategy(option,
    function(jwt_payload, done) {
        User.findOne({_id:jwt_payload.userId}, function(err, user) {
            if(err) {
                done(err, false);
            } else if (user){
                tokenController.checkToken(
                    {userId:jwt_payload.userId,
                        type:jwt_payload.type,
                        ipAddress:jwt_payload.ipAddress,
                        hash:jwt_payload.hash},
                    function (err,tok) {
                        if(err) {
                            done(err, false);
                        }else if (tok){
                            done(null, user);
                        }else{
                            done(null,false);
                        }
                    });
            } else {
                done(null,false);
            }
        });
    }
));

exports.authenticate = function(req, res, next) {
    User.findOne({
        login: req.body.login
    }, function(err, user) {
        if (err) {
            return res.json({success: false, number: 4, message: message.msg4, data: null});
        }
        if (!user) {
            return res.json({success: false, number: 4, message: message.msg4, data: null});
        }
        if(req.body.hash){
            tokenController.checkToken(
                {userId:user._id,
                    type:config.typeSEC,
                    ipAddress:req.connection.remoteAddress,
                    hash:req.body.hash},
                function (err,tok) {
                    if (err)
                        return res.json({success:false, number:4, message: message.msg4, data: null});
                    if (tok) {
                        tokenController.saveToken({
                            userId: user._id,
                            type: config.typeJWT,
                            ipAddress: req.connection.remoteAddress
                        }, function (err, data) {
                            if (err)
                                return res.json({success: false, number: 4, message: message.msg4, data: null});
                            var token = jwt.sign(
                                {
                                    userId: data.userId,
                                    type: data.type,
                                    ipAddress: data.ipAddress,
                                    hash: data.hash
                                },
                                secretConfig.secret);
                            res.json({success: true, number: 0, message: message.msg0, data: {token: 'JWT ' + token}});
                            next();
                            return;
                        });
                    } else {
                        return res.json({success:false, number:4, message: message.msg4, data: null});
                    }
                });
        }else if(req.body.password && user.verifyPassword(req.body.password)) {
            tokenController.saveToken({
                userId: user._id,
                type: config.typeSEC,
                ipAddress: req.connection.remoteAddress
            }, function (err, data) {
                if (err)
                    return res.json({success: false, number: 4, message: message.msg4, data: null});
                //send token
                if(config.sendType ='SMS')
                    smsApi.sendSms(user.phone,data.hash);
                else
                    console.log(data.hash);
                res.json({success: true, number: 0, message: message.msg0, data: null});
                next();
                return;
            });
        }else{
            return res.json({success:false, number:4, message: message.msg4, data: null});
        }
    });
};

exports.isAuthenticated = passport.authenticate('jwt', { session: false });