var secretConfig = require('../secret/config');
var SMSAPI = require('smsapi');

smsapi = new SMSAPI({
    oauth: {accessToken: secretConfig.smsApiToken}
});

exports.sendSms = function(number, code) {
    sendMessage(number, code)
        .then(displayResult)
        .catch(displayError);

    function displayResult(result){}

    function displayError(err){
        console.error(err);
        console.log(code);
    }
};

function sendMessage(number, code){
    return smsapi.message
        .sms()
        .from("Informacja")
        .to(number)
        .message("Your code: "+ code)
        .execute(); // return Promise
}

