var config = require('./config');
var secretConfig = require('./secret/config');
var express = require('express');
var cors = require('cors');

var path = require('path');
var logger = require('morgan');
var passport = require('passport');

var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(secretConfig.dbconnection);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var userController = require('./controllers/userc');
var dataController = require('./controllers/datac');
var authController = require('./controllers/auth');
var generatorController = require('./controllers/generator');

var app = express();

app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var router = express.Router();

//auth
router.route('/login')
    .post(authController.authenticate);

//user
router.route('/user')
    .post(userController.postUser)
    .get(userController.getUsers);
router.route('/user/key')
    .all(authController.isAuthenticated)
    .post(userController.getUserKey);

//data
router.route('/data')
    .all(authController.isAuthenticated)
    .post(dataController.postData)
    .put(dataController.updateData)
    .get(dataController.getAllData);
router.route('/data/delete')
    .all(authController.isAuthenticated)
    .post(dataController.deleteData);
router.route('/data/key')
    .all(authController.isAuthenticated)
    .post(dataController.getDataKey);
//generator
router.route('/generator')
    .post(generatorController.postGenerator);
//test
router.route('/test').
    get(dataController.testFun);

//app
app.use('/app',router);

module.exports = app;
