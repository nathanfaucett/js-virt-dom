var isArray = require("@nathanfaucett/is_array"),
    isDocument = require("@nathanfaucett/is_document"),
    getEventTarget = require("./getEventTarget");


module.exports = getPath;


function getPath(nativeEvent, window) {
    var path = nativeEvent.path,
        target = getEventTarget(nativeEvent, window);

    if (isArray(path)) {
        return path;
    } else if (isDocument(target) || (target && target.window === target)) {
        return [target];
    } else {
        path = [];

        while (target) {
            path[path.length] = target;
            target = target.parentNode;
        }
    }

    return path;
}