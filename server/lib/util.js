var util = require('util');

module.exports = util;



module.exports.bool = function(str) {
    try {
        if (typeof(str) == 'string') {
            return (/^true$/i).test(str);
        } else {
            if (new Boolean(str).toString().toLowerCase() == "true") {
                return true;
            } else {
                return false;
            }
        }
    } catch (ex) {
        return false;
    }
};