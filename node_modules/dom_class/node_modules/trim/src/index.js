var isNative = require("is_native"),
    isString = require("is_string");


var StringPrototype = String.prototype,

    nativeTrim = StringPrototype.trim,
    nativeTrimLeft = StringPrototype.trimLeft,
    nativeTrimRight = StringPrototype.trimRight,

    reTrim = /^[\s\xA0]+|[\s\xA0]+$/g,
    reTrimLeft = /^[\s\xA0]+/g,
    reTrimRight = /[\s\xA0]+$/g,

    baseTrim, baseTrimLeft, baseTrimRight;


module.exports = trim;


if (isNative(nativeTrim)) {
    baseTrim = function baseTrim(str) {
        return nativeTrim.call(str);
    };
} else {
    baseTrim = function baseTrim(str) {
        return str.replace(reTrim, "");
    };
}

if (isNative(nativeTrimLeft)) {
    baseTrimLeft = function baseTrimLeft(str) {
        return nativeTrimLeft.call(str);
    };
} else {
    baseTrimLeft = function baseTrimLeft(str) {
        return str.replace(reTrimLeft, "");
    };
}

if (isNative(nativeTrimRight)) {
    baseTrimRight = function baseTrimRight(str) {
        return nativeTrimRight.call(str);
    };
} else {
    baseTrimRight = function baseTrimRight(str) {
        return str.replace(reTrimRight, "");
    };
}


function trim(str) {
    return isString(str) ? baseTrim(str) : str;
}

trim.left = function trimLeft(str) {
    return isString(str) ? baseTrimLeft(str) : str;
};

trim.right = function trimRight(str) {
    return isString(str) ? baseTrimRight(str) : str;
};
