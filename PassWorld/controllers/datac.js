var Data = require('../models/data');
var message = require('../message');


exports.postData = function(req, res, next) {
    if (req.body && req.body.name && req.body.url && req.body.login && req.body.password) {

        var newData = new Data();
        newData.userId = req.user._id;
        newData.name = req.body.name;
        newData.url = req.body.url;
        newData.login = req.body.login;
        newData.password = req.body.password;

        newData.save(function(err) {
            if (err) {
                return res.json({success: false, number: 5, message: message.msg5, data: null});
            }
            res.json({success:true, number:0, message: message.msg0, data:{id:newData._id}});
            next();
            return;
        });
    }else {
        res.json({success:false, number:1, message: message.msg1, data: null});
        return;
    }
};

exports.getAllData=function(req, res, next) {
    if(req.user._id){
        Data.find({userId: req.user._id}, function(err, allData) {
            if (err)
                return res.json({success:false, number:3, message: message.msg3, data: null});

            var dataJson = [];
            allData.forEach(function (data) {
                dataJson.push({id: data._id,
                              name: data.name,
                              url: data.url});
            });

            res.json({success:true, number:0, message: message.msg0, data:dataJson});
            next();
            return;
        });
    }else{
        return res.json({success:false, number:1, message: message.msg1, data: null});
    }
};

exports.getDataKey=function(req, res, next) {
    if (req.user._id && req.body && req.body.id && req.body.hash) {
        if (req.user.verifyHash(req.body.hash)) {
            Data.findOne({userId: req.user._id, _id: req.body.id}, function (err, data) {
                if (err)
                    return res.json({success: false, number: 3, message: message.msg3, data: null});
                console.log(data.password);
                res.json({success: true, number: 0, message: message.msg0, data: {login: data.login, password: data.password}});
                next();
                return;
            });
        }else {
            return res.json({success: false, number: 1, message: message.msg1, data: null});
        }
    }else{
        return res.json({success:false, number:1, message: message.msg1, data: null});
    }
};

exports.updateData=function(req, res, next) {
    if (req.user._id && req.body && req.body.id && req.body.name && req.body.url) {
        Data.findOne({userId: req.user._id, _id: req.body.id}, function (err, data) {
            if (err)
                return res.json({success: false, number: 3, message: message.msg3, data: null});
            data.name = req.body.name ;
            data.url = req.body.url;
            data.save(function (err) {
                if (err)
                    return res.json({success: false, number: 3, message: message.msg3, data: null});

                res.json({success: true, number: 0, message: message.msg0, data: {id:data._id,name: data.name, url:data.url}});
                next();
                return;
            });
        });
    }else{
        return res.json({success:false, number:1, message: message.msg1, data: null});
    }
};

exports.deleteData=function(req, res, next) {
    if (req.user._id && req.body && req.body.id) {
        Data.findOne({userId: req.user._id, _id: req.body.id}, function (err, data) {
            if (err)
                return res.json({success: false, number: 3, message: message.msg3, data: null});

            data.remove(function(err){
                if (err)
                    res.send({success: false, number: 3, message: message.msg3, data: null});
                res.json({success: true, number: 0, message: message.msg0, data: null});
                next();
                return;
            });
        });
    }else{
        return res.json({success:false, number:1, message: message.msg1, data: null});
    }
};

var test = require('../controllers/generator');
exports.testFun = function(req, res, next) {
    var val = test.generate(3,0);
    console.log(val);
    return res.json({gen:val});
};