var indexOf = require("@nathanfaucett/index_of"),
    isNode = require("@nathanfaucett/is_node"),
    isFunction = require("@nathanfaucett/is_function"),
    ignoreNativeEventProp = require("./ignoreNativeEventProp");


module.exports = nativeEventToJSON;


function nativeEventToJSON(nativeEvent) {
    var json = {},
        key, value;

    for (key in nativeEvent) {
        value = nativeEvent[key];

        if (!(isFunction(value) || isNode(value) || indexOf(ignoreNativeEventProp, key) !== -1)) {
            json[key] = value;
        }
    }

    return json;
}