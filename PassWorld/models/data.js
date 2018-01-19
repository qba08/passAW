var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true },
        name: {type: String, required: true },
        url: {type: String, required: true },
        login: {type: String, required: true },
        password: {type: String, required: true }
    }
);



module.exports = mongoose.model('data', DataSchema);