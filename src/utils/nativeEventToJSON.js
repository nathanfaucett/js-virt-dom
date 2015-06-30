var has = require("has"),
    isNode = require("is_node"),
    isFunction = require("is_function");


var ignoreNativeEventProp = {
    path: true,
    view: true
};


module.exports = nativeEventToJSON;


function nativeEventToJSON(nativeEvent) {
    var json = {},
        localHas = has,
        key, value;


    for (key in nativeEvent) {
        if (localHas(nativeEvent, key)) {
            value = nativeEvent[key];

            if (ignoreNativeEventProp[key] !== true && !isNode(value) && !isFunction(value)) {
                json[key] = value;
            }
        }
    }

    return json;
}
