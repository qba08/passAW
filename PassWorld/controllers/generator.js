var message = require('../message');
var crypto = require('crypto');

function getRandNum(min,max) {
    var maxBytes = 1;
    var maxDec = 256;

    var randBytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
    return Math.floor(randBytes/maxDec*(max-min+1)+min);

}

function getAlphabet(alphNum,length) {
    var lowerCase = 'abcdefghijklmnopqrstuwxyz';
    var upperCase = 'ABCDEFGHIJKLMNOPQRSTUWXYZ';
    var numbers = '1234567890';
    var specialCharacters = '{}[]<>()!@#$%^&*-=_+;:,.';

    var alphabet = [];
    var randLen =0;
    var currentLen=length;

    switch(alphNum){
        case 0:
            alphabet.push({alph:numbers, len:length});
            break;
        case 1:
            alphabet.push({alph:lowerCase, len:length});
            break;
        case 2:
            randLen = getRandNum(1,length-1);
            alphabet.push({alph:lowerCase, len:randLen });
            alphabet.push({alph:numbers, len:length-randLen});
            break;
        case 3:
            randLen = getRandNum(1,currentLen-2);
            alphabet.push({alph:lowerCase, len:randLen });
            currentLen = currentLen-randLen;
            randLen = getRandNum(1,currentLen-1);
            alphabet.push({alph:numbers, len:randLen});
            currentLen = currentLen-randLen;
            alphabet.push({alph:upperCase, len:currentLen});
            break;
        case 4:
            randLen = getRandNum(1,Math.floor((currentLen-3)/4)+1);
            alphabet.push({alph:specialCharacters, len:randLen });
            currentLen = currentLen-randLen;
            randLen = getRandNum(1,currentLen-2);
            alphabet.push({alph:numbers, len:randLen});
            currentLen = currentLen-randLen;
            randLen = getRandNum(1,currentLen-1);
            alphabet.push({alph:upperCase, len:randLen});
            currentLen = currentLen-randLen;
            alphabet.push({alph:lowerCase, len:currentLen});
            break;
    }
    return alphabet;
}

function createRandString(alphabet) {
    var randString = '';
    var elem;
    var alph,len,i;
    while(elem = alphabet.pop()){
        alph = elem.alph;
        len = elem.len;
        for(i=0;i<len;i++){
            randString= randString + alph.charAt(getRandNum(0,alph.length-1));
        }
    }
    return randString;
}

function createMixString(randString) {
    var strArray = randString.split('');
    var char, index, swapIndex;
    for(index=0;index<strArray.length;index++){
        swapIndex=getRandNum(0,strArray.length-1);
        char=strArray[swapIndex];
        strArray[swapIndex] = strArray[index];
        strArray[index] = char;
    }

    return strArray.join('');
}
function generateKey(length, alphNum) {
    var alphabet = getAlphabet(alphNum,length);
    var randString = createRandString(alphabet);
    return createMixString(randString);
}

exports.generate = generateKey;

exports.postGenerator =function(req, res, next) {
    console.log(req.body);
    if(req.body && req.body.keyLength && req.body.keyAlphabet){
        var keyLength = parseInt(req.body.keyLength);
        var keyAlphabet = parseInt(req.body.keyAlphabet)-1;
        if (isNaN(keyLength) || keyLength < 4 || keyLength > 64 || isNaN(keyAlphabet) ||!(keyAlphabet  in [0, 1, 2, 3, 4])){
            return res.json({success:false, number:1, message: message.msg1, data: null});
        } else{
            var key = generateKey(keyLength,keyAlphabet );
            res.json({success:true, number:0, message: message.msg0, data:key});
            next();
            return;
        }
    }else{
        return res.json({success:false, number:1, message: message.msg1, data: null});
    }
};