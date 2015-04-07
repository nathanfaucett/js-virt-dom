var isLength = require("is_length"),
    isObjectLike = require("is_object_like");


module.exports = function isArrayLike(obj) {
    return isObjectLike(obj) && isLength(obj.length);
};
