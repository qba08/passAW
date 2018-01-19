var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true },
        hash: {type: String, required: true },
        type: {type:String, required: true },
        expire: {type: Date, required: true },
        ipAddress:{type: String, required: true}
    }
);



module.exports = mongoose.model('tokenStr', TokenSchema);