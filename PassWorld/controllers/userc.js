var User = require('../models/user');
var tokenController = require('../controllers/tokenc');
var smsApi = require('../controllers/smsApi');
var message = require('../message');
var config = require('../config');

exports.postUser = function(req, res, next) {
        if (req.body && req.body.login) {
            var promise = User.findOne({'login': req.body.login}).exec();

            promise
                .then(function (user) {
                    if (user) {
                        res.send({success:false, number:2, message: message.msg2, data: null});
                    } else {
                        var user = new User();
                        user.login = req.body.login;
                        user.email = req.body.email;
                        user.password = user.generateHash(req.body.password);
                        user.phone = req.body.phone;
                        user.key = req.body.key;
                        user.hash = user.generateHash(req.body.hash);
                        user.save(function (err) {
                            if (err)
                                return res.json({success:false, number:3, message: message.msg3, data: null});
                            res.json({success:true, number:0, message: message.msg0, data:{id: user._id}});
                            next();
                            return;
                        });

                    }
                });
        }else {
            return res.json({success:false, number:1, message: message.msg1, data: null});
        }
};

exports.getUsers=function(req, res, next) {
    User.find(function(err, users) {
        if (err)
            return res.json(err);
        res.json(users);
        next();
    });
};

exports.getUserKey=function(req, res, next) {
    if (req.user._id && req.body && req.body.code) {
        tokenController.checkToken(
            {
                userId: req.user._id,
                type: config.typeDAT,
                ipAddress: req.connection.remoteAddress,
                hash: req.body.code
            },
            function (err, tok) {
                if (err)
                    return res.json({success: false, number: 4, message: message.msg4, data: null});
                if (tok)
                    return res.json({success: true, number: 0, message: message.msg0, data: req.user.key});
                else
                    return res.json({success: false, number: 4, message: message.msg4, data: null});
            });
    }else if(req.user.hash && req.body && req.body.hash){
        if(req.user.verifyHash(req.body.hash))
            return res.json({success: true, number: 0, message: message.msg0, data: null});
        return res.json({success: false, number: 4, message: message.msg4, data: null});
    } else if(req.user && req.user._id) {
        tokenController.saveToken({
            userId: req.user._id,
            type: config.typeDAT,
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
    }else {
        return res.json({success: false, number: 4, message: message.msg4, data: null});
    }
};

