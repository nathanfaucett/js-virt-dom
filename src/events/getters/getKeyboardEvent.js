var getEventKey = require("./getEventKey"),
    getEventCharCode = require("./getEventCharCode");


module.exports = getKeyboardEvent;


function getKeyboardEvent(obj, nativeEvent) {
    obj.key = getEventKey(nativeEvent);
    obj.location = nativeEvent.location;
    obj.ctrlKey = nativeEvent.ctrlKey;
    obj.shiftKey = nativeEvent.shiftKey;
    obj.altKey = nativeEvent.altKey;
    obj.metaKey = nativeEvent.metaKey;
    obj.repeat = nativeEvent.repeat;
    obj.locale = nativeEvent.locale;
    obj.charCode = getCharCode(nativeEvent);
    obj.keyCode = getKeyCode(nativeEvent);
    obj.which = getWhich(nativeEvent);
}

function getCharCode(nativeEvent) {
    return nativeEvent.type === "keypress" ? getEventCharCode(nativeEvent) : 0;
}

function getKeyCode(nativeEvent) {
    var type = nativeEvent.type;

    return type === "keydown" || type === "keyup" ? nativeEvent.keyCode : 0;
}

function getWhich(nativeEvent) {
    var type = nativeEvent.type;

    return type === "keypress" ? getEventCharCode(event) : (
        type === "keydown" || type === "keyup" ? nativeEvent.keyCode : 0
    );
}
