var getTouch = require("./get_touch");


module.exports = getTouchEvent;


function getTouchEvent(obj, nativeEvent, eventHandler) {
    obj.touches = createTouches(obj.touches || [], nativeEvent.touches, eventHandler);
    obj.targetTouches = createTouches(obj.targetTouches || [], nativeEvent.targetTouches, eventHandler);
    obj.changedTouches = createTouches(obj.changedTouches || [], nativeEvent.changedTouches, eventHandler);
    obj.altKey = nativeEvent.altKey;
    obj.metaKey = nativeEvent.metaKey;
    obj.ctrlKey = nativeEvent.ctrlKey;
    obj.shiftKey = nativeEvent.shiftKey;
}

function createTouches(touches, nativeTouches, eventHandler) {
    var i = -1,
        il = nativeTouches.length - 1;

    while (i++ < il) {
        touches[i] = getTouch(touches[i] || {}, nativeTouches[i], eventHandler);
    }

    return touches;
}
