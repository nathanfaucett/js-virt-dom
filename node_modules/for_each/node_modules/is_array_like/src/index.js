var isLength = require("is_length"),
    isObjectLike = require("is_object_like");


var objectToString = Object.prototype.toString,
    objectArrayBufferString = "[object ArrayBuffer]",
    arrayLikeStrings = {
        "[object Array]": true,
        "[object Arguments]": true,
        "[object Float32Array]": true,
        "[object Float64Array]": true,
        "[object Int8Array]": true,
        "[object Int16Array]": true,
        "[object Int32Array]": true,
        "[object Uint8Array]": true,
        "[object Uint8ClampedArray]": true,
        "[object Uint16Array]": true,
        "[object Uint32Array]": true
    };


arrayLikeStrings[objectArrayBufferString] = true;


module.exports = function isArrayLike(obj) {
    var isObject = isObjectLike(obj),
        objectString = isObject && objectToString.call(obj);

    return isObject && (
        objectString !== objectArrayBufferString ? (
            isLength(obj.length) && arrayLikeStrings[objectString]
        ) : true
    ) || false;
};
