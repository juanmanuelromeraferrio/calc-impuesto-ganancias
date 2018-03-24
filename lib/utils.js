'use strict';

exports.isInRange = function (value, min, max) {
    var result = true;
    //check value is bigger than min
    if(min) {
        result = value >= min
    }
    //check value is smaller than max
    if(result && max) {
        result = value <= max
    }
    
    return result;
}