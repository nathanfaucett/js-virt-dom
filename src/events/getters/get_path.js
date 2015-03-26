var isArray = require("is_array"),
    isDocument = require("is_document"),
    getEventTarget = require("./get_event_target");


module.exports = getPath;


function getPath(nativeEvent) {
    var path = nativeEvent.path,
        target = getEventTarget(nativeEvent);

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
